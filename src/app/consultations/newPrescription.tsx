import { fetchPatientConsultations } from "@/api/consultation";
import { createPatient, fetchPatientById, fetchPatients } from "@/api/patient";
import { useAuth } from "@/components/context/auth-context";
import { newPrescriptionStyles as styles } from "@/styles/newPrescriptionStyles";
import { calculateAge } from "@/utils/age";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, BackHandler, Keyboard, KeyboardAvoidingView, Modal, Platform,
  RefreshControl, ScrollView, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View,
} from "react-native";

type PatientRecord = {
  id: number;
  last_name: string;
  first_name: string;
  gender: string;
  birthdate: string;
  email: string;
  phone_number: string;
  temperature?: string;
  blood_pressure?: string;
  height?: string;
  weight?: string;
  allergies?: string;
};

// Keys for every text field editable via the floating tap-to-edit bar.
type FloatingFieldKey =
  | "search" | "lastName" | "firstName" | "height" | "weight"
  | "temp" | "bp" | "allergies" | "email" | "mobileNumber";

export default function NewPrescriptionScreen() {
  const router = useRouter();
  const { activeClinic } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");
  const [birthdate, setBirthdate] = useState("");
  const [civilStatus, setCivilStatus] = useState<"Single" | "Married" | "Divorced" | "Separated" | "Widowed" | "Minor">("Single");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [temp, setTemp] = useState("");
  const [bp, setBp] = useState("");
  const [allergies, setAllergies] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());

  // ─── Floating tap-to-edit bar (mirrors LoginScreen / current-queue pattern) ─
  const [activeField, setActiveField] = useState<FloatingFieldKey | null>(null);
  const [floatingValue, setFloatingValue] = useState("");
  const floatingRef = useRef<TextInput>(null);

  const fieldConfig: Record<
    FloatingFieldKey,
    {
      label: string;
      value: string;
      setValue: (v: string) => void;
      keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad" | "number-pad";
      autoCapitalize?: "none" | "words" | "sentences";
      multiline?: boolean;
    }
  > = {
    search: { label: "Search Patients", value: searchQuery, setValue: setSearchQuery, autoCapitalize: "none" },
    lastName: { label: "Last Name", value: lastName, setValue: setLastName, autoCapitalize: "words" },
    firstName: { label: "First Name", value: firstName, setValue: setFirstName, autoCapitalize: "words" },
    height: { label: "Height (cm)", value: height, setValue: setHeight, keyboardType: "numeric" },
    weight: { label: "Weight (kg)", value: weight, setValue: setWeight, keyboardType: "numeric" },
    temp: { label: "Temp (°C)", value: temp, setValue: setTemp, keyboardType: "decimal-pad" },
    bp: { label: "Blood Pressure", value: bp, setValue: setBp },
    allergies: { label: "Allergies", value: allergies, setValue: setAllergies, multiline: true },
    email: { label: "Patient's Email Address", value: email, setValue: setEmail, keyboardType: "email-address", autoCapitalize: "none" },
    mobileNumber: { label: "Mobile Number (+63)", value: mobileNumber, setValue: setMobileNumber, keyboardType: "number-pad" },
  };

  const openFloating = (key: FloatingFieldKey) => {
    setFloatingValue(fieldConfig[key].value);
    setActiveField(key);
  };

  const dismissFloating = () => {
    if (activeField) {
      fieldConfig[activeField].setValue(floatingValue);
    }
    setActiveField(null);
    Keyboard.dismiss();
  };

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
  // ─────────────────────────────────────────────────────────────────────────

  const loadPatients = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetchPatients();
      const allPatients: PatientRecord[] = res.data.data ?? res.data;

      const consultationChecks = await Promise.all(
        allPatients.map(async (p) => {
          try {
            const cRes = await fetchPatientConsultations(p.id);
            const consultations = cRes.data.data ?? [];
            return consultations.length === 0 ? p : null;
          } catch {
            return p;
          }
        })
      );

      setPatients(consultationChecks.filter((p): p is PatientRecord => p !== null));
    } catch {
      Alert.alert("Error", "Could not load patients.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const displayedPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return patients
      .filter((p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q)
      )
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
  }, [patients, searchQuery]);

  const resetForm = () => {
    setLastName(""); setFirstName(""); setGender("Female");
    setBirthdate(""); setDateValue(new Date());
    setCivilStatus("Single"); setHeight(""); setWeight("");
    setTemp(""); setBp(""); setAllergies("");
    setEmail(""); setMobileNumber("");
  };

  const openCreateForm = () => {
    resetForm();
    setIsCreating(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateValue(selectedDate);
      setBirthdate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleSaveRecord = async () => {
    if (!lastName.trim() || !firstName.trim() || !birthdate.trim()) {
      Alert.alert("Missing Fields", "Please complete the patient's name and birthdate.");
      return;
    }
    if (!activeClinic) {
      Alert.alert("No Clinic Selected", "Please select a clinic first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createPatient({
        last_name: lastName,
        first_name: firstName,
        gender: gender.toLowerCase(),
        birthdate,
        email,
        phone_number: mobileNumber,
        civil_status: civilStatus.toLowerCase(),
        height,
        weight,
        allergies,
        temperature: temp,
        blood_pressure: bp,
        clinic_id: activeClinic.id,
      });
      const newPatient = response.data.patient;

      router.replace({
        pathname: "/consultations/createPrescription",
        params: {
          patientId: newPatient.id.toString(),
          patientName: `${newPatient.last_name}, ${newPatient.first_name}`,
          patientGender: newPatient.gender,
          patientBirthdate: newPatient.birthdate,
          patientTemperature: newPatient.temperature ?? "",
          patientBloodPressure: newPatient.blood_pressure ?? "",
          patientHeight: newPatient.height ?? "",
          patientWeight: newPatient.weight ?? "",
          patientAllergies: newPatient.allergies ?? "",
        },
      });
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || "Failed to save patient record.";
      Alert.alert("Error", serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPatient = async (patient: PatientRecord) => {
    try {
      // Fetch full patient record to get vitals
      const patientRes = await fetchPatientById(patient.id);
      const fullPatient = patientRes.data.data ?? patientRes.data;

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
        },
      });
    } catch {
      Alert.alert("Error", "Could not load patient details.");
    }
  };

  // Shared floating bar Modal — rendered once, used by every editable field
  // across both the patient list (search) and the create-patient form.
  const renderFloatingBarModal = () => (
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
        style={styles.modalContainer}
      >
        <View style={styles.floatingBar}>
          <Text style={styles.floatingLabel}>
            {activeField ? fieldConfig[activeField].label : ""}
          </Text>
          <View
            style={[
              styles.floatingInputRow,
              activeField && fieldConfig[activeField].multiline
                ? { minHeight: 90, alignItems: "flex-start", paddingVertical: 10 }
                : null,
            ]}
          >
            <TextInput
              ref={floatingRef}
              value={floatingValue}
              onChangeText={setFloatingValue}
              onSubmitEditing={activeField && fieldConfig[activeField].multiline ? undefined : dismissFloating}
              autoCapitalize={activeField ? fieldConfig[activeField].autoCapitalize ?? "sentences" : "sentences"}
              keyboardType={activeField ? fieldConfig[activeField].keyboardType ?? "default" : "default"}
              multiline={activeField ? fieldConfig[activeField].multiline : false}
              style={styles.floatingDisplayText}
            />
            <TouchableOpacity style={styles.floatingSubmitBtn} onPress={dismissFloating}>
              <Text style={styles.floatingSubmitIcon}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // Small helper so every "tap to edit" field looks/behaves the same way.
  const renderTapField = (
    key: FloatingFieldKey,
    inputStyle: any,
    placeholder: string
  ) => (
    <TouchableOpacity activeOpacity={1} onPress={() => openFloating(key)} style={{ flex: 1 }}>
      <TextInput
        style={inputStyle}
        value={fieldConfig[key].value}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        editable={false}
        pointerEvents="none"
        multiline={fieldConfig[key].multiline}
      />
    </TouchableOpacity>
  );

  // --- VIEW RENDER 1: Patient List ---
  if (!isCreating) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadPatients(true)}
              tintColor="#095c29"
            />
          }
        >
          <View style={styles.searchBarWrapper}>
            {renderTapField("search", styles.searchBarInput, "Search patients by name...")}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtnClick}>
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.listHeaderRow}>
            <Text style={styles.promptHeadline}>
              New Patients{" "}
              <Text style={styles.patientCount}>({displayedPatients.length})</Text>
            </Text>
            <TouchableOpacity style={styles.addPatientBtn} onPress={openCreateForm}>
              <Text style={styles.addPatientBtnText}>+ Add Patient</Text>
            </TouchableOpacity>
          </View>

          {displayedPatients.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery ? "No patients match your search." : "No new patients found."}
            </Text>
          ) : (
            displayedPatients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => handleSelectPatient(patient)}
                activeOpacity={0.75}
              >
                <View style={styles.cardInfoGroup}>
                  <Text style={styles.cardNameText}>
                    {patient.last_name}, {patient.first_name}
                  </Text>
                  <Text style={styles.cardSubDetails}>
                    {patient.gender
                      ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                      : "—"}{" "}
                    • DOB: {patient.birthdate}
                    {patient.birthdate ? ` • Age: ${calculateAge(patient.birthdate)}` : ""}
                  </Text>
                  {patient.phone_number ? (
                    <Text style={styles.cardSubDetails}>📱 +63 {patient.phone_number}</Text>
                  ) : null}
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {renderFloatingBarModal()}
      </View>
    );
  }

  // --- VIEW RENDER 2: Create Patient Form ---
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.promptHeadline}>Input the details of your patient</Text>

        {/* Last Name */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Last Name</Text>
          <View style={styles.inputContainerRow}>
            {renderTapField("lastName", styles.fieldInput, "Enter last name")}
            {lastName.length > 0 && (
              <TouchableOpacity onPress={() => setLastName("")} style={styles.clearBtnClick}>
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* First Name */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>First Name</Text>
          <View style={styles.inputContainerRow}>
            {renderTapField("firstName", styles.fieldInput, "Enter first name")}
            {firstName.length > 0 && (
              <TouchableOpacity onPress={() => setFirstName("")} style={styles.clearBtnClick}>
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Gender */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Gender</Text>
          <View style={styles.radioFlexContainer}>
            <TouchableOpacity style={styles.radioButtonOption} onPress={() => setGender("Male")}>
              <View style={[styles.outerRadioRing, gender === "Male" && styles.activeOuterRing]}>
                {gender === "Male" && <View style={styles.innerRadioDot} />}
              </View>
              <Text style={styles.radioOptionLabelText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioButtonOption} onPress={() => setGender("Female")}>
              <View style={[styles.outerRadioRing, gender === "Female" && styles.activeOuterRing]}>
                {gender === "Female" && <View style={styles.innerRadioDot} />}
              </View>
              <Text style={styles.radioOptionLabelText}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Birthdate (unchanged — native date picker, not the keyboard) */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Birthdate</Text>
          <TouchableOpacity style={styles.inputContainerRow} onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.fieldInput}
              value={birthdate}
              placeholder="Select patient birthdate"
              placeholderTextColor="#94a3b8"
              editable={false}
              pointerEvents="none"
            />
            <Text style={styles.calendarInlineIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Age — auto calculated */}
        {birthdate ? (
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Age</Text>
            <View style={[styles.inputContainerRow, { backgroundColor: "#f8fafc" }]}>
              <TextInput
                style={[styles.fieldInput, { color: "#64748b" }]}
                value={`${calculateAge(birthdate)} years old`}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </View>
        ) : null}

        {/* Civil Status */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Civil Status</Text>
          <View style={styles.civilStatusRow}>
            {(["Single", "Married", "Divorced", "Separated", "Widowed", "Minor"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.civilStatusPill,
                  civilStatus === status ? styles.civilStatusPillActive : styles.civilStatusPillInactive,
                ]}
                onPress={() => setCivilStatus(status)}
              >
                <Text style={civilStatus === status ? styles.civilStatusPillTextActive : styles.civilStatusPillTextInactive}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Height & Weight */}
        <View style={styles.fieldRowSplit}>
          <View style={[styles.fieldWrapper, styles.fieldRowSplitItem]}>
            <Text style={styles.fieldLabelText}>Height (cm)</Text>
            <View style={styles.inputContainerRow}>
              {renderTapField("height", styles.fieldInput, "e.g. 170")}
            </View>
          </View>
          <View style={[styles.fieldWrapper, styles.fieldRowSplitItem]}>
            <Text style={styles.fieldLabelText}>Weight (kg)</Text>
            <View style={styles.inputContainerRow}>
              {renderTapField("weight", styles.fieldInput, "e.g. 70")}
            </View>
          </View>
        </View>

        {/* Temp & BP */}
        <View style={styles.fieldRowSplit}>
          <View style={[styles.fieldWrapper, styles.fieldRowSplitItem]}>
            <Text style={styles.fieldLabelText}>Temp (°C)</Text>
            <View style={styles.inputContainerRow}>
              {renderTapField("temp", styles.fieldInput, "36.5")}
            </View>
          </View>
          <View style={[styles.fieldWrapper, styles.fieldRowSplitItem]}>
            <Text style={styles.fieldLabelText}>Blood Pressure</Text>
            <View style={styles.inputContainerRow}>
              {renderTapField("bp", styles.fieldInput, "120/80")}
            </View>
          </View>
        </View>

        {/* Allergies */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Allergies</Text>
          {renderTapField(
            "allergies",
            [styles.fieldInput, styles.allergiesInput],
            "List any allergies or type 'None'..."
          )}
        </View>

        {/* Email */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Patient's Email Address</Text>
          <View style={styles.inputContainerRow}>
            {renderTapField("email", styles.fieldInput, "example@email.com")}
          </View>
        </View>

        {/* Mobile Number */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Mobile Number</Text>
          <View style={styles.phoneInputLayoutGroup}>
            <View style={styles.countryCodeBadgePlate}>
              <Text style={styles.countryCodeBadgeLabel}>+63</Text>
            </View>
            {renderTapField("mobileNumber", styles.phoneNumberNativeInput, "917 123 4567")}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoAlertContainerBox}>
          <Text style={styles.infoBadgeIndicatorIcon}>ⓘ</Text>
          <View style={styles.infoAlertContentBodyTextGroup}>
            <Text style={styles.infoAlertMessageTextInline}>
              We will send a copy of the prescription to your patient's email or mobile number.
            </Text>
            <Text style={styles.infoAlertSubtextInline}>
              If unavailable, you may still continue to create a prescription and use other sharing options.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActionBarWrapper}>
        <TouchableOpacity
          style={[styles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
          onPress={handleSaveRecord}
          disabled={isSubmitting}
        >
          <Text style={styles.nextActionButtonLabelText}>
            {isSubmitting ? "SAVING..." : "SAVE RECORD"}
          </Text>
        </TouchableOpacity>
      </View>

      {renderFloatingBarModal()}
    </View>
  );
}