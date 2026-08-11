import { API_URL } from "@/api/config";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Accept': 'application/json' },
});

// Request interceptor — attach token and clinic ID
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const storedClinic = await SecureStore.getItemAsync('activeClinic');
  if (storedClinic) {
    const clinic = JSON.parse(storedClinic);
    config.headers['X-Clinic-ID'] = clinic.id;
  }

  return config;
});

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('activeClinic');

      // Redirect to login
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export const fetchPatients         = ()                               => apiClient.get('/patients');
export const fetchPatientById      = (id: string | number)            => apiClient.get(`/patients/${id}`);
export const createPatient         = (data: any)                      => apiClient.post('/patients', data);
export const updatePatient         = (id: string | number, data: any) => apiClient.put(`/patients/${id}`, data);
export const deletePatient         = (id: string | number)            => apiClient.delete(`/patients/${id}`);
export const fetchPatientDiagnoses = (id: number)                     => apiClient.get(`/patients/${id}/diagnoses`);