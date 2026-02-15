'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

interface CertificateFormContextType {
  formData: Partial<CertificateFormData>
  updateFormData: (data: Partial<CertificateFormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  certificateId?: string
  isEditMode: boolean
  resetForm: () => void
  isDirty: boolean
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
  const defaultFormData: Partial<CertificateFormData> = {
    gender: 'male' as const,
    manner_of_death: '' as any,
    is_fetal_infant_death: false,
  }

  const [formData, setFormData] = useState<Partial<CertificateFormData>>(
    initialData || defaultFormData
  )
  const [currentStep, setCurrentStep] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const totalSteps = 8

  const updateFormData = (data: Partial<CertificateFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setIsDirty(true)
  }

  const resetForm = useCallback(() => {
    setFormData(defaultFormData)
    setCurrentStep(1)
    setIsDirty(false)
  }, [])

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
        resetForm,
        isDirty,
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
