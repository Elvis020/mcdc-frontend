'use client'

interface ProgressBarProps {
  progress: number
  message?: string
}

export function ProgressBar({ progress, message }: ProgressBarProps) {
  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-emerald-100">
        <div
          className="h-full bg-emerald-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
