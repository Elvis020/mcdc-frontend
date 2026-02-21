import { createClient } from '@/lib/supabase/server'
import { NavLink } from '@/components/nav-link'
import { Search, CheckCircle2, Edit3, ChevronRight, FilePlus, ArrowLeft } from 'lucide-react'

export default async function CertificatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get certificates for current user - only select needed fields
  const { data: certificates } = await supabase
    .from('death_certificates')
    .select('id, deceased_full_name, serial_number, status, date_of_death, created_at, updated_at')
    .eq('created_by_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate days since last edit for drafts
  const getCertificateStatus = (cert: any) => {
    const daysSinceEdit = Math.floor((Date.now() - new Date(cert.updated_at).getTime()) / (1000 * 60 * 60 * 24))

    if (cert.status === 'submitted') {
      // Check if within editable window (assuming 5 days)
      if (daysSinceEdit < 5) {
        return `Editable for ${5 - daysSinceEdit} more days`
      }
      return 'Edit window closed'
    }

    if (cert.status === 'draft') {
      if (daysSinceEdit === 0) return 'Last edited today'
      if (daysSinceEdit === 1) return 'Last edited yesterday'
      return `Last edited ${daysSinceEdit} days ago`
    }

    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm">
        <NavLink
          href="/dashboard"
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          Dashboard
        </NavLink>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">Certificates</span>
      </nav>

      {/* Header with New Certificate Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 truncate">Death Certificates</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your medical cause of death certificates
          </p>
        </div>
        <NavLink
          href="/dashboard/certificates/new"
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex-shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span className="hidden sm:inline">New Certificate</span>
          <span className="sm:hidden">New</span>
        </NavLink>
      </div>

      {/* Search and Filters Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border-none bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="overflow-x-auto scrollbar-hide border-b border-slate-200">
          <div className="flex items-center gap-2 px-4 py-3 min-w-max">
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg whitespace-nowrap">
              All
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
              Submitted
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
              Drafts
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
              Editable
            </button>
          </div>
        </div>

        {/* Certificates List */}
        {certificates && certificates.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {certificates.map((cert) => {
              // Compute once — getCertificateStatus does Date math and was
              // previously called 3-4 times per row in the JSX below.
              const statusText = getCertificateStatus(cert)
              return (
              <NavLink
                key={cert.id}
                href={`/dashboard/certificates/${cert.id}`}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Status Icon */}
                <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 ${
                  cert.status === 'draft'
                    ? 'bg-amber-50'
                    : 'bg-emerald-50'
                }`}>
                  {cert.status === 'draft' ? (
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  )}
                </div>

                {/* Certificate Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-900 truncate min-w-0">
                      {cert.deceased_full_name || 'Unnamed Certificate'}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                      cert.status === 'draft'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {cert.status === 'draft' ? 'Draft' : 'Submitted'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 truncate">
                    {cert.serial_number || 'No serial number'} • {new Date(cert.date_of_death || cert.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>

                  {statusText && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {cert.status === 'submitted' && statusText.includes('Editable') && (
                        <span className="text-amber-600">⏰</span>
                      )}
                      {cert.status === 'submitted' && statusText.includes('closed') && (
                        <span className="text-slate-400">🔒</span>
                      )}
                      {statusText}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
              </NavLink>
            )
            })}
          </div>
        ) : (
          // Empty State
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl">
                <FilePlus className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No certificates yet
            </h3>
            <p className="text-sm text-slate-500">
              You haven't created any death certificates yet. Get started by creating your first one.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
