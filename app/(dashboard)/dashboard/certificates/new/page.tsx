import { CertificateForm } from '@/components/forms/certificate-form'
import { NavLink } from '@/components/nav-link'

export default function NewCertificatePage() {
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
        <NavLink
          href="/dashboard/certificates"
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          Certificates
        </NavLink>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">New Certificate</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">New Death Certificate</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete all sections to create a medical cause of death certificate
        </p>
      </div>

      {/* Form */}
      <CertificateForm />
    </div>
  )
}
