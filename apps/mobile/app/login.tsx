import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { inputStyles } from "@/constants/styles";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

export default function LoginScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleSubmitLogin = useCallback(() => {
    if (!email.trim() || !password) {
      setError("Renseigne l’e-mail et le mot de passe.");
      return;
    }
    Alert.alert("Pas encore implémenté", "La connexion n’est pas disponible pour le moment.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }, [email, password]);

  const handleSubmitRegister = useCallback(() => {
    if (!name.trim()) {
      setError("Renseigne ton nom.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Renseigne l’e-mail et le mot de passe.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    Alert.alert("Pas encore implémenté", "L’inscription n’est pas disponible pour le moment.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }, [name, email, password]);

  const toggleMode = useCallback(() => {
    setIsRegister((prev) => !prev);
    setError(null);
  }, []);

  const scrollContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: contentInsetBottom }],
    [contentInsetBottom],
  );

  return (
    <RootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={scrollContentStyle}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
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
            {isRegister ? "Inscription" : "Connexion"}
          </ThemedText>

          <Card>
            {isRegister ? (
              <>
                <ThemedText variant="subtitle2" color="gray600">
                  Nom
                </ThemedText>
                <TextInput
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    clearError();
                  }}
                  placeholder="Prénom Nom"
                  placeholderTextColor={colors.gray400}
                  autoCapitalize="words"
                  autoComplete="name"
                  style={[
                    inputStyles.base,
                    { borderColor: colors.gray200, color: colors.foreground },
                  ]}
                />
              </>
            ) : null}

            <ThemedText
              variant="subtitle2"
              color="gray600"
              style={isRegister ? styles.fieldLabel : undefined}
            >
              Adresse e-mail
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError();
              }}
              placeholder="exemple@example.com"
              placeholderTextColor={colors.gray400}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={[
                inputStyles.base,
                { borderColor: colors.gray200, color: colors.foreground },
              ]}
            />

            <ThemedText
              variant="subtitle2"
              color="gray600"
              style={styles.fieldLabel}
            >
              Mot de passe
            </ThemedText>
            <TextInput
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearError();
              }}
              placeholder="••••••••"
              placeholderTextColor={colors.gray400}
              secureTextEntry
              autoComplete="password"
              style={[
                inputStyles.base,
                { borderColor: colors.gray200, color: colors.foreground },
              ]}
            />

            {error ? (
              <ThemedText
                variant="body2"
                color="gray600"
                style={styles.errorText}
              >
                {error}
              </ThemedText>
            ) : null}

            <View style={styles.buttonsRow}>
              <Pressable
                onPress={isRegister ? handleSubmitRegister : handleSubmitLogin}
                accessibilityRole="button"
                accessibilityLabel={isRegister ? "S’inscrire" : "Se connecter"}
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <ThemedText
                  variant="subtitle1"
                  color="gray50"
                  style={styles.bold}
                >
                  {isRegister ? "S’inscrire" : "Se connecter"}
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={toggleMode}
                accessibilityRole="button"
                style={[
                  styles.secondaryButton,
                  { borderColor: colors.gray300 },
                ]}
              >
                <ThemedText variant="subtitle1" color="foreground" style={styles.bold}>
                  {isRegister ? "Se connecter" : "S’inscrire"}
                </ThemedText>
              </Pressable>
            </View>
          </Card>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </RootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  pageTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "600",
  },
  fieldLabel: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 12,
    color: "#B91C1C",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
});
