import { API_URL } from "@/api/config";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const queueClient = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

queueClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const storedClinic = await SecureStore.getItemAsync("activeClinic");
  if (storedClinic) {
    const clinic = JSON.parse(storedClinic);
    config.headers["X-Clinic-ID"] = clinic.id;
  }
  return config;
});

queueClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("activeClinic");
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export const fetchQueue              = ()                  => queueClient.get("/queue");
export const addToQueue              = (patientId: number) => queueClient.post("/queue", { patient_id: patientId });
export const removeFromQueue         = (queueId: number)   => queueClient.delete(`/queue/${queueId}`);
export const removeFromQueueByPatient = (patientId: number) => queueClient.delete(`/queue/by-patient/${patientId}`);