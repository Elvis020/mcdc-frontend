'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Logout error:', error)
        throw error
      }

      // Redirect to login page
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Failed to logout:', error)
      // Still redirect even if there's an error
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">{loading ? 'Logging out...' : 'Logout'}</span>
    </button>
  )
}
