'use client'

import { useCertificateForm } from './form-context'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, name: 'Administrative Data', shortName: 'Admin' },
  { number: 2, name: 'Medical Data Part 1', shortName: 'Medical 1' },
  { number: 3, name: 'Medical Data Part 2', shortName: 'Medical 2' },
  { number: 4, name: 'Other Medical Data', shortName: 'Other' },
  { number: 5, name: 'Manner & Location', shortName: 'Manner' },
  { number: 6, name: 'Fetal/Infant Death', shortName: 'Fetal' },
  { number: 7, name: 'Issuer Details', shortName: 'Issuer' },
]

export function FormProgress() {
  const { currentStep } = useCertificateForm()

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm',
                  currentStep === step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep > step.number
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted bg-background text-muted-foreground'
                )}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span className="mt-2 text-xs font-medium hidden sm:block">
                {step.shortName}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Name (Mobile) */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium">{steps[currentStep - 1].name}</p>
      </div>
    </div>
  )
}
