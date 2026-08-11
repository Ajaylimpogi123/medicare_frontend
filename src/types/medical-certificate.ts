import { Patient } from "./patient";
import { User } from "./user";

export type MedicalCertificate = {
  id: string;
  type: "medical-certificate";
  createdBy: User;
  dateIssued: Date;
  patient: Patient;
  complaints: string;
  diagnosis: string;
  recommendation: string;
};
