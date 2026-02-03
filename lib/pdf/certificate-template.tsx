'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { CertificateFormData } from '@/lib/validations/certificate.schema'

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: 2,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    fontSize: 9,
  },
  value: {
    width: '60%',
    fontSize: 9,
  },
  causeSection: {
    marginLeft: 10,
    marginBottom: 10,
  },
  causeItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  causeLabel: {
    width: 30,
    fontWeight: 'bold',
    fontSize: 9,
  },
  causeText: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    paddingTop: 10,
    fontSize: 8,
    textAlign: 'center',
  },
  metadata: {
    marginTop: 10,
    fontSize: 8,
    color: '#666',
  },
})

interface CertificateTemplateProps {
  data: Partial<CertificateFormData>
  serialNumber?: string
  issuedDate?: string
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'Not provided'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  serialNumber,
  issuedDate
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>REPUBLIC OF GHANA</Text>
        <Text style={styles.subtitle}>MEDICAL CERTIFICATE OF CAUSE OF DEATH</Text>
        <View style={styles.metadata}>
          <Text>Certificate No: {serialNumber || 'N/A'}</Text>
          <Text>Date Issued: {issuedDate || new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Deceased Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DECEASED INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{formatValue(data.deceased_full_name)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{formatValue(data.date_of_birth)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Death:</Text>
          <Text style={styles.value}>{formatValue(data.date_of_death)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{formatValue(data.gender)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>National ID Number:</Text>
          <Text style={styles.value}>{formatValue(data.national_id_number)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Folder Number:</Text>
          <Text style={styles.value}>{formatValue(data.folder_number)}</Text>
        </View>
      </View>

      {/* Cause of Death */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CAUSE OF DEATH</Text>
        <Text style={{ fontSize: 8, marginBottom: 5, fontStyle: 'italic' }}>
          Part I: Disease or condition directly leading to death
        </Text>
        <View style={styles.causeSection}>
          <View style={styles.causeItem}>
            <Text style={styles.causeLabel}>(a)</Text>
            <Text style={styles.causeText}>
              {formatValue(data.cause_a_description)}
              {data.cause_a_interval && ` - Interval: ${data.cause_a_interval}`}
            </Text>
          </View>
          <View style={styles.causeItem}>
            <Text style={styles.causeLabel}>(b)</Text>
            <Text style={styles.causeText}>
              {formatValue(data.cause_b_description)}
              {data.cause_b_interval && ` - Interval: ${data.cause_b_interval}`}
            </Text>
          </View>
          <View style={styles.causeItem}>
            <Text style={styles.causeLabel}>(c)</Text>
            <Text style={styles.causeText}>
              {formatValue(data.cause_c_description)}
              {data.cause_c_interval && ` - Interval: ${data.cause_c_interval}`}
            </Text>
          </View>
          <View style={styles.causeItem}>
            <Text style={styles.causeLabel}>(d)</Text>
            <Text style={styles.causeText}>
              {formatValue(data.cause_d_description)}
              {data.cause_d_interval && ` - Interval: ${data.cause_d_interval}`}
            </Text>
          </View>
        </View>

        {data.contributing_conditions && (
          <>
            <Text style={{ fontSize: 8, marginTop: 5, marginBottom: 5, fontStyle: 'italic' }}>
              Part II: Other significant conditions contributing to death
            </Text>
            <Text style={{ fontSize: 9, marginLeft: 10 }}>
              {formatValue(data.contributing_conditions)}
            </Text>
          </>
        )}
      </View>

      {/* Other Medical Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MEDICAL INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Surgery within 4 weeks:</Text>
          <Text style={styles.value}>{formatValue(data.surgery_within_4_weeks)}</Text>
        </View>
        {data.surgery_within_4_weeks && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Surgery Date:</Text>
              <Text style={styles.value}>{formatValue(data.surgery_date)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Surgery Reason:</Text>
              <Text style={styles.value}>{formatValue(data.surgery_reason)}</Text>
            </View>
          </>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Autopsy Requested:</Text>
          <Text style={styles.value}>{formatValue(data.autopsy_requested)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Autopsy Findings Used:</Text>
          <Text style={styles.value}>{formatValue(data.autopsy_findings_used)}</Text>
        </View>
      </View>

      {/* Manner of Death */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MANNER AND LOCATION OF DEATH</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Manner of Death:</Text>
          <Text style={styles.value}>{formatValue(data.manner_of_death)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Death Location:</Text>
          <Text style={styles.value}>{formatValue(data.death_location)}</Text>
        </View>
        {(data.manner_of_death === 'accident' ||
          data.manner_of_death === 'intentional_self_harm' ||
          data.manner_of_death === 'assault') && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>External Cause Date:</Text>
              <Text style={styles.value}>{formatValue(data.external_cause_date)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>External Cause:</Text>
              <Text style={styles.value}>{formatValue(data.external_cause_description)}</Text>
            </View>
          </>
        )}
      </View>

      {/* Fetal/Infant Death Information - Only if applicable */}
      {data.is_fetal_infant_death && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FETAL/INFANT DEATH INFORMATION</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Stillbirth:</Text>
            <Text style={styles.value}>{formatValue(data.stillbirth)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Birth Weight:</Text>
            <Text style={styles.value}>{formatValue(data.birth_weight_grams)} grams</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Weeks of Pregnancy:</Text>
            <Text style={styles.value}>{formatValue(data.completed_weeks_pregnancy)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mother's Age:</Text>
            <Text style={styles.value}>{formatValue(data.mother_age_years)} years</Text>
          </View>
        </View>
      )}

      {/* Issuer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CERTIFICATE ISSUED TO</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Issued To:</Text>
          <Text style={styles.value}>{formatValue(data.issued_to_full_name)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Relation to Deceased:</Text>
          <Text style={styles.value}>{formatValue(data.relation_to_deceased)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <Text style={styles.value}>{formatValue(data.issued_to_mobile)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Witness:</Text>
          <Text style={styles.value}>{formatValue(data.witness_to_deceased)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Witness Date:</Text>
          <Text style={styles.value}>{formatValue(data.witness_date)}</Text>
        </View>
      </View>

      {/* Signatures Section */}
      <View style={styles.section}>
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%' }}>
            <Text style={{ fontSize: 8, marginBottom: 15 }}>_________________________</Text>
            <Text style={{ fontSize: 8 }}>Certifying Officer Signature</Text>
          </View>
          <View style={{ width: '45%' }}>
            <Text style={{ fontSize: 8, marginBottom: 15 }}>_________________________</Text>
            <Text style={{ fontSize: 8 }}>Date</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This is an official medical certificate issued under the authority of Ghana Health Service</Text>
        <Text style={{ marginTop: 3 }}>Generated electronically via eMCOD System</Text>
      </View>
    </Page>
  </Document>
)
