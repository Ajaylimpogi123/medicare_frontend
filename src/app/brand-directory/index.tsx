import apiClient from "@/api/client";
import { useEffect, useMemo, useState } from "react";
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
import { brandStyles as styles } from "@/styles/brandStyles";

type Generic = {
  id: number;
  generic_name: string;
};

type Brand = {
  id: number;
  brand_name: string;
  generic_id: number;
  generic?: Generic;
};

export default function BrandDirectoryScreen() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [brandName, setBrandName] = useState("");
  const [selectedGeneric, setSelectedGeneric] = useState<Generic | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [generics, setGenerics] = useState<Generic[]>([]);
  const [loading, setLoading] = useState(true);

  // Generic picker modal
  const [showGenericPicker, setShowGenericPicker] = useState(false);
  const [genericSearch, setGenericSearch] = useState("");

  // — Load brands and generics in parallel on mount —
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [brandsRes, genericsRes] = await Promise.all([
        apiClient.get("/brands"),
        apiClient.get("/generics"),
      ]);
      setBrands(brandsRes.data.data ?? brandsRes.data);
      setGenerics(genericsRes.data.data ?? genericsRes.data);
    } catch {
      Alert.alert("Error", "Could not load brand directory.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter(
      (b) =>
        b.brand_name.toLowerCase().includes(query) ||
        b.generic?.generic_name.toLowerCase().includes(query),
    );
  }, [brands, searchQuery]);

  const filteredGenerics = generics.filter((g) =>
    g.generic_name.toLowerCase().includes(genericSearch.toLowerCase()),
  );

  const openCreateForm = () => {
    setBrandName("");
    setSelectedGeneric(null);
    setEditingBrand(null);
    setIsCreating(true);
  };

  const openEditForm = (brand: Brand) => {
    setBrandName(brand.brand_name);
    const generic = generics.find((g) => g.id === brand.generic_id) ?? null;
    setSelectedGeneric(generic);
    setEditingBrand(brand);
    setIsCreating(true);
  };

  const handleSaveSubmit = async () => {
    if (!brandName.trim()) {
      Alert.alert("Missing Fields", "Please enter a brand name.");
      return;
    }
    if (!selectedGeneric) {
      Alert.alert("Missing Fields", "Please select a generic.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        brand_name: brandName,
        generic_id: selectedGeneric.id,
      };

      if (editingBrand) {
        await apiClient.put(`/brands/${editingBrand.id}`, payload);
        Alert.alert("Success", `${brandName} has been updated.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadData(); } },
        ]);
      } else {
        await apiClient.post("/brands", payload);
        Alert.alert("Brand Added", `${brandName} has been saved.`, [
          { text: "OK", onPress: () => { setIsCreating(false); loadData(); } },
        ]);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Could not save brand.";
      Alert.alert("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (brand: Brand) => {
    Alert.alert(
      "Delete Brand",
      `Are you sure you want to remove ${brand.brand_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/brands/${brand.id}`);
              loadData();
            } catch {
              Alert.alert("Error", "Could not delete brand.");
            }
          },
        },
      ],
    );
  };

  // ── VIEW 1: Brand List ─────────────────────────────────────────────────────
  if (!isCreating) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.promptHeadline}>Brand Directory</Text>
            <TouchableOpacity style={styles.addBtn} onPress={openCreateForm}>
              <Text style={styles.addBtnText}>+ Add Brand</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by brand or generic name..."
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearBtnClick}>
                <Text style={styles.clearBtnSymbol}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#095c29" style={{ marginTop: 40 }} />
          ) : filteredBrands.length === 0 && brands.length === 0 ? (
            <Text style={styles.emptyText}>No brand records found. Click add to begin.</Text>
          ) : filteredBrands.length === 0 ? (
            <Text style={styles.emptyText}>No brands match "{searchQuery}".</Text>
          ) : (
            filteredBrands.map((brand) => (
              <View key={brand.id} style={styles.card}>
                <View style={styles.cardInfoGroup}>
                  <Text style={styles.cardNameText}>{brand.brand_name}</Text>
                  {brand.generic ? (
                    <Text style={styles.cardSubDetails}>
                      💊 {brand.generic.generic_name}
                    </Text>
                  ) : (
                    <Text style={styles.cardSubDetailsMuted}>No generic linked</Text>
                  )}
                </View>
                <View style={styles.cardActionsGroup}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openEditForm(brand)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(brand)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // ── VIEW 2: Create / Edit Form ─────────────────────────────────────────────
  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scroller} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.promptHeadline}>
            {editingBrand ? "Edit Brand Record" : "Add a New Brand"}
          </Text>

          {/* BRAND NAME */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Brand Name</Text>
            <View style={styles.inputContainerRow}>
              <TextInput
                style={styles.fieldInput}
                value={brandName}
                onChangeText={setBrandName}
                placeholder="e.g. Biogesic"
                placeholderTextColor="#94a3b8"
              />
              {brandName.length > 0 && (
                <TouchableOpacity onPress={() => setBrandName("")} style={styles.clearBtnClick}>
                  <Text style={styles.clearBtnSymbol}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* GENERIC SELECTOR */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabelText}>Generic Medication</Text>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setShowGenericPicker(true)}
            >
              <Text style={selectedGeneric ? styles.selectorBtnText : styles.selectorBtnPlaceholder}>
                {selectedGeneric ? selectedGeneric.generic_name : "Select a generic..."}
              </Text>
              <Text style={styles.selectorChevron}>▾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoAlertContainerBox}>
            <Text style={styles.infoBadgeIndicatorIcon}>ⓘ</Text>
            <View style={styles.infoAlertContentBodyTextGroup}>
              <Text style={styles.infoAlertMessageTextInline}>
                Each brand must be linked to one generic medication.
              </Text>
              <Text style={styles.infoAlertSubtextInline}>
                If the generic doesn't exist yet, add it in the Generics screen first.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActionBarWrapper}>
          <TouchableOpacity
            style={[styles.nextActionButtonCall, isSubmitting && { backgroundColor: "#82b27a" }]}
            onPress={handleSaveSubmit}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.nextActionButtonLabelText}>
              {isSubmitting ? "SAVING..." : "SAVE RECORD"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GENERIC PICKER MODAL */}
      <Modal
        visible={showGenericPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenericPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowGenericPicker(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Generic</Text>
              <TouchableOpacity onPress={() => setShowGenericPicker(false)}>
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchContainer}
              placeholder="Search generics..."
              placeholderTextColor="#94a3b8"
              value={genericSearch}
              onChangeText={setGenericSearch}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredGenerics.map((generic) => {
                const isSelected = selectedGeneric?.id === generic.id;
                return (
                  <TouchableOpacity
                    key={generic.id}
                    style={[styles.pickerRow, isSelected && styles.pickerRowSelected]}
                    onPress={() => {
                      setSelectedGeneric(generic);
                      setGenericSearch("");
                      setShowGenericPicker(false);
                    }}
                  >
                    <View style={styles.pickerRowInfo}>
                      <Text style={styles.pickerRowName}>{generic.generic_name}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}