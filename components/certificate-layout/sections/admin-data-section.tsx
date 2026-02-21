import { CertificateDisplayData, formatCertDate } from '../types'
import { FormField } from '../primitives/form-field'
import { FormCheckbox } from '../primitives/form-checkbox'

export function AdminDataSection({ data }: { data: CertificateDisplayData }) {
  return (
    <div className="border-b border-gray-400">
      {/* Section header */}
      <div className="px-2 py-0.5 bg-gray-100 border-b border-gray-400">
        <span className="text-[9px] font-bold uppercase tracking-wider">Administrative Data</span>
      </div>

      {/* Row 1: Folder No | COD Cert No | Facility Code + sub-fields */}
      <div className="grid grid-cols-[1fr_1fr_1.5fr] border-b border-gray-400 divide-x divide-gray-400">
        <FormField label="Folder No." value={data.folder_number} />
        <FormField label="COD Certificate No." value={data.cod_certificate_number} />
        <div>
          <FormField label="Facility Code" value={data.facility_code} />
          <div className="grid grid-cols-2 divide-x divide-gray-400 border-t border-gray-400">
            <FormField label="SN" value={data.facility_sn} />
            <FormField label="D" value={data.facility_d} />
          </div>
        </div>
      </div>

      {/* Row 2: Sex checkboxes | Date of birth */}
      <div className="grid grid-cols-2 border-b border-gray-400 divide-x divide-gray-400">
        <div className="px-2 py-1">
          <p className="text-[8px] text-gray-500 uppercase tracking-wide leading-tight mb-0.5">Sex</p>
          <div className="flex gap-3">
            <FormCheckbox checked={data.gender === 'female'} label="Female" />
            <FormCheckbox checked={data.gender === 'male'} label="Male" />
            <FormCheckbox checked={!data.gender} label="Unknown" />
          </div>
        </div>
        <FormField
          label="Date of Birth (DD/MM/YY)"
          value={formatCertDate(data.date_of_birth)}
        />
      </div>

      {/* Row 3: National Register Number | National ID */}
      <div className="grid grid-cols-2 divide-x divide-gray-400">
        <FormField label="National Register Number" value={data.national_register_number} />
        <FormField label="National ID of Deceased" value={data.national_id_number} />
      </div>
    </div>
  )
}
