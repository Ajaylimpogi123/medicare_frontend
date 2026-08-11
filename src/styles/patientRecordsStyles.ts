import { StyleSheet } from "react-native";
import { COLORS, SIZES, SPACING, SHADOWS, GlobalStyles, FormStyles } from "@/theme";

// --- PATIENT RECORDS (LIST & FORM) ---
export const patientRecordsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroller: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  // Search Bar
  searchBarWrapper: {
    ...FormStyles.inputContainerRow,
    backgroundColor: "#f8fafc",
    marginBottom: SPACING.lg,
  },
  searchBarInput: {
    ...FormStyles.fieldInput,
  },

  // List Header
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  promptHeadline: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  patientCount: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.muted,
  },
  addPatientBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  addPatientBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: SPACING.xxxl,
    fontSize: 15,
  },

  // Patient Card
  patientCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfoGroup: {
    flex: 1,
    gap: SPACING.xs,
  },
  cardNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  cardSubDetails: {
    fontSize: 14,
    color: COLORS.muted,
  },
  cardActionsGroup: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginLeft: SPACING.md,
    alignItems: "center",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  editButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: "600",
    fontSize: 13,
  },

  // Form Fields
  fieldWrapper: {
    marginBottom: 20,
  },
  fieldLabelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputContainerRow: {
    ...FormStyles.inputContainerRow,
  },
  fieldInput: {
    ...FormStyles.fieldInput,
  },
  clearBtnClick: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnSymbol: {
    fontSize: 20,
    color: "#94a3b8",
  },
  calendarInlineIcon: {
    fontSize: 18,
    color: "#94a3b8",
  },

  // Radio & Phone
  radioFlexContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    paddingVertical: 4,
  },
  radioButtonOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outerRadioRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  activeOuterRing: {
    borderColor: COLORS.primary,
  },
  innerRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioOptionLabelText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  phoneInputLayoutGroup: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
  },
  countryCodeBadgePlate: {
    width: 65,
    height: "100%",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  countryCodeBadgeLabel: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  phoneNumberNativeInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 14,
  },

  // Info & Actions
  infoAlertContainerBox: {
    ...FormStyles.infoAlertContainerBox,
  },
  infoBadgeIndicatorIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "bold",
    marginTop: 1,
  },
  infoAlertContentBodyTextGroup: {
    flex: 1,
    gap: 8,
  },
  infoAlertMessageTextInline: {
    fontSize: 14,
    color: "#166534",
    lineHeight: 20,
    fontWeight: "500",
  },
  infoAlertSubtextInline: {
    fontSize: 13,
    color: "#3f6212",
    lineHeight: 18,
  },
  bottomActionBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  nextActionButtonCall: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.soft,
  },
  nextActionButtonLabelText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

// --- PATIENT DETAILS (PROFILE & PRESCRIPTIONS) ---
export const patientDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
  },
  loaderText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.muted,
  },
  backBtnFallback: {
    marginTop: SPACING.sm,
  },
  backBtnFallbackText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },

  // Profile Banner
  profileBanner: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
  },
  patientFullName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  patientSubInfo: {
    fontSize: 14,
    color: "#bbf7d0",
  },

  // Content
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // Details
  fieldWrapper: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldValueBox: {
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    backgroundColor: "#f8fafc",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.text,
  },

  // Prescription Card
  prescriptionCard: {
    ...GlobalStyles.card,
    padding: SPACING.lg,
  },
  prescriptionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  prescriptionBadge: {
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  prescriptionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  prescriptionDate: {
    fontSize: 13,
    color: COLORS.muted,
  },
  prescriptionSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  prescriptionMedItem: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  prescriptionNotes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },

  // Empty State
  emptyHistoryBox: {
    alignItems: "center",
    paddingVertical: SPACING.xxxl,
    backgroundColor: "#f8fafc",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  emptyHistoryIcon: {
    fontSize: 28,
  },
  emptyHistoryText: {
    color: "#94a3b8",
    fontSize: 14,
    fontStyle: "italic",
  },
});