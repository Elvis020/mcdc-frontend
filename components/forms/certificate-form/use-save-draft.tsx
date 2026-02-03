'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCertificateForm } from './form-context'

export function useSaveDraft() {
  const router = useRouter()
  const { formData, certificateId, isEditMode } = useCertificateForm()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveDraft = async () => {
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Transform empty strings to null for date fields and database compatibility
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      )

      if (isEditMode && certificateId) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('death_certificates')
          .update({
            ...cleanFormData,
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
            ...cleanFormData,
          })

        if (insertError) throw insertError
      }

      // Navigate back to certificates page
      router.push('/dashboard/certificates')
    } catch (err: any) {
      setError(err.message || 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  return { saveDraft, saving, error }
}
