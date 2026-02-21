import { CertificateDisplayData, formatCertDate } from '../types'
import { YesNoUnknown } from '../primitives/form-checkbox'

export function OtherMedicalSection({ data }: { data: CertificateDisplayData }) {
  return (
    <div className="border-b border-gray-400">
      {/* Frame B header */}
      <div className="px-2 py-0.5 bg-gray-100 border-b border-gray-400">
        <span className="text-[9px] font-bold uppercase tracking-wider">
          Frame B: Other Medical Data
        </span>
      </div>

      {/* Surgery */}
      <div className="px-2 py-1.5 border-b border-gray-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px]">Was surgery performed within the last 4 weeks?</span>
          <YesNoUnknown value={data.surgery_within_4_weeks} />
        </div>
        {data.surgery_within_4_weeks === 'yes' && (
          <div className="mt-1.5 grid grid-cols-2 gap-2 pl-2 border-l-2 border-gray-300">
            <div>
              <span className="text-[8px] text-gray-500">Date of surgery: </span>
              <span className="text-[10px]">{formatCertDate(data.surgery_date)}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500">Reason (disease or condition): </span>
              <span className="text-[10px]">{data.surgery_reason ?? ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Autopsy requested */}
      <div className="px-2 py-1.5 border-b border-gray-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px]">Was an autopsy requested?</span>
          <YesNoUnknown value={data.autopsy_requested} />
        </div>
      </div>

      {/* Autopsy findings used */}
      <div className="px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px]">Were the findings used in the certification?</span>
          <YesNoUnknown value={data.autopsy_findings_used} />
        </div>
      </div>
    </div>
  )
}
