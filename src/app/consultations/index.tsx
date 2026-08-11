import { prescriptionStyles as styles } from "@/styles/prescriptionStyles";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type PrescriptionButton = {
  label: string;
  icon: string;
  description: string;
  onPress: () => void;
};

export default function CreatePrescriptionScreen() {
  const buttons: PrescriptionButton[] = [
    {
      label: "New Prescription",
      icon: "📝",
      description: "Create a new medication order",
      onPress: () => router.push("/consultations/newPrescription"),
    },
    {
      label: "Represcribe",
      icon: "🔄",
      description: "Reissue a previous prescription",
      onPress: () => router.push("/consultations/rePrescribe"),
    },
    {
      label: "Medical Certificate",
      icon: "🏥",
      description: "Issue a medical certificate",
      onPress: () => router.push("/medical-certificate"),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Create Prescription</Text>
      <Text style={styles.subheading}>How would you like to prescribe?</Text>

      <View style={styles.grid}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.label}
            activeOpacity={0.85}
            style={styles.card}
            onPress={btn.onPress}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{btn.icon}</Text>
            </View>
            <Text style={styles.cardText}>{btn.label}</Text>
            <Text style={styles.cardSubtext}>{btn.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}