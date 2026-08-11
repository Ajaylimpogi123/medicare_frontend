import { API_URL } from "@/api/config";
import { Clinic } from "@/types/clinic";
import { User } from "@/types/user";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";



interface AuthContextType {
  token: string | null;
  user: User | null;
  clinics: Clinic[];
  activeClinic: Clinic | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  selectClinic: (clinic: Clinic) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        const storedUser = await SecureStore.getItemAsync("userData");
        const storedClinics = await SecureStore.getItemAsync("userClinics");
        const storedActiveClinic = await SecureStore.getItemAsync("activeClinic");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        if (storedClinics) setClinics(JSON.parse(storedClinics));
        if (storedActiveClinic) setActiveClinic(JSON.parse(storedActiveClinic));
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContext();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // FIX: was /login — correct endpoint is /auth/login
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      await SecureStore.setItemAsync("userToken", newToken);
      await SecureStore.setItemAsync("userData", JSON.stringify(userData));
      await SecureStore.setItemAsync("userClinics", JSON.stringify(userData.clinics));

      setToken(newToken);
      setUser(userData);
      setClinics(userData.clinics);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    // FIX: must call API first to destroy the Sanctum token on the server
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      await SecureStore.deleteItemAsync("userClinics");
      await SecureStore.deleteItemAsync("activeClinic");
      setToken(null);
      setUser(null);
      setClinics([]);
      setActiveClinic(null);
    }
  };

  const selectClinic = async (clinic: Clinic) => {
    await SecureStore.setItemAsync("activeClinic", JSON.stringify(clinic));
    setActiveClinic(clinic);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, clinics, activeClinic, login, logout, selectClinic, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};