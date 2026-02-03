'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { Database } from '@/types/database'

type DeathCertificate = Database['public']['Tables']['death_certificates']['Row']

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  serialNumber: {
    fontSize: 11,
    marginTop: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
    border: '1 solid #000',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottom: '1 solid #000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
    paddingRight: 5,
  },
  columnHalf: {
    width: '50%',
    paddingRight: 5,
  },
  columnThird: {
    width: '33.33%',
    paddingRight: 5,
  },
  label: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    borderBottom: '1 solid #ccc',
    paddingBottom: 2,
    minHeight: 14,
  },
  valueMultiline: {
    fontSize: 9,
    border: '1 solid #ccc',
    padding: 5,
    minHeight: 40,
  },
  causeChain: {
    marginBottom: 10,
  },
  causeItem: {
    flexDirection: 'row',
    marginBottom: 5,
    borderLeft: '3 solid #333',
    paddingLeft: 8,
  },
  causeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 60,
  },
  causeDescription: {
    flex: 1,
    fontSize: 9,
    borderBottom: '1 solid #ccc',
    paddingBottom: 2,
  },
  causeInterval: {
    width: 100,
    fontSize: 8,
    color: '#666',
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1 solid #000',
    fontSize: 8,
    color: '#666',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
})

interface DeathCertificatePDFProps {
  certificate: DeathCertificate
}

export function DeathCertificatePDF({ certificate }: DeathCertificatePDFProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-GB')
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-GB')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPUBLIC OF GHANA</Text>
          <Text style={styles.subtitle}>MEDICAL CAUSE OF DEATH CERTIFICATE</Text>
          <Text style={styles.subtitle}>Ministry of Health</Text>
          <Text style={styles.serialNumber}>Serial No: {certificate.serial_number}</Text>
        </View>

        {/* Section 1: Administrative Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADMINISTRATIVE DATA</Text>

          <View style={styles.row}>
            <View style={styles.columnThird}>
              <Text style={styles.label}>Folder Number</Text>
              <Text style={styles.value}>{certificate.folder_number || 'N/A'}</Text>
            </View>
            <View style={styles.columnThird}>
              <Text style={styles.label}>COD Certificate Number</Text>
              <Text style={styles.value}>{certificate.cod_certificate_number || 'N/A'}</Text>
            </View>
            <View style={styles.columnThird}>
              <Text style={styles.label}>Facility Code</Text>
              <Text style={styles.value}>{certificate.facility_code || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Deceased Full Name</Text>
              <Text style={styles.value}>{certificate.deceased_full_name}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.columnThird}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{formatDate(certificate.date_of_birth)}</Text>
            </View>
            <View style={styles.columnThird}>
              <Text style={styles.label}>Date of Death</Text>
              <Text style={styles.value}>{formatDate(certificate.date_of_death)}</Text>
            </View>
            <View style={styles.columnThird}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{certificate.gender?.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>National ID</Text>
              <Text style={styles.value}>{certificate.national_id_number || 'N/A'}</Text>
            </View>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>National Register Number</Text>
              <Text style={styles.value}>{certificate.national_register_number || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Section 2: Medical Cause of Death */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEDICAL CAUSE OF DEATH (ICD-10 CHAIN)</Text>

          <View style={styles.causeChain}>
            <Text style={{ fontSize: 9, marginBottom: 5, fontStyle: 'italic' }}>
              Direct sequence of events leading to death:
            </Text>

            {certificate.cause_a_description && (
              <View style={styles.causeItem}>
                <Text style={styles.causeLabel}>CAUSE A</Text>
                <Text style={styles.causeDescription}>{certificate.cause_a_description}</Text>
                <Text style={styles.causeInterval}>{certificate.cause_a_interval || ''}</Text>
              </View>
            )}

            {certificate.cause_b_description && (
              <View style={styles.causeItem}>
                <Text style={styles.causeLabel}>CAUSE B</Text>
                <Text style={styles.causeDescription}>{certificate.cause_b_description}</Text>
                <Text style={styles.causeInterval}>{certificate.cause_b_interval || ''}</Text>
              </View>
            )}

            {certificate.cause_c_description && (
              <View style={styles.causeItem}>
                <Text style={styles.causeLabel}>CAUSE C</Text>
                <Text style={styles.causeDescription}>{certificate.cause_c_description}</Text>
                <Text style={styles.causeInterval}>{certificate.cause_c_interval || ''}</Text>
              </View>
            )}

            {certificate.cause_d_description && (
              <View style={styles.causeItem}>
                <Text style={styles.causeLabel}>CAUSE D</Text>
                <Text style={styles.causeDescription}>{certificate.cause_d_description}</Text>
                <Text style={styles.causeInterval}>{certificate.cause_d_interval || ''}</Text>
              </View>
            )}
          </View>

          {certificate.contributing_conditions && (
            <View>
              <Text style={styles.label}>Contributing Conditions (not part of direct chain)</Text>
              <Text style={styles.valueMultiline}>{certificate.contributing_conditions}</Text>
            </View>
          )}
        </View>

        {/* Section 3: Other Medical Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OTHER MEDICAL INFORMATION</Text>

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Surgery within 4 weeks?</Text>
              <Text style={styles.value}>{certificate.surgery_within_4_weeks?.toUpperCase() || 'N/A'}</Text>
            </View>
            {certificate.surgery_within_4_weeks === 'yes' && (
              <View style={styles.columnHalf}>
                <Text style={styles.label}>Surgery Date</Text>
                <Text style={styles.value}>{formatDate(certificate.surgery_date)}</Text>
              </View>
            )}
          </View>

          {certificate.surgery_within_4_weeks === 'yes' && certificate.surgery_reason && (
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Reason for Surgery</Text>
                <Text style={styles.valueMultiline}>{certificate.surgery_reason}</Text>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Autopsy Requested?</Text>
              <Text style={styles.value}>{certificate.autopsy_requested?.toUpperCase() || 'N/A'}</Text>
            </View>
            {certificate.autopsy_requested === 'yes' && (
              <View style={styles.columnHalf}>
                <Text style={styles.label}>Findings Used in Certification?</Text>
                <Text style={styles.value}>{certificate.autopsy_findings_used?.toUpperCase() || 'N/A'}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 4: Manner and Location of Death */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MANNER AND LOCATION OF DEATH</Text>

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Manner of Death</Text>
              <Text style={styles.value}>
                {certificate.manner_of_death?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
              </Text>
            </View>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Location of Death</Text>
              <Text style={styles.value}>
                {certificate.death_location?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>

          {certificate.manner_of_death === 'external_cause_or_poisonous' && (
            <>
              <View style={styles.row}>
                <View style={styles.columnHalf}>
                  <Text style={styles.label}>Date of Injury/Exposure</Text>
                  <Text style={styles.value}>{formatDate(certificate.external_cause_date)}</Text>
                </View>
                <View style={styles.columnHalf}>
                  <Text style={styles.label}>Poisoning Agent</Text>
                  <Text style={styles.value}>{certificate.poisoning_agent || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Description of External Cause</Text>
                  <Text style={styles.valueMultiline}>{certificate.external_cause_description || 'N/A'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Section 5: Fetal/Infant Death (if applicable) */}
        {certificate.is_fetal_infant_death && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FETAL/INFANT DEATH INFORMATION</Text>

            <View style={styles.row}>
              <View style={styles.columnThird}>
                <Text style={styles.label}>Stillbirth?</Text>
                <Text style={styles.value}>{certificate.stillbirth?.toUpperCase() || 'N/A'}</Text>
              </View>
              <View style={styles.columnThird}>
                <Text style={styles.label}>Multiple Pregnancy?</Text>
                <Text style={styles.value}>
                  {certificate.multiple_pregnancy !== undefined
                    ? (certificate.multiple_pregnancy ? 'YES' : 'NO')
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.columnThird}>
                <Text style={styles.label}>Birth Weight (grams)</Text>
                <Text style={styles.value}>{certificate.birth_weight_grams || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.columnThird}>
                <Text style={styles.label}>Weeks of Pregnancy</Text>
                <Text style={styles.value}>{certificate.completed_weeks_pregnancy || 'N/A'}</Text>
              </View>
              <View style={styles.columnThird}>
                <Text style={styles.label}>Mother's Age</Text>
                <Text style={styles.value}>{certificate.mother_age_years || 'N/A'}</Text>
              </View>
            </View>

            {certificate.maternal_conditions && (
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Maternal Conditions</Text>
                  <Text style={styles.valueMultiline}>{certificate.maternal_conditions}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Section 6: Issuer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CERTIFICATE ISSUED TO</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{certificate.issued_to_full_name || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{certificate.issued_to_mobile || 'N/A'}</Text>
            </View>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Relation to Deceased</Text>
              <Text style={styles.value}>{certificate.relation_to_deceased || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Witness Name</Text>
              <Text style={styles.value}>{certificate.witness_to_deceased || 'N/A'}</Text>
            </View>
            <View style={styles.columnHalf}>
              <Text style={styles.label}>Witness Date</Text>
              <Text style={styles.value}>{formatDate(certificate.witness_date)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text>Certificate Status: {certificate.status?.toUpperCase()}</Text>
            <Text>Created: {formatDateTime(certificate.created_at)}</Text>
          </View>
          {certificate.submitted_at && (
            <View style={styles.footerRow}>
              <Text>Submitted: {formatDateTime(certificate.submitted_at)}</Text>
            </View>
          )}
          <View style={styles.footerRow}>
            <Text>This is an official electronic death certificate issued by the Ghana Health Service</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
