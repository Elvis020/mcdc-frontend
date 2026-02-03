'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart1Schema, type MedicalDataPart1 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Step2MedicalPart1() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalDataPart1>({
    resolver: zodResolver(medicalDataPart1Schema),
    defaultValues: {
      cause_a_description: formData.cause_a_description || '',
      cause_a_interval: formData.cause_a_interval || '',
      cause_b_description: formData.cause_b_description || '',
      cause_b_interval: formData.cause_b_interval || '',
      cause_c_description: formData.cause_c_description || '',
      cause_c_interval: formData.cause_c_interval || '',
      cause_d_description: formData.cause_d_description || '',
      cause_d_interval: formData.cause_d_interval || '',
    },
  })

  const onSubmit = (data: MedicalDataPart1) => {
    updateFormData(data)
    setCurrentStep(3)
  }

  const handleBack = () => {
    setCurrentStep(1)
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
            <h3 className="text-lg font-semibold text-slate-900">Medical Data Part 1 - Cause of Death</h3>
            <p className="text-sm text-slate-500 mt-1">
              Report the chain of events leading to death (ICD format: a → b → c → d)
            </p>
          </div>
          {/* Cause A - Direct cause */}
          <div className="space-y-2">
            <Label htmlFor="cause_a_description">
              (a) Disease or condition directly leading to death <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cause_a_description"
              {...register('cause_a_description')}
              placeholder="e.g., Cardiac arrest, Respiratory failure"
              rows={3}
              className="resize-none"
            />
            {errors.cause_a_description && (
              <p className="text-sm text-destructive">{errors.cause_a_description.message}</p>
            )}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="cause_a_interval" className="text-xs">Time interval (onset to death)</Label>
                <Input
                  id="cause_a_interval"
                  {...register('cause_a_interval')}
                  placeholder="e.g., 2 hours, 3 days"
                />
              </div>
            </div>
          </div>

          {/* Cause B */}
          <div className="space-y-2">
            <Label htmlFor="cause_b_description">
              (b) Due to (or as a consequence of)
            </Label>
            <Textarea
              id="cause_b_description"
              {...register('cause_b_description')}
              placeholder="Condition that led to (a)"
              rows={3}
              className="resize-none"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="cause_b_interval" className="text-xs">Time interval</Label>
                <Input
                  id="cause_b_interval"
                  {...register('cause_b_interval')}
                  placeholder="e.g., 1 week"
                />
              </div>
            </div>
          </div>

          {/* Cause C */}
          <div className="space-y-2">
            <Label htmlFor="cause_c_description">
              (c) Due to (or as a consequence of)
            </Label>
            <Textarea
              id="cause_c_description"
              {...register('cause_c_description')}
              placeholder="Condition that led to (b)"
              rows={3}
              className="resize-none"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="cause_c_interval" className="text-xs">Time interval</Label>
                <Input
                  id="cause_c_interval"
                  {...register('cause_c_interval')}
                  placeholder="e.g., 2 months"
                />
              </div>
            </div>
          </div>

          {/* Cause D */}
          <div className="space-y-2">
            <Label htmlFor="cause_d_description">
              (d) Due to (or as a consequence of)
            </Label>
            <Textarea
              id="cause_d_description"
              {...register('cause_d_description')}
              placeholder="Underlying condition that led to (c)"
              rows={3}
              className="resize-none"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="cause_d_interval" className="text-xs">Time interval</Label>
                <Input
                  id="cause_d_interval"
                  {...register('cause_d_interval')}
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
          </div>
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
