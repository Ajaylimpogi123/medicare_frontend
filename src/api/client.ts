import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { API_URL } from "./config";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  const activeClinic = await SecureStore.getItemAsync("activeClinic");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (activeClinic) {
    const clinic = JSON.parse(activeClinic);
    config.headers["X-Clinic-ID"] = clinic.id;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("activeClinic");
      await SecureStore.deleteItemAsync("userData");
      await SecureStore.deleteItemAsync("userClinics");
      router.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default apiClient;