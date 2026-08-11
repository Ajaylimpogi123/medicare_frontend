import apiClient from "./client";

export const fetchClinics    = ()                      => apiClient.get("/clinics");
export const fetchClinicById = (id: number)            => apiClient.get(`/clinics/${id}`);
export const createClinic    = (data: any)             => apiClient.post("/clinics", data);
export const updateClinic    = (id: number, data: any) => apiClient.put(`/clinics/${id}`, data);
export const deleteClinic    = (id: number)            => apiClient.delete(`/clinics/${id}`);