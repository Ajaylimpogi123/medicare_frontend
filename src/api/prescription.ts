import apiClient from "./client";

export const updatePrescription = (id: number, data: any) => apiClient.put(`/prescriptions/${id}`, data);
export const deletePrescription = (id: number)            => apiClient.delete(`/prescriptions/${id}`);