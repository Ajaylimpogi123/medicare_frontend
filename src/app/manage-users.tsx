import apiClient from "@/api/client";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { manageStyles as styles } from "@/styles/manageStyles";

type Clinic = {
  id: number;
  clinic_name: string;
};

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "doctor" | "assistant";
  specialization: string | null;
  clinics: Clinic[];
};

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "assistant">("all");

  // — Edit modal state —
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  // — Edit form fields —
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinicIds, setClinicIds] = useState("");

  const loadUsers = async (role?: string) => {
    setLoading(true);
    try {
      const params = role && role !== "all" ? { role } : {};
      const res = await apiClient.get("/users", { params });
      setUsers(res.data);
    } catch {
      Alert.alert("Error", "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(roleFilter);
  }, [roleFilter]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhoneNumber(user.phone_number);
    setSpecialization(user.specialization ?? "");
    setClinicIds(user.clinics.map((c) => c.id).join(", "));
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      Alert.alert("Validation Error", "First name, last name, email, and phone number are required.");
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

    setSaving(true);
    try {
      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        clinic_ids: parsedClinicIds,
      };

      if (selectedUser.role === "doctor") {
        payload.specialization = specialization || null;
      }

      await apiClient.put(`/users/${selectedUser.id}`, payload);
      Alert.alert("Success", "User updated successfully.");
      setModalVisible(false);
      loadUsers(roleFilter);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (Object.values(error.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] ||
        "Something went wrong.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
      </View>

      {/* ROLE FILTER */}
      <View style={styles.filterRow}>
        {(["all", "doctor", "assistant"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, roleFilter === f && styles.filterBtnActive]}
            onPress={() => setRoleFilter(f)}
          >
            <Text style={[styles.filterBtnText, roleFilter === f && styles.filterBtnTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* USER LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#095c29" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {filteredUsers.length === 0 ? (
            <Text style={styles.emptyText}>No users found.</Text>
          ) : (
            filteredUsers.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={styles.userCard}
                onPress={() => openEditModal(u)}
                activeOpacity={0.75}
              >
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {u.first_name[0]?.toUpperCase()}
                    {u.last_name[0]?.toUpperCase()}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {u.last_name}, {u.first_name}
                  </Text>
                  <Text style={styles.userSub}>{u.email}</Text>
                  <View style={styles.tagRow}>
                    <View style={[styles.roleTag, u.role === "doctor" ? styles.roleTagDoctor : styles.roleTagAssistant]}>
                      <Text style={styles.roleTagText}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </Text>
                    </View>
                    {u.clinics.map((c) => (
                      <View key={c.id} style={styles.clinicTag}>
                        <Text style={styles.clinicTagText}>{c.clinic_name}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Edit User</Text>

            {/* Role badge — read only */}
            <View style={styles.roleBadgeRow}>
              <View style={[
                styles.roleTag,
                selectedUser?.role === "doctor" ? styles.roleTagDoctor : styles.roleTagAssistant
              ]}>
                <Text style={styles.roleTagText}>
                  {selectedUser?.role.charAt(0).toUpperCase()}{selectedUser?.role.slice(1)}
                </Text>
              </View>
              <Text style={styles.roleReadOnlyHint}>Role cannot be changed</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.fieldLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />

              {/* Specialization — only for doctors */}
              {selectedUser?.role === "doctor" && (
                <>
                  <Text style={styles.fieldLabel}>Specialization</Text>
                  <TextInput
                    style={styles.input}
                    value={specialization}
                    onChangeText={setSpecialization}
                    placeholder="e.g. Cardiology"
                    placeholderTextColor="#94a3b8"
                  />
                </>
              )}

              <Text style={styles.fieldLabel}>Clinic IDs (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={clinicIds}
                onChangeText={setClinicIds}
                placeholder="e.g. 1, 2, 3"
                placeholderTextColor="#94a3b8"
                keyboardType="numbers-and-punctuation"
              />
              {/* Show current clinic names for reference */}
              {selectedUser && selectedUser.clinics.length > 0 && (
                <Text style={styles.clinicHint}>
                  Current: {selectedUser.clinics.map((c) => `${c.id} — ${c.clinic_name}`).join(", ")}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}