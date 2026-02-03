'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { administrativeDataSchema, type AdministrativeData } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { useSaveDraft } from './use-save-draft'
import { cn } from '@/lib/utils'

export function Step1Administrative() {
  const { formData, updateFormData, setCurrentStep } = useCertificateForm()
  const { saveDraft, saving } = useSaveDraft()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
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

  const handleClearStep = () => {
    reset()
  }

  return (
    <div className="space-y-6">
      <FormProgress onClearStep={handleClearStep} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        {/* Certificate Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="folder_number" className="text-sm font-medium text-slate-700">
              Folder Number
            </label>
            <input
              id="folder_number"
              type="text"
              {...register('folder_number')}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cod_certificate_number" className="text-sm font-medium text-slate-700">
              COD Certificate No.
            </label>
            <input
              id="cod_certificate_number"
              type="text"
              {...register('cod_certificate_number')}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="facility_code" className="text-sm font-medium text-slate-700">
              Facility Code
            </label>
            <input
              id="facility_code"
              type="text"
              {...register('facility_code')}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Deceased Information */}
        <div className="space-y-1.5">
          <label htmlFor="deceased_full_name" className="text-sm font-medium text-slate-700">
            Deceased Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="deceased_full_name"
            type="text"
            {...register('deceased_full_name')}
            placeholder="Enter full name of deceased"
            className={cn(
              "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-slate-400",
              errors.deceased_full_name && touchedFields.deceased_full_name ? "border-red-300 bg-red-50" : "border-slate-200"
            )}
          />
          {errors.deceased_full_name && touchedFields.deceased_full_name && (
            <p className="text-xs text-red-600">{errors.deceased_full_name.message}</p>
          )}
        </div>

        {/* Dates and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="date_of_birth" className="text-sm font-medium text-slate-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-slate-400",
                errors.date_of_birth && touchedFields.date_of_birth ? "border-red-300 bg-red-50" : "border-slate-200"
              )}
            />
            {errors.date_of_birth && touchedFields.date_of_birth && (
              <p className="text-xs text-red-600">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="date_of_death" className="text-sm font-medium text-slate-700">
              Date of Death <span className="text-red-500">*</span>
            </label>
            <input
              id="date_of_death"
              type="date"
              {...register('date_of_death')}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-slate-400",
                errors.date_of_death && touchedFields.date_of_death ? "border-red-300 bg-red-50" : "border-slate-200"
              )}
            />
            {errors.date_of_death && touchedFields.date_of_death && (
              <p className="text-xs text-red-600">{errors.date_of_death.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="gender" className="text-sm font-medium text-slate-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* National IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="national_register_number" className="text-sm font-medium text-slate-700">
              National Register Number
            </label>
            <input
              id="national_register_number"
              type="text"
              {...register('national_register_number')}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="national_id_number" className="text-sm font-medium text-slate-700">
              National ID Number
            </label>
            <input
              id="national_id_number"
              type="text"
              {...register('national_id_number')}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StepIndicators />
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
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
