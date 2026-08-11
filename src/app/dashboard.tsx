import { fetchQueue } from "@/api/queue";
import { useAuth } from "@/components/context/auth-context";
import { ButtonCard, Card } from "@/components/ui";
import { dashboardStyles as styles } from "@/styles/dashboardStyles";
import { Clinic } from "@/types/clinic";
import { UserRole } from "@/types/user";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ButtonRoute =
  | "/patient-records"
  | "/consultations"
  | "/brand-directory"
  | "/generics"
  | "/diseases"
  | "/medical-certificate"
  | "/current-queue";

type ButtonItem = {
  label: string;
  route: ButtonRoute;
  icon: string;
  description: string;
  allowedRoles?: UserRole[];
};

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const { user, logout, clinics, activeClinic, selectClinic } = useAuth();
  const [clinicModalVisible, setClinicModalVisible] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  // Refresh queue count every time the dashboard tab comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!user || !activeClinic) return;
      const loadQueueCount = async () => {
        try {
          const response = await fetchQueue();
          setQueueCount(response.data.data?.length || 0);
        } catch (error) {
          console.error("Error loading queue count:", error);
        }
      };
      loadQueueCount();
    }, [user, activeClinic]),
  );

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSelectClinic = async (clinic: Clinic) => {
    await selectClinic(clinic);
    setClinicModalVisible(false);
  };

  const getColumns = () =>
    width >= 1024 ? 4 : width >= 768 ? 3 : width >= 600 ? 3 : 2;
  const columns = getColumns();
  const cardWidth = 100 / columns - 2;

  const clinicButtons: ButtonItem[] = [
    {
      label: "Patient Records",
      route: "/patient-records",
      icon: "🩺",
      description: "View and manage patient information",
      allowedRoles: ["doctor", "assistant"],
    },
    {
      label: "Consultations",
      route: "/consultations",
      icon: "📋",
      description: "Manage prescriptions and medical certificates",
      allowedRoles: ["doctor"],
    },
  ];

  const drugButtons: ButtonItem[] = [
    {
      label: "Brand Directory",
      route: "/brand-directory",
      icon: "💊",
      description: "View and manage branded medications",
      allowedRoles: ["doctor", "assistant"],
    },
    {
      label: "Generics",
      route: "/generics",
      icon: "🧪",
      description: "View and manage generic medications",
      allowedRoles: ["doctor", "assistant"],
    },
    {
      label: "Diseases",
      route: "/diseases",
      icon: "🦠",
      description: "View and manage disease information",
      allowedRoles: ["doctor"],
    },
  ];

  const filterByRole = (btn: ButtonItem) => {
    if (!btn.allowedRoles) return true;
    if (!user) return false;
    return btn.allowedRoles.includes(user.role);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <LinearGradient
          colors={["#16a34a", "#22c55e", "#50c079"]} // swap for your 3 colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <Text style={styles.welcomeTitle}>Welcome to CraveCare EMR</Text>
          <Text style={styles.welcomeText}>
            Manage patients, consultations, and records in one workspace.
          </Text>
        </LinearGradient>

        {/* Queue + Clinic Switcher Row */}
        <View style={styles.queueRow}>
          <TouchableOpacity
            style={[styles.queueCard, { flex: 1 }]}
            onPress={() => router.push("/current-queue")}
            activeOpacity={0.85}
          >
            <Text style={styles.queueLabel}>Current Queue</Text>
            <View style={styles.queueCountContainer}>
              <Text style={styles.queueCount}>{queueCount}</Text>
              <Text style={styles.queuePatientsLabel}> Patients</Text>
            </View>
          </TouchableOpacity>

          {clinics.length > 1 && (
            <TouchableOpacity
              style={[styles.clinicSwitcherBtn, { flex: 1 }]}
              onPress={() => setClinicModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.clinicSwitcherIcon}>🏥</Text>
              <Text style={styles.clinicSwitcherLabel}>Switch Clinic</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Clinic Management Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clinic Management</Text>
          <Text style={styles.sectionSubtitle}>Core operations</Text>
        </View>

        <View style={styles.buttonGrid}>
          {clinicButtons.filter(filterByRole).map((btn) => (
            <ButtonCard
              key={btn.route}
              label={btn.label}
              route={btn.route}
              icon={btn.icon}
              description={btn.description}
              cardWidth={cardWidth}
            />
          ))}
        </View>

        {/* Drug Information Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Drug Information</Text>
          <Text style={styles.sectionSubtitle}>Medication references</Text>
        </View>

        <View style={styles.buttonGrid}>
          {drugButtons.filter(filterByRole).map((btn) => (
            <ButtonCard
              key={btn.route}
              label={btn.label}
              route={btn.route}
              icon={btn.icon}
              description={btn.description}
              cardWidth={cardWidth}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out Session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Clinic Switcher Modal */}
      <Modal
        visible={clinicModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClinicModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setClinicModalVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Switch Clinic</Text>
            <Text style={styles.modalSubtitle}>
              Select your active branch for this session.
            </Text>

            <View style={{ gap: 10 }}>
              {clinics.map((clinic) => {
                const isSelected = clinic.id === activeClinic?.id;
                return (
                  <TouchableOpacity
                    key={clinic.id}
                    style={[
                      styles.modalCard,
                      isSelected && styles.modalCardSelected,
                    ]}
                    onPress={() => handleSelectClinic(clinic)}
                  >
                    <View
                      style={[
                        styles.modalCardAccent,
                        isSelected && styles.modalCardAccentSelected,
                      ]}
                    />
                    <View style={styles.modalCardBody}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalCardName}>
                          {clinic.clinic_name}
                        </Text>
                        {clinic.address && (
                          <Text style={styles.modalCardAddress}>
                            {clinic.address}
                          </Text>
                        )}
                      </View>
                      <View
                        style={
                          isSelected
                            ? styles.badgeActive
                            : styles.badgeAvailable
                        }
                      >
                        <Text
                          style={
                            isSelected
                              ? styles.badgeActiveText
                              : styles.badgeAvailableText
                          }
                        >
                          {isSelected ? "Active" : "Switch"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalDismissBtn}
              onPress={() => setClinicModalVisible(false)}
            >
              <Text style={styles.modalDismissBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
