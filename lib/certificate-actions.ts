import { createClient } from '@/lib/supabase/client'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

// Exhaustive list of valid death_certificates columns the frontend can write.
// Any key from the form that is NOT in this set is stripped before insert/update
// to avoid "column does not exist" errors from Supabase.
const VALID_DB_COLUMNS = new Set([
  'folder_number', 'cod_certificate_number', 'facility_code', 'facility_sn', 'facility_d',
  'deceased_full_name', 'date_of_birth', 'gender', 'national_register_number', 'national_id_number',
  'date_of_death',
  'cause_a_description', 'cause_a_icd_code', 'cause_a_interval', 'cause_a_comment',
  'cause_b_description', 'cause_b_icd_code', 'cause_b_interval', 'cause_b_comment',
  'cause_c_description', 'cause_c_icd_code', 'cause_c_interval', 'cause_c_comment',
  'cause_d_description', 'cause_d_icd_code', 'cause_d_interval', 'cause_d_comment',
  'contributing_conditions', 'contributing_conditions_icd_code', 'contributing_conditions_comment',
  'contributing_conditions_2', 'contributing_conditions_2_icd_code', 'contributing_conditions_2_comment',
  'contributing_conditions_3', 'contributing_conditions_3_icd_code', 'contributing_conditions_3_comment',
  'contributing_conditions_4', 'contributing_conditions_4_icd_code', 'contributing_conditions_4_comment',
  'surgery_within_4_weeks', 'surgery_date', 'surgery_reason',
  'autopsy_requested', 'autopsy_findings_used',
  'manner_of_death', 'external_cause_date', 'external_cause_description', 'poisoning_agent',
  'death_location', 'death_location_other',
  'is_fetal_infant_death', 'stillbirth', 'multiple_pregnancy',
  'hours_if_death_within_24h', 'birth_weight_grams', 'was_serviced',
  'completed_weeks_pregnancy', 'mother_age_years', 'maternal_conditions',
  'was_deceased_pregnant', 'pregnancy_timing', 'pregnancy_contributed_to_death',
  'issued_to_full_name', 'issued_to_mobile', 'issued_to_contact_details',
  'relation_to_deceased', 'witness_to_deceased', 'witness_date',
])

/**
 * Strips form-only fields, converts empty strings to null, and returns
 * a clean payload ready for Supabase insert/update.
 */
function preparePayload(formData: Partial<CertificateFormData>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(formData)) {
    if (!VALID_DB_COLUMNS.has(key)) continue
    result[key] = value === '' ? null : value
  }
  return result
}

interface SaveOptions {
  status: 'draft' | 'submitted'
  isEditMode: boolean
  certificateId?: string
}

interface SaveResult {
  success: boolean
  error?: string
  certificateId?: string
}

/**
 * Single source of truth for all certificate save/submit operations.
 * Called from use-save-draft, step-7, and step-8.
 */
export async function saveCertificate(
  formData: Partial<CertificateFormData>,
  options: SaveOptions
): Promise<SaveResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const cleanData = preparePayload(formData)

    if (options.isEditMode && options.certificateId) {
      // UPDATE existing certificate
      const updatePayload: Record<string, unknown> = {
        ...cleanData,
        status: options.status,
      }
      if (options.status === 'submitted') {
        updatePayload.submitted_at = new Date().toISOString()
        updatePayload.edit_window_expires_at = new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await supabase
        .from('death_certificates')
        .update(updatePayload as any)
        .eq('id', options.certificateId)

      if (updateError) return { success: false, error: updateError.message }

      // Write audit log entry
      await supabase.from('certificate_audit_log').insert({
        certificate_id: options.certificateId,
        user_id: user.id,
        action: options.status === 'submitted' ? 'submitted' : 'updated',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      })

      return { success: true, certificateId: options.certificateId }
    }

    // INSERT new certificate
    const { data: userData } = await supabase
      .from('users')
      .select('region_id, district_id, facility_id')
      .eq('id', user.id)
      .single()

    let serial: string

    if (options.status === 'draft') {
      serial = `DRAFT-${Date.now()}`
    } else {
      // Use the DB function for collision-safe serial numbers on submission
      const { data: regionData } = await supabase
        .from('regions')
        .select('code')
        .eq('id', userData?.region_id ?? '')
        .single()

      const { data: serialData } = await supabase.rpc(
        'generate_certificate_serial_number',
        {
          p_region_code: regionData?.code ?? 'GAR',
          p_facility_code: '',
        }
      )
      // Fall back to client-side if the DB function isn't available yet
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
      serial = serialData ?? `${regionData?.code ?? 'GAR'}-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const insertPayload: Record<string, unknown> = {
      serial_number: serial,
      status: options.status,
      created_by_id: user.id,
      region_id: userData?.region_id ?? null,
      district_id: userData?.district_id ?? null,
      facility_id: userData?.facility_id ?? null,
      ...cleanData,
    }

    if (options.status === 'submitted') {
      insertPayload.submitted_at = new Date().toISOString()
      insertPayload.edit_window_expires_at = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inserted, error: insertError } = await supabase
      .from('death_certificates')
      .insert(insertPayload as any)
      .select('id')
      .single()

    if (insertError) return { success: false, error: insertError.message }

    // Write audit log entry
    if (inserted?.id) {
      await supabase.from('certificate_audit_log').insert({
        certificate_id: inserted.id,
        user_id: user.id,
        action: options.status === 'submitted' ? 'submitted' : 'created',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      })
    }

    return { success: true, certificateId: inserted?.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
