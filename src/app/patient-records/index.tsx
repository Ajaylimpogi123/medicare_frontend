import { fetchPatientConsultations } from "@/api/consultation";
import { deletePatient, fetchPatients, updatePatient } from "@/api/patient";
import { useAuth } from "@/components/context/auth-context";
import { patientRecordsStyles as styles } from "@/styles/patientRecordsStyles";
import { calculateAge } from "@/utils/age";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert, Platform, RefreshControl, ScrollView,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";

type PatientRecord = {
  id: number;
  lastName: string;
  firstName: string;
  gender: "Male" | "Female";
  birthdate: string;
  email: string;
  mobileNumber: string;
  created_at: string;
};

export default function PatientRecordsScreen() {
  const { user, activeClinic } = useAuth();
  const router = useRouter();

  const isDoctor = user?.role === "doctor";

  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [patientDatabase, setPatientDatabase] = useState<PatientRecord[]>([]);
  const [patientStatusMap, setPatientStatusMap] = useState<Record<number, "new" | "old">>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [civilStatus, setCivilStatus] = useState<"Single" | "Married" | "Divorced" | "Separated" | "Widowed" | "Minor">("Single");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [temp, setTemp] = useState("");
  const [bp, setBp] = useState("");

  const loadPatients = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const response = await fetchPatients();
      const apiData = response.data.data || [];
      const formattedData = apiData.map((p: any) => ({
        id: p.id,
        lastName: p.last_name,
        firstName: p.first_name,
        gender: p.gender
          ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) as "Male" | "Female"
          : "Female",
        birthdate: p.birthdate,
        email: p.email ?? "",
        mobileNumber: p.phone_number ?? "",
        created_at: p.created_at,
      }));
      setPatientDatabase(formattedData);

      const statusEntries = await Promise.all(
        formattedData.map(async (p: PatientRecord) => {
          try {
            const cRes = await fetchPatientConsultations(p.id);
            const consultations = cRes.data.data ?? [];
            return [p.id, consultations.length > 0 ? "old" : "new"] as const;
          } catch {
            return [p.id, "new"] as const;
          }
        })
      );
      setPatientStatusMap(Object.fromEntries(statusEntries));
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert("Network Error", "Could not load patients. Check your connection.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) loadPatients();
  }, [user]);

  const displayedPatients = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return patientDatabase
      .filter((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        `${p.lastName} ${p.firstName}`.toLowerCase().includes(q)
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [patientDatabase, searchQuery]);

  const openEditForm = (patient: PatientRecord) => {
    setLastName(patient.lastName);
    setFirstName(patient.firstName);
    setGender(patient.gender);
    setBirthdate(patient.birthdate);
    setEmail(patient.email);
    setMobileNumber(patient.mobileNumber);
    const parsedDate = Date.parse(patient.birthdate);
    setDateValue(!isNaN(parsedDate) ? new Date(parsedDate) : new Date());
    setCivilStatus("Single"); setHeight(""); setWeight(""); setAllergies("");
    setTemp(""); setBp("");
    setEditingPatientId(patient.id);
    setIsEditing(true);
  };

  const handleClearField = (field: "lastName" | "firstName") => {
    if (field === "lastName") setLastName("");
    if (field === "firstName") setFirstName("");
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateValue(selectedDate);
      setBirthdate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleSaveEdit = async () => {
    if (!lastName.trim() || !firstName.trim() || !birthdate.trim()) {
      Alert.alert("Missing Fields", "Please complete the patient's name and birthdate.");
      return;
    }
    if (!activeClinic) {
      Alert.alert("No Clinic Selected", "Please select a clinic before saving.");
      return;
    }
    if (!editingPatientId) return;

    setIsSubmitting(true);
    const payload = {
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
      clinic_id: activeClinic?.id,
    };

    try {
      await updatePatient(editingPatientId, payload);
      Alert.alert("Success", `Patient data for ${firstName} ${lastName} has been updated.`, [
        { text: "OK", onPress: () => { setIsEditing(false); loadPatients(); } },
      ]);
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message ||
        (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] ||
        "Failed to communicate with the server.";
      Alert.alert("Submission Error", serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = (patientId: number, name: string) => {
    Alert.alert(
      "Delete Patient",
      `Are you sure you want to permanently remove the file records for ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              await deletePatient(patientId);
              await loadPatients();
            } catch {
              Alert.alert("Error", "Could not delete patient. Please try again.");
            }
          },
        },
      ]
    );
  };

  // --- VIEW RENDER 1: Edit Form ---
  if (isEditing) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.promptHeadline}>Edit Patient Details</Text>

          {/* Last Name */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Last Name</Text>
            <View style={styles.inputContainerRow}>
              <TextInput
                style={styles.fieldInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#94a3b8"
              />
              {lastName.length > 0 && (
                <TouchableOpacity onPress={() => handleClearField("lastName")} style={styles.clearBtnClick}>
                  <Text style={styles.clearBtnSymbol}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* First Name */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>First Name</Text>
            <View style={styles.inputContainerRow}>
              <TextInput
                style={styles.fieldInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#94a3b8"
              />
              {firstName.length > 0 && (
                <TouchableOpacity onPress={() => handleClearField("firstName")} style={styles.clearBtnClick}>
                  <Text style={styles.clearBtnSymbol}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Gender</Text>
            <View style={styles.radioFlexContainer}>
              <TouchableOpacity style={styles.radioButtonOption} onPress={() => setGender("Male")} activeOpacity={0.8}>
                <View style={[styles.outerRadioRing, gender === "Male" && styles.activeOuterRing]}>
                  {gender === "Male" && <View style={styles.innerRadioDot} />}
                </View>
                <Text style={styles.radioOptionLabelText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioButtonOption} onPress={() => setGender("Female")} activeOpacity={0.8}>
                <View style={[styles.outerRadioRing, gender === "Female" && styles.activeOuterRing]}>
                  {gender === "Female" && <View style={styles.innerRadioDot} />}
                </View>
                <Text style={styles.radioOptionLabelText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birthdate */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Birthdate</Text>
            <TouchableOpacity style={styles.inputContainerRow} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
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
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {(["Single", "Married", "Divorced", "Separated", "Widowed", "Minor"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
                    civilStatus === status
                      ? { backgroundColor: "#dcfce7", borderColor: "#166534" }
                      : { backgroundColor: "#f1f5f9", borderColor: "#cbd5e1" },
                  ]}
                  onPress={() => setCivilStatus(status)}
                >
                  <Text style={{ color: civilStatus === status ? "#166534" : "#475569" }}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Height & Weight */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Height (cm)</Text>
              <View style={styles.inputContainerRow}>
                <TextInput
                  style={styles.fieldInput}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholder="e.g. 170"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Weight (kg)</Text>
              <View style={styles.inputContainerRow}>
                <TextInput
                  style={styles.fieldInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="e.g. 70"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Temp & BP */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Temp (°C)</Text>
              <View style={styles.inputContainerRow}>
                <TextInput
                  style={styles.fieldInput}
                  value={temp}
                  onChangeText={setTemp}
                  keyboardType="decimal-pad"
                  placeholder="36.5"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Blood Pressure</Text>
              <View style={styles.inputContainerRow}>
                <TextInput
                  style={styles.fieldInput}
                  value={bp}
                  onChangeText={setBp}
                  placeholder="120/80"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Allergies */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Allergies</Text>
            <TextInput
              style={[styles.fieldInput, {
                height: 80,
                textAlignVertical: "top",
                paddingTop: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 10,
              }]}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="List any allergies or type 'None'..."
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={4}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Patient's Email Address</Text>
            <View style={styles.inputContainerRow}>
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Mobile Number</Text>
            <View style={styles.phoneInputLayoutGroup}>
              <View style={styles.countryCodeBadgePlate}>
                <Text style={styles.countryCodeBadgeLabel}>+63</Text>
              </View>
              <TextInput
                style={[styles.fieldInput, styles.phoneNumberNativeInput]}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="917 123 4567"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActionBarWrapper}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setIsEditing(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
            onPress={handleSaveEdit}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.nextActionButtonLabelText}>
              {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- VIEW RENDER 2: Patient History List ---
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
            Patient Records <Text style={styles.patientCount}>({displayedPatients.length})</Text>
          </Text>
        </View>

        {displayedPatients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? "No patients match your search." : "No patient records found."}
          </Text>
        ) : (
          displayedPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => router.push(`/patient-records/${patient.id}`)}
              activeOpacity={0.75}
            >
              <View style={styles.cardInfoGroup}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Text style={styles.cardNameText}>{patient.lastName}, {patient.firstName}</Text>
                  {patientStatusMap[patient.id] !== undefined && (
                    <View style={{
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 6,
                      backgroundColor: patientStatusMap[patient.id] === "new" ? "#dcfce7" : "#f1f5f9",
                      borderWidth: 1,
                      borderColor: patientStatusMap[patient.id] === "new" ? "#86efac" : "#cbd5e1",
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: patientStatusMap[patient.id] === "new" ? "#166534" : "#475569",
                      }}>
                        {patientStatusMap[patient.id] === "new" ? "new" : "old"}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardSubDetails}>
                  {patient.gender} • DOB: {patient.birthdate}
                  {patient.birthdate ? ` • Age: ${calculateAge(patient.birthdate)}` : ""}
                </Text>
                {patient.mobileNumber ? (
                  <Text style={styles.cardSubDetails}>📱 +63 {patient.mobileNumber}</Text>
                ) : null}
              </View>
              <View style={styles.cardActionsGroup}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={(e) => { e.stopPropagation(); openEditForm(patient); }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                {isDoctor && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(patient.id, `${patient.firstName} ${patient.lastName}`);
                    }}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}