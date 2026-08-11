import {
  createDisease,
  deleteDisease,
  fetchDiseases,
  updateDisease,
} from "@/api/disease";
import { useAuth } from "@/components/context/auth-context";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Disease = {
  id: number;
  disease_name: string;
  description: string | null;
  symptoms: string | null;
  total_diagnoses_count: number;
  active_diagnoses_count: number;
  deleted_at: string | null;
};

export default function DiseasesScreen() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [isCreating, setIsCreating] = useState(false);
  const [editingDiseaseId, setEditingDiseaseId] = useState<number | null>(null);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [description, setDescription] = useState("");

  const loadDiseases = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res = await fetchDiseases();
      setDiseases(res.data.data ?? res.data ?? []);
    } catch {
      Alert.alert("Error", "Could not load diseases.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  const filteredDiseases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return diseases;
    return diseases.filter(
      (d) =>
        d.disease_name.toLowerCase().includes(q) ||
        d.symptoms?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q),
    );
  }, [diseases, searchQuery]);

  const openCreateForm = () => {
    setName("");
    setSymptoms("");
    setDescription("");
    setEditingDiseaseId(null);
    setIsCreating(true);
  };

  const openEditForm = (disease: Disease) => {
    setName(disease.disease_name);
    setSymptoms(disease.symptoms ?? "");
    setDescription(disease.description ?? "");
    setEditingDiseaseId(disease.id);
    setIsCreating(true);
  };

  const handleSaveSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Fields", "Disease name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        disease_name: name,
        symptoms: symptoms || null,
        description: description || null,
      };

      if (editingDiseaseId) {
        await updateDisease(editingDiseaseId, payload);
        Alert.alert("Success", `${name} has been updated.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadDiseases(); } },
        ]);
      } else {
        await createDisease(payload);
        Alert.alert("Disease Added", `${name} has been added to the directory.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadDiseases(); } },
        ]);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] ||
        "Could not save disease.";
      Alert.alert("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDisease = (disease: Disease) => {
    Alert.alert(
      "Archive Disease",
      `Are you sure you want to archive "${disease.disease_name}"? This cannot be done if patients are actively diagnosed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDisease(disease.id);
              await loadDiseases();
            } catch (err: any) {
              // Backend returns 422 with descriptive message if active cases exist
              const msg =
                err?.response?.data?.message ||
                "Could not archive this disease.";
              Alert.alert("Cannot Archive", msg);
            }
          },
        },
      ],
    );
  };

  // --- VIEW RENDER 1: Disease List ---
  if (!isCreating) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadDiseases(true)}
              tintColor="#095c29"
            />
          }
        >
          <View style={styles.listHeaderRow}>
            <Text style={styles.promptHeadline}>Disease Directory</Text>
            {isDoctor && (
              <TouchableOpacity style={styles.addBtn} onPress={openCreateForm}>
                <Text style={styles.addBtnText}>+ Add Disease</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* SEARCH */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by disease name or symptoms..."
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearBtnClick}
              >
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator color="#095c29" style={{ marginTop: 40 }} />
          ) : filteredDiseases.length === 0 && diseases.length === 0 ? (
            <Text style={styles.emptyText}>
              No disease records found.{isDoctor ? " Tap + Add Disease to begin." : ""}
            </Text>
          ) : filteredDiseases.length === 0 ? (
            <Text style={styles.emptyText}>
              No diseases match "{searchQuery}".
            </Text>
          ) : (
            filteredDiseases.map((disease) => (
              <TouchableOpacity
                key={disease.id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => router.push(`/diseases/${disease.id}`)}
              >
                <View style={styles.cardInfoGroup}>
                  <Text style={styles.cardNameText}>{disease.disease_name}</Text>
                  {disease.symptoms ? (
                    <Text style={styles.cardSubDetails} numberOfLines={2}>
                      🩻 {disease.symptoms}
                    </Text>
                  ) : null}

                  {/* Diagnosis count badges */}
                  <View style={styles.badgeRow}>
                    {disease.active_diagnoses_count > 0 && (
                      <View style={styles.badgeActive}>
                        <Text style={styles.badgeActiveText}>
                          {disease.active_diagnoses_count} active
                        </Text>
                      </View>
                    )}
                    {disease.total_diagnoses_count > 0 && (
                      <View style={styles.badgeTotal}>
                        <Text style={styles.badgeTotalText}>
                          {disease.total_diagnoses_count} total
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Doctor-only actions */}
                {isDoctor && (
                  <View style={styles.cardActionsGroup}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditForm(disease)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteDisease(disease)}
                    >
                      <Text style={styles.deleteButtonText}>Archive</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Assistant — just show chevron */}
                {!isDoctor && (
                  <Text style={styles.chevron}>›</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // --- VIEW RENDER 2: Create / Edit Form ---
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.promptHeadline}>
          {editingDiseaseId ? "Edit Disease Record" : "Add a New Disease"}
        </Text>

        {/* DISEASE NAME */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Disease Name *</Text>
          <View style={styles.inputContainerRow}>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Pneumonia"
              placeholderTextColor="#94a3b8"
            />
            {name.length > 0 && (
              <TouchableOpacity onPress={() => setName("")} style={styles.clearBtnClick}>
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>Description (optional)</Text>
          <View style={[styles.inputContainerRow, styles.textAreaContainer]}>
            <TextInput
              style={[styles.fieldInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of this disease"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* GENERAL SYMPTOMS */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabelText}>General Symptoms (optional)</Text>
          <View style={[styles.inputContainerRow, styles.textAreaContainer]}>
            <TextInput
              style={[styles.fieldInput, styles.textArea]}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Typical symptoms of this disease (general reference)"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* INFO BOX */}
        <View style={styles.infoAlertContainerBox}>
          <Text style={styles.infoBadgeIndicatorIcon}>ⓘ</Text>
          <View style={styles.infoAlertContentBodyTextGroup}>
            <Text style={styles.infoAlertMessageTextInline}>
              General symptoms here are a reference for the disease itself.
            </Text>
            <Text style={styles.infoAlertSubtextInline}>
              Patient-specific symptoms are recorded separately during consultation when you attach this diagnosis.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActionBarWrapper}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setIsCreating(false)}
        >
          <Text style={styles.secondaryBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
          onPress={handleSaveSubmit}
          disabled={isSubmitting}
          activeOpacity={0.9}
        >
          <Text style={styles.nextActionButtonLabelText}>
            {isSubmitting ? "SAVING..." : "SAVE DISEASE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scroller: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 40 },
  listHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  promptHeadline: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  addBtn: { backgroundColor: "#095c29", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: "#0f172a", height: "100%" },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 40, fontSize: 15 },
  card: { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardInfoGroup: { flex: 1, gap: 4, marginRight: 12 },
  cardNameText: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  cardSubDetails: { fontSize: 14, color: "#64748b" },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  badgeActive: { backgroundColor: "#fef3c7", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: "#fde68a" },
  badgeActiveText: { fontSize: 11, fontWeight: "700", color: "#92400e" },
  badgeTotal: { backgroundColor: "#f1f5f9", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: "#e2e8f0" },
  badgeTotalText: { fontSize: 11, fontWeight: "600", color: "#475569" },
  cardActionsGroup: { flexDirection: "row", gap: 8, alignItems: "center" },
  editButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: "#e2e8f0" },
  editButtonText: { color: "#334155", fontWeight: "600", fontSize: 13 },
  deleteButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: "#fee2e2" },
  deleteButtonText: { color: "#ef4444", fontWeight: "600", fontSize: 13 },
  chevron: { fontSize: 22, color: "#095c29", fontWeight: "700" },
  fieldWrapper: { marginBottom: 20 },
  fieldLabelText: { fontSize: 15, fontWeight: "600", color: "#475569", marginBottom: 8 },
  inputContainerRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 14, height: 52 },
  textAreaContainer: { height: "auto", minHeight: 120, alignItems: "flex-start", paddingVertical: 12 },
  fieldInput: { flex: 1, fontSize: 16, color: "#0f172a", height: "100%" },
  textArea: { height: undefined, minHeight: 96 },
  clearBtnClick: { padding: 4, justifyContent: "center", alignItems: "center" },
  clearBtnSymbol: { fontSize: 20, color: "#94a3b8" },
  infoAlertContainerBox: { flexDirection: "row", backgroundColor: "#f0fdf4", borderRadius: 12, padding: 14, gap: 12, marginTop: 12, borderWidth: 1, borderColor: "#dcfce7" },
  infoBadgeIndicatorIcon: { fontSize: 18, color: "#095c29", fontWeight: "bold", marginTop: 1 },
  infoAlertContentBodyTextGroup: { flex: 1, gap: 8 },
  infoAlertMessageTextInline: { fontSize: 14, color: "#166534", lineHeight: 20, fontWeight: "500" },
  infoAlertSubtextInline: { fontSize: 13, color: "#3f6212", lineHeight: 18 },
  bottomActionBarWrapper: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12, backgroundColor: "#ffffff", borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  secondaryBtn: { flex: 1, height: 54, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
  secondaryBtnText: { color: "#475569", fontSize: 15, fontWeight: "600" },
  nextActionButtonCall: { flex: 2, backgroundColor: "#095c29", height: 54, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  nextActionButtonLabelText: { color: "#ffffff", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});