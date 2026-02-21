import { CertificateDisplayData, formatCertDate } from '../types'
import { FormCheckbox } from '../primitives/form-checkbox'

// Checkbox grid: 3 columns × 3 rows (excluding external_cause_or_poisonous)
const MANNER_GRID: [string, string][] = [
  ['disease', 'Disease'],
  ['assault', 'Assault'],
  ['could_not_be_determined', 'Could not be determined'],
  ['accident', 'Accident'],
  ['legal_intervention', 'Legal intervention'],
  ['pending_investigation', 'Pending investigation'],
  ['intentional_self_harm', 'Intentional self-harm'],
  ['war', 'War'],
  ['unknown', 'Unknown'],
]

// Place-of-death grid: 2 columns × 5 rows
const LOCATION_GRID: [string, string][] = [
  ['home', 'At home'],
  ['residential_institution', 'Residential institution'],
  ['school_other_institution_public', 'School, other institution, public admin. area'],
  ['sports_athletics', 'Sports and athletics area'],
  ['street_highway', 'Street/Highway'],
  ['trade_service_area', 'Trade and service area'],
  ['industrial_construction_area', 'Industrial/construction area'],
  ['farm', 'Farm'],
  ['other', 'Other (please specify)'],
  ['unknown', 'Unknown'],
]

export function MannerLocationSection({ data }: { data: CertificateDisplayData }) {
  const isExternal = data.manner_of_death === 'external_cause_or_poisonous'

  return (
    <div className="border-b border-gray-400">
      {/* ── Manner of Death ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-400">
        <div className="px-2 py-0.5 border-b border-gray-400">
          <span className="text-[9px] font-bold uppercase tracking-wider">Manner of Death</span>
        </div>

        <div className="px-2 py-1.5">
          {/* 3-column checkbox grid */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
            {MANNER_GRID.map(([value, label]) => (
              <FormCheckbox
                key={value}
                checked={data.manner_of_death === value}
                label={label}
              />
            ))}
          </div>

          {/* External cause — shown as a full-width row with date field */}
          <div className="mt-1.5 flex flex-wrap items-center gap-3 pt-1 border-t border-gray-200">
            <FormCheckbox
              checked={isExternal}
              label="External cause or poisonous"
            />
            <span className="text-[9px]">
              Date of injury:{' '}
              <span className="border-b border-gray-700 inline-block min-w-[80px] text-[10px]">
                {isExternal ? formatCertDate(data.external_cause_date) : ''}
              </span>
            </span>
          </div>

          {/* External cause details */}
          {isExternal && (
            <div className="mt-1.5 pl-2 border-l-2 border-gray-300 space-y-1">
              <div>
                <p className="text-[8px] text-gray-500">
                  Please describe how external cause occurred (if poisoning, state poisoning agent):
                </p>
                <p className="text-[10px] min-h-[14px]">{data.external_cause_description ?? ''}</p>
              </div>
              {data.poisoning_agent && (
                <p className="text-[9px]">
                  <span className="text-gray-500">Poisoning agent: </span>
                  {data.poisoning_agent}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Place of Death ───────────────────────────────────────────────────── */}
      <div>
        <div className="px-2 py-0.5 border-b border-gray-400">
          <span className="text-[9px] font-bold uppercase tracking-wider">Place of Death</span>
        </div>

        <div className="px-2 py-1.5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {LOCATION_GRID.map(([value, label]) => (
              <FormCheckbox
                key={value}
                checked={data.death_location === value}
                label={label}
              />
            ))}
          </div>
          {data.death_location === 'other' && data.death_location_other && (
            <p className="text-[10px] mt-1 pl-5">
              <span className="text-gray-500">Specify: </span>
              {data.death_location_other}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
