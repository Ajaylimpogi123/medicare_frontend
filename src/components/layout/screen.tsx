import { theme } from "@/theme";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps;

// tentative global screen wrapper
// for consistent padding
// and background color across screens

// still need to integrate in each screen
export function Screen({ style, children, ...props }: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
});
