import apiClient from "./client";

export const fetchBrands    = ()                      => apiClient.get("/brands");
export const fetchBrandById = (id: number)            => apiClient.get(`/brands/${id}`);
export const createBrand    = (data: any)             => apiClient.post("/brands", data);
export const updateBrand    = (id: number, data: any) => apiClient.put(`/brands/${id}`, data);
export const deleteBrand    = (id: number)            => apiClient.delete(`/brands/${id}`);