'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCertificateForm } from './form-context'
import { saveCertificate } from '@/lib/certificate-actions'
import { CertificateFormData } from '@/lib/validations/certificate.schema'
import { toast } from 'sonner'

export function useSaveDraft() {
  const router = useRouter()
  const { formData, certificateId, isEditMode } = useCertificateForm()
  const [saving, setSaving] = useState(false)
  // Ref-based guard: React state updates are async, so `saving` being true
  // in state doesn't prevent a second call from starting before the first
  // setSaving(true) is committed. A ref is synchronous and prevents the race.
  const savingRef = useRef(false)

  const saveDraft = useCallback(async (currentStepData?: Partial<CertificateFormData>) => {
    if (savingRef.current) return  // synchronous guard — no double-saves
    savingRef.current = true
    setSaving(true)

    const mergedData = { ...formData, ...(currentStepData ?? {}) }

    const result = await saveCertificate(mergedData, {
      status: 'draft',
      isEditMode,
      certificateId,
    })

    if (result.success) {
      toast.success('Draft saved successfully')
      router.push('/dashboard/certificates')
      // Don't reset saving — navigation is in progress; component will unmount
    } else {
      toast.error(result.error ?? 'Failed to save draft')
      setSaving(false)
      savingRef.current = false
    }
  }, [formData, certificateId, isEditMode, router])

  return { saveDraft, saving }
}
