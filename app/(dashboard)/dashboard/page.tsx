import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { NavLink } from '@/components/nav-link'
import { FileText, FilePlus, CheckCircle2, Clock, FileCheck, ChevronRight, Edit3 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user data and counts in parallel for better performance
  const [userData, draftCountResult, submittedCountResult] = await Promise.all([
    supabase
      .from('users')
      .select('full_name, last_sign_in_at')
      .eq('id', user!.id)
      .single(),
    supabase
      .from('death_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('created_by_id', user!.id)
      .eq('status', 'draft'),
    supabase
      .from('death_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('created_by_id', user!.id)
      .eq('status', 'submitted')
  ])

  const draftCount = draftCountResult.count
  const submittedCount = submittedCountResult.count

  const totalCount = (draftCount || 0) + (submittedCount || 0)

  // Format last sign-in
  const lastSignIn = userData?.data?.last_sign_in_at
    ? new Date(userData.data.last_sign_in_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          Welcome back, Dr.
        </h1>
        {lastSignIn && (
          <p className="text-sm text-slate-500">
            Last sign-in: {lastSignIn}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drafts */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Drafts</h3>
              <div className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded-full">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-2">
              {draftCount || 0}
            </p>
            <p className="text-sm text-slate-500">Awaiting completion</p>
          </div>
        </div>

        {/* Submitted */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Submitted</h3>
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-2">
              {submittedCount || 0}
            </p>
            <p className="text-sm text-slate-500">Successfully filed</p>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Total</h3>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-2">
              {totalCount}
            </p>
            <p className="text-sm text-slate-500">All time</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          QUICK ACTIONS
        </h2>
        <div className="space-y-3">
          {/* Create New Certificate */}
          <NavLink
            href="/dashboard/certificates/new"
            className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl">
                <FilePlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Create New Certificate</h3>
                <p className="text-xs text-slate-500">Start a new death certificate</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </NavLink>

          {/* Continue Draft */}
          <NavLink
            href="/dashboard/certificates?status=draft"
            className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl">
                <Edit3 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Continue Draft</h3>
                <p className="text-xs text-slate-500">Resume an incomplete certificate</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </NavLink>

          {/* View All Certificates */}
          <NavLink
            href="/dashboard/certificates"
            className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">View All Certificates</h3>
                <p className="text-xs text-slate-slice">Browse and search your history</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </NavLink>
        </div>
      </div>
    </div>
  )
}
