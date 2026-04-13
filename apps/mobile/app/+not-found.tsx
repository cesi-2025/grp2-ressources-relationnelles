import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  const colors = useThemeColors();

  return (
    <RootView>
      <View style={styles.body}>
        <ThemedText variant="headline" color="foreground" style={styles.title}>
          404
        </ThemedText>
        <ThemedText variant="subtitle1" color="gray600" style={styles.subtitle}>
          Page introuvable
        </ThemedText>
        <ThemedText variant="body2" color="gray600" style={styles.hint}>
          Adresse inconnue.
        </ThemedText>

        <Pressable
          onPress={() => router.replace("/login")}
          accessibilityRole="button"
          accessibilityLabel="Retour à la connexion"
          style={[styles.button, { backgroundColor: colors.foreground }]}
        >
          <ThemedText variant="subtitle2" color="gray50">
            Retour à la connexion
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Page précédente"
          style={styles.linkRow}
        >
          <Ionicons name="chevron-back" size={20} color={colors.foreground} />
          <ThemedText variant="subtitle2" color="foreground">
            Page précédente
          </ThemedText>
        </Pressable>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 12,
  },
  hint: {
    marginBottom: 28,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
});
