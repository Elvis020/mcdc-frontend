'use client'

import { useRef, useState, useEffect } from 'react'
import { CertificateLayout } from './certificate-layout'
import { CertificateDisplayData } from './types'

// 210mm at 96 dpi
const CERT_WIDTH_PX = 794

interface CertificateScalerProps {
  data: CertificateDisplayData
}

/**
 * Wraps CertificateLayout and scales it to fit the container width on small screens.
 * On desktop (container ≥ CERT_WIDTH_PX) the certificate renders at 1:1.
 * On mobile the entire form shrinks proportionally — no horizontal scroll.
 *
 * Uses ResizeObserver on the outer container to compute scale in real time,
 * and adjusts the wrapper height to match the scaled certificate height so
 * there is no collapsed or empty space below.
 */
export function CertificateScaler({ data }: CertificateScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const certRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [certHeight, setCertHeight] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const cert = certRef.current
    if (!container || !cert) return

    const update = () => {
      const containerWidth = container.getBoundingClientRect().width
      const newScale = Math.min(1, containerWidth / CERT_WIDTH_PX)
      setScale(newScale)
      // Measure the certificate's natural height each time it may have changed
      setCertHeight(cert.getBoundingClientRect().height / (newScale || 1))
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  return (
    // Outer container fills available width; its height tracks the scaled cert
    <div
      ref={containerRef}
      style={{
        height: certHeight != null ? certHeight * scale : undefined,
        // Clip so nothing bleeds outside when scale < 1
        overflow: 'hidden',
      }}
    >
      <div
        ref={certRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: CERT_WIDTH_PX,
        }}
      >
        <CertificateLayout data={data} />
      </div>
    </div>
  )
}
