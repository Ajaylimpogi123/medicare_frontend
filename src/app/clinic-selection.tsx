import { Clinic } from "@/types/clinic";
import { Stack, useRouter } from "expo-router";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/components/context/auth-context";
import { COLORS } from "@/theme";
import { clinicSelectionStyles as styles } from "@/styles/clinicSelectionStyles";
import { LinearGradient } from "expo-linear-gradient";
export default function ClinicSelectionScreen() {
  const router = useRouter();
  const { clinics, selectClinic } = useAuth();

  const handleSelectClinic = async (clinic: Clinic) => {
    await selectClinic(clinic);
    router.replace("/dashboard");
  };

  return (
    <>
      <LinearGradient
        colors={["#16a34a", "#22c55e", "#4ade80"]} // your 3 colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.primary}
          />

          <View style={styles.headerBanner}>
            <Image
              source={require("@/assets/images/CraveCare-Logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formSheet}>
            <Text style={styles.promptHeadline}>Select a Clinic</Text>
            <Text style={styles.subTitle}>
              Choose your assigned clinic branch to proceed.
            </Text>

            <View style={styles.clinicList}>
              {clinics.map((clinic) => (
                <TouchableOpacity
                  key={clinic.id}
                  style={styles.card}
                  onPress={() => handleSelectClinic(clinic)}
                  activeOpacity={0.75}
                >
                  <View style={styles.cardAccentBar} />

                  <View style={styles.cardBody}>
                    <View style={styles.cardTextGroup}>
                      <Text style={styles.cardNameText}>
                        {clinic.clinic_name}
                      </Text>
                      {clinic.address && (
                        <Text style={styles.cardAddress}>{clinic.address}</Text>
                      )}
                    </View>

                    <View style={styles.statusBadgeActive}>
                      <Text style={styles.statusBadgeActiveText}>
                        Available
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.footerNote}>
              Only active branches are accessible. Contact your administrator to
              enable additional branches.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
