export interface Clinic {
  id: number;
  clinic_name: string;
  doctor_id: number | null;
  address: string | null;
  phone_number: string | null;
}