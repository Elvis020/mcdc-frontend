'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mannerLocationSchema, type MannerLocation } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step5MannerLocation() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MannerLocation>({
    resolver: zodResolver(mannerLocationSchema),
    defaultValues: {
      manner_of_death: formData.manner_of_death || 'disease',
      external_cause_date: formData.external_cause_date || '',
      external_cause_description: formData.external_cause_description || '',
      poisoning_agent: formData.poisoning_agent || '',
      death_location: formData.death_location || undefined,
    },
  })

  const mannerOfDeath = watch('manner_of_death')
  const showExternalCause = mannerOfDeath === 'external_cause_or_poisonous'

  const onSubmit = (data: MannerLocation) => {
    updateFormData(data)
    setCurrentStep(6)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manner of Death</CardTitle>
          <CardDescription>
            Circumstances and location of death
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="manner_of_death">
              Manner of Death <span className="text-destructive">*</span>
            </Label>
            <Select id="manner_of_death" {...register('manner_of_death')}>
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
              <option value="school_other_institution_public">School/Other Institution/Public</option>
              <option value="sports_athletics">Sports and Athletics</option>
              <option value="street_highway">Street and Highway</option>
              <option value="trade_service_area">Trade and Service Area</option>
              <option value="industrial_construction_area">Industrial and Construction Area</option>
              <option value="farm">Farm</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
          ← Back
        </Button>
        <Button type="submit" size="lg">
          Next Step →
        </Button>
      </div>
    </form>
  )
}
