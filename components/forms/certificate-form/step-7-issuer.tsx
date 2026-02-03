'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { issuerDetailsSchema, type IssuerDetails } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function Step7Issuer() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, certificateId, isEditMode } = useCertificateForm()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<IssuerDetails>({
    resolver: zodResolver(issuerDetailsSchema),
    defaultValues: {
      issued_to_full_name: formData.issued_to_full_name || '',
      issued_to_mobile: formData.issued_to_mobile || '',
      issued_to_contact_details: formData.issued_to_contact_details || '',
      relation_to_deceased: formData.relation_to_deceased || '',
      witness_to_deceased: formData.witness_to_deceased || '',
      witness_date: formData.witness_date || '',
    },
  })

  const onSaveDraft = async (data: IssuerDetails) => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Combine all form data and transform empty strings to null
      const completeData = Object.fromEntries(
        Object.entries({ ...formData, ...data }).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )

      if (isEditMode && certificateId) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('death_certificates')
          .update({
            ...completeData,
            status: 'draft',
          })
          .eq('id', certificateId)

        if (updateError) throw updateError
      } else {
        // Create new certificate
        // Get user's region data
        const { data: userData } = await supabase
          .from('users')
          .select('region_id, district_id, facility_id')
          .eq('id', user.id)
          .single()

        // Generate serial number (simplified - in production use DB function)
        const serial = `DRAFT-${Date.now()}`

        const { error: insertError } = await supabase
          .from('death_certificates')
          .insert({
            serial_number: serial,
            status: 'draft',
            created_by_id: user.id,
            region_id: userData?.region_id,
            district_id: userData?.district_id,
            facility_id: userData?.facility_id,
            ...completeData,
          })

        if (insertError) throw insertError
      }

      router.push('/dashboard/certificates')
    } catch (err: any) {
      setError(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const onNextStep = (data: IssuerDetails) => {
    // Save data to form context and move to Step 8 (Review & Submit)
    updateFormData(data)
    setCurrentStep(8)
  }

  const handleClearStep = () => {
    reset()
  }

  return (
    <div className="space-y-6">
      <FormProgress onClearStep={handleClearStep} />

      <form onSubmit={handleSubmit(onNextStep)} className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Issuer Details</h3>
            <p className="text-sm text-slate-500 mt-1">
              Information about the person receiving the certificate
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="issued_to_full_name">Issued To (Full Name)</Label>
            <Input
              id="issued_to_full_name"
              {...register('issued_to_full_name')}
              placeholder="Name of person receiving certificate"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issued_to_mobile">Mobile Number</Label>
              <Input
                id="issued_to_mobile"
                {...register('issued_to_mobile')}
                placeholder="e.g., 0244123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation_to_deceased">Relation to Deceased</Label>
              <Input
                id="relation_to_deceased"
                {...register('relation_to_deceased')}
                placeholder="e.g., Son, Daughter, Spouse"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issued_to_contact_details">Other Contact Details</Label>
            <Textarea
              id="issued_to_contact_details"
              {...register('issued_to_contact_details')}
              placeholder="Additional contact information"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="witness_to_deceased">Witness Name</Label>
              <Input
                id="witness_to_deceased"
                {...register('witness_to_deceased')}
                placeholder="Name of witness"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="witness_date">Witness Date</Label>
              <Input
                id="witness_date"
                type="date"
                {...register('witness_date')}
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
              onClick={() => setCurrentStep(6)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors order-first sm:order-none"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSaveDraft)}
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
