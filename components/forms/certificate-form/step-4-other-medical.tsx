'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otherMedicalDataSchema, type OtherMedicalData } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function Step4OtherMedical() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<OtherMedicalData>({
    resolver: zodResolver(otherMedicalDataSchema),
    defaultValues: {
      surgery_within_4_weeks: formData.surgery_within_4_weeks || undefined,
      surgery_date: formData.surgery_date || '',
      surgery_reason: formData.surgery_reason || '',
      autopsy_requested: formData.autopsy_requested || undefined,
      autopsy_findings_used: formData.autopsy_findings_used || undefined,
    },
  })

  const surgeryPerformed = watch('surgery_within_4_weeks')
  const autopsyRequested = watch('autopsy_requested')

  const onSubmit = (data: OtherMedicalData) => {
    updateFormData(data)
    setCurrentStep(5)
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
            <h3 className="text-lg font-semibold text-slate-900">Other Medical Data</h3>
            <p className="text-sm text-slate-500 mt-1">
              Information about surgery and autopsy
            </p>
          </div>
          {/* Surgery Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="surgery_within_4_weeks">
                Was surgery performed within the last 4 weeks?
              </Label>
              <Select id="surgery_within_4_weeks" {...register('surgery_within_4_weeks')}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            {surgeryPerformed === 'yes' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="surgery_date">Date of Surgery</Label>
                  <Input
                    id="surgery_date"
                    type="date"
                    {...register('surgery_date')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surgery_reason">Reason for Surgery</Label>
                  <Textarea
                    id="surgery_reason"
                    {...register('surgery_reason')}
                    placeholder="Describe the disease or condition that required surgery"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Autopsy Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autopsy_requested">
                Was an autopsy requested?
              </Label>
              <Select id="autopsy_requested" {...register('autopsy_requested')}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            {autopsyRequested === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="autopsy_findings_used">
                  Were the findings used in certification?
                </Label>
                <Select id="autopsy_findings_used" {...register('autopsy_findings_used')}>
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
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
