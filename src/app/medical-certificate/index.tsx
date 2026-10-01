import { fetchPatientConsultations } from "@/api/consultation";
import { fetchAllPatients } from "@/api/patient";
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

// ── Page size constants ───────────────────────────────────────────────────────
// expo-print's printAsync/printToFileAsync ignore the CSS @page size — they
// default to US Letter (612x792pt) unless width/height are passed explicitly.
// A5 = 148mm x 210mm = 5.83in x 8.27in = 420pt x 595pt (at 72pt/inch).
const A5_WIDTH_PT = 420;
const A5_HEIGHT_PT = 595;

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Escape user-supplied text before interpolating it into the certificate HTML
const esc = (value: string | null | undefined) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ── PDF HTML Generator ────────────────────────────────────────────────────────
// Blank fill-in-the-blank template — the doctor handwrites the clinical content
// after printing. Only the patient's name, doctor/clinic letterhead, and
// today's date are pre-filled from data we already have.
// Font sizes are tuned to fit A5 (5.8in x 8.3in) on one page.

const generateMedicalCertificateHTML = (
  patientFullName: string,
  doctorName: string,
  doctorSpecialization: string,
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
    @page { size: A5 portrait; margin: 0.35in; }
    html, body { width: 148mm; height: 210mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 2px double #000;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .doctor-name { font-size: 15pt; font-weight: bold; margin-bottom: 2px; }
    .clinic-info { font-size: 11.5pt; line-height: 1.25; margin-top: 3px; }
    .date-row { text-align: right; font-size: 12pt; margin-bottom: 12px; }
    .date-line {
      display: inline-block;
      border-bottom: 0.75px solid #444;
      min-width: 110px;
      padding-bottom: 2px;
      margin-left: 6px;
    }
    .title {
      text-align: center;
      font-size: 15pt;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .salutation { font-size: 12pt; margin-bottom: 10px; }
    .fill {
      display: inline-block;
      border-bottom: 0.75px solid #444;
      padding: 0 4px;
    }
    .cert-para { font-size: 12pt; line-height: 1.6; }
    .cert-para .indent { padding-left: 16px; }
    .fill-name { min-width: 150px; }
    .fill-full { display: block; width: 100%; margin-bottom: 2px; }
    .fill-date { min-width: 120px; }
    .diagnosis-row { font-size: 12pt; line-height: 1.4; margin-top: 4px; }
    .diagnosis-row .fill-inline { min-width: 170px; }
    .blank-full {
      display: block;
      border-bottom: 0.75px solid #444;
      height: 16px;
    }
    .recommendation-row { font-size: 12pt; line-height: 1.4; margin-top: 8px; }
    .recommendation-row .fill-inline { min-width: 190px; }
    .closing { font-size: 12pt; margin-top: 10px; line-height: 1.4; }
    .signature-block { margin-top: 50px; text-align: right; }
    .signature-name { font-size: 12pt; font-weight: bold; text-align: right; }
    .signature-lic { font-size: 12pt; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <div class="doctor-name">${esc(doctorName)}</div>
    <div class="clinic-info">
      <div><strong>${esc(doctorSpecialization)}</strong></div>
      <div><strong>${esc(clinicName)}</strong></div>
      ${clinicAddress ? `<div>${esc(clinicAddress)}</div>` : ""}
      ${clinicContact ? `<div>Tel No.: ${esc(clinicContact)}</div>` : ""}
    </div>
  </div>

  <div class="date-row">Date: <span class="date-line">${formatDisplayDate(issuedAt)}</span></div>

  <div class="title">Medical Certificate</div>

  <div class="salutation">To whom it may concern,</div>

  <div class="cert-para">
    <span class="indent">This is to certify that</span>
    <span class="fill fill-name">${esc(patientFullName)}</span> of
    <span class="fill fill-full">&nbsp;</span>
    has consulted me on <span class="fill fill-date">&nbsp;</span>
  </div>

  <div class="diagnosis-row">
    with the following diagnosis<span class="fill fill-inline">&nbsp;</span>
  </div>
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
    <div class="signature-name">${esc(doctorName)}</div>
    <div class="signature-lic">Lic No.: ${esc(prcNumber) || "____________"}</div>
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
      const allPatients: Patient[] = await fetchAllPatients();

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
      const doctorName = user
        ? `${user.first_name} ${user.last_name}, M.D.`
        : "Physician";
      const doctorSpecialization = user?.specialization ?? "";
      const prcNumber = user?.prc_id ?? "";
      const clinicName = activeClinic?.clinic_name ?? "Clinic";
      const clinicAddress = activeClinic?.address ?? "";
      const clinicContact = activeClinic?.phone_number ?? "";
      const patientFullName = `${patient.first_name} ${patient.last_name}`;
      const issuedAt = new Date();
      console.log("activeClinic", JSON.stringify(activeClinic));
      const html = generateMedicalCertificateHTML(
        patientFullName,
        doctorName,
        doctorSpecialization,
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
                // width/height (in points) force A5 — expo-print ignores
                // the CSS @page size and defaults to Letter otherwise.
                await Print.printAsync({
                  html,
                  width: A5_WIDTH_PT,
                  height: A5_HEIGHT_PT,
                });
              } catch (err: any) {
                Alert.alert(
                  "Print Failed",
                  err?.message ?? "Something went wrong.",
                );
              }
            },
          },
          {
            text: "📧 Send via Email",
            onPress: async () => {
              try {
                const { uri } = await Print.printToFileAsync({
                  html,
                  width: A5_WIDTH_PT,
                  height: A5_HEIGHT_PT,
                });
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
                    ? patient.gender.charAt(0).toUpperCase() +
                      patient.gender.slice(1)
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
