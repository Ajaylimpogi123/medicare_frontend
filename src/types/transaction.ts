import { MedicalCertificate } from "./medical-certificate";
import { Prescription } from "./prescription";

export type Transaction = Prescription | MedicalCertificate;
