import { z } from 'zod'

// Enums matching database
export const genderEnum = z.enum(['male', 'female'])
export const yesNoUnknownEnum = z.enum(['yes', 'no', 'unknown'])
// Helper to convert empty strings to undefined for optional enums
const optionalEnum = (enumSchema: z.ZodEnum<any>) =>
  z.union([enumSchema, z.literal('')]).transform(val => val === '' ? undefined : val).optional()
export const mannerOfDeathEnum = z.enum([
  'disease',
  'assault',
  'could_not_be_determined',
  'accident',
  'war',
  'pending_investigation',
  'intentional_self_harm',
  'legal_intervention',
  'external_cause_or_poisonous',
])
export const deathLocationEnum = z.enum([
  'home',
  'residential_institution',
  'school_other_institution_public',
  'sports_athletics',
  'street_highway',
  'trade_service_area',
  'industrial_construction_area',
  'farm',
])
export const pregnancyTimingEnum = z.enum([
  'at_time_of_death',
  'within_42_days_before',
  'between_43_days_to_1_year_before',
  'unknown',
])

// Step 1: Administrative Data
export const administrativeDataSchema = z.object({
  folder_number: z.string().optional(),
  cod_certificate_number: z.string().optional(),
  facility_code: z.string().optional(),
  facility_sn: z.string().optional(),
  facility_d: z.string().optional(),
  deceased_full_name: z.string().min(1, 'Deceased name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: genderEnum,
  national_register_number: z.string().optional(),
  national_id_number: z.string().optional(),
  date_of_death: z.string().min(1, 'Date of death is required'),
})

// Step 2: Medical Data Part 1 (Cause Chain)
export const medicalDataPart1Schema = z.object({
  cause_a_description: z.string().min(1, 'Direct cause of death is required'),
  cause_a_interval: z.string().optional(),
  cause_b_description: z.string().optional(),
  cause_b_interval: z.string().optional(),
  cause_c_description: z.string().optional(),
  cause_c_interval: z.string().optional(),
  cause_d_description: z.string().optional(),
  cause_d_interval: z.string().optional(),
})

// Step 3: Medical Data Part 2
export const medicalDataPart2Schema = z.object({
  contributing_conditions: z.string().optional(),
})

// Step 4: Other Medical Data
export const otherMedicalDataSchema = z.object({
  surgery_within_4_weeks: optionalEnum(yesNoUnknownEnum),
  surgery_date: z.string().optional(),
  surgery_reason: z.string().optional(),
  autopsy_requested: optionalEnum(yesNoUnknownEnum),
  autopsy_findings_used: optionalEnum(yesNoUnknownEnum),
})

// Step 5: Manner and Location of Death
export const mannerLocationSchema = z.object({
  manner_of_death: mannerOfDeathEnum,
  external_cause_date: z.string().optional(),
  external_cause_description: z.string().optional(),
  poisoning_agent: z.string().optional(),
  death_location: optionalEnum(deathLocationEnum),
})

// Step 6: Fetal/Infant Death (conditional)
export const fetalInfantSchema = z.object({
  is_fetal_infant_death: z.boolean().optional(),
  stillbirth: optionalEnum(yesNoUnknownEnum),
  multiple_pregnancy: z.boolean().optional(),
  hours_if_death_within_24h: z.number().int().min(0).max(24).optional(),
  birth_weight_grams: z.number().int().min(0).optional(),
  was_serviced: z.boolean().optional(),
  completed_weeks_pregnancy: z.number().int().min(0).max(45).optional(),
  mother_age_years: z.number().int().min(10).max(60).optional(),
  maternal_conditions: z.string().optional(),
  was_deceased_pregnant: optionalEnum(yesNoUnknownEnum),
  pregnancy_timing: optionalEnum(pregnancyTimingEnum),
  pregnancy_contributed_to_death: optionalEnum(yesNoUnknownEnum),
})

// Step 7: Issuer Details
export const issuerDetailsSchema = z.object({
  issued_to_full_name: z.string().optional(),
  issued_to_mobile: z.string().optional(),
  issued_to_contact_details: z.string().optional(),
  relation_to_deceased: z.string().optional(),
  witness_to_deceased: z.string().optional(),
  witness_date: z.string().optional(),
})

// Complete certificate schema (all steps combined)
export const certificateSchema = z.object({
  ...administrativeDataSchema.shape,
  ...medicalDataPart1Schema.shape,
  ...medicalDataPart2Schema.shape,
  ...otherMedicalDataSchema.shape,
  ...mannerLocationSchema.shape,
  ...fetalInfantSchema.shape,
  ...issuerDetailsSchema.shape,
})

export type CertificateFormData = z.infer<typeof certificateSchema>
export type AdministrativeData = z.infer<typeof administrativeDataSchema>
export type MedicalDataPart1 = z.infer<typeof medicalDataPart1Schema>
export type MedicalDataPart2 = z.infer<typeof medicalDataPart2Schema>
export type OtherMedicalData = z.infer<typeof otherMedicalDataSchema>
export type MannerLocation = z.infer<typeof mannerLocationSchema>
export type FetalInfant = z.infer<typeof fetalInfantSchema>
export type IssuerDetails = z.infer<typeof issuerDetailsSchema>
