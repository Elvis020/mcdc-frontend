'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalDataPart1Schema, type MedicalDataPart1 } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step2MedicalPart1() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()

  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Data Part 1 - Cause of Death</CardTitle>
          <CardDescription>
            Report the chain of events leading to death (ICD format: a → b → c → d)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cause A - Direct cause */}
          <div className="space-y-2">
            <Label htmlFor="cause_a_description">
              (a) Disease or condition directly leading to death <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cause_a_description"
              {...register('cause_a_description')}
              placeholder="e.g., Cardiac arrest, Respiratory failure"
              rows={2}
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
              rows={2}
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
              rows={2}
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
              rows={2}
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          ← Back
        </Button>
        <Button type="submit" size="lg">
          Next Step →
        </Button>
      </div>
    </form>
  )
}
