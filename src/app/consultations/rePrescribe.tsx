import { fetchPatientConsultations } from "@/api/consultation";
import { fetchPatientById, fetchPatients } from "@/api/patient";
import { rePrescribeStyles as styles } from "@/styles/rePrescribeStyles";
import { calculateAge } from "@/utils/age";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  birthdate: string;
  temperature?: string;
  blood_pressure?: string;
  height?: string;
  weight?: string;
  allergies?: string;
};

type Prescription = {
  id: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  generic_name_snapshot?: string | null;
  brand_name_snapshot?: string | null;
  generic: { id: number; generic_name: string };
  brand: { id: number; brand_name: string };
};

type ActiveDiagnosis = {
  diagnosis_id: number;
  disease_id: number;
  disease_name: string;
  status: "ongoing" | "referred";
  type: string;
  symptoms: string | null;
  consultation_id: number;
};

type Consultation = {
  id: number;
  consultation_date: string;
  prescriptions: Prescription[];
  diseases?: {
    id: number;
    disease_name: string;
    pivot: {
      id: number;
      type: string;
      status: string;
      symptoms: string | null;
      disease_name_snapshot: string | null;
    };
  }[];
};

export default function ReprescribeScreen() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPatientId, setLoadingPatientId] = useState<number | null>(null);

  const loadPatients = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res = await fetchPatients();
      const allPatients: Patient[] = res.data.data ?? res.data;

      const consultationChecks = await Promise.all(
        allPatients.map(async (p) => {
          try {
            const cRes = await fetchPatientConsultations(p.id);
            const consultations = cRes.data.data ?? [];
            return consultations.length > 0 ? p : null;
          } catch {
            return null;
          }
        })
      );

      setPatients(consultationChecks.filter((p): p is Patient => p !== null));
    } catch {
      Alert.alert("Error", "Could not load patients.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
      else setIsLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q),
    );
  }, [patients, searchQuery]);

  const handleSelectPatient = async (patient: Patient) => {
    setLoadingPatientId(patient.id);
    try {
      // Fetch full patient record to get vitals
      const patientRes = await fetchPatientById(patient.id);
      const fullPatient = patientRes.data.data ?? patientRes.data;

      const res = await fetchPatientConsultations(patient.id);
      const consultations: Consultation[] = res.data.data ?? [];

      const latestWithRx = consultations.find(
        (c) => c.prescriptions && c.prescriptions.length > 0,
      );

      const prefillMeds = latestWithRx
        ? latestWithRx.prescriptions.map((rx) => ({
            key: rx.id.toString(),
            generic_id: rx.generic?.id ?? 0,
            brand_id: rx.brand?.id ?? 0,
            generic_name: rx.generic?.generic_name ?? rx.generic_name_snapshot ?? "Unknown",
            brand_name: rx.brand?.brand_name ?? rx.brand_name_snapshot ?? "Unknown",
            dosage: rx.dosage,
            frequency: rx.frequency,
            duration: rx.duration,
            instructions: rx.instructions ?? "",
          }))
        : [];

      const activeDiagnoses: ActiveDiagnosis[] = [];
      const seenDiseaseIds = new Set<number>();

      consultations.forEach((c) => {
        if (!c.diseases) return;
        c.diseases.forEach((d) => {
          const status = d.pivot?.status;
          const diseaseId = d.id;
          if (
            (status === "ongoing" || status === "referred") &&
            !seenDiseaseIds.has(diseaseId)
          ) {
            seenDiseaseIds.add(diseaseId);
            activeDiagnoses.push({
              diagnosis_id: d.pivot.id,
              disease_id: d.id,
              disease_name: d.pivot.disease_name_snapshot ?? d.disease_name ?? "Unknown",
              status,
              type: d.pivot.type,
              symptoms: d.pivot.symptoms ?? null,
              consultation_id: c.id,
            });
          }
        });
      });

      router.push({
        pathname: "/consultations/createPrescription",
        params: {
          patientId: patient.id.toString(),
          patientName: `${patient.last_name}, ${patient.first_name}`,
          patientGender: patient.gender,
          patientBirthdate: patient.birthdate,
          patientTemperature: fullPatient.temperature ?? "",
          patientBloodPressure: fullPatient.blood_pressure ?? "",
          patientHeight: fullPatient.height ?? "",
          patientWeight: fullPatient.weight ?? "",
          patientAllergies: fullPatient.allergies ?? "",
          prefillMeds: JSON.stringify(prefillMeds),
          prefillActiveDiagnoses: JSON.stringify(activeDiagnoses),
        },
      });
    } catch {
      Alert.alert("Error", "Could not load patient history.");
    } finally {
      setLoadingPatientId(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadPatients(true)}
            tintColor="#095c29"
          />
        }
      >
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search patients by name..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtnClick}>
              <Text style={styles.clearBtnSymbol}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listHeaderRow}>
          <Text style={styles.promptHeadline}>
            Returning Patients{" "}
            <Text style={styles.patientCount}>({filteredPatients.length})</Text>
          </Text>
        </View>

        {isLoading ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <ActivityIndicator size="large" color="#095c29" />
            <Text style={[styles.emptyText, { marginTop: 12 }]}>Loading patients...</Text>
          </View>
        ) : filteredPatients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? "No patients match your search." : "No returning patients found."}
          </Text>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => handleSelectPatient(patient)}
              activeOpacity={0.75}
              disabled={loadingPatientId === patient.id}
            >
              <View style={styles.cardInfoGroup}>
                <Text style={styles.cardNameText}>
                  {patient.last_name}, {patient.first_name}
                </Text>
                <Text style={styles.cardSubDetails}>
                  {patient.gender
                    ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                    : "—"}{" "}
                  • DOB: {patient.birthdate ?? "—"}
                  {patient.birthdate ? ` • Age: ${calculateAge(patient.birthdate)}` : ""}
                </Text>
              </View>

              {loadingPatientId === patient.id ? (
                <ActivityIndicator size="small" color="#095c29" />
              ) : (
                <Text style={styles.chevron}>›</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}