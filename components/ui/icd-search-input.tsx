'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useIcdSearch } from '@/hooks/use-icd-search'
import type { IcdResult } from '@/lib/icd-search'

interface IcdSearchInputProps {
  id?: string
  value: string
  icdCode?: string
  onChange: (description: string, icdCode?: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function IcdSearchInput({
  id,
  value,
  icdCode,
  onChange,
  placeholder = 'Start typing to search ICD-11 codes...',
  required,
  className,
}: IcdSearchInputProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const { results, loading } = useIcdSearch(query)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // Ref so the stable click-outside listener can read the latest icdCode
  // without being recreated on every ICD code selection (avoids removeEventListener
  // + addEventListener churn on each keystroke / selection).
  const icdCodeRef = useRef(icdCode)
  useEffect(() => { icdCodeRef.current = icdCode }, [icdCode])

  // When a code is already selected, show its display value; otherwise show the search query
  const displayValue = icdCode ? value : query

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!icdCode) {
      setQuery('')
    }
  }, [value, icdCode])

  // Close dropdown on outside click — also revert query if nothing was selected.
  // Empty deps array: listener is attached once and reads icdCode via ref.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        if (!icdCodeRef.current) {
          setQuery('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex])

  const selectResult = useCallback(
    (result: IcdResult) => {
      const display = `${result.name} (${result.code})`
      setQuery('')
      onChange(display, result.code)
      setOpen(false)
      setHighlightIndex(-1)
    },
    [onChange]
  )

  const clearSelection = useCallback(() => {
    setQuery('')
    onChange('', undefined)
    setOpen(false)
    inputRef.current?.focus()
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // If user had a selection, clear it so they can search again
    if (icdCode) {
      onChange('', undefined)
    }
    setQuery(val)
    setOpen(true)
    setHighlightIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightIndex >= 0 && results[highlightIndex]) {
          selectResult(results[highlightIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        setHighlightIndex(-1)
        if (!icdCode) setQuery('')
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (icdCode) return // Don't reopen dropdown if already selected
            if (query.trim().length >= 2) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          readOnly={!!icdCode}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            icdCode && 'border-emerald-400 bg-emerald-50/30 pr-24',
            !icdCode && query && 'pr-3',
            className
          )}
        />
        {icdCode && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            {icdCode}
          </span>
        )}
        {icdCode && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && !icdCode && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-slate-200 bg-white shadow-lg"
        >
          {results.map((result, idx) => (
            <li
              key={result.code}
              role="option"
              aria-selected={idx === highlightIndex}
              onMouseDown={(e) => {
                e.preventDefault()
                selectResult(result)
              }}
              onMouseEnter={() => setHighlightIndex(idx)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 cursor-pointer text-sm',
                idx === highlightIndex ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-600 shrink-0">
                {result.code}
              </span>
              <span className="truncate">{result.name}</span>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim().length >= 2 && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg px-3 py-2 text-sm text-slate-500">
          No ICD-11 codes found. Try a different search term.
        </div>
      )}
    </div>
  )
}
