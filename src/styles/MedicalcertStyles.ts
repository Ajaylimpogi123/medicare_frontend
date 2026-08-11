import { StyleSheet } from "react-native";

export const medicalCertStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scroller: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 40 },

  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchBarInput: { flex: 1, fontSize: 15, color: "#0f172a", height: "100%" },
  clearBtnClick: { padding: 4, justifyContent: "center", alignItems: "center" },
  clearBtnSymbol: { fontSize: 20, color: "#94a3b8" },

  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  promptHeadline: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  patientCount: { fontSize: 16, fontWeight: "500", color: "#64748b" },

  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 30,
    fontSize: 14,
  },

  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardInfoGroup: { gap: 4 },
  cardNameText: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  cardSubDetails: { fontSize: 13, color: "#64748b" },
  chevron: { fontSize: 22, color: "#cbd5e1", fontWeight: "400" },

  // Access-denied state (non-doctor roles)
  accessDeniedWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 8,
  },
  accessDeniedIcon: { fontSize: 40, marginBottom: 8 },
  accessDeniedTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  accessDeniedText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});