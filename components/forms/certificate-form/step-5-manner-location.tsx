'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mannerLocationSchema, type MannerLocation } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function Step5MannerLocation() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MannerLocation>({
    resolver: zodResolver(mannerLocationSchema),
    defaultValues: {
      manner_of_death: formData.manner_of_death,
      external_cause_date: formData.external_cause_date || '',
      external_cause_description: formData.external_cause_description || '',
      poisoning_agent: formData.poisoning_agent || '',
      death_location: formData.death_location || undefined,
      death_location_other: formData.death_location_other || '',
    },
  })

  const mannerOfDeath = watch('manner_of_death')
  const showExternalCause = mannerOfDeath === 'external_cause_or_poisonous'

  const onSubmit = (data: MannerLocation) => {
    updateFormData(data)
    setCurrentStep(6)
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
            <h3 className="text-lg font-semibold text-slate-900">Manner of Death</h3>
            <p className="text-sm text-slate-500 mt-1">
              Circumstances and location of death
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="manner_of_death">
              Manner of Death <span className="text-red-500">*</span>
            </Label>
            <Select id="manner_of_death" {...register('manner_of_death')}>
              <option value="" disabled>Select manner of death...</option>
              <option value="disease">Disease</option>
              <option value="assault">Assault</option>
              <option value="could_not_be_determined">Could Not Be Determined</option>
              <option value="accident">Accident</option>
              <option value="war">War</option>
              <option value="pending_investigation">Pending Investigation</option>
              <option value="intentional_self_harm">Intentional Self Harm</option>
              <option value="legal_intervention">Legal Intervention</option>
              <option value="external_cause_or_poisonous">External Cause or Poisonous</option>
            </Select>
            {errors.manner_of_death && (
              <p className="text-sm text-destructive">{errors.manner_of_death.message}</p>
            )}
          </div>

          {showExternalCause && (
            <>
              <div className="space-y-2">
                <Label htmlFor="external_cause_date">Date of Injury/External Cause</Label>
                <Input
                  id="external_cause_date"
                  type="date"
                  {...register('external_cause_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="external_cause_description">
                  Describe How External Cause Occurred
                </Label>
                <Textarea
                  id="external_cause_description"
                  {...register('external_cause_description')}
                  placeholder="Describe the circumstances..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poisoning_agent">
                  If Poisoning, Specify Agent
                </Label>
                <Input
                  id="poisoning_agent"
                  {...register('poisoning_agent')}
                  placeholder="e.g., Pesticide, medication"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="death_location">Location of Death</Label>
            <Select id="death_location" {...register('death_location')}>
              <option value="">Select location...</option>
              <option value="home">Home</option>
              <option value="residential_institution">Residential Institution</option>
              <option value="school_other_institution_public">School/Other Institution/Public Administrative Area</option>
              <option value="sports_athletics">Sports and Athletics</option>
              <option value="street_highway">Street and Highway</option>
              <option value="trade_service_area">Trade and Service Area</option>
              <option value="industrial_construction_area">Industrial and Construction Area</option>
              <option value="farm">Farm</option>
              <option value="unknown">Unknown</option>
              <option value="other">Other</option>
            </Select>
          </div>

          {watch('death_location') === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="death_location_other">Please specify location</Label>
              <Input
                id="death_location_other"
                {...register('death_location_other')}
                placeholder="Specify the location of death..."
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
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
