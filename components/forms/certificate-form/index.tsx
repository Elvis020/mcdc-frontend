'use client'

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

function FormContent() {
  const { currentStep } = useCertificateForm()

  return (
    <div className="space-y-6">
      <FormProgress />

      {currentStep === 1 && <Step1Administrative />}
      {currentStep === 2 && <Step2MedicalPart1 />}
      {currentStep === 3 && <Step3MedicalPart2 />}
      {currentStep === 4 && <Step4OtherMedical />}
      {currentStep === 5 && <Step5MannerLocation />}
      {currentStep === 6 && <Step6FetalInfant />}
      {currentStep === 7 && <Step7Issuer />}
    </div>
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
