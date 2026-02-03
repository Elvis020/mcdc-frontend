'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

interface CertificatePreviewProps {
  formData: Partial<CertificateFormData>
}

export function CertificatePreview({ formData }: CertificatePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-slate-900">Review Certificate Data</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {isExpanded ? 'Click to collapse' : 'Click to review all information before submitting'}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 p-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-semibold text-slate-900 text-sm">{section.title}</h4>
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
      )}
    </div>
  )
}
