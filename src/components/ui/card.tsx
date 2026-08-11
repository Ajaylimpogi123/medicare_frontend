import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
});