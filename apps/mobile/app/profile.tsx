import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const {
    isReady,
    isLoggedIn,
    user,
    token,
    signOut,
    deleteAccount,
    refreshUser,
  } = useAuth();

  const scrollContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: contentInsetBottom }],
    [contentInsetBottom],
  );

  useFocusEffect(
    useCallback(() => {
      if (!token || !isLoggedIn) return;
      void refreshUser().catch(() => {});
    }, [token, isLoggedIn, refreshUser]),
  );

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace({ pathname: "/" });
    }
  }, [isReady, isLoggedIn]);

  if (!isReady) {
    return (
      <RootView>
        <ThemedText variant="body1" color="gray600" style={styles.loadingText}>
          Chargement…
        </ThemedText>
      </RootView>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (!user) {
    return (
      <RootView>
        <ThemedText variant="body1" color="gray600" style={styles.loadingText}>
          Chargement du profil…
        </ThemedText>
      </RootView>
    );
  }

  const handleSignOut = () => {
    Alert.alert("Déconnexion", "Fermer la session sur cet appareil ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => {
          void signOut().then(() => router.replace({ pathname: "/" }));
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est définitive. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            void deleteAccount()
              .then(() => {
                router.replace({ pathname: "/" });
              })
              .catch(() => {
                Alert.alert(
                  "Erreur",
                  "Impossible de supprimer le compte pour le moment.",
                );
              });
          },
        },
      ],
    );
  };

  return (
    <RootView>
      <Animated.ScrollView
        contentContainerStyle={scrollContentStyle}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <BackButton />

        <ThemedText
          variant="headline"
          color="foreground"
          style={styles.pageTitle}
        >
          Mon profil
        </ThemedText>

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

          <Pressable
            onPress={() => router.push({ pathname: "/favorites" })}
            accessibilityRole="button"
            accessibilityLabel="Voir mes favoris"
            style={[styles.favoritesButton, { borderColor: colors.gray300 }]}
          >
            <ThemedText variant="subtitle1" color="foreground">
              Mes favoris
            </ThemedText>
          </Pressable>

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
            <ThemedText variant="subtitle1" color="danger">
              Supprimer mon compte
            </ThemedText>
          </Pressable>
        </Card>
      </Animated.ScrollView>
    </RootView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  loadingText: {
    padding: 16,
  },
  pageTitle: {
    marginTop: 8,
    marginBottom: 20,
  },
  fieldLabel: {
    marginTop: 16,
  },
  fieldValue: {
    marginTop: 8,
  },
  connectedText: {
    paddingTop: 16,
    marginTop: 16,
    textAlign: "center",
  },
  signOutButton: {
    marginTop: 48,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  favoritesButton: {
    marginTop: 48,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  dashboardButton: {
    marginTop: 12,
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
});
