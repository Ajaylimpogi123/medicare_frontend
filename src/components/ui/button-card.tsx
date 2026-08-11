import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, SIZES, SHADOWS } from "@/theme";

type Props = {
  label: string;
  route: any;
  icon: string;
  cardWidth: number;
  description: string;
  allowedRoles?: ("doctor" | "assistant" | "admin")[];
};

export function ButtonCard({ label, route, icon, cardWidth, description }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: `${cardWidth}%` }]}
      onPress={() => router.push(route)}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sub}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  icon: {
    fontSize: 28,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: COLORS.muted,
  },
});