import { CertificateDisplayData, formatCertDate } from '../types'

export function IssuerSection({ data }: { data: CertificateDisplayData }) {
  return (
    <div>
      <div className="px-3 py-2 space-y-2.5">
        {/* Issued to + Mobile */}
        <div className="grid grid-cols-[1fr_auto] gap-6 border-b border-gray-300 pb-1.5">
          <div>
            <span className="text-[9px] text-gray-500">Issued to (Full Name): </span>
            <span className="text-[10px] border-b border-gray-700 inline-block min-w-[160px]">
              {data.issued_to_full_name ?? ''}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500">Mobile: </span>
            <span className="text-[10px] border-b border-gray-700 inline-block min-w-[90px]">
              {data.issued_to_mobile ?? ''}
            </span>
          </div>
        </div>

        {/* Relation to deceased */}
        <div className="border-b border-gray-300 pb-1.5">
          <span className="text-[9px] text-gray-500">Relation to deceased: </span>
          <span className="text-[10px] border-b border-gray-700 inline-block min-w-[200px]">
            {data.relation_to_deceased ?? ''}
          </span>
        </div>

        {/* Contact details */}
        <div className="border-b border-gray-300 pb-1.5">
          <span className="text-[9px] text-gray-500">Contact Details: </span>
          <span className="text-[10px] border-b border-gray-700 inline-block min-w-[220px]">
            {data.issued_to_contact_details ?? ''}
          </span>
        </div>

        {/* Witness + date */}
        <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-1.5">
          <div>
            <span className="text-[9px] text-gray-500">Witness to deceased: </span>
            <span className="text-[10px] border-b border-gray-700 inline-block min-w-[110px]">
              {data.witness_to_deceased ?? ''}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500">Witness by my hand this day: </span>
            <span className="text-[10px] border-b border-gray-700 inline-block min-w-[80px]">
              {formatCertDate(data.witness_date)}
            </span>
          </div>
        </div>

        {/* Medical Officer fields (not in data — signature lines) */}
        <div className="border-b border-gray-300 pb-1.5">
          <span className="text-[9px] text-gray-500">Name of Medical Officer: </span>
          <span className="text-[10px] border-b border-gray-700 inline-block min-w-[200px]" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-1.5">
          <div>
            <span className="text-[9px] text-gray-500">Signature: </span>
            <span className="text-[10px] border-b border-gray-700 inline-block min-w-[130px]" />
          </div>
          <div className="text-right text-[8px] text-gray-400 italic">
            To be stamped by Registrar in Charge
          </div>
        </div>

        <div>
          <span className="text-[9px] text-gray-500">Medical Qualification: </span>
          <span className="text-[10px] border-b border-gray-700 inline-block min-w-[180px]" />
        </div>

        <div>
          <span className="text-[9px] text-gray-500">Address: </span>
          <span className="text-[10px] border-b border-gray-700 inline-block min-w-[220px]" />
        </div>
      </div>
    </div>
  )
}
