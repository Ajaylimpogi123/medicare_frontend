// ── mocks/index.ts ────────────────────────────────────────────────────────────
// Central mock data file. Import from here in any screen:
// import {
//   MOCK_CLINIC,
//   MOCK_USER,
//   MOCK_PATIENTS,
//   MOCK_GENERICS,
//   MOCK_BRANDS,
//   MOCK_DISEASES,
//   MOCK_PRESCRIPTIONS,
//   MOCK_MEDICAL_CERTIFICATES,
//   MOCK_TRANSACTIONS,
// } from "@/mocks";

import { Brand } from "@/types/brand";
import { Clinic } from "@/types/clinic";
import { Disease } from "@/types/disease";
import { Generic } from "@/types/generic";
import { MedicalCertificate } from "@/types/medical-certificate";
import { Patient } from "@/types/patient";
import { Prescription } from "@/types/prescription";
import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";

// ── Clinic ────────────────────────────────────────────────────────────────────

export const MOCK_CLINIC: Clinic = {
  id: "1",
  name: "Crave Medical Center",
  address: "JS Bldg. Lacson-Galo St., Bacolod City",
  contactNumber: "09171231234",
};

// ── User ──────────────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "1",
  firstName: "Kenneth",
  lastName: "Pedrajas",
  email: "[pedkenneth@gmail.com](mailto:pedkenneth@gmail.com)",
  phoneNumber: "09958533900",
  role: "doctor",
  prcNumber: "1234567890",
  specialty: "Pulmonary",
  clinic: MOCK_CLINIC,
};

// ── Patients ──────────────────────────────────────────────────────────────────

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    createdBy: MOCK_USER,
    lastName: "Soratorio",
    firstName: "Agnes",
    gender: "Female",
    birthdate: new Date("1954-01-25"),
    email: "[agnes.soratorio@example.com](mailto:agnes.soratorio@example.com)",
    phoneNumber: "09123456789",
    clinic: MOCK_CLINIC,
  },
  {
    id: "2",
    createdBy: MOCK_USER,
    lastName: "Dela Cruz",
    firstName: "Juan",
    gender: "Male",
    birthdate: new Date("1990-03-10"),
    email: "[juan.dela.cruz@example.com](mailto:juan.dela.cruz@example.com)",
    phoneNumber: "09234567890",
    clinic: MOCK_CLINIC,
  },
  {
    id: "3",
    createdBy: MOCK_USER,
    lastName: "Santos",
    firstName: "Maria",
    gender: "Female",
    birthdate: new Date("1985-07-04"),
    email: "[maria.santos@example.com](mailto:maria.santos@example.com)",
    phoneNumber: "09345678901",
    clinic: MOCK_CLINIC,
  },
];

// ── Generics ──────────────────────────────────────────────────────────────────

export const MOCK_GENERICS: Generic[] = [
  { id: "1", name: "Paracetamol", uses: "Fever, mild to moderate pain relief" },
  { id: "2", name: "Amoxicillin", uses: "Bacterial infections" },
  { id: "3", name: "Ibuprofen", uses: "Pain, fever, inflammation" },
  { id: "4", name: "Cetirizine", uses: "Allergies, hay fever" },
  { id: "5", name: "Metformin", uses: "Type 2 diabetes management" },
];

// ── Brands ────────────────────────────────────────────────────────────────────

export const MOCK_BRANDS: Brand[] = [
  { id: "1", name: "Amoxil", generics: [MOCK_GENERICS[1]] }, // Amoxicillin
  { id: "2", name: "Advil", generics: [MOCK_GENERICS[2]] }, // Ibuprofen
  { id: "3", name: "Glucophage", generics: [MOCK_GENERICS[4]] }, // Metformin
];

// ── Diseases ──────────────────────────────────────────────────────────────────

export const MOCK_DISEASES: Disease[] = [
  {
    id: "1",
    name: "Influenza",
    symptoms:
      "Fever, chills, muscle aches, cough, congestion, runny nose, headaches, fatigue",
  },
  {
    id: "2",
    name: "Acute Bronchitis",
    symptoms:
      "Persistent cough, mild fever, fatigue, chest discomfort, mucus production",
  },
  {
    id: "3",
    name: "Upper Respiratory Tract Infection",
    symptoms:
      "Sore throat, runny nose, nasal congestion, sneezing, cough, mild fever",
  },
];

// ── Prescriptions ─────────────────────────────────────────────────────────────

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "1",
    type: "prescription",
    createdBy: MOCK_USER,
    dateIssued: new Date("2025-05-01"),
    patient: MOCK_PATIENTS[0],
    medications: [
      {
        generic: MOCK_GENERICS[0],
        brand: MOCK_BRANDS[0],
        dosage: "500mg every 8 hours for 7 days",
      },
    ],
    notes: "Take with food. Complete the full antibiotic course.",
  },
  {
    id: "3",
    type: "prescription",
    createdBy: MOCK_USER,
    dateIssued: new Date("2025-05-10"),
    patient: MOCK_PATIENTS[2],
    medications: [
      {
        generic: MOCK_GENERICS[1],
        brand: MOCK_BRANDS[1],
        dosage: "400mg every 6 hours as needed for pain",
      },
    ],
    notes: "Avoid on empty stomach.",
  },
  {
    id: "5",
    type: "prescription",
    createdBy: MOCK_USER,
    dateIssued: new Date("2025-05-20"),
    patient: MOCK_PATIENTS[1],
    medications: [
      {
        generic: MOCK_GENERICS[2],
        brand: MOCK_BRANDS[2],
        dosage: "850mg twice daily with meals",
      },
      {
        generic: MOCK_GENERICS[0],
        brand: MOCK_BRANDS[0],
        dosage: "500mg every 8 hours for 7 days",
      },
    ],
    notes: "Monitor blood sugar weekly.",
  },
];

// ── Medical Certificates ──────────────────────────────────────────────────────

export const MOCK_MEDICAL_CERTIFICATES: MedicalCertificate[] = [
  {
    id: "2",
    type: "medical-certificate",
    createdBy: MOCK_USER,
    dateIssued: new Date("2025-05-03"),
    patient: MOCK_PATIENTS[1],
    complaints:
      "Patient presented with symptoms of acute bronchitis, including persistent cough, mild fever, and fatigue.",
    diagnosis: "Acute Bronchitis",
    recommendation:
      "Patient is cleared to return to work. No physical restrictions.",
  },
  {
    id: "4",
    type: "medical-certificate",
    createdBy: MOCK_USER,
    dateIssued: new Date("2025-05-15"),
    patient: MOCK_PATIENTS[0],
    complaints:
      "Patient presented with symptoms of acute bronchitis, including persistent cough, mild fever, and fatigue.",
    diagnosis: "Acute Bronchitis",
    recommendation:
      "Patient is cleared to return to work. No physical restrictions.",
  },
];

// ── Transactions ──────────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  ...MOCK_PRESCRIPTIONS,
  ...MOCK_MEDICAL_CERTIFICATES,
].sort((a, b) => b.dateIssued.getTime() - a.dateIssued.getTime());
