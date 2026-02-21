/**
 * Database Types
 * These match the Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole =
  | 'doctor'
  | 'birth_death_registry'
  | 'health_department'
  | 'health_information_professional'
  | 'admin'

export type CertificateStatus = 'draft' | 'submitted'

export type Gender = 'male' | 'female'

export type YesNoUnknown = 'yes' | 'no' | 'unknown'

export type MannerOfDeath =
  | 'disease'
  | 'assault'
  | 'could_not_be_determined'
  | 'accident'
  | 'war'
  | 'pending_investigation'
  | 'intentional_self_harm'
  | 'legal_intervention'
  | 'external_cause_or_poisonous'

export type DeathLocation =
  | 'home'
  | 'residential_institution'
  | 'school_other_institution_public'
  | 'sports_athletics'
  | 'street_highway'
  | 'trade_service_area'
  | 'industrial_construction_area'
  | 'farm'
  | 'unknown'
  | 'other'

export type PregnancyTiming =
  | 'at_time_of_death'
  | 'within_42_days_before'
  | 'between_43_days_to_1_year_before'
  | 'unknown'

export type AuditAction =
  | 'created'
  | 'updated'
  | 'submitted'
  | 'viewed'
  | 'pdf_generated'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          mdc_registry_id: string | null
          full_name: string
          role: UserRole
          region_id: string | null
          district_id: string | null
          facility_id: string | null
          last_sign_in_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          mdc_registry_id?: string | null
          full_name: string
          role?: UserRole
          region_id?: string | null
          district_id?: string | null
          facility_id?: string | null
          last_sign_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mdc_registry_id?: string | null
          full_name?: string
          role?: UserRole
          region_id?: string | null
          district_id?: string | null
          facility_id?: string | null
          last_sign_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      mdc_registry: {
        Row: {
          id: string
          mdc_pin: string
          full_name: string
          email: string
          medical_qualification: string | null
          facility_id: string | null
          region_id: string | null
          district_id: string | null
          is_active: boolean
          imported_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mdc_pin: string
          full_name: string
          email: string
          medical_qualification?: string | null
          facility_id?: string | null
          region_id?: string | null
          district_id?: string | null
          is_active?: boolean
          imported_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mdc_pin?: string
          full_name?: string
          email?: string
          medical_qualification?: string | null
          facility_id?: string | null
          region_id?: string | null
          district_id?: string | null
          is_active?: boolean
          imported_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      death_certificates: {
        Row: {
          id: string
          serial_number: string
          status: CertificateStatus
          folder_number: string | null
          cod_certificate_number: string | null
          facility_code: string | null
          facility_sn: string | null
          facility_d: string | null
          deceased_full_name: string
          date_of_birth: string
          gender: Gender
          national_register_number: string | null
          national_id_number: string | null
          date_of_death: string
          cause_a_description: string
          cause_a_icd_code: string | null
          cause_a_interval: string | null
          cause_a_comment: string | null
          cause_b_description: string | null
          cause_b_icd_code: string | null
          cause_b_interval: string | null
          cause_b_comment: string | null
          cause_c_description: string | null
          cause_c_icd_code: string | null
          cause_c_interval: string | null
          cause_c_comment: string | null
          cause_d_description: string | null
          cause_d_icd_code: string | null
          cause_d_interval: string | null
          cause_d_comment: string | null
          contributing_conditions: string | null
          contributing_conditions_icd_code: string | null
          contributing_conditions_comment: string | null
          contributing_conditions_2: string | null
          contributing_conditions_2_icd_code: string | null
          contributing_conditions_2_comment: string | null
          contributing_conditions_3: string | null
          contributing_conditions_3_icd_code: string | null
          contributing_conditions_3_comment: string | null
          contributing_conditions_4: string | null
          contributing_conditions_4_icd_code: string | null
          contributing_conditions_4_comment: string | null
          surgery_within_4_weeks: YesNoUnknown | null
          surgery_date: string | null
          surgery_reason: string | null
          autopsy_requested: YesNoUnknown | null
          autopsy_findings_used: YesNoUnknown | null
          manner_of_death: MannerOfDeath
          external_cause_date: string | null
          external_cause_description: string | null
          poisoning_agent: string | null
          death_location: DeathLocation | null
          death_location_other: string | null
          is_fetal_infant_death: boolean
          stillbirth: YesNoUnknown | null
          multiple_pregnancy: boolean | null
          hours_if_death_within_24h: number | null
          birth_weight_grams: number | null
          was_serviced: boolean | null
          completed_weeks_pregnancy: number | null
          mother_age_years: number | null
          maternal_conditions: string | null
          was_deceased_pregnant: YesNoUnknown | null
          pregnancy_timing: PregnancyTiming | null
          pregnancy_contributed_to_death: YesNoUnknown | null
          issued_to_full_name: string | null
          issued_to_mobile: string | null
          issued_to_contact_details: string | null
          relation_to_deceased: string | null
          witness_to_deceased: string | null
          witness_date: string | null
          created_by_id: string
          facility_id: string | null
          region_id: string | null
          district_id: string | null
          submitted_at: string | null
          edit_window_expires_at: string | null
          pdf_storage_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          serial_number: string
          status?: CertificateStatus
          folder_number?: string | null
          cod_certificate_number?: string | null
          facility_code?: string | null
          facility_sn?: string | null
          facility_d?: string | null
          deceased_full_name: string
          date_of_birth: string
          gender: Gender
          national_register_number?: string | null
          national_id_number?: string | null
          date_of_death: string
          cause_a_description: string
          cause_a_icd_code?: string | null
          cause_a_interval?: string | null
          cause_a_comment?: string | null
          cause_b_description?: string | null
          cause_b_icd_code?: string | null
          cause_b_interval?: string | null
          cause_b_comment?: string | null
          cause_c_description?: string | null
          cause_c_icd_code?: string | null
          cause_c_interval?: string | null
          cause_c_comment?: string | null
          cause_d_description?: string | null
          cause_d_icd_code?: string | null
          cause_d_interval?: string | null
          cause_d_comment?: string | null
          contributing_conditions?: string | null
          contributing_conditions_icd_code?: string | null
          contributing_conditions_comment?: string | null
          contributing_conditions_2?: string | null
          contributing_conditions_2_icd_code?: string | null
          contributing_conditions_2_comment?: string | null
          contributing_conditions_3?: string | null
          contributing_conditions_3_icd_code?: string | null
          contributing_conditions_3_comment?: string | null
          contributing_conditions_4?: string | null
          contributing_conditions_4_icd_code?: string | null
          contributing_conditions_4_comment?: string | null
          surgery_within_4_weeks?: YesNoUnknown | null
          surgery_date?: string | null
          surgery_reason?: string | null
          autopsy_requested?: YesNoUnknown | null
          autopsy_findings_used?: YesNoUnknown | null
          manner_of_death: MannerOfDeath
          external_cause_date?: string | null
          external_cause_description?: string | null
          poisoning_agent?: string | null
          death_location?: DeathLocation | null
          death_location_other?: string | null
          is_fetal_infant_death?: boolean
          stillbirth?: YesNoUnknown | null
          multiple_pregnancy?: boolean | null
          hours_if_death_within_24h?: number | null
          birth_weight_grams?: number | null
          was_serviced?: boolean | null
          completed_weeks_pregnancy?: number | null
          mother_age_years?: number | null
          maternal_conditions?: string | null
          was_deceased_pregnant?: YesNoUnknown | null
          pregnancy_timing?: PregnancyTiming | null
          pregnancy_contributed_to_death?: YesNoUnknown | null
          issued_to_full_name?: string | null
          issued_to_mobile?: string | null
          issued_to_contact_details?: string | null
          relation_to_deceased?: string | null
          witness_to_deceased?: string | null
          witness_date?: string | null
          created_by_id: string
          facility_id?: string | null
          region_id?: string | null
          district_id?: string | null
          submitted_at?: string | null
          edit_window_expires_at?: string | null
          pdf_storage_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          serial_number?: string
          status?: CertificateStatus
          folder_number?: string | null
          cod_certificate_number?: string | null
          facility_code?: string | null
          facility_sn?: string | null
          facility_d?: string | null
          deceased_full_name?: string
          date_of_birth?: string
          gender?: Gender
          national_register_number?: string | null
          national_id_number?: string | null
          date_of_death?: string
          cause_a_description?: string
          cause_a_icd_code?: string | null
          cause_a_interval?: string | null
          cause_a_comment?: string | null
          cause_b_description?: string | null
          cause_b_icd_code?: string | null
          cause_b_interval?: string | null
          cause_b_comment?: string | null
          cause_c_description?: string | null
          cause_c_icd_code?: string | null
          cause_c_interval?: string | null
          cause_c_comment?: string | null
          cause_d_description?: string | null
          cause_d_icd_code?: string | null
          cause_d_interval?: string | null
          cause_d_comment?: string | null
          contributing_conditions?: string | null
          contributing_conditions_icd_code?: string | null
          contributing_conditions_comment?: string | null
          contributing_conditions_2?: string | null
          contributing_conditions_2_icd_code?: string | null
          contributing_conditions_2_comment?: string | null
          contributing_conditions_3?: string | null
          contributing_conditions_3_icd_code?: string | null
          contributing_conditions_3_comment?: string | null
          contributing_conditions_4?: string | null
          contributing_conditions_4_icd_code?: string | null
          contributing_conditions_4_comment?: string | null
          surgery_within_4_weeks?: YesNoUnknown | null
          surgery_date?: string | null
          surgery_reason?: string | null
          autopsy_requested?: YesNoUnknown | null
          autopsy_findings_used?: YesNoUnknown | null
          manner_of_death?: MannerOfDeath
          external_cause_date?: string | null
          external_cause_description?: string | null
          poisoning_agent?: string | null
          death_location?: DeathLocation | null
          death_location_other?: string | null
          is_fetal_infant_death?: boolean
          stillbirth?: YesNoUnknown | null
          multiple_pregnancy?: boolean | null
          hours_if_death_within_24h?: number | null
          birth_weight_grams?: number | null
          was_serviced?: boolean | null
          completed_weeks_pregnancy?: number | null
          mother_age_years?: number | null
          maternal_conditions?: string | null
          was_deceased_pregnant?: YesNoUnknown | null
          pregnancy_timing?: PregnancyTiming | null
          pregnancy_contributed_to_death?: YesNoUnknown | null
          issued_to_full_name?: string | null
          issued_to_mobile?: string | null
          issued_to_contact_details?: string | null
          relation_to_deceased?: string | null
          witness_to_deceased?: string | null
          witness_date?: string | null
          submitted_at?: string | null
          edit_window_expires_at?: string | null
          pdf_storage_path?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          id: string
          code: string
          name: string
          created_at: string
        }
        Insert: Record<string, never>
        Update: Record<string, never>
        Relationships: []
      }
      districts: {
        Row: {
          id: string
          code: string
          name: string
          region_id: string
          created_at: string
        }
        Insert: Record<string, never>
        Update: Record<string, never>
        Relationships: []
      }
      facilities: {
        Row: {
          id: string
          code: string
          name: string
          district_id: string
          region_id: string
          created_at: string
        }
        Insert: Record<string, never>
        Update: Record<string, never>
        Relationships: []
      }
      user_sign_ins: {
        Row: {
          id: string
          user_id: string
          signed_in_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          signed_in_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: Record<string, never>
        Relationships: []
      }
      certificate_audit_log: {
        Row: {
          id: string
          certificate_id: string
          user_id: string
          action: AuditAction
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          certificate_id: string
          user_id: string
          action: AuditAction
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      generate_certificate_serial_number: {
        Args: {
          p_region_code: string
          p_facility_code: string
        }
        Returns: string
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_doctor: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      certificate_status: CertificateStatus
      gender: Gender
      yes_no_unknown: YesNoUnknown
      manner_of_death: MannerOfDeath
      death_location: DeathLocation
      pregnancy_timing: PregnancyTiming
      audit_action: AuditAction
    }
    CompositeTypes: Record<string, never>
  }
}
