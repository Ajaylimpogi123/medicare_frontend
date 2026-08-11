import apiClient from "./client";

export const fetchDiseases          = (page = 1)              => apiClient.get(`/diseases?page=${page}`);
export const fetchDiseaseById       = (id: number)            => apiClient.get(`/diseases/${id}`);
export const createDisease          = (data: any)             => apiClient.post("/diseases", data);
export const updateDisease          = (id: number, data: any) => apiClient.put(`/diseases/${id}`, data);
export const deleteDisease          = (id: number)            => apiClient.delete(`/diseases/${id}`);
export const fetchDiseasePatients   = (id: number)            => apiClient.get(`/diseases/${id}/patients`);
export const updateDiagnosisStatus  = (diseaseId: number, diagnosisId: number, data: any) => apiClient.patch(`/diseases/${diseaseId}/diagnoses/${diagnosisId}`, data);