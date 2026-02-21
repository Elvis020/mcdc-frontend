'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCertificateForm } from './form-context'
import { FormProgress, StepIndicators } from './form-progress'
import { saveCertificate } from '@/lib/certificate-actions'
import { certificateSchema } from '@/lib/validations/certificate.schema'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CertificateLayout } from '@/components/certificate-layout/certificate-layout'
import { toast } from 'sonner'

export function Step8ReviewSubmit() {
  const router = useRouter()
  const { formData, setCurrentStep, certificateId, isEditMode } = useCertificateForm()
  const [activeAction, setActiveAction] = useState<'draft' | 'submit' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSaveDraft = async () => {
    setActiveAction('draft')
    setError(null)

    const result = await saveCertificate(formData, {
      status: 'draft',
      isEditMode,
      certificateId,
    })

    setActiveAction(null)

    if (result.success) {
      toast.success('Draft saved successfully')
      router.push('/dashboard/certificates')
    } else {
      setError(result.error ?? 'Failed to save draft')
      toast.error(result.error ?? 'Failed to save draft')
    }
  }

  const onSubmit = async () => {
    // Validate required fields before submitting
    const validation = certificateSchema.safeParse(formData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      const msg = `Please complete required fields: ${firstError?.message ?? 'Validation failed'}`
      setError(msg)
      toast.error(msg)
      return
    }

    setActiveAction('submit')
    setError(null)

    const result = await saveCertificate(formData, {
      status: 'submitted',
      isEditMode,
      certificateId,
    })

    setActiveAction(null)

    if (result.success) {
      toast.success('Certificate submitted successfully')
      router.push('/dashboard/certificates')
    } else {
      setError(result.error ?? 'Failed to submit certificate')
      toast.error(result.error ?? 'Failed to submit certificate')
    }
  }

  return (
    <div className="space-y-6">
      <FormProgress />

      {/* Certificate Preview — physical form layout */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Review Certificate</h3>
          <p className="text-sm text-slate-500 mt-1">
            Please review all information carefully before submitting
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CertificateLayout data={formData} />
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StepIndicators />
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep(7)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors order-first sm:order-none"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={activeAction !== null}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeAction === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={activeAction !== null}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeAction === 'submit'
              ? (isEditMode ? 'Updating...' : 'Submitting...')
              : (isEditMode ? 'Update Certificate' : 'Submit Certificate')}
          </button>
        </div>
      </div>
    </div>
  )
}
