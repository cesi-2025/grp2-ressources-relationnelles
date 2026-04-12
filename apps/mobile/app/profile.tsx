import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { MOCK_USER } from "@/data/mockUser";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const user = MOCK_USER;

  const handleSignOut = () => {
    Alert.alert("Pas encore implémenté", "La déconnexion n’est pas disponible pour le moment.", [
      { text: "OK" },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Pas encore implémenté",
      "La suppression de compte n’est pas disponible pour le moment.",
    );
  };

  return (
    <RootView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          <ThemedText variant="subtitle1" color="foreground">
            Retour
          </ThemedText>
        </Pressable>

        <ThemedText
          variant="headline"
          color="foreground"
          style={styles.pageTitle}
        >
          Mon profil
        </ThemedText>

        <Pressable
          onPress={() => router.push({ pathname: "/login" })}
          style={styles.linkRow}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir l’écran connexion"
        >
          <ThemedText variant="subtitle2" color="primary">
            Voir l’écran connexion
          </ThemedText>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>

        <Card>
          <ThemedText variant="subtitle2" color="gray600">
            Nom
          </ThemedText>
          <ThemedText
            variant="body1"
            color="foreground"
            style={styles.fieldValue}
          >
            {user.name}
          </ThemedText>

          <ThemedText
            variant="subtitle2"
            color="gray600"
            style={styles.fieldLabel}
          >
            E-mail
          </ThemedText>
          <ThemedText
            variant="body1"
            color="foreground"
            style={styles.fieldValue}
          >
            {user.email}
          </ThemedText>

          <View style={styles.badge}>
            <ThemedText variant="body2" color="gray600">
              Compte : fonctionnalités à venir
            </ThemedText>
          </View>

          <ThemedText
            variant="body1"
            color="foreground"
            style={styles.connectedText}
          >
            L’authentification n’est pas encore implémentée.
          </ThemedText>

          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Se déconnecter"
            style={[styles.signOutButton, { borderColor: colors.gray300 }]}
          >
            <ThemedText variant="subtitle1" color="foreground">
              Se déconnecter
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Supprimer mon compte"
            style={[styles.deleteButton, { borderColor: colors.gray300 }]}
          >
            <ThemedText variant="subtitle1" style={styles.deleteButtonText}>
              Supprimer mon compte
            </ThemedText>
          </Pressable>
        </Card>
      </ScrollView>
    </RootView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  pageTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 4,
  },
  fieldLabel: {
    marginTop: 16,
  },
  fieldValue: {
    marginTop: 8,
  },
  badge: {
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  connectedText: {
    paddingTop: 16,
    marginTop: 16,
    textAlign: "center",
  },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  deleteButtonText: {
    color: "#B91C1C",
  },
});
