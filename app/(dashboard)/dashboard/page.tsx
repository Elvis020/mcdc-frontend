import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, FilePlus, CheckCircle2, Clock, TrendingUp, AlertCircle, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user details
  const { data: userData } = await supabase
    .from('users')
    .select('*, mdc_registry(*)')
    .eq('id', user!.id)
    .single()

  // Get certificate counts
  const { count: draftCount } = await supabase
    .from('death_certificates')
    .select('*', { count: 'exact', head: true })
    .eq('created_by_id', user!.id)
    .eq('status', 'draft')

  const { count: submittedCount } = await supabase
    .from('death_certificates')
    .select('*', { count: 'exact', head: true })
    .eq('created_by_id', user!.id)
    .eq('status', 'submitted')

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back, Dr. {userData?.mdc_registry?.full_name?.split(' ')[0]}
              </h2>
            </div>
          </div>
          <div className="flex flex-col space-y-1 mt-4">
            <p className="text-sm font-medium text-foreground/80">
              Medical & Dental Council PIN: <span className="font-mono text-primary font-semibold">{userData?.mdc_registry?.mdc_pin}</span>
            </p>
            {userData?.last_sign_in_at && (
              <p className="text-sm text-muted-foreground">
                Last sign-in: {new Date(userData.last_sign_in_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid with enhanced styling */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Draft Certificates */}
        <Card className="relative overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Draft Certificates</CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <CardDescription className="text-xs">Incomplete certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground mb-1">{draftCount || 0}</p>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        {/* Submitted Certificates */}
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <CardDescription className="text-xs">Completed certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary mb-1">{submittedCount || 0}</p>
            <p className="text-xs text-primary/70 font-medium">Successfully filed</p>
          </CardContent>
        </Card>

        {/* Total Certificates */}
        <Card className="relative overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Certificates</CardTitle>
              <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <CardDescription className="text-xs">All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground mb-1">{(draftCount || 0) + (submittedCount || 0)}</p>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FilePlus className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start h-auto py-4 shadow-sm hover:shadow-md transition-shadow">
              <Link href="/dashboard/certificates/new" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-foreground/20 rounded-lg">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Create New Certificate</p>
                  <p className="text-xs opacity-90">Start a new death certificate</p>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-auto py-4 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-colors">
              <Link href="/dashboard/certificates" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">View All Certificates</p>
                  <p className="text-xs text-muted-foreground">Browse and manage certificates</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-border shadow-sm bg-gradient-to-br from-muted/30 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>Platform information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mt-0.5">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Development Phase</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Certificate creation and management features are currently under development.
                  The authentication system and database are fully operational.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
