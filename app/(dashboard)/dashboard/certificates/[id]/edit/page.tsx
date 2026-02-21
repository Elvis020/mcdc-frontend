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
  // null values from the DB must be converted to undefined so they don't
  // conflict with Zod schema types (which use T | undefined, not T | null).
  const n = <T,>(v: T | null): T | undefined => v ?? undefined

  const initialData = {
    folder_number: n(certificate.folder_number),
    cod_certificate_number: n(certificate.cod_certificate_number),
    facility_code: n(certificate.facility_code),
    deceased_full_name: certificate.deceased_full_name,
    date_of_birth: certificate.date_of_birth,
    gender: certificate.gender,
    date_of_death: certificate.date_of_death,
    national_id_number: n(certificate.national_id_number),
    national_register_number: n(certificate.national_register_number),
    cause_a_description: certificate.cause_a_description,
    cause_a_icd_code: n(certificate.cause_a_icd_code),
    cause_a_interval: n(certificate.cause_a_interval),
    cause_a_comment: n(certificate.cause_a_comment),
    cause_b_description: n(certificate.cause_b_description),
    cause_b_icd_code: n(certificate.cause_b_icd_code),
    cause_b_interval: n(certificate.cause_b_interval),
    cause_b_comment: n(certificate.cause_b_comment),
    cause_c_description: n(certificate.cause_c_description),
    cause_c_icd_code: n(certificate.cause_c_icd_code),
    cause_c_interval: n(certificate.cause_c_interval),
    cause_c_comment: n(certificate.cause_c_comment),
    cause_d_description: n(certificate.cause_d_description),
    cause_d_icd_code: n(certificate.cause_d_icd_code),
    cause_d_interval: n(certificate.cause_d_interval),
    cause_d_comment: n(certificate.cause_d_comment),
    contributing_conditions: n(certificate.contributing_conditions),
    contributing_conditions_icd_code: n(certificate.contributing_conditions_icd_code),
    contributing_conditions_comment: n(certificate.contributing_conditions_comment),
    contributing_conditions_2: n(certificate.contributing_conditions_2),
    contributing_conditions_2_icd_code: n(certificate.contributing_conditions_2_icd_code),
    contributing_conditions_2_comment: n(certificate.contributing_conditions_2_comment),
    contributing_conditions_3: n(certificate.contributing_conditions_3),
    contributing_conditions_3_icd_code: n(certificate.contributing_conditions_3_icd_code),
    contributing_conditions_3_comment: n(certificate.contributing_conditions_3_comment),
    contributing_conditions_4: n(certificate.contributing_conditions_4),
    contributing_conditions_4_icd_code: n(certificate.contributing_conditions_4_icd_code),
    contributing_conditions_4_comment: n(certificate.contributing_conditions_4_comment),
    surgery_within_4_weeks: n(certificate.surgery_within_4_weeks),
    surgery_date: n(certificate.surgery_date),
    surgery_reason: n(certificate.surgery_reason),
    autopsy_requested: n(certificate.autopsy_requested),
    autopsy_findings_used: n(certificate.autopsy_findings_used),
    manner_of_death: certificate.manner_of_death,
    death_location: n(certificate.death_location),
    death_location_other: n(certificate.death_location_other),
    external_cause_date: n(certificate.external_cause_date),
    external_cause_description: n(certificate.external_cause_description),
    poisoning_agent: n(certificate.poisoning_agent),
    is_fetal_infant_death: certificate.is_fetal_infant_death,
    stillbirth: n(certificate.stillbirth),
    multiple_pregnancy: n(certificate.multiple_pregnancy),
    birth_weight_grams: n(certificate.birth_weight_grams),
    completed_weeks_pregnancy: n(certificate.completed_weeks_pregnancy),
    mother_age_years: n(certificate.mother_age_years),
    maternal_conditions: n(certificate.maternal_conditions),
    pregnancy_timing: n(certificate.pregnancy_timing),
    pregnancy_contributed_to_death: n(certificate.pregnancy_contributed_to_death),
    issued_to_full_name: n(certificate.issued_to_full_name),
    issued_to_mobile: n(certificate.issued_to_mobile),
    issued_to_contact_details: n(certificate.issued_to_contact_details),
    relation_to_deceased: n(certificate.relation_to_deceased),
    witness_to_deceased: n(certificate.witness_to_deceased),
    witness_date: n(certificate.witness_date),
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
