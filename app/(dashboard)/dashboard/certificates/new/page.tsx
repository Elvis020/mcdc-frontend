import { CertificateForm } from '@/components/forms/certificate-form'

export default function NewCertificatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Death Certificate</h1>
        <p className="text-muted-foreground mt-2">
          Complete all sections to create a medical cause of death certificate
        </p>
      </div>

      <CertificateForm />
    </div>
  )
}
