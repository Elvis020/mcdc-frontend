interface FormCheckboxProps {
  checked: boolean
  label?: string
  className?: string
}

/** A small bordered square mimicking a paper-form checkbox. */
export function FormCheckbox({ checked, label, className }: FormCheckboxProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ''}`}>
      <span
        className={`inline-flex items-center justify-center w-3.5 h-3.5 border border-gray-700 flex-shrink-0 ${
          checked ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        {checked && (
          <span className="text-white text-[8px] leading-none font-bold">✓</span>
        )}
      </span>
      {label && <span className="text-[10px]">{label}</span>}
    </span>
  )
}

interface YesNoUnknownProps {
  value?: string | null
  className?: string
}

/** Three inline checkboxes for Yes / No / Unknown fields. */
export function YesNoUnknown({ value, className }: YesNoUnknownProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <FormCheckbox checked={value === 'yes'} label="Yes" />
      <FormCheckbox checked={value === 'no'} label="No" />
      <FormCheckbox checked={value === 'unknown'} label="Unknown" />
    </span>
  )
}
