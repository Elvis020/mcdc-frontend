'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart2Schema, type MedicalDataPart2 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step3MedicalPart2() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()

  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Data Part 2 - Contributing Conditions</CardTitle>
          <CardDescription>
            Other significant conditions contributing to death but not related to the disease or condition causing it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contributing_conditions">
              Contributing Conditions (Optional)
            </Label>
            <Textarea
              id="contributing_conditions"
              {...register('contributing_conditions')}
              placeholder="List any other conditions that contributed to death but were not part of the causal chain..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Examples: Diabetes, Hypertension, Chronic kidney disease, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
          ← Back
        </Button>
        <Button type="submit" size="lg">
          Next Step →
        </Button>
      </div>
    </form>
  )
}
