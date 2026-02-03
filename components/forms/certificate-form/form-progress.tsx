'use client'

import { useCertificateForm } from './form-context'
import { cn } from '@/lib/utils'
import { RotateCcw } from 'lucide-react'

export const steps = [
  { number: 1, name: 'Administrative', description: 'Basic information' },
  { number: 2, name: 'Medical Part 1', description: 'Cause of death' },
  { number: 3, name: 'Medical Part 2', description: 'Contributing factors' },
  { number: 4, name: 'Other Medical', description: 'Additional details' },
  { number: 5, name: 'Manner & Location', description: 'Death circumstances' },
  { number: 6, name: 'Fetal/Infant', description: 'Optional section' },
  { number: 7, name: 'Issuer Details', description: 'Your information' },
  { number: 8, name: 'Review & Submit', description: 'Final review' },
]

interface FormProgressProps {
  onClearStep?: () => void
}

export function FormProgress({ onClearStep }: FormProgressProps) {
  const { currentStep } = useCertificateForm()

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Step {currentStep}: {steps[currentStep - 1].name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {steps[currentStep - 1].description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onClearStep && (
            <button
              type="button"
              onClick={onClearStep}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              title="Clear current step"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs text-slate-500 font-medium">
            {currentStep} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  )
}

// Separate component for step indicators to be used in navigation
export function StepIndicators() {
  const { currentStep, setCurrentStep } = useCertificateForm()

  return (
    <div className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
      {steps.map((step) => (
        <button
          key={step.number}
          onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
          disabled={step.number > currentStep}
          className={cn(
            'size-2 rounded-full transition-all',
            currentStep === step.number && 'bg-emerald-600 w-8',
            currentStep > step.number && 'bg-emerald-600 hover:scale-125 cursor-pointer',
            currentStep < step.number && 'bg-slate-300 cursor-not-allowed'
          )}
          aria-label={`Go to step ${step.number}`}
        />
      ))}
    </div>
  )
}
