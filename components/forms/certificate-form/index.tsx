'use client'

import { useCallback, useEffect, useState } from 'react'
import { CertificateFormProvider, useCertificateForm } from './form-context'
import { CertificateFormData } from '@/lib/validations/certificate.schema'
import { FormProgress } from './form-progress'
import { Step1Administrative } from './step-1-administrative'
import { Step2MedicalPart1 } from './step-2-medical-part1'
import { Step3MedicalPart2 } from './step-3-medical-part2'
import { Step4OtherMedical } from './step-4-other-medical'
import { Step5MannerLocation } from './step-5-manner-location'
import { Step6FetalInfant } from './step-6-fetal-infant'
import { Step7Issuer } from './step-7-issuer'
import { Step8ReviewSubmit } from './step-8-review-submit'
import { UnsavedChangesDialog } from './unsaved-changes-dialog'
import { useNavigationGuard } from './use-navigation-guard'

function FormContent() {
  const { currentStep, isDirty, setCurrentStep, resetForm } = useCertificateForm()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Stable callback reference prevents useNavigationGuard's effect from
  // re-running (and re-attaching the document click listener) on every render.
  const onNavigationAttempt = useCallback((targetUrl: string) => {
    setPendingNavigation(targetUrl)
    setShowDialog(true)
  }, [])

  const { allowNavigation, router } = useNavigationGuard({
    shouldBlock: isDirty,
    onNavigationAttempt,
  })

  useEffect(() => {
    if (isDirty) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  const handleDiscard = () => {
    setShowDialog(false)
    resetForm()
    if (pendingNavigation) {
      allowNavigation()
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const handleCancel = () => {
    setShowDialog(false)
    setPendingNavigation(null)
  }

  return (
    <>
      {currentStep === 1 && <Step1Administrative />}
      {currentStep === 2 && <Step2MedicalPart1 />}
      {currentStep === 3 && <Step3MedicalPart2 />}
      {currentStep === 4 && <Step4OtherMedical />}
      {currentStep === 5 && <Step5MannerLocation />}
      {currentStep === 6 && <Step6FetalInfant />}
      {currentStep === 7 && <Step7Issuer />}
      {currentStep === 8 && <Step8ReviewSubmit />}

      <UnsavedChangesDialog
        isOpen={showDialog}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      />
    </>
  )
}

interface CertificateFormProps {
  initialData?: Partial<CertificateFormData>
  certificateId?: string
}

export function CertificateForm({ initialData, certificateId }: CertificateFormProps) {
  return (
    <CertificateFormProvider initialData={initialData} certificateId={certificateId}>
      <FormContent />
    </CertificateFormProvider>
  )
}
