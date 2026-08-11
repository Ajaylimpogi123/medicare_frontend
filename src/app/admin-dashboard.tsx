import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import apiClient from "@/api/client";
import { useAuth } from "@/components/context/auth-context";
import { adminDashboardStyles as styles } from "@/styles/adminDashboardStyles";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  // — Create User form state —
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"doctor" | "assistant">("doctor");
  const [prcId, setPrcId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinicIds, setClinicIds] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // — Create Clinic form state —
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [clinicLoading, setClinicLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleCreateUser = async () => {
    if (!userEmail || !userPassword || !firstName || !lastName || !phoneNumber || !clinicIds) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
    if (role === "doctor" && !prcId) {
      Alert.alert("Validation Error", "PRC ID is required for doctors.");
      return;
    }

    const parsedClinicIds = clinicIds
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsedClinicIds.length === 0) {
      Alert.alert("Validation Error", "Enter at least one valid clinic ID.");
      return;
    }

    setUserLoading(true);
    try {
      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        password: userPassword,
        phone_number: phoneNumber,
        role,
        clinic_ids: parsedClinicIds,
      };

      if (role === "doctor") {
        payload.prc_id = prcId;
        payload.specialization = specialization;
      }

      const response = await apiClient.post("/auth/register", payload);
      Alert.alert("Success", response.data.message);

      // Reset form
      setUserEmail(""); setUserPassword(""); setFirstName(""); setLastName(""); 
      setPhoneNumber(""); setPrcId(""); setClinicIds(""); setSpecialization("");
      setRole("doctor");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setUserLoading(false);
    }
  };

  const handleCreateClinic = async () => {
    if (!clinicName) {
      Alert.alert("Validation Error", "Clinic name is required.");
      return;
    }

    setClinicLoading(true);
    try {
      const payload: any = {
        clinic_name: clinicName,
        ...(clinicAddress && { address: clinicAddress }),
        ...(clinicPhone && { phone_number: clinicPhone }),
        ...(doctorId && { doctor_id: parseInt(doctorId, 10) }),
      };

      const response = await apiClient.post("/clinics", payload);
      Alert.alert("Success", `Clinic "${response.data.clinic_name}" created.`);

      setClinicName(""); setClinicAddress(""); setClinicPhone(""); setDoctorId("");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setClinicLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview card */}
      <View style={styles.card}>
        <Text style={styles.title}>System Overview</Text>
        <Text style={styles.text}>Welcome, {user?.first_name}!</Text>
        <Text style={styles.text}>Permission Level: {user?.role.toUpperCase()}</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/manage-users")}
        >
          <Text style={styles.actionText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>System Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Create Staff */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Staff Account</Text>
        <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
        <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
        <TextInput placeholder="Email" value={userEmail} onChangeText={setUserEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput placeholder="Password" value={userPassword} onChangeText={setUserPassword} secureTextEntry style={styles.input} />
        <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" style={styles.input} />
        <TextInput placeholder="Clinic IDs (e.g. 1,3)" value={clinicIds} onChangeText={setClinicIds} keyboardType="numbers-and-punctuation" style={styles.input} />

        <View style={styles.roleRow}>
          <TouchableOpacity style={[styles.roleButton, role === "doctor" && styles.roleButtonActive]} onPress={() => setRole("doctor")}>
            <Text style={[styles.roleButtonText, role === "doctor" && styles.roleButtonTextActive]}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, role === "assistant" && styles.roleButtonActive]} onPress={() => setRole("assistant")}>
            <Text style={[styles.roleButtonText, role === "assistant" && styles.roleButtonTextActive]}>Assistant</Text>
          </TouchableOpacity>
        </View>

        {role === "doctor" && (
          <>
            <TextInput placeholder="PRC ID" value={prcId} onChangeText={setPrcId} style={styles.input} />
            <TextInput placeholder="Specialization" value={specialization} onChangeText={setSpecialization} style={styles.input} />
          </>
        )}

        <TouchableOpacity style={[styles.submitButton, userLoading && styles.submitButtonDisabled]} onPress={handleCreateUser} disabled={userLoading}>
          <Text style={styles.submitButtonText}>{userLoading ? "Creating..." : "Create Staff Account"}</Text>
        </TouchableOpacity>
      </View>

      {/* Create Clinic */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Clinic</Text>
        <TextInput placeholder="Clinic Name" value={clinicName} onChangeText={setClinicName} style={styles.input} />
        <TextInput placeholder="Address (optional)" value={clinicAddress} onChangeText={setClinicAddress} style={styles.input} />
        <TextInput placeholder="Phone Number (optional)" value={clinicPhone} onChangeText={setClinicPhone} keyboardType="phone-pad" style={styles.input} />
        <TextInput placeholder="Doctor ID (optional)" value={doctorId} onChangeText={setDoctorId} keyboardType="numeric" style={styles.input} />

        <TouchableOpacity style={[styles.submitButton, clinicLoading && styles.submitButtonDisabled]} onPress={handleCreateClinic} disabled={clinicLoading}>
          <Text style={styles.submitButtonText}>{clinicLoading ? "Creating..." : "Create Clinic"}</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}