import Image from 'next/image'
import { CertificateDisplayData, formatCertDate } from './types'
import { AdminDataSection } from './sections/admin-data-section'
import { CauseOfDeathSection } from './sections/cause-of-death-section'
import { OtherMedicalSection } from './sections/other-medical-section'
import { MannerLocationSection } from './sections/manner-location-section'
import { FetalInfantSection } from './sections/fetal-infant-section'
import { IssuerSection } from './sections/issuer-section'

interface CertificateLayoutProps {
  data: CertificateDisplayData
}

/**
 * Purely presentational certificate layout that mirrors the physical Ghana MoH
 * Medical Cause of Death Certificate (Medical Form L Section 30).
 *
 * Works in both server components (view page) and client components (step-8 wizard).
 */
export function CertificateLayout({ data }: CertificateLayoutProps) {
  return (
    <div className="w-[210mm] bg-white shadow-lg font-serif text-[11px] border border-gray-400 print:shadow-none print:border-0">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-3 py-2 border-b border-gray-400">
          <div className="flex items-center gap-3">
            <Image
              src="/MoH.png"
              alt="Ghana Ministry of Health coat of arms"
              width={48}
              height={48}
              className="object-contain"
            />
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-gray-700">
                Ministry of Health
              </p>
              <p className="text-[13px] font-bold uppercase tracking-wide">
                Medical Cause of Death Certificate
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[8px] text-gray-500 uppercase tracking-wide">Serial No.</p>
            <p className="text-[11px] font-bold font-mono tracking-widest">
              {data.serial_number ?? '____________'}
            </p>
          </div>
        </div>

        {/* ── Opening attestation line ───────────────────────────────────────── */}
        <div className="px-3 py-1.5 border-b border-gray-400 text-[10px] leading-relaxed">
          <span>I hereby certify that I have medically attended </span>
          <span className="font-semibold border-b border-gray-700 inline-block min-w-[160px] px-0.5">
            {data.deceased_full_name ?? ''}
          </span>
          <span> that I last saw on </span>
          <span className="font-medium border-b border-gray-700 inline-block min-w-[80px] px-0.5">
            {formatCertDate(data.date_of_death)}
          </span>
          <span className="text-[9px] text-gray-400"> (DD/MM/YY)</span>
        </div>

        {/* ── Sections ──────────────────────────────────────────────────────── */}
        <AdminDataSection data={data} />
        <CauseOfDeathSection data={data} />
        <OtherMedicalSection data={data} />
        <MannerLocationSection data={data} />
        <FetalInfantSection data={data} />
        <IssuerSection data={data} />

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-400 px-3 py-1 flex flex-wrap justify-between items-center bg-gray-50">
          <span className="text-[8px] text-gray-600">
            Form to be captured in DHIMS2 within 5 days of issuing.
          </span>
          <span className="text-[9px] font-bold text-gray-700 tracking-wide">
            MEDICAL FORM L SECTION 30
          </span>
        </div>
    </div>
  )
}
