'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart2Schema, type MedicalDataPart2 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Step3MedicalPart2() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<MedicalDataPart2>({
    resolver: zodResolver(medicalDataPart2Schema),
    defaultValues: {
      contributing_conditions: formData.contributing_conditions || '',
    },
  })

  const onSubmit = (data: MedicalDataPart2) => {
    updateFormData(data)
    setCurrentStep(4)
  }

  const handleClearStep = () => {
    reset()
  }

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
          <div className="space-y-2">
            <Label htmlFor="contributing_conditions">
              Contributing Conditions (Optional)
            </Label>
            <Textarea
              id="contributing_conditions"
              {...register('contributing_conditions')}
              placeholder="List any other conditions that contributed to death but were not part of the causal chain..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Examples: Diabetes, Hypertension, Chronic kidney disease, etc.
            </p>
          </div>
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
