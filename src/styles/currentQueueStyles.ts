import { COLORS, FormStyles, SHADOWS, SIZES, SPACING } from "@/theme";
import { StyleSheet } from "react-native";

export const currentQueueStyles = StyleSheet.create({

  // ─── Layout ────────────────────────────────────────────────────────────────

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

  // ─── Search Bar ────────────────────────────────────────────────────────────

  searchBarWrapper: {
    ...FormStyles.inputContainerRow,
    backgroundColor: "#f8fafc",
    marginBottom: SPACING.lg,
  },
  searchBarInput: {
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

  // ─── List Header ───────────────────────────────────────────────────────────

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
  emptyText: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: SPACING.xxxl,
    fontSize: 15,
  },

  // ─── Buttons ───────────────────────────────────────────────────────────────

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
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: COLORS.muted,
    fontWeight: "600",
    fontSize: 14,
  },

  // ─── Queue Patient Cards ────────────────────────────────────────────────────

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
  queueBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  queueBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
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
    flexShrink: 0,
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
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    backgroundColor: "#fee2e2",
  },
  removeBtnText: {
    color: COLORS.error,
    fontWeight: "600",
    fontSize: 13,
  },

  // ─── Form Fields ────────────────────────────────────────────────────────────

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
  calendarInlineIcon: {
    fontSize: 18,
    color: "#94a3b8",
  },

  // ─── Radio Buttons ─────────────────────────────────────────────────────────

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

  // ─── Phone Input ───────────────────────────────────────────────────────────

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

  // ─── Info Alert ────────────────────────────────────────────────────────────

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

  // ─── Floating Field Bar (tap-to-edit bar above the keyboard) ────────────────

  floatingBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  floatingBar: {
    backgroundColor: "#2a2d3a",
    paddingHorizontal: SPACING.lg,
    paddingTop: 14,
    paddingBottom: 24,
  },
  floatingLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
  },
  floatingInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    backgroundColor: "#1e2130",
    paddingHorizontal: 14,
    minHeight: 52,
  },
  floatingDisplayText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 10,
  },
  floatingSubmitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  floatingSubmitIcon: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // ─── Bottom Action Bar ─────────────────────────────────────────────────────

  bottomActionBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    gap: SPACING.md,
  },
  nextActionButtonCall: {
    flex: 1,
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