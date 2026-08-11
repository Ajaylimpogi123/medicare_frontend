import { StyleSheet } from "react-native";
import { COLORS, SIZES, GlobalStyles } from "@/theme";

export const clinicSelectionStyles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerBanner: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: { width: "100%", height: "100%" },
  formSheet: {
    flex: 3,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  promptHeadline: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
    lineHeight: 20,
  },
  clinicList: { gap: 12 },
  card: { ...GlobalStyles.card, flexDirection: "row", overflow: "hidden" },
  cardDisabled: { backgroundColor: "#f8fafc", opacity: 0.65 },
  cardAccentBar: { width: 5, backgroundColor: COLORS.primary },
  cardAccentBarDisabled: { backgroundColor: "#cbd5e1" },
  cardBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cardTextGroup: { flex: 1, gap: 4 },
  cardNameText: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  cardNameDisabled: { color: "#94a3b8" },
  cardAddress: { fontSize: 13, color: COLORS.muted },
  cardAddressDisabled: { color: "#b0bac9" },
  statusBadgeActive: {
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeActiveText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusBadgeDisabled: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeDisabledText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.disabled,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
