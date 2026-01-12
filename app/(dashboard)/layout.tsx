import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, LayoutDashboard, Settings, LogOut, User, ShieldCheck } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user details
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Professional header with green accent */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title */}
            <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-sm">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">MCDC System</h1>
                <p className="text-xs text-muted-foreground leading-none">
                  Medical Cause of Death Certificate
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/certificates"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Certificates</span>
              </Link>
            </nav>

            {/* User profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {userData?.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    {userData?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Status bar with verification badge */}
      {userData?.role === 'medical_practitioner' && (
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 lg:px-6 py-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">Verified Medical Practitioner</span>
              {userData?.status === 'active' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 lg:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-auto">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              2026 Medical Cause of Death Certificate System. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Secure government portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
