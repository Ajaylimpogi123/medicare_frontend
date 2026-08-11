import apiClient from "./client";

export const fetchGenerics    = ()                      => apiClient.get("/generics");
export const fetchGenericById = (id: number)            => apiClient.get(`/generics/${id}`);
export const createGeneric    = (data: any)             => apiClient.post("/generics", data);
export const updateGeneric    = (id: number, data: any) => apiClient.put(`/generics/${id}`, data);
export const deleteGeneric    = (id: number)            => apiClient.delete(`/generics/${id}`);