import { StyleSheet } from "react-native";
import { COLORS, SIZES, SPACING, SHADOWS } from "@/theme";

export const prescriptionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#123524",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: SPACING.md,
    width: "48%",
    ...SHADOWS.soft, // Using your centralized shadow theme
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#eef6f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: COLORS.muted,
  },
});