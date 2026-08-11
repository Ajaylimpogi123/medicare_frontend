import { StyleSheet } from "react-native";
import { COLORS, SIZES, SPACING, SHADOWS, FormStyles } from "@/theme";

export const prescriptionHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  historySearchWrapper: {
    ...FormStyles.inputContainerRow,
    backgroundColor: "#f8fafc",
    marginBottom: SPACING.md,
  },
  historySearchInput: {
    ...FormStyles.fieldInput,
  },
  historyDateFilterWrapper: {
    ...FormStyles.inputContainerRow,
    backgroundColor: "#f8fafc",
    marginBottom: SPACING.lg,
  },
  historyDateFilterInput: {
    ...FormStyles.fieldInput,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: SPACING.md,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  badge: {
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardDate: {
    fontSize: 13,
    color: COLORS.muted,
  },
  historySectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  historyMedItem: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  historyNotes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    fontStyle: "italic",
  },
});