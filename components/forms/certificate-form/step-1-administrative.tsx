'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { administrativeDataSchema, type AdministrativeData } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step1Administrative() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdministrativeData>({
    resolver: zodResolver(administrativeDataSchema),
    defaultValues: {
      folder_number: formData.folder_number || '',
      cod_certificate_number: formData.cod_certificate_number || '',
      facility_code: formData.facility_code || '',
      facility_sn: formData.facility_sn || '',
      facility_d: formData.facility_d || '',
      deceased_full_name: formData.deceased_full_name || '',
      date_of_birth: formData.date_of_birth || '',
      gender: formData.gender || 'male',
      national_register_number: formData.national_register_number || '',
      national_id_number: formData.national_id_number || '',
      date_of_death: formData.date_of_death || '',
    },
  })

  const onSubmit = (data: AdministrativeData) => {
    updateFormData(data)
    setCurrentStep(2)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administrative Data</CardTitle>
          <CardDescription>
            Basic information about the deceased and certificate details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Certificate Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folder_number">Folder Number</Label>
              <Input
                id="folder_number"
                {...register('folder_number')}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cod_certificate_number">COD Certificate No.</Label>
              <Input
                id="cod_certificate_number"
                {...register('cod_certificate_number')}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facility_code">Facility Code</Label>
              <Input
                id="facility_code"
                {...register('facility_code')}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Deceased Information */}
          <div className="space-y-2">
            <Label htmlFor="deceased_full_name">
              Deceased Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deceased_full_name"
              {...register('deceased_full_name')}
              placeholder="Enter full name of deceased"
            />
            {errors.deceased_full_name && (
              <p className="text-sm text-destructive">{errors.deceased_full_name.message}</p>
            )}
          </div>

          {/* Dates and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_death">
                Date of Death <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_of_death"
                type="date"
                {...register('date_of_death')}
              />
              {errors.date_of_death && (
                <p className="text-sm text-destructive">{errors.date_of_death.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select id="gender" {...register('gender')}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </div>
          </div>

          {/* National IDs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="national_register_number">National Register Number</Label>
              <Input
                id="national_register_number"
                {...register('national_register_number')}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="national_id_number">National ID Number</Label>
              <Input
                id="national_id_number"
                {...register('national_id_number')}
                placeholder="Optional"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Next Step →
        </Button>
      </div>
    </form>
  )
}
