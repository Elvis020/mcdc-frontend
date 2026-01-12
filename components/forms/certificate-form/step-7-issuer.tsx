'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { issuerDetailsSchema, type IssuerDetails } from '@/lib/validations/certificate.schema'
import { useCertificateForm } from './form-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function Step7Issuer() {
  const router = useRouter()
  const { formData, updateFormData, setCurrentStep, certificateId, isEditMode } = useCertificateForm()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
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

      // Combine all form data
      const completeData = { ...formData, ...data }

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

  const onSubmit = async (data: IssuerDetails) => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const completeData = { ...formData, ...data }

      if (isEditMode && certificateId) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('death_certificates')
          .update({
            ...completeData,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            edit_window_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', certificateId)

        if (updateError) throw updateError
      } else {
        // Create new certificate
        const { data: userData } = await supabase
          .from('users')
          .select('region_id, district_id, facility_id')
          .eq('id', user.id)
          .single()

        // Generate proper serial number
        const { data: regionData } = await supabase
          .from('regions')
          .select('code')
          .eq('id', userData?.region_id)
          .single()

        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const serial = `${regionData?.code || 'GAR'}-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`

        const { error: insertError } = await supabase
          .from('death_certificates')
          .insert({
            serial_number: serial,
            status: 'submitted',
            created_by_id: user.id,
            region_id: userData?.region_id,
            district_id: userData?.district_id,
            facility_id: userData?.facility_id,
            submitted_at: new Date().toISOString(),
            edit_window_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            ...completeData,
          })

        if (insertError) throw insertError
      }

      router.push('/dashboard/certificates')
    } catch (err: any) {
      setError(err.message || 'Failed to submit certificate')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Issuer Details</CardTitle>
          <CardDescription>
            Information about the person receiving the certificate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              rows={2}
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setCurrentStep(6)}>
          ← Back
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit(onSaveDraft)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Certificate' : 'Submit Certificate')}
          </Button>
        </div>
      </div>
    </form>
  )
}
