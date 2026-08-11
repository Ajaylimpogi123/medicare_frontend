import { COLORS, SIZES } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

type ButtonProps = TouchableOpacityProps & {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  loadingLabel?: string;
};

const GRADIENTS: Record<string, [string, string, string]> = {
  primary: ["#16a34a", "#22c55e", "#4ade80"],
  danger: ["#dc2626", "#ef4444", "#f87171"],
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  loadingLabel = "Please wait...",
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Outline variant: no gradient, just border + text
  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          styles.outlineButton,
          isDisabled && styles.outlineDisabled,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.outlineText}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // Secondary variant: flat white/light background, no gradient
  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.secondaryButton,
          isDisabled && styles.secondaryDisabled,
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text} />
        ) : (
          <Text style={styles.secondaryText}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // Primary / danger: gradient buttons
  const colors = isDisabled
    ? [COLORS.disabled, COLORS.disabled, COLORS.disabled]
    : (GRADIENTS[variant] ?? GRADIENTS.primary);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.wrapper, style]}
      {...rest}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryDisabled: {
    opacity: 0.5,
  },

  outlineButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  outlineDisabled: {
    opacity: 0.5,
  },
});
