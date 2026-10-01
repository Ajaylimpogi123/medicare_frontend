import apiClient from "./client";

export const fetchPatientConsultations = (patientId: number, page?: number) => apiClient.get(`/consultations?patient_id=${patientId}`, { params: { page } });

export const getPrescriptionPdfSignedUrl = (consultationId: number) =>
  apiClient.get(`/consultations/${consultationId}/prescription-pdf/signed-url`);