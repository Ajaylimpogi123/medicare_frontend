import { StyleSheet } from "react-native";
import { COLORS, SIZES, SHADOWS, GlobalStyles } from "@/theme";

export const dashboardStyles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────────────────────────

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },

  // ─── Header ────────────────────────────────────────────────────────────────

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.text,
  },

  // ─── Welcome Card ──────────────────────────────────────────────────────────

  welcomeCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 14,
  },

  welcomeTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 22,
  },

  // ─── Queue Row ─────────────────────────────────────────────────────────────

  queueRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  queueCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  queueLabel: {
    color: COLORS.muted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  queueCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  queueCount: {
    color: "#FF0000",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 6,
  },
  queuePatientsLabel: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },

  // ─── Clinic Switcher Button ────────────────────────────────────────────────

  clinicSwitcherBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 20,
    gap: 6,
  },
  clinicSwitcherIcon: {
    fontSize: 24,
    textAlign: "center",
  },
  clinicSwitcherLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },
  clinicSwitcherSub: {
    fontSize: 11,
    color: "#4ade80",
    marginTop: 1,
  },

  // ─── Section Headers ───────────────────────────────────────────────────────

  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },

  // ─── Button Grid ───────────────────────────────────────────────────────────

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  // ─── Logout Button ─────────────────────────────────────────────────────────

  logoutButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fca5a5",
    ...SHADOWS.soft,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: "700",
  },

  // ─── Modal Backdrop & Sheet ────────────────────────────────────────────────

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 20,
  },

  // ─── Modal Clinic Cards ────────────────────────────────────────────────────

  modalClinicList: {
    gap: 10,
  },
  modalCard: {
    ...GlobalStyles.card,
    flexDirection: "row",
    overflow: "hidden",
  },
  modalCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#f0fdf4",
  },
  modalCardDisabled: {
    opacity: 0.55,
  },
  modalCardAccent: {
    width: 5,
    backgroundColor: "#cbd5e1",
  },
  modalCardAccentSelected: {
    backgroundColor: COLORS.primary,
  },
  modalCardAccentDisabled: {
    backgroundColor: COLORS.border,
  },
  modalCardBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },
  modalCardNameDisabled: {
    color: "#94a3b8",
  },
  modalCardAddress: {
    fontSize: 13,
    color: COLORS.muted,
  },
  modalCardAddressDisabled: {
    color: "#b0bac9",
  },

  // ─── Badges ────────────────────────────────────────────────────────────────

  badgeActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeActiveText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  badgeAvailable: {
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeAvailableText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  badgeDisabled: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeDisabledText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
  },

  // ─── Modal Dismiss Button ──────────────────────────────────────────────────

  modalDismissBtn: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalDismissBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.muted,
  },
});
