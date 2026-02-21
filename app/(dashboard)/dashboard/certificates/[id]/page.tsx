import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CertificateLayout } from '@/components/certificate-layout/certificate-layout'

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

  // Fetch user data to check role and permissions
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Death Certificate</h1>
            <Badge variant={certificate.status === 'draft' ? 'secondary' : 'default'}>
              {certificate.status}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 truncate">
            Serial Number: {certificate.serial_number}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0">
          <Button variant="outline" asChild className="flex-1 sm:flex-none">
            <Link href="/dashboard/certificates">
              <span className="sm:hidden">← Back</span>
              <span className="hidden sm:inline">← Back to List</span>
            </Link>
          </Button>

          {canEdit && (
            <Button asChild className="flex-1 sm:flex-none">
              <Link href={`/dashboard/certificates/${certificate.id}/edit`}>
                <span className="sm:hidden">Edit</span>
                <span className="hidden sm:inline">Edit Certificate</span>
              </Link>
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

      {/* Certificate — physical form layout */}
      <CertificateLayout data={certificate} />
    </div>
  )
}
