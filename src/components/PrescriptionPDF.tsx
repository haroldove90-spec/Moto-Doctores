import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Estilos para la receta médica
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  doctorInfo: {
    textAlign: 'right',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  license: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  patientBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  patientDetail: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  content: {
    lineHeight: 1.6,
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  signature: {
    textAlign: 'center',
    width: 150,
  },
  signatureLine: {
    borderTop: 1,
    borderTopColor: '#334155',
    marginTop: 40,
    paddingTop: 8,
  },
  date: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 20,
  }
});

interface PrescriptionData {
  patientName: string;
  patientAge: string;
  diagnosis: string;
  treatment: string;
  doctorName: string;
  doctorLicense: string;
  date: string;
  qrCodeUrl?: string;
}

export const PrescriptionPDF = ({ data }: { data: PrescriptionData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MotoDoctores</Text>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{data.doctorName}</Text>
          <Text style={styles.license}>Cédula Profesional: {data.doctorLicense}</Text>
        </View>
      </View>

      {/* Patient Info */}
      <View style={styles.patientBox}>
        <View style={styles.patientDetail}>
          <Text style={styles.label}>Paciente</Text>
          <Text style={styles.value}>{data.patientName}</Text>
        </View>
        <View style={styles.patientDetail}>
          <Text style={styles.label}>Edad</Text>
          <Text style={styles.value}>{data.patientAge} años</Text>
        </View>
        <View style={styles.patientDetail}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>{data.date}</Text>
        </View>
      </View>

      {/* Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnóstico</Text>
        <Text style={styles.content}>{data.diagnosis}</Text>
      </View>

      {/* Treatment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tratamiento y Prescripción</Text>
        <Text style={styles.content}>{data.treatment}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          {data.qrCodeUrl && <Image src={data.qrCodeUrl} style={styles.qrCode} />}
          <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 4 }}>Validar receta en motodoctores.com</Text>
        </View>
        
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text style={styles.value}>Firma del Médico</Text>
          <Text style={styles.license}>{data.doctorName}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
