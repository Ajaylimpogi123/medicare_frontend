import { fetchPatientConsultations } from "@/api/consultation";
import { createPatient, updatePatient } from "@/api/patient";
import { addToQueue, fetchQueue, removeFromQueue } from "@/api/queue";
import { useAuth } from "@/components/context/auth-context";
import { currentQueueStyles as styles } from "@/styles/currentQueueStyles";
import { calculateAge } from "@/utils/age";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, BackHandler, Keyboard, KeyboardAvoidingView, Modal, Platform,
  RefreshControl, ScrollView, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View,
} from "react-native";

type QueueEntry = {
  queue_id: number;
  queued_at: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    gender: string;
    birthdate: string;
    phone_number: string;
    email: string;
    temperature?: string;
    blood_pressure?: string;
    height?: string;
    weight?: string;
    allergies?: string;
  };
};

// Keys for every text field that can be edited via the floating bar.
type FloatingFieldKey =
  | "search" | "lastName" | "firstName" | "height" | "weight"
  | "temp" | "bp" | "allergies" | "email" | "mobileNumber";

export default function CurrentQueueScreen() {
  const router = useRouter();
  const { user, activeClinic } = useAuth();

  const isDoctor = user?.role === "doctor";

  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [patientStatusMap, setPatientStatusMap] = useState<Record<number, "new" | "old">>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");
  const [birthdate, setBirthdate] = useState("");
  const [dateValue, setDateValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [civilStatus, setCivilStatus] = useState<"Single" | "Married" | "Divorced" | "Separated" | "Widowed" | "Minor">("Single");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [temp, setTemp] = useState("");
  const [bp, setBp] = useState("");
  const [allergies, setAllergies] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // ─── Floating tap-to-edit bar (mirrors LoginScreen pattern) ───────────────
  const [activeField, setActiveField] = useState<FloatingFieldKey | null>(null);
  const [floatingValue, setFloatingValue] = useState("");
  const floatingRef = useRef<TextInput>(null);

  // Central lookup so every field can share one Modal instead of one-per-field.
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
    search: { label: "Search Queue", value: searchQuery, setValue: setSearchQuery, autoCapitalize: "none" },
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
  // ────────────────────────────────────────────────────────────────────────

  const loadQueue = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetchQueue();
      const entries: QueueEntry[] = res.data.data ?? [];
      setQueue(entries);

      const statusEntries = await Promise.all(
        entries.map(async (entry) => {
          try {
            const cRes = await fetchPatientConsultations(entry.patient.id);
            const consultations = cRes.data.data ?? [];
            return [entry.patient.id, consultations.length > 0 ? "old" : "new"] as const;
          } catch {
            return [entry.patient.id, "new"] as const;
          }
        })
      );
      setPatientStatusMap(Object.fromEntries(statusEntries));
    } catch {
      Alert.alert("Error", "Could not load queue.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && activeClinic) loadQueue();
  }, [user, activeClinic]);

  const filteredQueue = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter((entry) =>
      entry.patient.first_name.toLowerCase().includes(q) ||
      entry.patient.last_name.toLowerCase().includes(q)
    );
  }, [queue, searchQuery]);

  const resetForm = () => {
    setEditingPatientId(null);
    setLastName(""); setFirstName(""); setGender("Female");
    setBirthdate(""); setDateValue(new Date());
    setCivilStatus("Single"); setHeight(""); setWeight("");
    setTemp(""); setBp(""); setAllergies("");
    setEmail(""); setMobileNumber("");
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const openEditForm = (entry: QueueEntry) => {
    const p = entry.patient;
    setEditingPatientId(p.id);
    setLastName(p.last_name);
    setFirstName(p.first_name);
    setGender(
      p.gender
        ? ((p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) as "Male" | "Female")
        : "Female"
    );
    setBirthdate(p.birthdate ?? "");
    const parsed = Date.parse(p.birthdate);
    setDateValue(!isNaN(parsed) ? new Date(parsed) : new Date());
    setCivilStatus("Single");
    setHeight(p.height ?? "");
    setWeight(p.weight ?? "");
    setTemp(p.temperature ?? "");
    setBp(p.blood_pressure ?? "");
    setAllergies(p.allergies ?? "");
    setEmail(p.email ?? "");
    setMobileNumber(p.phone_number ?? "");
    setShowAddForm(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateValue(selectedDate);
      setBirthdate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleSaveAndAddToQueue = async () => {
    if (!lastName.trim() || !firstName.trim() || !birthdate.trim()) {
      Alert.alert("Missing Fields", "Please complete the patient's name and birthdate.");
      return;
    }
    if (!activeClinic) {
      Alert.alert("No Clinic Selected", "Please select a clinic before adding a patient.");
      return;
    }

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
      if (editingPatientId) {
        await updatePatient(editingPatientId, payload);
        setShowAddForm(false);
        await loadQueue();
        Alert.alert("Updated", `Patient record for ${firstName} ${lastName} has been updated.`);
      } else {
        const response = await createPatient(payload);
        const newPatient = response.data.patient;
        await addToQueue(newPatient.id);
        setShowAddForm(false);
        await loadQueue();

        if (isDoctor) {
          const freshQueue = await fetchQueue();
          const freshEntries: QueueEntry[] = freshQueue.data.data ?? [];
          const matchedEntry = freshEntries.find((e) => e.patient.id === newPatient.id);
          router.push({
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
              queueId: matchedEntry ? matchedEntry.queue_id.toString() : "",
            },
          });
        } else {
          Alert.alert("Success", `${firstName} ${lastName} has been added to the queue.`);
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] ||
        "Could not save patient.";
      Alert.alert("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromQueue = (queueId: number, name: string) => {
    Alert.alert(
      "Remove from Queue",
      `Remove ${name} from today's queue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove", style: "destructive",
          onPress: async () => {
            try {
              await removeFromQueue(queueId);
              await loadQueue();
            } catch {
              Alert.alert("Error", "Could not remove patient from queue.");
            }
          },
        },
      ]
    );
  };

  const handleCardPress = (entry: QueueEntry) => {
    if (!isDoctor) return;
    router.push({
      pathname: "/consultations/createPrescription",
      params: {
        patientId: entry.patient.id.toString(),
        patientName: `${entry.patient.last_name}, ${entry.patient.first_name}`,
        patientGender: entry.patient.gender,
        patientBirthdate: entry.patient.birthdate,
        patientTemperature: entry.patient.temperature ?? "",
        patientBloodPressure: entry.patient.blood_pressure ?? "",
        patientHeight: entry.patient.height ?? "",
        patientWeight: entry.patient.weight ?? "",
        patientAllergies: entry.patient.allergies ?? "",
        queueId: entry.queue_id.toString(),
      },
    });
  };

  // Shared floating bar Modal — rendered once, used by every editable field
  // across both the form view and the list view (search bar).
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

  // ─── VIEW: Add / Edit Patient Form ───────────────────────────────────────
  if (showAddForm) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.promptHeadline}>
            {editingPatientId ? "Edit Patient Details" : "Input the details of your patient"}
          </Text>

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

          {/* Birthdate (unchanged — uses native date picker, not the keyboard) */}
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
                {renderTapField("height", styles.fieldInput, "e.g. 170")}
              </View>
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Weight (kg)</Text>
              <View style={styles.inputContainerRow}>
                {renderTapField("weight", styles.fieldInput, "e.g. 70")}
              </View>
            </View>
          </View>

          {/* Temp & BP */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
              <Text style={styles.fieldLabelText}>Temp (°C)</Text>
              <View style={styles.inputContainerRow}>
                {renderTapField("temp", styles.fieldInput, "36.5")}
              </View>
            </View>
            <View style={[styles.fieldWrapper, { flex: 1 }]}>
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
              [styles.fieldInput, {
                height: 80,
                textAlignVertical: "top",
                paddingTop: 10,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 10,
              }],
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
              {renderTapField("mobileNumber", [styles.fieldInput, styles.phoneNumberNativeInput], "917 123 4567")}
            </View>
          </View>

          {/* Info Alert */}
          <View style={styles.infoAlertContainerBox}>
            <Text style={styles.infoBadgeIndicatorIcon}>ⓘ</Text>
            <View style={styles.infoAlertContentBodyTextGroup}>
              <Text style={styles.infoAlertMessageTextInline}>
                We will send a copy of the prescription to your patient's email or mobile number.
              </Text>
              <Text style={styles.infoAlertSubtextInline}>
                If email or mobile number is not available, you may still continue and send it using other sharing options.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActionBarWrapper}>
          <TouchableOpacity
            style={[styles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
            onPress={handleSaveAndAddToQueue}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.nextActionButtonLabelText}>
              {isSubmitting
                ? "PROCESSING..."
                : editingPatientId
                ? "SAVE CHANGES"
                : "ADD TO QUEUE"}
            </Text>
          </TouchableOpacity>
        </View>

        {renderFloatingBarModal()}
      </View>
    );
  }

  // ─── VIEW: Main Queue List ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadQueue(true)}
            tintColor="#095c29"
          />
        }
      >
        {/* Search */}
        <View style={styles.searchBarWrapper}>
          {renderTapField("search", styles.searchBarInput, "Search queue by name...")}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtnClick}>
              <Text style={styles.clearBtnSymbol}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.promptHeadline}>
            Today's Queue{" "}
            <Text style={styles.patientCount}>({filteredQueue.length})</Text>
          </Text>
          <TouchableOpacity style={styles.addPatientBtn} onPress={openAddForm}>
            <Text style={styles.addPatientBtnText}>+ Add Patient</Text>
          </TouchableOpacity>
        </View>

        {filteredQueue.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? "No patients match your search." : "No patients in queue today."}
          </Text>
        ) : (
          filteredQueue.map((entry, index) => (
            <TouchableOpacity
              key={entry.queue_id}
              style={styles.patientCard}
              onPress={() => handleCardPress(entry)}
              activeOpacity={isDoctor ? 0.75 : 1}
            >
              {/* Queue number badge */}
              <View style={styles.queueBadge}>
                <Text style={styles.queueBadgeText}>{index + 1}</Text>
              </View>

              <View style={styles.cardInfoGroup}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <Text style={styles.cardNameText}>
                    {entry.patient.last_name}, {entry.patient.first_name}
                  </Text>
                  {patientStatusMap[entry.patient.id] !== undefined && (
                    <View style={{
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 6,
                      backgroundColor: patientStatusMap[entry.patient.id] === "new" ? "#dcfce7" : "#f1f5f9",
                      borderWidth: 1,
                      borderColor: patientStatusMap[entry.patient.id] === "new" ? "#86efac" : "#cbd5e1",
                    }}>
                      <Text style={{
                        fontSize: 11,
                        fontWeight: "700",
                        color: patientStatusMap[entry.patient.id] === "new" ? "#166534" : "#475569",
                      }}>
                        {patientStatusMap[entry.patient.id] === "new" ? "new" : "old"}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardSubDetails}>
                  {entry.patient.gender
                    ? entry.patient.gender.charAt(0).toUpperCase() + entry.patient.gender.slice(1)
                    : "—"}{" "}
                  • DOB: {entry.patient.birthdate}
                  {entry.patient.birthdate ? ` • Age: ${calculateAge(entry.patient.birthdate)}` : ""}
                </Text>
                {entry.patient.phone_number ? (
                  <Text style={styles.cardSubDetails}>📱 +63 {entry.patient.phone_number}</Text>
                ) : null}
                {isDoctor && (
                  <Text style={styles.cardSubDetails}>Tap to start prescription →</Text>
                )}
              </View>

              <View style={[styles.cardActionsGroup, { flexDirection: "column" }]}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={(e) => { e.stopPropagation(); openEditForm(entry); }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleRemoveFromQueue(
                      entry.queue_id,
                      `${entry.patient.first_name} ${entry.patient.last_name}`
                    );
                  }}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {renderFloatingBarModal()}
    </View>
  );
}