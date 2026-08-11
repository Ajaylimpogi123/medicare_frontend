import { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { fetchPatientConsultations } from "@/api/consultation";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { prescriptionHistoryStyles as styles } from "@/styles/prescriptionHistoryStyles";

type Prescription = {
  id: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  generic: { id: number; generic_name: string };
  brand: { id: number; brand_name: string };
};

type Consultation = {
  id: number;
  consultation_date: string;
  chief_complaint: string | null;
  notes: string | null;
  prescriptions: Prescription[];
};

export default function PrescriptionHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const res = await fetchPatientConsultations(Number(id));
        setConsultations(res.data.data || []);
      } catch (error) {
        Alert.alert("Error", "Could not load prescription history.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const filtered = useMemo(() => {
    return consultations.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.prescriptions.some((rx) => 
          rx.brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rx.generic.generic_name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        c.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate =
        dateFilter === '' || c.consultation_date.startsWith(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [consultations, searchQuery, dateFilter]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SEARCH BAR */}
        <View style={styles.historySearchWrapper}>
          <TextInput
            style={styles.historySearchInput}
            placeholder="Search by medication or notes..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* DATE FILTER */}
        <View style={styles.historyDateFilterWrapper}>
          <TextInput
            style={styles.historyDateFilterInput}
            placeholder="Filter by date (YYYY-MM-DD)"
            placeholderTextColor="#94a3b8"
            value={dateFilter}
            onChangeText={setDateFilter}
          />
        </View>

        <Text style={styles.resultsCount}>
          {filtered.length} prescription{filtered.length !== 1 ? 's' : ''} found
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No prescriptions match your search.</Text>
          </View>
        ) : (
          filtered.map((c) => (
            <View key={c.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>💊 Prescription</Text>
                </View>
                <Text style={styles.cardDate}>{c.consultation_date?.split("T")[0]}</Text>
              </View>

              <Text style={styles.historySectionLabel}>MEDICATIONS</Text>
              {c.prescriptions.map((rx) => (
                <Text key={rx.id} style={styles.historyMedItem}>
                  • {rx.brand.brand_name} ({rx.generic.generic_name}) — {rx.dosage}, {rx.frequency}
                </Text>
              ))}

              {c.notes ? (
                <>
                  <Text style={styles.historySectionLabel}>NOTES</Text>
                  <Text style={styles.historyNotes}>{c.notes}</Text>
                </>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}