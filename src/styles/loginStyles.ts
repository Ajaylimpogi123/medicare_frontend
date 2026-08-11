import { StyleSheet } from "react-native";
import { COLORS, SIZES, GlobalStyles } from "@/theme";

export const loginStyles = StyleSheet.create({
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
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  logo: {
    width: "100%",
    height: "90%",
  },

  buttonWrapper: {
    borderRadius: 16, // match whatever radius `button` already has
    overflow: "hidden", // clips the gradient to the rounded corners
  },
  formSheet: {
    flex: 3,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    paddingHorizontal: 28,
    paddingTop: 35,
  },
  sheetTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.text,
  },
  button: {
    ...GlobalStyles.primaryButton,
    marginTop: 10,
  },
  buttonText: {
    ...GlobalStyles.primaryButtonText,
  },
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
    paddingHorizontal: 16,
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
});
