'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface UseNavigationGuardProps {
  shouldBlock: boolean
  onNavigationAttempt: (targetUrl: string) => void
}

export function useNavigationGuard({ shouldBlock, onNavigationAttempt }: UseNavigationGuardProps) {
  const router = useRouter()
  const isNavigatingRef = useRef(false)
  // Store the reset-timer ID so it can be cancelled if the component unmounts
  // before the 100ms window elapses (avoids writing to a ref on an unmounted component).
  const allowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!shouldBlock) return

    const handleClick = (e: MouseEvent) => {
      // Don't block if we're already navigating (user confirmed)
      if (isNavigatingRef.current) return

      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      const href = anchor.getAttribute('href')

      // Only block internal navigation
      if (href && href.startsWith('/') && !href.startsWith('#')) {
        e.preventDefault()
        e.stopPropagation()
        onNavigationAttempt(href)
      }
    }

    // Attach to capture phase to catch it before other handlers
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [shouldBlock, onNavigationAttempt])

  // Clear pending allow-timer on unmount
  useEffect(() => {
    return () => {
      if (allowTimerRef.current !== null) clearTimeout(allowTimerRef.current)
    }
  }, [])

  const allowNavigation = useCallback(() => {
    isNavigatingRef.current = true
    // Reset after a short delay to allow the navigation to complete
    allowTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false
    }, 100)
  }, [])

  return { allowNavigation, router }
}
