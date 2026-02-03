'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { DeathCertificatePDF } from './death-certificate-pdf'
import type { Database } from '@/types/database'

type DeathCertificate = Database['public']['Tables']['death_certificates']['Row']

interface PDFDownloadButtonProps {
  certificate: DeathCertificate
}

export function PDFDownloadButton({ certificate }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)

  // PDFDownloadLink only works on client side
  // We need to wait for hydration to complete
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button variant="outline" disabled>
        Preparing PDF...
      </Button>
    )
  }

  const fileName = `death-certificate-${certificate.serial_number}.pdf`

  return (
    <PDFDownloadLink
      document={<DeathCertificatePDF certificate={certificate} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
