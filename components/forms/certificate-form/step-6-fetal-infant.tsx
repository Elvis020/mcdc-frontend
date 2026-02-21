'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetalInfantSchema, type FetalInfant } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function Step6FetalInfant() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
  } = useForm<FetalInfant>({
    resolver: zodResolver(fetalInfantSchema),
    defaultValues: {
      is_fetal_infant_death: formData.is_fetal_infant_death || false,
      stillbirth: formData.stillbirth || undefined,
      multiple_pregnancy: formData.multiple_pregnancy || false,
      hours_if_death_within_24h: formData.hours_if_death_within_24h || undefined,
      birth_weight_grams: formData.birth_weight_grams || undefined,
      was_serviced: formData.was_serviced || false,
      completed_weeks_pregnancy: formData.completed_weeks_pregnancy || undefined,
      mother_age_years: formData.mother_age_years || undefined,
      maternal_conditions: formData.maternal_conditions || '',
      was_deceased_pregnant: formData.was_deceased_pregnant || undefined,
      pregnancy_timing: formData.pregnancy_timing || undefined,
      pregnancy_contributed_to_death: formData.pregnancy_contributed_to_death || undefined,
    },
  })

  const isFetalInfant = watch('is_fetal_infant_death')
  const wasPregnant = watch('was_deceased_pregnant')

  const onSubmit = (data: FetalInfant) => {
    updateFormData(data)
    setCurrentStep(7)
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
            <h3 className="text-lg font-semibold text-slate-900">Fetal or Infant Death</h3>
            <p className="text-sm text-slate-500 mt-1">
              Complete this section only if applicable (skip if not relevant)
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_fetal_infant_death"
                {...register('is_fetal_infant_death')}
                className="h-4 w-4"
              />
              <Label htmlFor="is_fetal_infant_death" className="font-normal">
                This is a fetal or infant death
              </Label>
            </div>
          </div>

          {isFetalInfant && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stillbirth">Stillbirth?</Label>
                  <Select id="stillbirth" {...register('stillbirth')}>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="multiple_pregnancy"
                      {...register('multiple_pregnancy')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="multiple_pregnancy" className="font-normal">
                      Multiple pregnancy
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours_if_death_within_24h">
                    Hours (if death within 24h)
                  </Label>
                  <Input
                    id="hours_if_death_within_24h"
                    type="number"
                    min="0"
                    max="24"
                    {...register('hours_if_death_within_24h', { valueAsNumber: true })}
                    placeholder="0-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_weight_grams">Birth Weight (grams)</Label>
                  <Input
                    id="birth_weight_grams"
                    type="number"
                    {...register('birth_weight_grams', { valueAsNumber: true })}
                    placeholder="e.g., 3500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completed_weeks_pregnancy">Weeks of Pregnancy</Label>
                  <Input
                    id="completed_weeks_pregnancy"
                    type="number"
                    min="0"
                    max="45"
                    {...register('completed_weeks_pregnancy', { valueAsNumber: true })}
                    placeholder="0-45"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mother_age_years">Mother's Age (years)</Label>
                <Input
                  id="mother_age_years"
                  type="number"
                  min="10"
                  max="60"
                  {...register('mother_age_years', { valueAsNumber: true })}
                  placeholder="e.g., 28"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maternal_conditions">
                  Maternal Conditions Affecting Fetus/Newborn
                </Label>
                <Textarea
                  id="maternal_conditions"
                  {...register('maternal_conditions')}
                  placeholder="List any maternal conditions..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </>
          )}

          {/* For Women - Pregnancy Status */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">For Women: Pregnancy Status</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="was_deceased_pregnant">
                  Was the Deceased Pregnant?
                </Label>
                <Select id="was_deceased_pregnant" {...register('was_deceased_pregnant')}>
                  <option value="">Not applicable</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </div>

              {wasPregnant === 'yes' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pregnancy_timing">When?</Label>
                    <Select id="pregnancy_timing" {...register('pregnancy_timing')}>
                      <option value="">Select...</option>
                      <option value="at_time_of_death">At time of death</option>
                      <option value="within_42_days_before">Within 42 days before death</option>
                      <option value="between_43_days_to_1_year_before">Between 43 days to 1 year before death</option>
                      <option value="unknown">Unknown</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pregnancy_contributed_to_death">
                      Did pregnancy contribute to death?
                    </Label>
                    <Select id="pregnancy_contributed_to_death" {...register('pregnancy_contributed_to_death')}>
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unknown">Unknown</option>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors order-first sm:order-none"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => saveDraft(getValues())}
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
