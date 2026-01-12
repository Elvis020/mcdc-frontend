import { createClient } from '@/lib/supabase/server'
import { CertificateForm } from '@/components/forms/certificate-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import type { Database } from '@/types/database'

interface CertificateEditPageProps {
  params: Promise<{ id: string }>
}

type DeathCertificate = Database['public']['Tables']['death_certificates']['Row']

export default async function CertificateEditPage({ params }: CertificateEditPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch certificate
  const { data: certificate, error } = await supabase
    .from('death_certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !certificate) {
    notFound()
  }

  // Check if certificate is editable
  const isEditable = () => {
    if (certificate.status === 'draft') return true
    if (certificate.status === 'submitted' && certificate.edit_window_expires_at) {
      const expiryDate = new Date(certificate.edit_window_expires_at)
      return new Date() < expiryDate
    }
    return false
  }

  const canEdit = isEditable()

  // Calculate days remaining for edit
  const getDaysRemaining = () => {
    if (certificate.status !== 'submitted' || !certificate.edit_window_expires_at) return null
    const now = new Date()
    const expiry = new Date(certificate.edit_window_expires_at)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = getDaysRemaining()

  // If not editable, show error message
  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Certificate</h1>
          <p className="text-muted-foreground mt-2">
            Serial Number: {certificate.serial_number}
          </p>
        </div>

        <Alert variant="destructive">
          <AlertDescription className="space-y-2">
            <p className="font-semibold">This certificate cannot be edited.</p>
            <p>
              The 5-day edit window has expired. Submitted certificates can only be edited within 5 days of submission.
            </p>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/certificates">← Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/certificates/${certificate.id}`}>View Certificate</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Convert database row to form data format
  const initialData = {
    folder_number: certificate.folder_number,
    cod_certificate_number: certificate.cod_certificate_number,
    facility_code: certificate.facility_code,
    deceased_full_name: certificate.deceased_full_name,
    date_of_birth: certificate.date_of_birth,
    gender: certificate.gender,
    date_of_death: certificate.date_of_death,
    national_id: certificate.national_id,
    national_register_number: certificate.national_register_number,
    cause_a_description: certificate.cause_a_description,
    cause_a_interval: certificate.cause_a_interval,
    cause_b_description: certificate.cause_b_description,
    cause_b_interval: certificate.cause_b_interval,
    cause_c_description: certificate.cause_c_description,
    cause_c_interval: certificate.cause_c_interval,
    cause_d_description: certificate.cause_d_description,
    cause_d_interval: certificate.cause_d_interval,
    contributing_conditions: certificate.contributing_conditions,
    surgery_within_4_weeks: certificate.surgery_within_4_weeks,
    surgery_date: certificate.surgery_date,
    surgery_reason: certificate.surgery_reason,
    autopsy_requested: certificate.autopsy_requested,
    autopsy_findings_used: certificate.autopsy_findings_used,
    manner_of_death: certificate.manner_of_death,
    death_location: certificate.death_location,
    external_cause_date: certificate.external_cause_date,
    external_cause_description: certificate.external_cause_description,
    poisoning_agent: certificate.poisoning_agent,
    is_fetal_infant_death: certificate.is_fetal_infant_death,
    stillbirth: certificate.stillbirth,
    multiple_pregnancy: certificate.multiple_pregnancy,
    birth_weight_grams: certificate.birth_weight_grams,
    completed_weeks_pregnancy: certificate.completed_weeks_pregnancy,
    mother_age: certificate.mother_age,
    maternal_conditions: certificate.maternal_conditions,
    pregnancy_timing: certificate.pregnancy_timing,
    pregnancy_contributed: certificate.pregnancy_contributed,
    issued_to_full_name: certificate.issued_to_full_name,
    issued_to_mobile: certificate.issued_to_mobile,
    issued_to_contact_details: certificate.issued_to_contact_details,
    relation_to_deceased: certificate.relation_to_deceased,
    witness_to_deceased: certificate.witness_to_deceased,
    witness_date: certificate.witness_date,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Death Certificate</h1>
        <p className="text-muted-foreground mt-2">
          Serial Number: {certificate.serial_number} • Status: {certificate.status}
        </p>
      </div>

      {/* Edit Window Warning */}
      {certificate.status === 'submitted' && daysRemaining !== null && daysRemaining > 0 && (
        <Alert>
          <AlertDescription>
            <strong>Edit window expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.</strong>
            {' '}After that, this certificate will be permanently locked.
          </AlertDescription>
        </Alert>
      )}

      <CertificateForm initialData={initialData} certificateId={certificate.id} />
    </div>
  )
}
