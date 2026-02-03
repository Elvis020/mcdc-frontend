'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onDiscard: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({
  isOpen,
  onDiscard,
  onCancel,
}: UnsavedChangesDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Disable scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = ''
    }

    // Cleanup: ensure scrolling is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Unsaved Changes</h3>
            <p className="text-sm text-slate-600 mt-2">
              You have unsaved changes. If you leave now, your progress will be lost. Use "Save as Draft" button to save your progress first.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onDiscard}
              className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={onCancel}
              className="w-full px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
