import { StyleSheet } from "react-native";

// ─── DESIGN TOKENS ──────────────────────────────────────────────
export const COLORS = {
  primary: "#095c29",
  background: "#f5f7fb",
  text: "#0f172a",
  textHeading: "#0f172a",
  textSecondary: "#64748b",
  textDark: "#334155",
  textLight: "#94a3b8",
  muted: "#64748b",
  white: "#ffffff",
  border: "#e2e8f0",
  error: "#ef4444",
  disabled: "#6b7280",

  // ─── NEW ADDITIONS ───
  greyLight: "#f8fafc",
  successLight: "#f0fdf4",
  successBorder: "#dcfce7",
  successDark: "#166534",
  successExtraDark: "#3f6212",
  headerbackgroundcolor: "#299651",
  buttonColor: "#208a47",
};

export const SIZES = {
  radius: 14,
  radiusLarge: 40,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
};

// ─── GLOBAL REUSABLE STYLES ─────────────────────────────────────
export const GlobalStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: 54,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    ...SHADOWS.soft,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700" as const,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bottomActionBar: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

// ─── SHARED FORM FIELD STYLES ────────────────────────────────────
export const FormStyles = StyleSheet.create({
  fieldWrapper: {
    marginBottom: SPACING.xl,
  },
  fieldLabelText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: SPACING.sm,
  },
  inputContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    height: 52,
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: "100%",
  },
  clearBtnClick: {
    padding: SPACING.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtnSymbol: {
    fontSize: 20,
    color: COLORS.muted,
  },
  calendarInlineIcon: {
    fontSize: 18,
    color: COLORS.muted,
  },
  radioFlexContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    paddingVertical: SPACING.xs,
  },
  radioButtonOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  outerRadioRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
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
    borderColor: COLORS.border,
    borderTopLeftRadius: SIZES.radius,
    borderBottomLeftRadius: SIZES.radius,
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
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopRightRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
    paddingHorizontal: 14,
  },
  infoAlertContainerBox: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderRadius: SIZES.radius,
    padding: 14,
    gap: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  infoBadgeIndicatorIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "bold",
    marginTop: 1,
  },
  infoAlertContentBodyTextGroup: {
    flex: 1,
    gap: SPACING.sm,
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
});

// ─── HEADER STYLE ────────────────────────────────────────────────
export const HeaderStyles = {
  headerStyle: {
    backgroundColor: COLORS.headerbackgroundcolor,
  },
  headerTintColor: COLORS.white,
  headerTitleStyle: {
    fontWeight: "bold" as const,
  },
};
