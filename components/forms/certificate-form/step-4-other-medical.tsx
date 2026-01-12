'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otherMedicalDataSchema, type OtherMedicalData } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step4OtherMedical() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()

  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Other Medical Data</CardTitle>
          <CardDescription>
            Information about surgery and autopsy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
          ← Back
        </Button>
        <Button type="submit" size="lg">
          Next Step →
        </Button>
      </div>
    </form>
  )
}
