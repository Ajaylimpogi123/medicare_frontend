import apiClient from "@/api/client";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import genericsStyles from "@/styles/genericsStyles";

type Generic = {
  id: number;
  generic_name: string;
};

export default function GenericsScreen() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingGeneric, setEditingGeneric] = useState<Generic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [genericName, setGenericName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generics, setGenerics] = useState<Generic[]>([]);
  const [loading, setLoading] = useState(true);

  // — Load all generics on mount —
  useEffect(() => {
    loadGenerics();
  }, []);

  const loadGenerics = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/generics");
      setGenerics(res.data.data ?? res.data);
    } catch {
      Alert.alert("Error", "Could not load generics.");
    } finally {
      setLoading(false);
    }
  };

  const filteredGenerics = useMemo(
    () =>
      generics.filter((g) =>
        g.generic_name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      ),
    [generics, searchQuery],
  );

  const openCreateForm = () => {
    setGenericName("");
    setEditingGeneric(null);
    setIsCreating(true);
  };

  const openEditForm = (generic: Generic) => {
    setGenericName(generic.generic_name);
    setEditingGeneric(generic);
    setIsCreating(true);
  };

  const handleSaveSubmit = async () => {
    if (!genericName.trim()) {
      Alert.alert("Missing Fields", "Please enter a generic name.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingGeneric) {
        // UPDATE
        await apiClient.put(`/generics/${editingGeneric.id}`, {
          generic_name: genericName,
        });
        Alert.alert("Success", `${genericName} has been updated.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadGenerics(); } },
        ]);
      } else {
        // CREATE
        await apiClient.post("/generics", { generic_name: genericName });
        Alert.alert("Generic Added", `${genericName} has been saved.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadGenerics(); } },
        ]);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Could not save generic.";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (generic: Generic) => {
    Alert.alert(
      "Delete Generic",
      `Are you sure you want to remove ${generic.generic_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/generics/${generic.id}`);
              loadGenerics();
            } catch {
              Alert.alert("Error", "Could not delete generic.");
            }
          },
        },
      ],
    );
  };

  // ── VIEW 1: Generics List ───────────────────────────────────────────────────
  if (!isCreating) {
    return (
      <View style={genericsStyles.container}>
        <ScrollView style={genericsStyles.scroller} contentContainerStyle={genericsStyles.content}>
          <View style={genericsStyles.listHeaderRow}>
            <Text style={genericsStyles.promptHeadline}>Generics</Text>
            <TouchableOpacity style={genericsStyles.addBtn} onPress={openCreateForm}>
              <Text style={genericsStyles.addBtnText}>+ Add Generic</Text>
            </TouchableOpacity>
          </View>

          <View style={genericsStyles.searchContainer}>
            <Text style={genericsStyles.searchIcon}>🔍</Text>
            <TextInput
              style={genericsStyles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search generic name..."
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={genericsStyles.clearBtnClick}>
                <Text style={genericsStyles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#095c29" style={{ marginTop: 40 }} />
          ) : filteredGenerics.length === 0 && generics.length === 0 ? (
            <Text style={genericsStyles.emptyText}>No generics found. Click add to begin.</Text>
          ) : filteredGenerics.length === 0 ? (
            <Text style={genericsStyles.emptyText}>No generics match "{searchQuery}".</Text>
          ) : (
            filteredGenerics.map((generic) => (
              <View key={generic.id} style={genericsStyles.card}>
                <View style={genericsStyles.cardInfoGroup}>
                  <Text style={genericsStyles.cardNameText}>{generic.generic_name}</Text>
                </View>
                <View style={genericsStyles.cardActionsGroup}>
                  <TouchableOpacity style={genericsStyles.editButton} onPress={() => openEditForm(generic)}>
                    <Text style={genericsStyles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={genericsStyles.deleteButton} onPress={() => handleDelete(generic)}>
                    <Text style={genericsStyles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // ── VIEW 2: Create / Edit Form ──────────────────────────────────────────────
  return (
    <View style={genericsStyles.container}>
      <ScrollView
        style={genericsStyles.scroller}
        contentContainerStyle={genericsStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={genericsStyles.promptHeadline}>
          {editingGeneric ? "Edit Generic" : "Add a New Generic"}
        </Text>

        <View style={genericsStyles.fieldWrapper}>
          <Text style={genericsStyles.fieldLabelText}>Generic Name</Text>
          <View style={genericsStyles.inputContainerRow}>
            <TextInput
              style={genericsStyles.fieldInput}
              value={genericName}
              onChangeText={setGenericName}
              placeholder="e.g. Paracetamol"
              placeholderTextColor="#94a3b8"
            />
            {genericName.length > 0 && (
              <TouchableOpacity onPress={() => setGenericName("")} style={genericsStyles.clearBtnClick}>
                <Text style={genericsStyles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={genericsStyles.infoAlertContainerBox}>
          <Text style={genericsStyles.infoBadgeIndicatorIcon}>ⓘ</Text>
          <View style={genericsStyles.infoAlertContentBodyTextGroup}>
            <Text style={genericsStyles.infoAlertMessageTextInline}>
              Enter the generic (chemical) name of the medication.
            </Text>
            <Text style={genericsStyles.infoAlertSubtextInline}>
              Brands will be linked to this generic separately in the Brand Directory.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={genericsStyles.bottomActionBarWrapper}>
        <TouchableOpacity
          style={[genericsStyles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
          onPress={handleSaveSubmit}
          disabled={isSubmitting}
          activeOpacity={0.9}
        >
          <Text style={genericsStyles.nextActionButtonLabelText}>
            {isSubmitting ? "SAVING..." : "SAVE RECORD"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}