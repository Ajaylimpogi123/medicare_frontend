import { fetchPatientConsultations } from "@/api/consultation";
import { fetchPatients } from "@/api/patient";
import { useAuth } from "@/components/context/auth-context";
import { medicalCertStyles as styles } from "@/styles/MedicalcertStyles";
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  birthdate: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// ── PDF HTML Generator ────────────────────────────────────────────────────────
// Blank fill-in-the-blank template — the doctor handwrites the clinical content
// after printing. Only the patient's name, doctor/clinic letterhead, and
// today's date are pre-filled from data we already have.

const generateMedicalCertificateHTML = (
  patientFullName: string,
  doctorName: string,
  prcNumber: string,
  clinicName: string,
  clinicAddress: string,
  clinicContact: string,
  issuedAt: Date,
): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: letter portrait; margin: 1in; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 2px double #000;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .doctor-name { font-size: 18pt; font-weight: bold; margin-bottom: 2px; }
    .clinic-info { font-size: 9pt; line-height: 1.3; margin-top: 4px; }
    .date-row { text-align: right; font-size: 12pt; margin-bottom: 18px; }
    .date-line {
      display: inline-block;
      border-bottom: 1px solid #000;
      min-width: 160px;
      padding-bottom: 2px;
      margin-left: 6px;
    }
    .title {
      text-align: center;
      font-size: 22pt;
      font-weight: bold;
      margin-bottom: 18px;
    }
    .salutation { font-size: 12pt; margin-bottom: 14px; }
    .fill {
      display: inline-block;
      border-bottom: 1px solid #000;
      padding: 0 4px;
    }
    .cert-para { font-size: 12pt; line-height: 1.9; }
    .cert-para .indent { padding-left: 24px; }
    .fill-name { min-width: 220px; }
    .fill-full { display: block; width: 100%; margin-bottom: 2px; }
    .fill-date { min-width: 180px; }
    .diagnosis-row { font-size: 12pt; line-height: 1.6; margin-top: 6px; }
    .diagnosis-row .fill-inline { min-width: 260px; }
    .blank-full {
      display: block;
      border-bottom: 1px solid #000;
      height: 24px;
    }
    .recommendation-row { font-size: 12pt; line-height: 1.6; margin-top: 10px; }
    .recommendation-row .fill-inline { min-width: 300px; }
    .closing { font-size: 12pt; margin-top: 16px; line-height: 1.6; }
    .signature-block { margin-top: 30px; text-align: right; }
    .signature-name { font-size: 12pt; font-weight: bold; text-align: right; }
    .signature-lic { font-size: 10pt; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <div class="doctor-name">${doctorName}</div>
    <div class="clinic-info">
      <div><strong>${clinicName}</strong></div>
      ${clinicAddress ? `<div>${clinicAddress}</div>` : ""}
      ${clinicContact ? `<div>Tel No.: ${clinicContact}</div>` : ""}
    </div>
  </div>

  <div class="date-row">Date: <span class="date-line">${formatDisplayDate(issuedAt)}</span></div>

  <div class="title">Medical Certificate</div>

  <div class="salutation">To whom it may concern,</div>

  <div class="cert-para">
    <span class="indent">This is to certify that</span>
    <span class="fill fill-name">${patientFullName}</span> of
    <span class="fill fill-full">&nbsp;</span>
    has consulted me on <span class="fill fill-date">&nbsp;</span>
  </div>

  <div class="diagnosis-row">
    with the following diagnosis<span class="fill fill-inline">&nbsp;</span>
  </div>
  <div class="blank-full"></div>
  <div class="blank-full"></div>
  <div class="blank-full"></div>
  <div class="blank-full"></div>

  <div class="recommendation-row">
    Recommendation (s):<span class="fill fill-inline">&nbsp;</span>
  </div>
  <div class="blank-full"></div>
  <div class="blank-full"></div>

  <div class="closing">
    This certificate is issued upon the request of the patient.<br />
    Thank you.
  </div>

  <div class="signature-block">
    <div class="signature-name">${doctorName}</div>
    <div class="signature-lic">Lic No.: ${prcNumber || "____________"}</div>
    <div class="signature-lic">PTR No.: ____________</div>
  </div>
</body>
</html>
`;

// ── Screen ────────────────────────────────────────────────────────────────────

export default function MedicalCertificateScreen() {
  const { user, activeClinic } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPatientId, setLoadingPatientId] = useState<number | null>(null);

  const isDoctor = user?.role === "doctor";

  const loadPatients = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res = await fetchPatients();
      const allPatients: Patient[] = res.data.data ?? res.data;

      // Only patients with at least one consultation on record
      const consultationChecks = await Promise.all(
        allPatients.map(async (p) => {
          try {
            const cRes = await fetchPatientConsultations(p.id);
            const consultations = cRes.data.data ?? [];
            return consultations.length > 0 ? p : null;
          } catch {
            return null;
          }
        }),
      );

      const withConsultations = consultationChecks.filter(
        (p): p is Patient => p !== null,
      );

      // Alphabetical by last name, then first name
      withConsultations.sort((a, b) => {
        const lastCompare = a.last_name.localeCompare(b.last_name);
        if (lastCompare !== 0) return lastCompare;
        return a.first_name.localeCompare(b.first_name);
      });

      setPatients(withConsultations);
    } catch {
      Alert.alert("Error", "Could not load patients.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
      else setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDoctor) loadPatients();
  }, [isDoctor]);

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q),
    );
  }, [patients, searchQuery]);

  // ── Generate + present print/share/email options ──────────────────────────
  const handleSelectPatient = async (patient: Patient) => {
    setLoadingPatientId(patient.id);
    try {
      const doctorName = user ? `${user.first_name} ${user.last_name}, M.D.` : "Physician";
      const prcNumber = user?.prc_id ?? "";
      const clinicName = activeClinic?.clinic_name ?? "Clinic";
      const clinicAddress = activeClinic?.address ?? "";
      const clinicContact = activeClinic?.phone_number ?? "";
      const patientFullName = `${patient.first_name} ${patient.last_name}`;
      const issuedAt = new Date();

      const html = generateMedicalCertificateHTML(
        patientFullName,
        doctorName,
        prcNumber,
        clinicName,
        clinicAddress,
        clinicContact,
        issuedAt,
      );

      Alert.alert(
        "Medical Certificate",
        `Generate a blank medical certificate for ${patientFullName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "📤 Share / Print",
            onPress: async () => {
              try {
                await Print.printAsync({ html });
              } catch (err: any) {
                Alert.alert("Print Failed", err?.message ?? "Something went wrong.");
              }
            },
          },
          {
            text: "📧 Send via Email",
            onPress: async () => {
              try {
                const { uri } = await Print.printToFileAsync({ html });
                const isAvailable = await MailComposer.isAvailableAsync();
                if (!isAvailable) {
                  Alert.alert(
                    "Email Unavailable",
                    "No email client is configured on this device.",
                  );
                  return;
                }
                await MailComposer.composeAsync({
                  subject: `Medical Certificate — ${patientFullName}`,
                  body: `Please find attached the medical certificate for ${patientFullName}.`,
                  attachments: [uri],
                });
              } catch {
                Alert.alert("Email Failed", "Could not open email composer.");
              }
            },
          },
        ],
      );
    } catch {
      Alert.alert("Error", "Could not generate the certificate.");
    } finally {
      setLoadingPatientId(null);
    }
  };

  // ── Guard: doctors only ─────────────────────────────────────────────────────
  if (!isDoctor) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDeniedWrap}>
          <Text style={styles.accessDeniedIcon}>🔒</Text>
          <Text style={styles.accessDeniedTitle}>Doctors Only</Text>
          <Text style={styles.accessDeniedText}>
            Medical certificates can only be issued by a doctor account.
          </Text>
        </View>
      </View>
    );
  }

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
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search patients by name..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
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

        {/* List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.promptHeadline}>
            Patients{" "}
            <Text style={styles.patientCount}>({filteredPatients.length})</Text>
          </Text>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <ActivityIndicator size="large" color="#095c29" />
            <Text style={[styles.emptyText, { marginTop: 12 }]}>
              Loading patients...
            </Text>
          </View>
        ) : filteredPatients.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No patients match your search."
              : "No patients with consultation records found."}
          </Text>
        ) : (
          filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => handleSelectPatient(patient)}
              activeOpacity={0.75}
              disabled={loadingPatientId === patient.id}
            >
              <View style={styles.cardInfoGroup}>
                <Text style={styles.cardNameText}>
                  {patient.last_name}, {patient.first_name}
                </Text>
                <Text style={styles.cardSubDetails}>
                  {patient.gender
                    ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                    : "—"}{" "}
                  • DOB: {patient.birthdate ?? "—"}
                </Text>
              </View>

              {loadingPatientId === patient.id ? (
                <ActivityIndicator size="small" color="#095c29" />
              ) : (
                <Text style={styles.chevron}>›</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}