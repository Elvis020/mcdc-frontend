import { CertificateDisplayData } from '../types'

export function CauseOfDeathSection({ data }: { data: CertificateDisplayData }) {
  const causes = [
    {
      label: 'a',
      desc: data.cause_a_description,
      icd: data.cause_a_icd_code,
      interval: data.cause_a_interval,
      comment: data.cause_a_comment,
    },
    {
      label: 'b',
      desc: data.cause_b_description,
      icd: data.cause_b_icd_code,
      interval: data.cause_b_interval,
      comment: data.cause_b_comment,
    },
    {
      label: 'c',
      desc: data.cause_c_description,
      icd: data.cause_c_icd_code,
      interval: data.cause_c_interval,
      comment: data.cause_c_comment,
    },
    {
      label: 'd',
      desc: data.cause_d_description,
      icd: data.cause_d_icd_code,
      interval: data.cause_d_interval,
      comment: data.cause_d_comment,
    },
  ]

  const conditions = [
    { desc: data.contributing_conditions, icd: data.contributing_conditions_icd_code, comment: data.contributing_conditions_comment },
    { desc: data.contributing_conditions_2, icd: data.contributing_conditions_2_icd_code, comment: data.contributing_conditions_2_comment },
    { desc: data.contributing_conditions_3, icd: data.contributing_conditions_3_icd_code, comment: data.contributing_conditions_3_comment },
    { desc: data.contributing_conditions_4, icd: data.contributing_conditions_4_icd_code, comment: data.contributing_conditions_4_comment },
  ]

  return (
    <div className="border-b border-gray-400">
      {/* Frame A header */}
      <div className="px-2 py-0.5 border-b border-gray-400">
        <span className="text-[9px] font-bold uppercase tracking-wider">
          Frame A: Medical Data — Part 1 and Part 2
        </span>
      </div>

      {/* Instructions */}
      <div className="px-2 py-0.5 border-b border-gray-400 bg-gray-50">
        <p className="text-[8px] text-gray-600">
          1. Report disease or condition directly leading to death on line (a). Report chain of events due to order
          (if applicable) on lines (b), (c), (d).
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1.5rem_1fr_5.5rem] border-b border-gray-400 divide-x divide-gray-400 bg-gray-50">
        <div className="px-1 py-0.5" />
        <div className="px-2 py-0.5">
          <p className="text-[8px] font-semibold">Cause of death</p>
          <p className="text-[7px] text-gray-400 italic">
            Disease or condition — not the mechanism of dying
          </p>
        </div>
        <div className="px-1 py-0.5 flex items-center justify-center">
          <p className="text-[7px] font-semibold text-center leading-tight">
            Time interval
            <br />
            onset → death
          </p>
        </div>
      </div>

      {/* Cause rows a → d */}
      {causes.map((cause, i) => (
        <div
          key={cause.label}
          className="grid grid-cols-[1.5rem_1fr_5.5rem] divide-x divide-gray-400 border-b border-gray-400"
        >
          {/* Row label with upward arrow to show causation chain */}
          <div className="flex flex-col items-center justify-center px-1 py-1.5">
            {i > 0 && <span className="text-[8px] text-gray-400 leading-none">↑</span>}
            <span className="text-[10px] font-bold">{cause.label}</span>
          </div>

          {/* Description + ICD code */}
          <div className="px-2 py-1">
            {i === 0 && (
              <p className="text-[7px] text-gray-400 italic mb-0.5">
                Disease or condition directly leading to death
              </p>
            )}
            {i > 0 && (
              <p className="text-[7px] text-gray-400 italic mb-0.5">
                Due to (or as a consequence of)
              </p>
            )}
            <p className="text-[10px] min-h-[14px]">{cause.desc ?? ''}</p>
            {cause.icd && (
              <p className="text-[8px] text-gray-400 mt-0.5 font-mono">ICD: {cause.icd}</p>
            )}
            {cause.comment && (
              <p className="text-[8px] text-gray-500 italic mt-0.5">{cause.comment}</p>
            )}
          </div>

          {/* Time interval */}
          <div className="px-1 py-1 flex items-start justify-center">
            <p className="text-[10px] text-center">{cause.interval ?? ''}</p>
          </div>
        </div>
      ))}

      {/* Part 2 — Contributing conditions */}
      <div className="border-t border-gray-400">
        <div className="px-2 py-0.5 bg-gray-50 border-b border-gray-400">
          <p className="text-[8px] text-gray-600">
            2. Other significant conditions contributing to death (time intervals can be included in
            brackets; after the condition)
          </p>
        </div>
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_5.5rem] border-b border-gray-400 divide-x divide-gray-400 bg-gray-50">
          <div className="px-2 py-0.5">
            <p className="text-[8px] font-semibold">Condition</p>
          </div>
          <div className="px-1 py-0.5 flex items-center justify-center">
            <p className="text-[7px] font-semibold text-center leading-tight">ICD-11 Code</p>
          </div>
        </div>
        {conditions.map((cond, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_5.5rem] divide-x divide-gray-400 min-h-[22px] ${
              i < conditions.length - 1 ? 'border-b border-gray-400' : ''
            }`}
          >
            <div className="px-2 py-1">
              <p className="text-[10px]">{cond.desc ?? ''}</p>
              {cond.comment && (
                <p className="text-[8px] text-gray-500 italic mt-0.5">{cond.comment}</p>
              )}
            </div>
            <div className="px-1 py-1 flex items-start justify-center">
              <p className="text-[10px] font-mono text-center">{cond.icd ?? ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
