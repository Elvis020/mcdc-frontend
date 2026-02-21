import { CertificateDisplayData } from '../types'
import { FormCheckbox, YesNoUnknown } from '../primitives/form-checkbox'

export function FetalInfantSection({ data }: { data: CertificateDisplayData }) {
  return (
    <div className="border-b border-gray-400">
      {/* Header */}
      <div className="px-2 py-0.5 bg-gray-100 border-b border-gray-400">
        <span className="text-[9px] font-bold uppercase tracking-wider">Fetal or Infant Death</span>
      </div>

      <div className="px-2 py-1.5 space-y-2.5">
        {/* Is fetal/infant death? */}
        <div className="flex items-center gap-3">
          <FormCheckbox checked={data.is_fetal_infant_death === true} label="Yes" />
          <FormCheckbox checked={data.is_fetal_infant_death === false} label="No" />
          <FormCheckbox checked={data.is_fetal_infant_death == null} label="Unknown" />
        </div>

        {/* Death within 24h | Stillborn */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-1.5">
          <div>
            <span className="text-[9px]">Death within 24h, specify number of hours: </span>
            <span className="text-[10px] font-medium">
              {data.hours_if_death_within_24h != null ? String(data.hours_if_death_within_24h) : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px]">Stillborn?</span>
            <YesNoUnknown value={data.stillbirth} />
          </div>
        </div>

        {/* Serviced | Multiple pregnancy */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px]">Serviced?</span>
            <FormCheckbox checked={data.was_serviced === true} label="Yes" />
            <FormCheckbox checked={data.was_serviced === false} label="No" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px]">Multiple pregnancy?</span>
            <FormCheckbox checked={data.multiple_pregnancy === true} label="Yes" />
            <FormCheckbox checked={data.multiple_pregnancy === false} label="No" />
          </div>
        </div>

        {/* Birth weight | Mother's age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px]">Birth weight (in grams): </span>
            <span className="text-[10px] font-medium">
              {data.birth_weight_grams != null ? String(data.birth_weight_grams) : ''}
            </span>
          </div>
          <div>
            <span className="text-[9px]">Age of mother (years): </span>
            <span className="text-[10px] font-medium">
              {data.mother_age_years != null ? String(data.mother_age_years) : ''}
            </span>
          </div>
        </div>

        {/* Completed weeks of pregnancy */}
        <div>
          <span className="text-[9px]">Number of completed weeks of pregnancy: </span>
          <span className="text-[10px] font-medium">
            {data.completed_weeks_pregnancy != null ? String(data.completed_weeks_pregnancy) : ''}
          </span>
        </div>

        {/* Maternal conditions */}
        <div className="border-t border-gray-200 pt-1.5">
          <p className="text-[8px] text-gray-500 mb-0.5">
            If death was perinatal, please state conditions of mother that affected the foetus and newborn:
          </p>
          <p className="text-[10px] min-h-[14px]">{data.maternal_conditions ?? ''}</p>
        </div>

        {/* For Women — was deceased pregnant? */}
        <div className="border-t border-gray-200 pt-1.5">
          <p className="text-[9px] font-semibold mb-1">For Women, was the Deceased Pregnant?</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <FormCheckbox
              checked={data.pregnancy_timing === 'at_time_of_death'}
              label="At time of death"
            />
            <FormCheckbox
              checked={data.pregnancy_timing === 'within_42_days_before'}
              label="Within 42 days before death"
            />
            <FormCheckbox
              checked={data.pregnancy_timing === 'between_43_days_to_1_year_before'}
              label="Between 43 days to 1 year before"
            />
            <FormCheckbox
              checked={
                data.was_deceased_pregnant === 'unknown' ||
                data.pregnancy_timing === 'unknown'
              }
              label="Unknown"
            />
          </div>
        </div>

        {/* Did pregnancy contribute to death? */}
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-1.5">
          <span className="text-[9px]">Did the pregnancy contribute to death?</span>
          <YesNoUnknown value={data.pregnancy_contributed_to_death} />
        </div>
      </div>
    </div>
  )
}
