'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart1Schema, type MedicalDataPart1 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IcdSearchInput } from '@/components/ui/icd-search-input'

type CauseKey = 'a' | 'b' | 'c' | 'd'

const CAUSE_LABELS: Record<CauseKey, string> = {
  a: '(a) Disease or condition directly leading to death',
  b: '(b) Due to (or as a consequence of)',
  c: '(c) Due to (or as a consequence of)',
  d: '(d) Due to (or as a consequence of)',
}

// Keys that can be dynamically added beyond the default a + b
const EXTRA_KEYS: CauseKey[] = ['c', 'd']

export function Step2MedicalPart1() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  // Determine which extra conditions are already populated (for edit mode)
  const initialExtras: CauseKey[] = []
  if (formData.cause_c_description) initialExtras.push('c')
  if (formData.cause_d_description) {
    if (!initialExtras.includes('c')) initialExtras.push('c')
    initialExtras.push('d')
  }

  const [visibleExtras, setVisibleExtras] = useState<CauseKey[]>(initialExtras)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicalDataPart1>({
    resolver: zodResolver(medicalDataPart1Schema),
    defaultValues: {
      cause_a_description: formData.cause_a_description || '',
      cause_a_icd_code: formData.cause_a_icd_code || '',
      cause_a_interval: formData.cause_a_interval || '',
      cause_a_comment: formData.cause_a_comment || '',
      cause_b_description: formData.cause_b_description || '',
      cause_b_icd_code: formData.cause_b_icd_code || '',
      cause_b_interval: formData.cause_b_interval || '',
      cause_b_comment: formData.cause_b_comment || '',
      cause_c_description: formData.cause_c_description || '',
      cause_c_icd_code: formData.cause_c_icd_code || '',
      cause_c_interval: formData.cause_c_interval || '',
      cause_c_comment: formData.cause_c_comment || '',
      cause_d_description: formData.cause_d_description || '',
      cause_d_icd_code: formData.cause_d_icd_code || '',
      cause_d_interval: formData.cause_d_interval || '',
      cause_d_comment: formData.cause_d_comment || '',
    },
  })

  const onSubmit = (data: MedicalDataPart1) => {
    // Clear data for hidden extra conditions
    for (const key of EXTRA_KEYS) {
      if (!visibleExtras.includes(key)) {
        data[`cause_${key}_description`] = ''
        data[`cause_${key}_icd_code`] = ''
        data[`cause_${key}_interval`] = ''
        data[`cause_${key}_comment`] = ''
      }
    }
    updateFormData(data)
    setCurrentStep(3)
  }

  const handleBack = () => {
    setCurrentStep(1)
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

  const removeCondition = (key: CauseKey) => {
    // Remove this key and any keys after it (e.g., removing c also removes d)
    const idx = EXTRA_KEYS.indexOf(key)
    const keysToRemove = EXTRA_KEYS.slice(idx)
    setVisibleExtras((prev) => prev.filter((k) => !keysToRemove.includes(k)))

    // Clear form values for removed keys
    for (const k of keysToRemove) {
      setValue(`cause_${k}_description`, '')
      setValue(`cause_${k}_icd_code`, '')
      setValue(`cause_${k}_interval`, '')
      setValue(`cause_${k}_comment`, '')
    }
  }

  const canAddMore = visibleExtras.length < EXTRA_KEYS.length

  // All visible cause keys: always a + b, plus any extras
  const allVisibleKeys: CauseKey[] = ['a', 'b', ...visibleExtras]

  return (
    <div className="space-y-6">
      <FormProgress onClearStep={handleClearStep} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Medical Data Part 1 - Cause of Death</h3>
            <p className="text-sm text-slate-500 mt-1">
              Report the chain of events leading to death. Search and select an ICD-11 code for each condition.
            </p>
          </div>

          {allVisibleKeys.map((key) => {
            const descField = `cause_${key}_description` as const
            const icdField = `cause_${key}_icd_code` as const
            const intervalField = `cause_${key}_interval` as const
            const isRequired = key === 'a'
            const isExtra = EXTRA_KEYS.includes(key)

            const commentField = `cause_${key}_comment` as const

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={descField}>
                    {CAUSE_LABELS[key]} {isRequired && <span className="text-red-500">*</span>}
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
                  id={descField}
                  value={watch(descField) || ''}
                  icdCode={watch(icdField) || undefined}
                  onChange={(description, icdCode) => {
                    setValue(descField, description, { shouldValidate: true })
                    setValue(icdField, icdCode || '', { shouldValidate: true })
                  }}
                  placeholder="Search ICD-11 codes..."
                />
                {errors[descField] && (
                  <p className="text-sm text-destructive">{errors[descField]?.message}</p>
                )}
                {errors[icdField] && (
                  <p className="text-sm text-destructive">{errors[icdField]?.message}</p>
                )}
                <div>
                  <Label htmlFor={commentField} className="text-xs">Comment/Clarifications</Label>
                  <textarea
                    id={commentField}
                    {...register(commentField)}
                    placeholder="Additional notes or clarifications..."
                    rows={2}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor={intervalField} className="text-xs">Time interval (onset to death)</Label>
                    <Input
                      id={intervalField}
                      {...register(intervalField)}
                      placeholder="e.g., 2 hours, 3 days"
                    />
                  </div>
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
              Add condition
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleBack}
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
