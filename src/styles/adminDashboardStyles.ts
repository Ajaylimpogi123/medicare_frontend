import { StyleSheet } from "react-native";
import { COLORS, SIZES, SPACING, GlobalStyles } from "@/theme";

export const adminDashboardStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  content: { 
    padding: SPACING.xl, 
    paddingBottom: 40 
  },
  card: { 
    ...GlobalStyles.card, 
    padding: SPACING.xl, 
    marginBottom: SPACING.xl 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: SPACING.sm, 
    color: COLORS.primary 
  },
  text: { 
    fontSize: 16, 
    color: COLORS.text, 
    marginBottom: SPACING.xs 
  },
  grid: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: SPACING.xl 
  },
  actionButton: { 
    flex: 1, 
    backgroundColor: COLORS.border, 
    padding: SPACING.xl, 
    borderRadius: SIZES.radius, 
    marginHorizontal: 5, 
    alignItems: "center" 
  },
  actionText: { 
    fontWeight: "bold", 
    color: COLORS.primary 
  },
  section: { 
    ...GlobalStyles.card, // Reused your global card style
    padding: SPACING.xl, 
    marginBottom: SPACING.xl 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: COLORS.primary, 
    marginBottom: SPACING.md 
  },
  input: { 
    backgroundColor: "#f8fafc", 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.md, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    fontSize: 15, 
    color: COLORS.text, 
    marginBottom: SPACING.md 
  },
  roleRow: { 
    flexDirection: "row", 
    gap: SPACING.sm, 
    marginBottom: SPACING.sm 
  },
  roleButton: { 
    flex: 1, 
    paddingVertical: SPACING.md, 
    borderRadius: SIZES.radius, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    alignItems: "center", 
    backgroundColor: "#f8fafc" 
  },
  roleButtonActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  roleButtonText: { 
    fontWeight: "600", 
    color: COLORS.muted 
  },
  roleButtonTextActive: { 
    color: COLORS.white 
  },
  submitButton: { 
    ...GlobalStyles.primaryButton, 
    marginTop: SPACING.xs 
  },
  submitButtonDisabled: { 
    opacity: 0.6 
  },
  submitButtonText: { 
    color: COLORS.white, 
    fontWeight: "bold", 
    fontSize: 15 
  },
  logoutButton: { 
    backgroundColor: COLORS.error, 
    padding: SPACING.md, 
    borderRadius: SIZES.radius, 
    alignItems: "center", 
    marginTop: SPACING.sm 
  },
  logoutText: { 
    color: COLORS.white, 
    fontWeight: "bold" 
  },
});