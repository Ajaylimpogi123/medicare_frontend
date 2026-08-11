import { useAuth } from "@/components/context/auth-context";
import { loginStyles as styles } from "@/styles/loginStyles";
import { COLORS } from "@/theme";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/ui/Button";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  const [activeField, setActiveField] = useState<"email" | "password" | null>(
    null,
  );
  const [floatingValue, setFloatingValue] = useState("");
  const floatingRef = useRef<TextInput>(null);

  const { login } = useAuth();

  const isLocked = lockoutTimeLeft > 0;
  const isActionDisabled = isLocked || isLoading;

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (activeField !== null) {
          dismissFloating();
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [activeField, floatingValue]);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(
      () => setLockoutTimeLeft((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      if (activeField !== null) dismissFloating();
    });
    return () => sub.remove();
  }, [activeField, floatingValue]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLogin = async () => {
    if (isLocked) {
      Alert.alert(
        "Locked Out",
        `Please wait ${formatTime(lockoutTimeLeft)} before trying again.`,
      );
      return;
    }

    // Use refs to get guaranteed current values regardless of React render cycle
    const currentEmail = emailRef.current.trim();
    const currentPassword = passwordRef.current;

    if (!currentEmail || !currentPassword) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(currentEmail, currentPassword);
      setFailedAttempts(0);
      router.replace("/clinic-selection");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ?? error?.message ?? "Unknown error";
      Alert.alert("Error Detail", msg);
      handleFailedAttempt();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    if (nextAttempts >= 5) {
      setLockoutTimeLeft(180);
      Alert.alert(
        "Account Locked",
        "Too many failed attempts. Suspended for 3 minutes.",
      );
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  const openFloating = (field: "email" | "password") => {
    setFloatingValue(field === "email" ? email : password);
    setActiveField(field);
  };

  const dismissFloating = () => {
    if (activeField === "email") {
      setEmail(floatingValue);
      emailRef.current = floatingValue;
    }
    if (activeField === "password") {
      setPassword(floatingValue);
      passwordRef.current = floatingValue;
    }
    setActiveField(null);
    Keyboard.dismiss();
  };

  return (
    <LinearGradient
      colors={["#16a34a", "#22c55e", "#4ade80"]} // your 3 colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        <View style={styles.headerBanner}>
          <Image
            source={require("@/assets/images/CraveCare-Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formSheet}>
          <Text style={styles.sheetTitle}>Login</Text>
          <Text style={styles.sheetSubtitle}>
            Sign in to access your clinic workspace
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => !isActionDisabled && openFloating("email")}
          >
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              value={email}
              style={styles.input}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => !isActionDisabled && openFloating("password")}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              secureTextEntry
              style={styles.input}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {/* 
          <TouchableOpacity
            style={[
              styles.button,
              isActionDisabled && { backgroundColor: COLORS.disabled },
            ]}
            onPress={handleLogin}
            disabled={isActionDisabled}
          >
            <Text style={styles.buttonText}>
              {isLoading
                ? "Logging in..."
                : isLocked
                  ? `Locked (${formatTime(lockoutTimeLeft)})`
                  : "Login"}
            </Text>
          </TouchableOpacity> */}

          <Button
            label={
              isLoading
                ? "Logging in..."
                : isLocked
                  ? `Locked (${formatTime(lockoutTimeLeft)})`
                  : "Login"
            }
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLocked}
          />
        </View>

        <Modal
          visible={activeField !== null}
          transparent
          animationType="none"
          onRequestClose={dismissFloating}
          onShow={() => {
            setTimeout(() => {
              floatingRef.current?.focus();
            }, 100);
          }}
        >
          <TouchableWithoutFeedback onPress={dismissFloating}>
            <View style={styles.floatingBackdrop} />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.floatingBar}>
              <Text style={styles.floatingLabel}>
                {activeField === "email" ? "Email Address" : "Password"}
              </Text>
              <View style={styles.floatingInputRow}>
                <TextInput
                  ref={floatingRef}
                  value={floatingValue}
                  onChangeText={setFloatingValue}
                  onSubmitEditing={dismissFloating}
                  secureTextEntry={activeField === "password"}
                  autoCapitalize="none"
                  keyboardType={
                    activeField === "email" ? "email-address" : "default"
                  }
                  style={styles.floatingDisplayText}
                />
                <TouchableOpacity
                  style={styles.floatingSubmitBtn}
                  onPress={dismissFloating}
                >
                  <Text style={styles.floatingSubmitIcon}>↑</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </LinearGradient>
  );
}
