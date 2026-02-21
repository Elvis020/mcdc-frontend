/**
 * Loose display type compatible with both CertificateFormData (from Zod)
 * and the death_certificates DB row (from Supabase).
 *
 * All fields are optional/nullable so the component works for:
 *  - Step 8 wizard preview (no serial_number yet, partial data)
 *  - Certificate view page (full DB row)
 */
export interface CertificateDisplayData {
  // Administrative
  serial_number?: string | null
  folder_number?: string | null
  cod_certificate_number?: string | null
  facility_code?: string | null
  facility_sn?: string | null
  facility_d?: string | null
  deceased_full_name?: string | null
  date_of_birth?: string | null
  date_of_death?: string | null
  gender?: string | null
  national_register_number?: string | null
  national_id_number?: string | null
  // Cause of death chain
  cause_a_description?: string | null
  cause_a_icd_code?: string | null
  cause_a_interval?: string | null
  cause_b_description?: string | null
  cause_b_icd_code?: string | null
  cause_b_interval?: string | null
  cause_c_description?: string | null
  cause_c_icd_code?: string | null
  cause_c_interval?: string | null
  cause_d_description?: string | null
  cause_d_icd_code?: string | null
  cause_d_interval?: string | null
  // Contributing conditions (up to 4)
  contributing_conditions?: string | null
  contributing_conditions_icd_code?: string | null
  contributing_conditions_2?: string | null
  contributing_conditions_2_icd_code?: string | null
  contributing_conditions_3?: string | null
  contributing_conditions_3_icd_code?: string | null
  contributing_conditions_4?: string | null
  contributing_conditions_4_icd_code?: string | null
  // Other medical
  surgery_within_4_weeks?: string | null
  surgery_date?: string | null
  surgery_reason?: string | null
  autopsy_requested?: string | null
  autopsy_findings_used?: string | null
  // Manner and location of death
  manner_of_death?: string | null
  external_cause_date?: string | null
  external_cause_description?: string | null
  poisoning_agent?: string | null
  death_location?: string | null
  death_location_other?: string | null
  // Fetal / infant
  is_fetal_infant_death?: boolean | null
  stillbirth?: string | null
  multiple_pregnancy?: boolean | null
  was_serviced?: boolean | null
  hours_if_death_within_24h?: number | null
  birth_weight_grams?: number | null
  completed_weeks_pregnancy?: number | null
  mother_age_years?: number | null
  maternal_conditions?: string | null
  was_deceased_pregnant?: string | null
  pregnancy_timing?: string | null
  pregnancy_contributed_to_death?: string | null
  // Issuer
  issued_to_full_name?: string | null
  issued_to_mobile?: string | null
  issued_to_contact_details?: string | null
  relation_to_deceased?: string | null
  witness_to_deceased?: string | null
  witness_date?: string | null
}

// ── Enum label maps ──────────────────────────────────────────────────────────

export const MANNER_OF_DEATH_LABELS: Record<string, string> = {
  disease: 'Disease',
  assault: 'Assault',
  could_not_be_determined: 'Could not be determined',
  accident: 'Accident',
  war: 'War',
  pending_investigation: 'Pending investigation',
  intentional_self_harm: 'Intentional self-harm',
  legal_intervention: 'Legal intervention',
  external_cause_or_poisonous: 'External cause or poisonous',
}

export const DEATH_LOCATION_LABELS: Record<string, string> = {
  home: 'At home',
  residential_institution: 'Residential institution',
  school_other_institution_public: 'School, other institution, public',
  sports_athletics: 'Sports and athletics area',
  street_highway: 'Street/Highway',
  trade_service_area: 'Trade and service area',
  industrial_construction_area: 'Industrial/construction area',
  farm: 'Farm',
  unknown: 'Unknown',
  other: 'Other',
}

export const PREGNANCY_TIMING_LABELS: Record<string, string> = {
  at_time_of_death: 'At time of death',
  within_42_days_before: 'Within 42 days before death',
  between_43_days_to_1_year_before: '43 days to 1 year before',
  unknown: 'Unknown',
}

// ── Date helper ──────────────────────────────────────────────────────────────

/** Format an ISO date string as DD/MM/YYYY for display on the certificate. */
export function formatCertDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-GB')
  } catch {
    return dateStr
  }
}
