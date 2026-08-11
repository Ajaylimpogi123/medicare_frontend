import { createBrand } from "@/api/brand";
import apiClient from "@/api/client";
import { getPrescriptionPdfSignedUrl } from "@/api/consultation";
import { createDisease, fetchDiseases } from "@/api/disease";
import { createGeneric } from "@/api/generic";
import { removeFromQueue } from "@/api/queue";
import { useAuth } from "@/components/context/auth-context";
import { createPrescriptionStyles as styles } from "@/styles/createPrescriptionStyles";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// — Types —
type Brand = {
  id: number;
  brand_name: string;
};

type Generic = {
  id: number;
  generic_name: string;
  brands: Brand[];
};

type Disease = {
  id: number;
  disease_name: string;
  description: string | null;
};

type DiagnosisEntry = {
  key: string;
  disease_id: number;
  disease_name: string;
  type: "primary" | "secondary";
  symptoms: string;
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

type MedicationEntry = {
  key: string;
  generic_id: number;
  brand_id: number;
  generic_name: string;
  brand_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

// — Floating field editor field keys —
// Each key maps to exactly one text field somewhere on the screen.
type FloatingFieldKey =
  | "chiefComplaint"
  | "notes"
  | "dosage"
  | "frequency"
  | "duration"
  | "instructions"
  | "diagnosisSymptoms"
  | "newGenericName"
  | "newBrandName"
  | "newDiseaseName"
  | "newDiseaseDescription"
  | "newDiseaseSymptoms";

const FLOATING_FIELD_CONFIG: Record<FloatingFieldKey, { label: string; multiline?: boolean }> = {
  chiefComplaint: { label: "Chief Complaint", multiline: true },
  notes: { label: "Notes", multiline: true },
  dosage: { label: "Dosage" },
  frequency: { label: "Frequency" },
  duration: { label: "Duration" },
  instructions: { label: "Instructions", multiline: true },
  diagnosisSymptoms: { label: "Symptoms", multiline: true },
  newGenericName: { label: "Generic Name" },
  newBrandName: { label: "Brand Name" },
  newDiseaseName: { label: "Disease Name" },
  newDiseaseDescription: { label: "Description", multiline: true },
  newDiseaseSymptoms: { label: "General Symptoms", multiline: true },
};

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function CreatePrescriptionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { activeClinic, user } = useAuth();

  const {
    patientId, patientName, patientGender, patientBirthdate,
    queueId, prefillMeds, prefillActiveDiagnoses,
    patientTemperature, patientBloodPressure,
    patientHeight, patientWeight, patientAllergies,
  } = useLocalSearchParams<{
    patientId: string;
    patientName: string;
    patientGender: string;
    patientBirthdate: string;
    queueId?: string;
    prefillMeds?: string;
    prefillActiveDiagnoses?: string;
    patientTemperature?: string;
    patientBloodPressure?: string;
    patientHeight?: string;
    patientWeight?: string;
    patientAllergies?: string;
  }>();

  // — Generics + Brands —
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [brands, setBrands] = useState<(Brand & { generic_id: number })[]>([]);
  const [genericsLoading, setGenericsLoading] = useState(true);

  // — Diseases —
  const [diseases, setDiseases] = useState<Disease[]>([]);

  // — Active diagnoses —
  const [activeDiagnoses, setActiveDiagnoses] = useState<ActiveDiagnosis[]>(() => {
    if (!prefillActiveDiagnoses) return [];
    try { return JSON.parse(prefillActiveDiagnoses as string) as ActiveDiagnosis[]; }
    catch { return []; }
  });
  const [updatingDiagnosisId, setUpdatingDiagnosisId] = useState<number | null>(null);

  // — New diagnoses —
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);

  // — Medications —
  const [medications, setMedications] = useState<MedicationEntry[]>(() => {
    if (!prefillMeds) return [];
    try { return JSON.parse(prefillMeds as string) as MedicationEntry[]; }
    catch { return []; }
  });

  const [notes, setNotes] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // — Medication modal —
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [selectedGeneric, setSelectedGeneric] = useState<Generic | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [genericPickerVisible, setGenericPickerVisible] = useState(false);
  const [brandPickerVisible, setBrandPickerVisible] = useState(false);
  const [genericSearch, setGenericSearch] = useState("");
  const [showCreateGeneric, setShowCreateGeneric] = useState(false);
  const [newGenericName, setNewGenericName] = useState("");
  const [creatingGeneric, setCreatingGeneric] = useState(false);
  const [showCreateBrand, setShowCreateBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [creatingBrand, setCreatingBrand] = useState(false);

  // — Disease modal —
  const [diseaseModalVisible, setDiseaseModalVisible] = useState(false);
  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [diagnosisType, setDiagnosisType] = useState<"primary" | "secondary">("primary");
  const [diagnosisSymptoms, setDiagnosisSymptoms] = useState("");
  const [editingDiagnosisKey, setEditingDiagnosisKey] = useState<string | null>(null);
  const [showCreateDisease, setShowCreateDisease] = useState(false);
  const [newDiseaseName, setNewDiseaseName] = useState("");
  const [newDiseaseDescription, setNewDiseaseDescription] = useState("");
  const [newDiseaseSymptoms, setNewDiseaseSymptoms] = useState("");
  const [creatingDisease, setCreatingDisease] = useState(false);

  // — Floating field editor (login-screen pattern, generalized to N fields) —
  const [activeField, setActiveField] = useState<FloatingFieldKey | null>(null);
  const [floatingValue, setFloatingValue] = useState("");
  const floatingRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (activeField !== null) {
        dismissFloating();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [activeField, floatingValue]);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      if (activeField !== null) dismissFloating();
    });
    return () => sub.remove();
  }, [activeField, floatingValue]);

  const getFieldValue = (field: FloatingFieldKey): string => {
    switch (field) {
      case "chiefComplaint": return chiefComplaint;
      case "notes": return notes;
      case "dosage": return dosage;
      case "frequency": return frequency;
      case "duration": return duration;
      case "instructions": return instructions;
      case "diagnosisSymptoms": return diagnosisSymptoms;
      case "newGenericName": return newGenericName;
      case "newBrandName": return newBrandName;
      case "newDiseaseName": return newDiseaseName;
      case "newDiseaseDescription": return newDiseaseDescription;
      case "newDiseaseSymptoms": return newDiseaseSymptoms;
    }
  };

  const setFieldValue = (field: FloatingFieldKey, value: string) => {
    switch (field) {
      case "chiefComplaint": setChiefComplaint(value); break;
      case "notes": setNotes(value); break;
      case "dosage": setDosage(value); break;
      case "frequency": setFrequency(value); break;
      case "duration": setDuration(value); break;
      case "instructions": setInstructions(value); break;
      case "diagnosisSymptoms": setDiagnosisSymptoms(value); break;
      case "newGenericName": setNewGenericName(value); break;
      case "newBrandName": setNewBrandName(value); break;
      case "newDiseaseName": setNewDiseaseName(value); break;
      case "newDiseaseDescription": setNewDiseaseDescription(value); break;
      case "newDiseaseSymptoms": setNewDiseaseSymptoms(value); break;
    }
  };

  const openFloating = (field: FloatingFieldKey) => {
    setFloatingValue(getFieldValue(field));
    setActiveField(field);
  };

  const dismissFloating = () => {
    if (activeField !== null) {
      setFieldValue(activeField, floatingValue);
    }
    setActiveField(null);
    Keyboard.dismiss();
  };

  const activeFieldConfig = activeField ? FLOATING_FIELD_CONFIG[activeField] : null;

  const age = patientBirthdate ? calculateAge(patientBirthdate) : null;
  const capitalizedGender = patientGender
    ? patientGender.charAt(0).toUpperCase() + patientGender.slice(1)
    : "";

  useEffect(() => {
    navigation.setOptions({
      headerTitle: prefillMeds ? "Represcribe" : "Create Prescription",
      headerStyle: { backgroundColor: "#095c29" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [genericsRes, brandsRes, diseasesRes] = await Promise.all([
          apiClient.get("/generics"),
          apiClient.get("/brands"),
          fetchDiseases(),
        ]);
        setGenerics(genericsRes.data.data ?? genericsRes.data);
        setBrands(brandsRes.data.data ?? brandsRes.data);
        setDiseases(diseasesRes.data.data ?? diseasesRes.data);
      } catch {
        Alert.alert("Error", "Could not load medications or diseases list.");
      } finally {
        setGenericsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredGenerics = generics.filter((g) =>
    g.generic_name.toLowerCase().includes(genericSearch.toLowerCase())
  );
  const filteredBrands = selectedGeneric
    ? brands.filter((b) => b.generic_id === selectedGeneric.id)
    : [];
  const filteredDiseases = diseases.filter((d) =>
    d.disease_name.toLowerCase().includes(diseaseSearch.toLowerCase())
  );

  // — Medication handlers —
  const openAddModal = () => {
    setEditingKey(null);
    setSelectedGeneric(null); setSelectedBrand(null);
    setDosage(""); setFrequency(""); setDuration(""); setInstructions("");
    setShowCreateGeneric(false); setShowCreateBrand(false);
    setNewGenericName(""); setNewBrandName("");
    setModalVisible(true);
  };

  const openEditModal = (med: MedicationEntry) => {
    setEditingKey(med.key);
    setSelectedGeneric(generics.find((g) => g.id === med.generic_id) ?? null);
    setSelectedBrand(brands.find((b) => b.id === med.brand_id) ?? null);
    setDosage(med.dosage); setFrequency(med.frequency);
    setDuration(med.duration); setInstructions(med.instructions);
    setModalVisible(true);
  };

  const handleSaveMedication = () => {
    if (!selectedGeneric || !selectedBrand) {
      Alert.alert("Missing Fields", "Please select a generic and brand.");
      return;
    }
    if (!dosage.trim() || !frequency.trim() || !duration.trim()) {
      Alert.alert("Missing Fields", "Dosage, frequency, and duration are required.");
      return;
    }
    const entry: MedicationEntry = {
      key: editingKey ?? Date.now().toString(),
      generic_id: selectedGeneric.id,
      brand_id: selectedBrand.id,
      generic_name: selectedGeneric.generic_name,
      brand_name: selectedBrand.brand_name,
      dosage, frequency, duration, instructions,
    };
    if (editingKey) {
      setMedications((prev) => prev.map((m) => m.key === editingKey ? entry : m));
    } else {
      setMedications((prev) => [...prev, entry]);
    }
    setModalVisible(false);
  };

  const handleRemoveMedication = (key: string) => {
    Alert.alert("Remove Medication", "Remove this medication from the prescription?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setMedications((prev) => prev.filter((m) => m.key !== key)) },
    ]);
  };

  const handleCreateGeneric = async () => {
    if (!newGenericName.trim()) { Alert.alert("Missing Field", "Generic name is required."); return; }
    setCreatingGeneric(true);
    try {
      const res = await createGeneric({ generic_name: newGenericName.trim() });
      const created: Generic = { ...res.data.generic, brands: [] };
      setGenerics((prev) => [...prev, created]);
      setSelectedGeneric(created); setSelectedBrand(null);
      setNewGenericName(""); setShowCreateGeneric(false); setGenericPickerVisible(false);
      setBrandPickerVisible(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] || "Could not create generic.";
      Alert.alert("Error", msg);
    } finally { setCreatingGeneric(false); }
  };

  const handleCreateBrand = async () => {
    if (!selectedGeneric) { Alert.alert("Error", "No generic selected."); return; }
    if (!newBrandName.trim()) { Alert.alert("Missing Field", "Brand name is required."); return; }
    setCreatingBrand(true);
    try {
      const res = await createBrand({ generic_id: selectedGeneric.id, brand_name: newBrandName.trim() });
      const created: Brand & { generic_id: number } = { ...res.data.brand, generic_id: selectedGeneric.id };
      setBrands((prev) => [...prev, created]);
      setSelectedBrand(created);
      setNewBrandName(""); setShowCreateBrand(false); setBrandPickerVisible(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] || "Could not create brand.";
      Alert.alert("Error", msg);
    } finally { setCreatingBrand(false); }
  };

  // — Disease handlers —
  const openAddDiseaseModal = () => {
    setEditingDiagnosisKey(null); setSelectedDisease(null);
    setDiagnosisType("primary"); setDiagnosisSymptoms("");
    setDiseaseSearch(""); setShowCreateDisease(false);
    setNewDiseaseName(""); setNewDiseaseDescription(""); setNewDiseaseSymptoms("");
    setDiseaseModalVisible(true);
  };

  const openEditDiseaseModal = (diagnosis: DiagnosisEntry) => {
    setEditingDiagnosisKey(diagnosis.key);
    setSelectedDisease(diseases.find((d) => d.id === diagnosis.disease_id) ?? null);
    setDiagnosisType(diagnosis.type); setDiagnosisSymptoms(diagnosis.symptoms);
    setDiseaseSearch(""); setShowCreateDisease(false);
    setDiseaseModalVisible(true);
  };

  const handleSaveDiagnosis = () => {
    if (!selectedDisease) { Alert.alert("Missing Fields", "Please select a disease."); return; }
    const isDuplicate = diagnoses.some((d) => d.disease_id === selectedDisease.id && d.key !== editingDiagnosisKey);
    if (isDuplicate) { Alert.alert("Duplicate", "This disease has already been added to this consultation."); return; }
    const entry: DiagnosisEntry = {
      key: editingDiagnosisKey ?? Date.now().toString(),
      disease_id: selectedDisease.id,
      disease_name: selectedDisease.disease_name,
      type: diagnosisType,
      symptoms: diagnosisSymptoms,
    };
    if (editingDiagnosisKey) {
      setDiagnoses((prev) => prev.map((d) => d.key === editingDiagnosisKey ? entry : d));
    } else {
      setDiagnoses((prev) => [...prev, entry]);
    }
    setDiseaseModalVisible(false);
  };

  const handleRemoveDiagnosis = (key: string) => {
    Alert.alert("Remove Diagnosis", "Remove this diagnosis from the consultation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setDiagnoses((prev) => prev.filter((d) => d.key !== key)) },
    ]);
  };

  const handleCreateDisease = async () => {
    if (!newDiseaseName.trim()) { Alert.alert("Missing Fields", "Disease name is required."); return; }
    setCreatingDisease(true);
    try {
      const res = await createDisease({
        disease_name: newDiseaseName.trim(),
        description: newDiseaseDescription.trim() || null,
        symptoms: newDiseaseSymptoms.trim() || null,
      });
      const created: Disease = res.data.disease;
      setDiseases((prev) => [...prev, created]);
      setSelectedDisease(created);
      setShowCreateDisease(false);
      setNewDiseaseName(""); setNewDiseaseDescription(""); setNewDiseaseSymptoms("");
      Alert.alert("Success", `"${created.disease_name}" created and selected.`);
    } catch (error: any) {
      const message = error.response?.data?.message || (Object.values(error.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] || "Could not create disease.";
      Alert.alert("Error", message);
    } finally { setCreatingDisease(false); }
  };

  const handleUpdateDiagnosisStatus = async (
    diagnosis: ActiveDiagnosis,
    newStatus: "ongoing" | "treated" | "referred"
  ) => {
    setUpdatingDiagnosisId(diagnosis.diagnosis_id);
    try {
      await apiClient.patch(
        `/diseases/${diagnosis.disease_id}/diagnoses/${diagnosis.diagnosis_id}`,
        { status: newStatus }
      );
      setActiveDiagnoses((prev) =>
        prev.map((d) => d.diagnosis_id === diagnosis.diagnosis_id ? { ...d, status: newStatus as any } : d)
      );
      if (newStatus === "treated") {
        setActiveDiagnoses((prev) => prev.filter((d) => d.diagnosis_id !== diagnosis.diagnosis_id));
      }
      Alert.alert("Updated", `Diagnosis marked as ${newStatus}.`);
    } catch {
      Alert.alert("Error", "Could not update diagnosis status.");
    } finally { setUpdatingDiagnosisId(null); }
  };

  const handleSubmit = async () => {
    if (medications.length === 0) { Alert.alert("No Medications", "Please add at least one medication."); return; }
    if (!activeClinic) { Alert.alert("No Clinic", "No active clinic selected."); return; }

    setIsSubmitting(true);
    try {
      const consultationDate = new Date().toISOString().replace("T", " ").substring(0, 19);
      const payload = {
        patient_id: Number(patientId),
        clinic_id: activeClinic.id,
        consultation_date: consultationDate,
        chief_complaint: chiefComplaint || null,
        notes: notes || null,
        diseases: diagnoses.map((d) => ({
          disease_id: d.disease_id,
          type: d.type,
          status: "ongoing",
          symptoms: d.symptoms || null,
        })),
        prescriptions: medications.map((m) => ({
          generic_id: m.generic_id,
          brand_id: m.brand_id,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions || null,
        })),
      };

      const res = await apiClient.post("/consultations", payload);

      if (queueId) {
        try { await removeFromQueue(Number(queueId)); }
        catch { console.log("queueId param:", queueId); }
      }

      const savedConsultation = res.data.consultation;

      Alert.alert(
        "Consultation Saved",
        "Would you like to print the prescription?",
        [
          { text: "No", style: "cancel", onPress: () => router.back() },
          {
            text: "Yes, Print",
            onPress: async () => {
              try {
                const signedRes = await getPrescriptionPdfSignedUrl(savedConsultation.id);
                await Linking.openURL(signedRes.data.url);
              } catch {
                Alert.alert("Error", "Could not generate prescription PDF.");
              }
              router.back();
            },
          },
        ]
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] || "Failed to save consultation.";
      Alert.alert("Error", message);
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* PATIENT CARD */}
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.patientCard}>
            <View style={styles.patientAvatarCircle}>
              <Text style={styles.patientAvatarText}>
                {(patientName?.split(",")[1]?.trim()[0] ?? "").toUpperCase()}
                {(patientName?.split(",")[0]?.trim()[0] ?? "").toUpperCase()}
              </Text>
            </View>
            <View style={styles.patientCardInfo}>
              <Text style={styles.patientCardCode}>Patient ID: {patientId}</Text>
              <Text style={styles.patientCardName}>{patientName}</Text>

              {/* Gender & Age */}
              <Text style={styles.patientCardSub}>
                {capitalizedGender}{age !== null ? ` • ${age} years old` : ""}
              </Text>

              {/* Height & Weight */}
              {(patientHeight || patientWeight) ? (
                <Text style={styles.patientCardSub}>
                  {patientHeight ? `📏 ${patientHeight} cm` : ""}
                  {patientHeight && patientWeight ? "  " : ""}
                  {patientWeight ? `⚖️ ${patientWeight} kg` : ""}
                </Text>
              ) : null}

              {/* Temp & BP */}
              {(patientTemperature || patientBloodPressure) ? (
                <Text style={styles.patientCardSub}>
                  {patientTemperature ? `🌡 ${patientTemperature} °C` : ""}
                  {patientTemperature && patientBloodPressure ? "  " : ""}
                  {patientBloodPressure ? `💉 ${patientBloodPressure} mmHg` : ""}
                </Text>
              ) : null}

              {/* Allergies warning */}
              {patientAllergies ? (
                <View style={{
                  marginTop: 8,
                  backgroundColor: "#fef9c3",
                  borderRadius: 6,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: "#fde68a",
                }}>
                  <Text style={{ fontSize: 12, color: "#92400e", fontWeight: "600" }}>
                    ⚠️ Allergies: {patientAllergies}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* CHIEF COMPLAINT */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Chief Complaint</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => openFloating("chiefComplaint")}>
            <TextInput
              style={styles.textArea}
              value={chiefComplaint}
              placeholder="e.g. Fever and headache for 3 days"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {/* ACTIVE DIAGNOSES */}
          {activeDiagnoses.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Active Diagnoses</Text>
              <Text style={styles.sectionSubtitle}>
                From previous consultations. Update status if condition has changed.
              </Text>
              {activeDiagnoses.map((diag) => (
                <View key={diag.diagnosis_id} style={styles.activeDiagCard}>
                  <View style={styles.activeDiagHeader}>
                    <Text style={styles.activeDiagName}>{diag.disease_name}</Text>
                    <View style={[
                      styles.statusBadge,
                      diag.status === "ongoing" ? styles.statusOngoing : styles.statusReferred,
                    ]}>
                      <Text style={styles.statusBadgeText}>{diag.status}</Text>
                    </View>
                  </View>
                  {diag.symptoms ? (
                    <Text style={styles.activeDiagSymptoms}>{diag.symptoms}</Text>
                  ) : null}
                  <Text style={styles.activeDiagType}>
                    {diag.type.charAt(0).toUpperCase() + diag.type.slice(1)} diagnosis
                  </Text>
                  <View style={styles.diagStatusRow}>
                    {diag.status !== "treated" && (
                      <TouchableOpacity
                        style={styles.diagStatusBtn}
                        disabled={updatingDiagnosisId === diag.diagnosis_id}
                        onPress={() => handleUpdateDiagnosisStatus(diag, "treated")}
                      >
                        {updatingDiagnosisId === diag.diagnosis_id
                          ? <ActivityIndicator size="small" color="#095c29" />
                          : <Text style={styles.diagStatusBtnText}>✓ Treated</Text>
                        }
                      </TouchableOpacity>
                    )}
                    {diag.status !== "referred" && (
                      <TouchableOpacity
                        style={[styles.diagStatusBtn, styles.diagStatusBtnSecondary]}
                        disabled={updatingDiagnosisId === diag.diagnosis_id}
                        onPress={() => handleUpdateDiagnosisStatus(diag, "referred")}
                      >
                        <Text style={[styles.diagStatusBtnText, styles.diagStatusBtnTextSecondary]}>
                          → Refer
                        </Text>
                      </TouchableOpacity>
                    )}
                    {diag.status === "referred" && (
                      <TouchableOpacity
                        style={[styles.diagStatusBtn, { borderColor: "#64748b" }]}
                        disabled={updatingDiagnosisId === diag.diagnosis_id}
                        onPress={() => handleUpdateDiagnosisStatus(diag, "ongoing")}
                      >
                        <Text style={[styles.diagStatusBtnText, { color: "#64748b" }]}>
                          ↩ Ongoing
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </>
          )}

          {/* NEW DIAGNOSES */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Diagnoses <Text style={styles.optionalTag}>(Optional)</Text>
          </Text>
          {diagnoses.length === 0 ? (
            <View style={styles.emptyMedBox}>
              <Text style={styles.emptyMedText}>No diagnoses added yet.</Text>
            </View>
          ) : (
            diagnoses.map((diag) => (
              <View key={diag.key} style={styles.medCard}>
                <View style={styles.activeDiagHeader}>
                  <Text style={styles.medBrandName}>{diag.disease_name}</Text>
                  <View style={[styles.statusBadge, styles.statusOngoing]}>
                    <Text style={styles.statusBadgeText}>{diag.type}</Text>
                  </View>
                </View>
                {diag.symptoms ? (
                  <Text style={styles.medGenericName}>{diag.symptoms}</Text>
                ) : null}
                <View style={styles.medActionRow}>
                  <TouchableOpacity style={styles.changeBtn} onPress={() => openEditDiseaseModal(diag)}>
                    <Text style={styles.changeBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveDiagnosis(diag.key)}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addMedBtn} onPress={openAddDiseaseModal} activeOpacity={0.8}>
            <Text style={styles.addMedBtnText}>+ ADD DIAGNOSIS</Text>
          </TouchableOpacity>

          {/* MEDICATIONS */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Medications</Text>
          {genericsLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#095c29" />
              <Text style={styles.loadingText}>Loading medications...</Text>
            </View>
          ) : medications.length === 0 ? (
            <View style={styles.emptyMedBox}>
              <Text style={styles.emptyMedText}>No medications added yet.</Text>
            </View>
          ) : (
            medications.map((med) => (
              <View key={med.key} style={styles.medCard}>
                <Text style={styles.medBrandName}>{med.brand_name}</Text>
                <Text style={styles.medGenericName}>{med.generic_name}</Text>
                <Text style={styles.medDetail}>
                  {med.dosage} — {med.frequency} for {med.duration}
                </Text>
                {med.instructions ? (
                  <Text style={styles.medInstructions}>📝 {med.instructions}</Text>
                ) : null}
                <View style={styles.medActionRow}>
                  <TouchableOpacity style={styles.changeBtn} onPress={() => openEditModal(med)}>
                    <Text style={styles.changeBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveMedication(med.key)}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          {!genericsLoading && (
            <TouchableOpacity style={styles.addMedBtn} onPress={openAddModal} activeOpacity={0.8}>
              <Text style={styles.addMedBtnText}>+ ADD MEDICATION</Text>
            </TouchableOpacity>
          )}

          {/* NOTES */}
          <Text style={styles.notesLabel}>Notes</Text>
          <TouchableOpacity activeOpacity={1} onPress={() => openFloating("notes")}>
            <TextInput
              style={styles.textArea}
              value={notes}
              placeholder="Add clinical notes here..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </ScrollView>

        {/* SUBMIT */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { backgroundColor: "#82b27a" }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? "SAVING..." : "SAVE CONSULTATION"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ADD / EDIT MEDICATION MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editingKey ? "Edit Medication" : "Add Medication"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalFieldLabel}>Generic Name *</Text>
              <TouchableOpacity
                style={styles.selectorBtn}
                onPress={() => setGenericPickerVisible(true)}
              >
                <Text style={selectedGeneric ? styles.selectorBtnText : styles.selectorBtnPlaceholder}>
                  {selectedGeneric ? selectedGeneric.generic_name : "Select a generic..."}
                </Text>
                <Text style={styles.selectorChevron}>▾</Text>
              </TouchableOpacity>

              <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>Brand Name *</Text>
              <TouchableOpacity
                style={[styles.selectorBtn, !selectedGeneric && styles.selectorBtnDisabled]}
                onPress={() => selectedGeneric && setBrandPickerVisible(true)}
                activeOpacity={selectedGeneric ? 0.75 : 1}
              >
                <Text style={selectedBrand ? styles.selectorBtnText : styles.selectorBtnPlaceholder}>
                  {selectedBrand
                    ? selectedBrand.brand_name
                    : selectedGeneric
                    ? "Select a brand..."
                    : "Pick a generic first"}
                </Text>
                <Text style={styles.selectorChevron}>▾</Text>
              </TouchableOpacity>

              <ModalField label="Dosage *" value={dosage} placeholder="e.g. 500mg" onPress={() => openFloating("dosage")} />
              <ModalField label="Frequency *" value={frequency} placeholder="e.g. 3x a day" onPress={() => openFloating("frequency")} />
              <ModalField label="Duration *" value={duration} placeholder="e.g. 7 days" onPress={() => openFloating("duration")} />
              <ModalField label="Instructions (optional)" value={instructions} placeholder="e.g. Take after meals" onPress={() => openFloating("instructions")} />
            </ScrollView>
            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveMedication}>
              <Text style={styles.modalSaveBtnText}>Save Medication</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* GENERIC PICKER */}
      <Modal
        visible={genericPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setGenericPickerVisible(false);
          setShowCreateGeneric(false);
          setNewGenericName("");
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setGenericPickerVisible(false);
            setShowCreateGeneric(false);
            setNewGenericName("");
          }}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            {!showCreateGeneric ? (
              <>
                <Text style={styles.modalTitle}>Select Generic</Text>
                <TextInput
                  style={styles.pickerSearch}
                  placeholder="Search generics..."
                  placeholderTextColor="#94a3b8"
                  value={genericSearch}
                  onChangeText={setGenericSearch}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                  {filteredGenerics.length === 0 ? (
                    <Text style={styles.emptyMedText}>No generics found.</Text>
                  ) : (
                    filteredGenerics.map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        style={[styles.pickerItem, selectedGeneric?.id === g.id && styles.pickerItemSelected]}
                        onPress={() => {
                          setSelectedGeneric(g); setSelectedBrand(null);
                          setGenericSearch(""); setGenericPickerVisible(false);
                          setBrandPickerVisible(true);
                        }}
                      >
                        <Text style={[styles.pickerItemText, selectedGeneric?.id === g.id && styles.pickerItemTextSelected]}>
                          {g.generic_name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.modalSaveBtn, { backgroundColor: "#f0fdf4", marginTop: 12 }]}
                  onPress={() => { setGenericSearch(""); setShowCreateGeneric(true); }}
                >
                  <Text style={[styles.modalSaveBtnText, { color: "#095c29" }]}>
                    + Create New Generic
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.createDiseaseHeader}>
                  <Text style={styles.modalTitle}>New Generic</Text>
                  <TouchableOpacity onPress={() => { setShowCreateGeneric(false); setNewGenericName(""); }}>
                    <Text style={styles.cancelCreateText}>← Back</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalFieldLabel}>Generic Name *</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => openFloating("newGenericName")}>
                  <TextInput
                    style={styles.modalFieldInput}
                    value={newGenericName}
                    placeholder="e.g. Paracetamol"
                    placeholderTextColor="#94a3b8"
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSaveBtn, { marginTop: 16 }, creatingGeneric && { opacity: 0.6 }]}
                  onPress={handleCreateGeneric}
                  disabled={creatingGeneric}
                >
                  <Text style={styles.modalSaveBtnText}>
                    {creatingGeneric ? "Creating..." : "Create Generic"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* BRAND PICKER */}
      <Modal
        visible={brandPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setBrandPickerVisible(false);
          setShowCreateBrand(false);
          setNewBrandName("");
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setBrandPickerVisible(false);
            setShowCreateBrand(false);
            setNewBrandName("");
          }}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            {!showCreateBrand ? (
              <>
                <Text style={styles.modalTitle}>Select Brand</Text>
                <Text style={styles.pickerSubtitle}>
                  Brands for: {selectedGeneric?.generic_name}
                </Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                  {filteredBrands.length === 0 ? (
                    <Text style={styles.emptyMedText}>No brands found for this generic.</Text>
                  ) : (
                    filteredBrands.map((b) => (
                      <TouchableOpacity
                        key={b.id}
                        style={[styles.pickerItem, selectedBrand?.id === b.id && styles.pickerItemSelected]}
                        onPress={() => { setSelectedBrand(b); setBrandPickerVisible(false); }}
                      >
                        <Text style={[styles.pickerItemText, selectedBrand?.id === b.id && styles.pickerItemTextSelected]}>
                          {b.brand_name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.modalSaveBtn, { backgroundColor: "#f0fdf4", marginTop: 12 }]}
                  onPress={() => setShowCreateBrand(true)}
                >
                  <Text style={[styles.modalSaveBtnText, { color: "#095c29" }]}>
                    + Create New Brand
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.createDiseaseHeader}>
                  <Text style={styles.modalTitle}>New Brand</Text>
                  <TouchableOpacity onPress={() => { setShowCreateBrand(false); setNewBrandName(""); }}>
                    <Text style={styles.cancelCreateText}>← Back</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalFieldLabel}>Generic: {selectedGeneric?.generic_name}</Text>
                <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>Brand Name *</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => openFloating("newBrandName")}>
                  <TextInput
                    style={styles.modalFieldInput}
                    value={newBrandName}
                    placeholder="e.g. Biogesic"
                    placeholderTextColor="#94a3b8"
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSaveBtn, { marginTop: 16 }, creatingBrand && { opacity: 0.6 }]}
                  onPress={handleCreateBrand}
                  disabled={creatingBrand}
                >
                  <Text style={styles.modalSaveBtnText}>
                    {creatingBrand ? "Creating..." : "Create Brand & Select"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* DISEASE PICKER MODAL */}
      <Modal
        visible={diseaseModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDiseaseModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDiseaseModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editingDiagnosisKey ? "Edit Diagnosis" : "Add Diagnosis"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {!showCreateDisease ? (
                <>
                  <Text style={styles.modalFieldLabel}>Disease *</Text>
                  <TextInput
                    style={styles.pickerSearch}
                    placeholder="Search diseases..."
                    placeholderTextColor="#94a3b8"
                    value={diseaseSearch}
                    onChangeText={setDiseaseSearch}
                  />
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 180 }}
                    nestedScrollEnabled
                  >
                    {filteredDiseases.length === 0 ? (
                      <Text style={styles.emptyMedText}>No diseases found.</Text>
                    ) : (
                      filteredDiseases.map((d) => (
                        <TouchableOpacity
                          key={d.id}
                          style={[styles.pickerItem, selectedDisease?.id === d.id && styles.pickerItemSelected]}
                          onPress={() => setSelectedDisease(d)}
                        >
                          <Text style={[styles.pickerItemText, selectedDisease?.id === d.id && styles.pickerItemTextSelected]}>
                            {d.disease_name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.createDiseaseLink}
                    onPress={() => setShowCreateDisease(true)}
                  >
                    <Text style={styles.createDiseaseLinkText}>+ Create new disease</Text>
                  </TouchableOpacity>
                  <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>Diagnosis Type *</Text>
                  <View style={styles.typeRow}>
                    {(["primary", "secondary"] as const).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.typeBtn, diagnosisType === t && styles.typeBtnActive]}
                        onPress={() => setDiagnosisType(t)}
                      >
                        <Text style={[styles.typeBtnText, diagnosisType === t && styles.typeBtnTextActive]}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={[styles.modalFieldLabel, { marginTop: 14 }]}>Symptoms (optional)</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => openFloating("diagnosisSymptoms")}>
                    <TextInput
                      style={[styles.modalFieldInput, { height: 80 }]}
                      value={diagnosisSymptoms}
                      placeholder="e.g. High fever, productive cough"
                      placeholderTextColor="#94a3b8"
                      multiline
                      textAlignVertical="top"
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.createDiseaseHeader}>
                    <Text style={styles.modalTitle}>New Disease</Text>
                    <TouchableOpacity onPress={() => setShowCreateDisease(false)}>
                      <Text style={styles.cancelCreateText}>← Back</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalFieldLabel}>Disease Name *</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => openFloating("newDiseaseName")}>
                    <TextInput
                      style={styles.modalFieldInput}
                      value={newDiseaseName}
                      placeholder="e.g. Pneumonia"
                      placeholderTextColor="#94a3b8"
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>Description (optional)</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => openFloating("newDiseaseDescription")}>
                    <TextInput
                      style={[styles.modalFieldInput, { height: 70 }]}
                      value={newDiseaseDescription}
                      placeholder="Brief description of the disease"
                      placeholderTextColor="#94a3b8"
                      multiline
                      textAlignVertical="top"
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>General Symptoms (optional)</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => openFloating("newDiseaseSymptoms")}>
                    <TextInput
                      style={[styles.modalFieldInput, { height: 70 }]}
                      value={newDiseaseSymptoms}
                      placeholder="e.g. Fever, cough, fatigue"
                      placeholderTextColor="#94a3b8"
                      multiline
                      textAlignVertical="top"
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalSaveBtn, creatingDisease && { opacity: 0.6 }]}
                    onPress={handleCreateDisease}
                    disabled={creatingDisease}
                  >
                    <Text style={styles.modalSaveBtnText}>
                      {creatingDisease ? "Creating..." : "Create Disease"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
            {!showCreateDisease && (
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveDiagnosis}>
                <Text style={styles.modalSaveBtnText}>Save Diagnosis</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* FLOATING FIELD EDITOR — shared by Chief Complaint, Notes, Medication
          fields, Diagnosis Symptoms, and the "create new" sub-forms */}
      <Modal
        visible={activeField !== null}
        transparent
        animationType="none"
        onRequestClose={dismissFloating}
        onShow={() => {
          setTimeout(() => {
            floatingRef.current?.focus();
          }, 100);
        }}
      >
        <TouchableWithoutFeedback onPress={dismissFloating}>
          <View style={styles.floatingBackdrop} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.floatingModalContainer}
        >
          <View style={styles.floatingBar}>
            <Text style={styles.floatingLabel}>{activeFieldConfig?.label}</Text>
            <View
              style={[
                styles.floatingInputRow,
                activeFieldConfig?.multiline && styles.floatingInputRowMultiline,
              ]}
            >
              <TextInput
                ref={floatingRef}
                value={floatingValue}
                onChangeText={setFloatingValue}
                onSubmitEditing={activeFieldConfig?.multiline ? undefined : dismissFloating}
                autoCapitalize="sentences"
                multiline={activeFieldConfig?.multiline}
                style={[
                  styles.floatingDisplayText,
                  activeFieldConfig?.multiline && styles.floatingDisplayTextMultiline,
                ]}
              />
              <TouchableOpacity style={styles.floatingSubmitBtn} onPress={dismissFloating}>
                <Text style={styles.floatingSubmitIcon}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const ModalField = ({
  label, value, onPress, placeholder,
}: {
  label: string;
  value: string;
  onPress: () => void;
  placeholder: string;
}) => (
  <View style={styles.modalFieldWrapper}>
    <Text style={styles.modalFieldLabel}>{label}</Text>
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <TextInput
        style={styles.modalFieldInput}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
  </View>
);