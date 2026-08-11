import { StyleSheet } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/theme";

export const rePrescribeStyles = StyleSheet.create({

  // ─── Layout ────────────────────────────────────────────────────────────────

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroller: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },

  // ─── Search Bar ────────────────────────────────────────────────────────────

  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  clearBtnClick: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  clearBtnSymbol: {
    fontSize: 20,
    color: COLORS.muted,
    lineHeight: 22,
  },

  // ─── List Header ───────────────────────────────────────────────────────────

  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  promptHeadline: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  patientCount: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.muted,
  },

  // ─── Patient Cards ─────────────────────────────────────────────────────────

  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.soft,
  },
  cardInfoGroup: {
    flex: 1,
  },
  cardNameText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  cardSubDetails: {
    fontSize: 13,
    color: COLORS.muted,
  },
  chevron: {
    fontSize: 22,
    color: "#cbd5e1",
    fontWeight: "300",
    paddingLeft: 8,
  },

  // ─── Empty State ───────────────────────────────────────────────────────────

  emptyText: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 48,
    fontSize: 15,
  },

});