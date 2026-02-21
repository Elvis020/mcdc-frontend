/**
 * Supabase Client for Client-Side Usage
 * Use this in Client Components
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

interface CreateClientOptions {
  /** When false, the session is stored in sessionStorage and lost on tab close.
   *  Defaults to true (persistent cookie-based session). */
  persistSession?: boolean
}

export function createClient({ persistSession = true }: CreateClientOptions = {}) {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession } }
  )
}
