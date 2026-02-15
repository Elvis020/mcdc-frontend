'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart2Schema, type MedicalDataPart2 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Label } from '@/components/ui/label'
import { IcdSearchInput } from '@/components/ui/icd-search-input'

type ConditionKey = '1' | '2' | '3' | '4'

const EXTRA_KEYS: ConditionKey[] = ['2', '3', '4']

// Map keys to schema field prefixes
function descField(key: ConditionKey) {
  return key === '1' ? 'contributing_conditions' as const : `contributing_conditions_${key}` as const
}
function icdField(key: ConditionKey) {
  return key === '1' ? 'contributing_conditions_icd_code' as const : `contributing_conditions_${key}_icd_code` as const
}
function commentField(key: ConditionKey) {
  return key === '1' ? 'contributing_conditions_comment' as const : `contributing_conditions_${key}_comment` as const
}

export function Step3MedicalPart2() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  // Determine which extra conditions are already populated (for edit mode)
  const initialExtras: ConditionKey[] = []
  if (formData.contributing_conditions_2) initialExtras.push('2')
  if (formData.contributing_conditions_3) {
    if (!initialExtras.includes('2')) initialExtras.push('2')
    initialExtras.push('3')
  }
  if (formData.contributing_conditions_4) {
    if (!initialExtras.includes('2')) initialExtras.push('2')
    if (!initialExtras.includes('3')) initialExtras.push('3')
    initialExtras.push('4')
  }

  const [visibleExtras, setVisibleExtras] = useState<ConditionKey[]>(initialExtras)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<MedicalDataPart2>({
    resolver: zodResolver(medicalDataPart2Schema),
    defaultValues: {
      contributing_conditions: formData.contributing_conditions || '',
      contributing_conditions_icd_code: formData.contributing_conditions_icd_code || '',
      contributing_conditions_comment: formData.contributing_conditions_comment || '',
      contributing_conditions_2: formData.contributing_conditions_2 || '',
      contributing_conditions_2_icd_code: formData.contributing_conditions_2_icd_code || '',
      contributing_conditions_2_comment: formData.contributing_conditions_2_comment || '',
      contributing_conditions_3: formData.contributing_conditions_3 || '',
      contributing_conditions_3_icd_code: formData.contributing_conditions_3_icd_code || '',
      contributing_conditions_3_comment: formData.contributing_conditions_3_comment || '',
      contributing_conditions_4: formData.contributing_conditions_4 || '',
      contributing_conditions_4_icd_code: formData.contributing_conditions_4_icd_code || '',
      contributing_conditions_4_comment: formData.contributing_conditions_4_comment || '',
    },
  })

  const onSubmit = (data: MedicalDataPart2) => {
    // Clear data for hidden extra conditions
    for (const key of EXTRA_KEYS) {
      if (!visibleExtras.includes(key)) {
        data[descField(key)] = ''
        data[icdField(key)] = ''
        data[commentField(key)] = ''
      }
    }
    updateFormData(data)
    setCurrentStep(4)
  }

  const handleClearStep = () => {
    reset()
    setVisibleExtras([])
  }

  const addCondition = () => {
    const next = EXTRA_KEYS.find((k) => !visibleExtras.includes(k))
    if (next) {
      setVisibleExtras((prev) => [...prev, next])
    }
  }

  const removeCondition = (key: ConditionKey) => {
    const idx = EXTRA_KEYS.indexOf(key)
    const keysToRemove = EXTRA_KEYS.slice(idx)
    setVisibleExtras((prev) => prev.filter((k) => !keysToRemove.includes(k)))

    for (const k of keysToRemove) {
      setValue(descField(k), '')
      setValue(icdField(k), '')
      setValue(commentField(k), '')
    }
  }

  const canAddMore = visibleExtras.length < EXTRA_KEYS.length

  const allVisibleKeys: ConditionKey[] = ['1', ...visibleExtras]

  return (
    <div className="space-y-6">
      <FormProgress onClearStep={handleClearStep} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Medical Data Part 2 - Contributing Conditions</h3>
            <p className="text-sm text-slate-500 mt-1">
              Other significant conditions contributing to death but not related to the disease or condition causing it
            </p>
          </div>

          {allVisibleKeys.map((key, idx) => {
            const desc = descField(key)
            const icd = icdField(key)
            const comment = commentField(key)
            const isExtra = EXTRA_KEYS.includes(key)

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={desc}>
                    Contributing Condition {idx + 1} (Optional)
                  </Label>
                  {isExtra && (
                    <button
                      type="button"
                      onClick={() => removeCondition(key)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <IcdSearchInput
                  id={desc}
                  value={watch(desc) || ''}
                  icdCode={watch(icd) || undefined}
                  onChange={(description, icdCode) => {
                    setValue(desc, description)
                    setValue(icd, icdCode || '')
                  }}
                  placeholder="Search ICD-11 codes..."
                />
                <div>
                  <Label htmlFor={comment} className="text-xs">Comment/Clarifications</Label>
                  <textarea
                    id={comment}
                    {...register(comment)}
                    placeholder="Additional notes or clarifications..."
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
              </div>
            )
          })}

          {/* Add condition button */}
          {canAddMore && (
            <button
              type="button"
              onClick={addCondition}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add contributing condition
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            Examples: Diabetes, Hypertension, Chronic kidney disease, etc.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors order-first sm:order-none"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={saving}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors"
            >
              Next Step →
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
