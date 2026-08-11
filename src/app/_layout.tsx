import {
  DarkTheme,
  DefaultTheme,
  router,
  Stack,
  ThemeProvider,
} from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/components/context/auth-context";
import { HeaderStyles } from "@/theme";
import "../global.css";

function RootStack() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role === "admin") {
      router.replace("/admin-dashboard");
    } else {
      router.replace("/clinic-selection");
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  const doctorTitle =
    user?.role === "doctor" ? `Hello, Dr. ${user.first_name}! 👋` : null;

  const assistantTitle =
    user?.role === "assistant" ? `Hello, ${user.first_name}! 👋` : null;

  const headerTitle = doctorTitle ?? assistantTitle ?? "Dashboard";

  return (
    <Stack
      screenOptions={
        {
          ...HeaderStyles,
          headerBackTitleVisible: false,
        } as any
      }
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="clinic-selection" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ title: headerTitle }} />
      <Stack.Screen
        name="admin-dashboard"
        options={{ title: "Admin Control Panel" }}
      />
      <Stack.Screen
        name="patient-records"
        options={{ title: "Patient Records" }}
      />
      <Stack.Screen
        name="patient-records/[id]"
        options={{ title: "Patient Profile" }}
      />
      <Stack.Screen
        name="patient-records/[id]/prescriptions"
        options={{ title: "Prescription History" }}
      />
      <Stack.Screen name="consultations" options={{ title: "Consultations" }} />
      <Stack.Screen
        name="consultations/newPrescription"
        options={{ title: "New Prescription" }}
      />
      <Stack.Screen
        name="consultations/rePrescribe"
        options={{ title: "Represcribe" }}
      />
      {/* <Stack.Screen name="transactions" options={{ title: "Transactions" }} /> */}
      <Stack.Screen
        name="brand-directory"
        options={{ title: "Brand Directory" }}
      />
      <Stack.Screen name="generics" options={{ title: "Generics" }} />
      <Stack.Screen name="diseases" options={{ title: "Diseases" }} />
      <Stack.Screen
        name="medical-certificate"
        options={{ title: "Medical Certificate" }}
      />
      <Stack.Screen name="current-queue" options={{ title: "Current Queue" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}
