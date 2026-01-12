import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function CertificatesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get certificates for current user
  const { data: certificates } = await supabase
    .from('death_certificates')
    .select('*')
    .eq('created_by_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Death Certificates</h1>
          <p className="text-muted-foreground mt-2">
            Manage your medical cause of death certificates
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/certificates/new">+ New Certificate</Link>
        </Button>
      </div>

      {/* Certificates List */}
      {certificates && certificates.length > 0 ? (
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{cert.deceased_full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Serial: {cert.serial_number}
                    </p>
                  </div>
                  <Badge variant={cert.status === 'draft' ? 'secondary' : 'default'}>
                    {cert.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Death</p>
                    <p className="font-medium">
                      {cert.date_of_death ? new Date(cert.date_of_death).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{cert.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(cert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/certificates/${cert.id}`}>View</Link>
                    </Button>
                    {cert.status === 'draft' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/certificates/${cert.id}/edit`}>Edit</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't created any certificates yet
            </p>
            <Button asChild>
              <Link href="/dashboard/certificates/new">Create Your First Certificate</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
