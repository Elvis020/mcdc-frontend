import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

interface CertificateViewPageProps {
  params: Promise<{ id: string }>
}

export default async function CertificateViewPage({ params }: CertificateViewPageProps) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Death Certificate</h1>
            <Badge variant={certificate.status === 'draft' ? 'secondary' : 'default'}>
              {certificate.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Serial Number: {certificate.serial_number}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/certificates">← Back to List</Link>
          </Button>
          <PDFDownloadButton certificate={certificate} />
          {canEdit && (
            <Button asChild>
              <Link href={`/dashboard/certificates/${certificate.id}/edit`}>Edit Certificate</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Edit Window Alert */}
      {certificate.status === 'submitted' && daysRemaining !== null && (
        <Alert variant={daysRemaining > 0 ? 'default' : 'destructive'}>
          <AlertDescription>
            {daysRemaining > 0 ? (
              <>
                Edit window expires in <strong>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</strong>.
                After that, this certificate will be locked.
              </>
            ) : (
              'Edit window has expired. This certificate is now locked.'
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Administrative Data */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Data</CardTitle>
          <CardDescription>Certificate and deceased information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Folder Number</p>
              <p className="font-medium">{certificate.folder_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">COD Certificate Number</p>
              <p className="font-medium">{certificate.cod_certificate_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Facility Code</p>
              <p className="font-medium">{certificate.facility_code || 'N/A'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">Deceased Full Name</p>
            <p className="text-lg font-semibold">{certificate.deceased_full_name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {certificate.date_of_birth ? new Date(certificate.date_of_birth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Death</p>
              <p className="font-medium">
                {certificate.date_of_death ? new Date(certificate.date_of_death).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{certificate.gender}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">National ID</p>
              <p className="font-medium">{certificate.national_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">National Register Number</p>
              <p className="font-medium">{certificate.national_register_number || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Data - Cause of Death Chain */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Cause of Death (ICD Chain)</CardTitle>
          <CardDescription>Direct sequence of events leading to death</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((level) => {
              const description = certificate[`cause_${level}_description` as keyof typeof certificate]
              const interval = certificate[`cause_${level}_interval` as keyof typeof certificate]

              if (!description) return null

              return (
                <div key={level} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase">
                        Cause {level.toUpperCase()}
                        {level === 'a' && ' (Direct/Immediate Cause)'}
                      </p>
                      <p className="font-medium mt-1">{description}</p>
                    </div>
                    {interval && (
                      <div className="text-right ml-4">
                        <p className="text-sm text-muted-foreground">Time Interval</p>
                        <p className="font-medium">{interval}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {certificate.contributing_conditions && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Contributing Conditions (not part of direct chain)
              </p>
              <p className="whitespace-pre-wrap">{certificate.contributing_conditions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Medical Data */}
      <Card>
        <CardHeader>
          <CardTitle>Other Medical Information</CardTitle>
          <CardDescription>Surgery and autopsy details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Surgery within 4 weeks before death?</p>
            <p className="font-medium capitalize">{certificate.surgery_within_4_weeks || 'Not specified'}</p>
          </div>

          {certificate.surgery_within_4_weeks === 'yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4">
              <div>
                <p className="text-sm text-muted-foreground">Surgery Date</p>
                <p className="font-medium">
                  {certificate.surgery_date ? new Date(certificate.surgery_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason for Surgery</p>
                <p className="font-medium">{certificate.surgery_reason || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Autopsy requested?</p>
            <p className="font-medium capitalize">{certificate.autopsy_requested || 'Not specified'}</p>
          </div>

          {certificate.autopsy_requested === 'yes' && (
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-muted-foreground">Were autopsy findings used in certification?</p>
              <p className="font-medium capitalize">{certificate.autopsy_findings_used || 'Not specified'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manner and Location of Death */}
      <Card>
        <CardHeader>
          <CardTitle>Manner and Location of Death</CardTitle>
          <CardDescription>Circumstances and place of death</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Manner of Death</p>
              <p className="font-medium capitalize">{certificate.manner_of_death?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location of Death</p>
              <p className="font-medium capitalize">{certificate.death_location?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>
          </div>

          {certificate.manner_of_death === 'external_cause_or_poisonous' && (
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-semibold">External Cause Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Injury/Exposure</p>
                  <p className="font-medium">
                    {certificate.external_cause_date ? new Date(certificate.external_cause_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Poisoning Agent</p>
                  <p className="font-medium">{certificate.poisoning_agent || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description of External Cause</p>
                <p className="font-medium whitespace-pre-wrap">{certificate.external_cause_description || 'N/A'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fetal/Infant Death Section */}
      {certificate.is_fetal_infant_death && (
        <Card>
          <CardHeader>
            <CardTitle>Fetal/Infant Death Information</CardTitle>
            <CardDescription>Additional details for fetal or infant deaths</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stillbirth?</p>
                <p className="font-medium capitalize">{certificate.stillbirth || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Multiple Pregnancy?</p>
                <p className="font-medium capitalize">{certificate.multiple_pregnancy || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Birth Weight (grams)</p>
                <p className="font-medium">{certificate.birth_weight_grams || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weeks of Pregnancy</p>
                <p className="font-medium">{certificate.completed_weeks_pregnancy || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mother's Age</p>
                <p className="font-medium">{certificate.mother_age || 'N/A'}</p>
              </div>
            </div>

            {certificate.maternal_conditions && (
              <div>
                <p className="text-sm text-muted-foreground">Maternal Conditions</p>
                <p className="font-medium whitespace-pre-wrap">{certificate.maternal_conditions}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Death during pregnancy?</p>
                <p className="font-medium capitalize">{certificate.pregnancy_timing || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Did pregnancy contribute to death?</p>
                <p className="font-medium capitalize">{certificate.pregnancy_contributed || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issuer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Issuer Details</CardTitle>
          <CardDescription>Certificate recipient and witness information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Issued To</p>
            <p className="font-medium text-lg">{certificate.issued_to_full_name || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="font-medium">{certificate.issued_to_mobile || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relation to Deceased</p>
              <p className="font-medium">{certificate.relation_to_deceased || 'N/A'}</p>
            </div>
          </div>

          {certificate.issued_to_contact_details && (
            <div>
              <p className="text-sm text-muted-foreground">Other Contact Details</p>
              <p className="font-medium">{certificate.issued_to_contact_details}</p>
            </div>
          )}

          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Witness Name</p>
              <p className="font-medium">{certificate.witness_to_deceased || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Witness Date</p>
              <p className="font-medium">
                {certificate.witness_date ? new Date(certificate.witness_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{new Date(certificate.created_at).toLocaleString()}</p>
            </div>
            {certificate.submitted_at && (
              <div>
                <p className="text-sm text-muted-foreground">Submitted At</p>
                <p className="font-medium">{new Date(certificate.submitted_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
