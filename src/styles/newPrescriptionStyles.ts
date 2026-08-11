import { StyleSheet } from "react-native";

export const newPrescriptionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroller: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 40,
  },
  promptHeadline: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 52,
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    height: "100%",
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
    backgroundColor: "#ffffff",
  },
  activeOuterRing: {
    borderColor: "#095c29",
  },
  innerRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#095c29",
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
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: "#cbd5e1",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 14,
  },

  // ─── Civil Status pills ────────────────────────────────────────────────────

  civilStatusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  civilStatusPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  civilStatusPillActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#166534",
  },
  civilStatusPillInactive: {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
  },
  civilStatusPillTextActive: {
    color: "#166534",
  },
  civilStatusPillTextInactive: {
    color: "#475569",
  },

  // ─── Row layout (Height/Weight, Temp/BP) ───────────────────────────────────

  fieldRowSplit: {
    flexDirection: "row",
    gap: 10,
  },
  fieldRowSplitItem: {
    flex: 1,
  },

  // ─── Allergies textarea ────────────────────────────────────────────────────

  allergiesInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
  },

  infoAlertContainerBox: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  infoBadgeIndicatorIcon: {
    fontSize: 18,
    color: "#095c29",
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
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  nextActionButtonCall: {
    backgroundColor: "#095c29",
    height: 54,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#095c29",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  nextActionButtonLabelText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
  },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  patientCount: {
    fontSize: 16,
    fontWeight: "400",
    color: "#64748b",
  },
  addPatientBtn: {
    backgroundColor: "#095c29",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addPatientBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontSize: 15,
    fontStyle: "italic",
  },
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardInfoGroup: {
    flex: 1,
  },
  cardNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  cardSubDetails: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 1,
  },
  chevron: {
    fontSize: 22,
    color: "#cbd5e1",
    fontWeight: "300",
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
    paddingHorizontal: 20,
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
    borderColor: "#095c29",
    borderRadius: 10,
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
    backgroundColor: "#095c29",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  floatingSubmitIcon: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});