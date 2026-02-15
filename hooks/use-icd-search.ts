import { useState, useEffect, useRef } from 'react'
import { searchIcd, type IcdResult } from '@/lib/icd-search'

export function useIcdSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<IcdResult[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel any in-flight request
    abortRef.current?.abort()

    if (!query || query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    const timeout = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const data = await searchIcd(query, 7, controller.signal)
        if (!controller.signal.aborted) {
          setResults(data)
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setResults([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, debounceMs)

    return () => {
      clearTimeout(timeout)
      abortRef.current?.abort()
    }
  }, [query, debounceMs])

  return { results, loading }
}
