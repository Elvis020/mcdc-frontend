'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

interface CertificateFormContextType {
  formData: Partial<CertificateFormData>
  updateFormData: (data: Partial<CertificateFormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  certificateId?: string
  isEditMode: boolean
}

const CertificateFormContext = createContext<CertificateFormContextType | undefined>(undefined)

interface CertificateFormProviderProps {
  children: ReactNode
  initialData?: Partial<CertificateFormData>
  certificateId?: string
}

export function CertificateFormProvider({
  children,
  initialData,
  certificateId
}: CertificateFormProviderProps) {
  const [formData, setFormData] = useState<Partial<CertificateFormData>>(
    initialData || {
      // Default values for new certificates
      gender: 'male',
      manner_of_death: 'disease',
      is_fetal_infant_death: false,
    }
  )
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7

  const updateFormData = (data: Partial<CertificateFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  return (
    <CertificateFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        totalSteps,
        certificateId,
        isEditMode: !!certificateId,
      }}
    >
      {children}
    </CertificateFormContext.Provider>
  )
}

export function useCertificateForm() {
  const context = useContext(CertificateFormContext)
  if (!context) {
    throw new Error('useCertificateForm must be used within CertificateFormProvider')
  }
  return context
}
