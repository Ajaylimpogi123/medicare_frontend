import { Brand } from "./brand";
import { Generic } from "./generic";
import { Patient } from "./patient";
import { User } from "./user";

export type Medication = {
  generic: Generic;
  brand: Brand;
  dosage: string;
};

export type Prescription = {
  id: string;
  type: "prescription";
  createdBy: User;
  dateIssued: Date; // Date object
  patient: Patient;
  medications: Medication[];
  notes: string;
};
