'use client'

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
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

// Defined outside component — created once, never recreated across renders.
// If defined inside, a new object is created on every render, breaking
// resetForm's memoization and causing unnecessary re-renders.
const DEFAULT_FORM_DATA: Partial<CertificateFormData> = {
  gender: 'male' as const,
  manner_of_death: '' as any,
  is_fetal_infant_death: false,
}

export function CertificateFormProvider({
  children,
  initialData,
  certificateId
}: CertificateFormProviderProps) {
  const [formData, setFormData] = useState<Partial<CertificateFormData>>(
    initialData || DEFAULT_FORM_DATA
  )
  const [currentStep, setCurrentStep] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const totalSteps = 8

  // Stable reference — uses functional updater so it never goes stale.
  // Without useCallback, a new function is created on every render, causing
  // all 8 step components (which consume this via context) to re-render.
  const updateFormData = useCallback((data: Partial<CertificateFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setIsDirty(true)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setCurrentStep(1)
    setIsDirty(false)
  }, [])

  // Memoize the context value object so consumers only re-render when
  // the specific slice of state they use actually changes.
  const value = useMemo(() => ({
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    totalSteps,
    certificateId,
    isEditMode: !!certificateId,
    resetForm,
    isDirty,
  }), [formData, updateFormData, currentStep, certificateId, resetForm, isDirty])

  return (
    <CertificateFormContext.Provider value={value}>
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
