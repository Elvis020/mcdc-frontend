interface FormFieldProps {
  label: string
  value?: string | null
  className?: string
}

/** A bordered cell with a tiny uppercase label and a value row below it. */
export function FormField({ label, value, className }: FormFieldProps) {
  return (
    <div className={`px-2 py-1 ${className ?? ''}`}>
      <p className="text-[8px] text-gray-500 uppercase tracking-wide leading-tight mb-0.5">
        {label}
      </p>
      <p className="text-[10px] min-h-[14px]">{value ?? ''}</p>
    </div>
  )
}
