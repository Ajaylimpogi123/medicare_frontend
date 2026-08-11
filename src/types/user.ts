import { Clinic } from "./clinic";

export type UserRole = "doctor" | "assistant" | "admin";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  prc_id?: string;    // doctors only
  clinics: Clinic[];  // user can belong to multiple clinics
}