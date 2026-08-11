import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "@/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: SPACING.xs,
  },
});