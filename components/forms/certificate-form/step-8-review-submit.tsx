'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

export function Step8ReviewSubmit() {
  const router = useRouter()
  const { formData, setCurrentStep, certificateId, isEditMode } = useCertificateForm()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'Not provided'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  const sections = [
    {
      title: 'Administrative Data',
      fields: [
        { label: 'Folder Number', value: formData.folder_number },
        { label: 'COD Certificate Number', value: formData.cod_certificate_number },
        { label: 'Facility Code', value: formData.facility_code },
        { label: 'Deceased Full Name', value: formData.deceased_full_name },
        { label: 'Date of Birth', value: formData.date_of_birth },
        { label: 'Date of Death', value: formData.date_of_death },
        { label: 'Gender', value: formData.gender },
        { label: 'National Register Number', value: formData.national_register_number },
        { label: 'National ID Number', value: formData.national_id_number },
      ],
    },
    {
      title: 'Medical Data - Cause of Death',
      fields: [
        { label: 'Cause (a)', value: formData.cause_a_description },
        { label: 'Time Interval (a)', value: formData.cause_a_interval },
        { label: 'Cause (b)', value: formData.cause_b_description },
        { label: 'Time Interval (b)', value: formData.cause_b_interval },
        { label: 'Cause (c)', value: formData.cause_c_description },
        { label: 'Time Interval (c)', value: formData.cause_c_interval },
        { label: 'Cause (d)', value: formData.cause_d_description },
        { label: 'Time Interval (d)', value: formData.cause_d_interval },
        { label: 'Contributing Conditions', value: formData.contributing_conditions },
      ],
    },
    {
      title: 'Other Medical Data',
      fields: [
        { label: 'Surgery Within 4 Weeks', value: formData.surgery_within_4_weeks },
        { label: 'Surgery Date', value: formData.surgery_date },
        { label: 'Surgery Reason', value: formData.surgery_reason },
        { label: 'Autopsy Requested', value: formData.autopsy_requested },
        { label: 'Autopsy Findings Used', value: formData.autopsy_findings_used },
      ],
    },
    {
      title: 'Manner & Location of Death',
      fields: [
        { label: 'Manner of Death', value: formData.manner_of_death },
        { label: 'External Cause Date', value: formData.external_cause_date },
        { label: 'External Cause Description', value: formData.external_cause_description },
        { label: 'Poisoning Agent', value: formData.poisoning_agent },
        { label: 'Death Location', value: formData.death_location },
      ],
    },
    {
      title: 'Fetal/Infant Death & Pregnancy Status',
      fields: [
        { label: 'Is Fetal/Infant Death', value: formData.is_fetal_infant_death },
        { label: 'Stillbirth', value: formData.stillbirth },
        { label: 'Multiple Pregnancy', value: formData.multiple_pregnancy },
        { label: 'Hours if Death Within 24h', value: formData.hours_if_death_within_24h },
        { label: 'Birth Weight (grams)', value: formData.birth_weight_grams },
        { label: 'Weeks of Pregnancy', value: formData.completed_weeks_pregnancy },
        { label: "Mother's Age", value: formData.mother_age_years },
        { label: 'Maternal Conditions', value: formData.maternal_conditions },
        { label: 'Was Deceased Pregnant', value: formData.was_deceased_pregnant },
        { label: 'Pregnancy Timing', value: formData.pregnancy_timing },
        { label: 'Pregnancy Contributed to Death', value: formData.pregnancy_contributed_to_death },
      ],
    },
    {
      title: 'Issuer Details',
      fields: [
        { label: 'Issued To', value: formData.issued_to_full_name },
        { label: 'Mobile', value: formData.issued_to_mobile },
        { label: 'Contact Details', value: formData.issued_to_contact_details },
        { label: 'Relation to Deceased', value: formData.relation_to_deceased },
        { label: 'Witness Name', value: formData.witness_to_deceased },
        { label: 'Witness Date', value: formData.witness_date },
      ],
    },
  ]

  const onSaveDraft = async () => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Transform empty strings to null for database compatibility
      const completeData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )

      if (isEditMode && certificateId) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('death_certificates')
          .update({
            ...completeData,
            status: 'draft',
          })
          .eq('id', certificateId)

        if (updateError) throw updateError
      } else {
        // Create new certificate
        const { data: userData } = await supabase
          .from('users')
          .select('region_id, district_id, facility_id')
          .eq('id', user.id)
          .single()

        // Generate serial number (simplified - in production use DB function)
        const serial = `DRAFT-${Date.now()}`

        const { error: insertError } = await supabase
          .from('death_certificates')
          .insert({
            serial_number: serial,
            status: 'draft',
            created_by_id: user.id,
            region_id: userData?.region_id,
            district_id: userData?.district_id,
            facility_id: userData?.facility_id,
            ...completeData,
          })

        if (insertError) throw insertError
      }

      router.push('/dashboard/certificates')
    } catch (err: any) {
      setError(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = async () => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Transform empty strings to null for database compatibility
      const completeData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )

      if (isEditMode && certificateId) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('death_certificates')
          .update({
            ...completeData,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            edit_window_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', certificateId)

        if (updateError) throw updateError
      } else {
        // Create new certificate
        const { data: userData } = await supabase
          .from('users')
          .select('region_id, district_id, facility_id')
          .eq('id', user.id)
          .single()

        // Generate proper serial number
        const { data: regionData } = await supabase
          .from('regions')
          .select('code')
          .eq('id', userData?.region_id)
          .single()

        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const serial = `${regionData?.code || 'GAR'}-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`

        const { error: insertError } = await supabase
          .from('death_certificates')
          .insert({
            serial_number: serial,
            status: 'submitted',
            created_by_id: user.id,
            region_id: userData?.region_id,
            district_id: userData?.district_id,
            facility_id: userData?.facility_id,
            submitted_at: new Date().toISOString(),
            edit_window_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            ...completeData,
          })

        if (insertError) throw insertError
      }

      router.push('/dashboard/certificates')
    } catch (err: any) {
      setError(err.message || 'Failed to submit certificate')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <FormProgress />

      {/* Full Certificate Review - Always Expanded */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Review Certificate Data</h3>
          <p className="text-sm text-slate-500 mt-1">
            Please review all information carefully before submitting
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-200 pb-2">
                {section.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {section.fields.map((field, fieldIdx) => (
                  <div key={fieldIdx} className="flex justify-between py-1.5">
                    <span className="text-sm text-slate-600">{field.label}:</span>
                    <span className="text-sm text-slate-900 font-medium">
                      {formatValue(field.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StepIndicators />
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(7)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors order-first sm:order-none"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Certificate' : 'Submit Certificate')}
          </button>
        </div>
      </div>
    </div>
  )
}
