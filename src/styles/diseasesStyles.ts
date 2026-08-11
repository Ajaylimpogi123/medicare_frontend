import { StyleSheet } from "react-native";

const diseasesStyles = StyleSheet.create({
  // — Layout —
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroller: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 40,
  },

  // — List Header —
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  promptHeadline: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  addBtn: {
    backgroundColor: "#095c29",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // — Search Bar —
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
    height: "100%",
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 40,
    fontSize: 15,
  },

  // — Disease Card (List) —
  card: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfoGroup: {
    flex: 1,
    gap: 4,
    marginRight: 12,
  },
  cardNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardSubDetails: {
    fontSize: 14,
    color: "#64748b",
  },
  cardActionsGroup: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
  },
  editButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 13,
  },

  // — Disease Detail Card —
  diseaseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 18,
    marginBottom: 16,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  diseaseDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 20,
  },
  archivedBadge: {
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  archivedBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ef4444",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  countCard: {
    flex: 1,
    alignItems: "center",
  },
  countNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#095c29",
  },
  countLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  countDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#e2e8f0",
  },

  // — Filter Tabs —
  filterScroll: {
    marginBottom: 12,
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  filterTabActive: {
    backgroundColor: "#095c29",
    borderColor: "#095c29",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTabTextActive: {
    color: "#ffffff",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 10,
  },

  // — Patient Card —
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 10,
    overflow: "hidden",
  },
  patientCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#095c29",
  },
  patientInfo: {
    flex: 1,
    gap: 2,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  patientSub: {
    fontSize: 13,
    color: "#64748b",
  },
  diagnosedDate: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  badgeCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typePrimary: {
    backgroundColor: "#dbeafe",
  },
  typeSecondary: {
    backgroundColor: "#f3e8ff",
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1e3a5f",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOngoing: {
    backgroundColor: "#fef3c7",
  },
  statusTreated: {
    backgroundColor: "#dcfce7",
  },
  statusReferred: {
    backgroundColor: "#e0e7ff",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  expandChevron: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  expandedBody: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  symptomsBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  rxTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 14,
    marginBottom: 8,
  },
  rxEmpty: {
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  rxCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  rxBrand: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  rxGeneric: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  rxDetail: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  statusUpdateBox: {
    marginTop: 14,
  },
  statusUpdateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  statusBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  statusBtnActive: {
    backgroundColor: "#095c29",
    borderColor: "#095c29",
  },
  statusBtnDisabled: {
    opacity: 0.5,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  statusBtnTextActive: {
    color: "#ffffff",
  },

  // — Create / Edit Form —
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
  textAreaContainer: {
    height: "auto",
    minHeight: 120,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    height: "100%",
  },
  textArea: {
    height: undefined,
    minHeight: 96,
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

  // — Info Alert Box —
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

  // — Bottom Action Bar —
  bottomActionBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: "#ffffff",
  },
  nextActionButtonCall: {
    backgroundColor: "#095c29",
    height: 54,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#095c29",
    shadowOffset: { width: 0, height: 2 },
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
});

export default diseasesStyles;