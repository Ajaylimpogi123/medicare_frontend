import apiClient from "./client";

export const fetchPatientConsultations = (patientId: number) => apiClient.get(`/consultations?patient_id=${patientId}`);

export const getPrescriptionPdfSignedUrl = (consultationId: number) =>
  apiClient.get(`/consultations/${consultationId}/prescription-pdf/signed-url`);