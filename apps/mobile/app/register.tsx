import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { FullScreenLoadingOverlay } from "@/components/FullScreenLoadingOverlay";
import { LabeledTextInput } from "@/components/LabeledTextInput";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, type Href } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const HOME_PATH = "/" as Href;
const LOGIN_PATH = "/login" as Href;

const REDIRECT_MS = 120;

export default function RegisterScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postAuthLoading, setPostAuthLoading] = useState(false);
  const [postAuthMessage, setPostAuthMessage] = useState("Compte créé…");
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const goHomeAfterAuth = useCallback((message: string) => {
    setSubmitting(false);
    setPostAuthMessage(message);
    setPostAuthLoading(true);
    setTimeout(() => {
      router.replace(HOME_PATH);
    }, REDIRECT_MS);
  }, []);

  const handleSubmitRegister = useCallback(async () => {
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
    if (!passwordConfirm) {
      setError("Confirme ton mot de passe.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signUp(name, email, password);
      goHomeAfterAuth("Compte créé…");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inscription impossible.");
      setSubmitting(false);
    }
  }, [name, email, password, passwordConfirm, signUp, goHomeAfterAuth]);

  const goToLogin = useCallback(() => {
    router.replace(LOGIN_PATH);
  }, []);

  const scrollContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: contentInsetBottom }],
    [contentInsetBottom],
  );

  const busy = submitting || postAuthLoading;

  return (
    <RootView>
      <FullScreenLoadingOverlay visible={postAuthLoading} message={postAuthMessage} />
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
          <BackButton
            disabled={busy}
            onPress={goToLogin}
            accessibilityLabel="Retour à la connexion"
          />

          <ThemedText
            variant="headline"
            color="foreground"
            style={styles.pageTitle}
          >
            Inscription
          </ThemedText>

          <Card>
            <LabeledTextInput
              label="Nom"
              value={name}
              onChangeText={(t) => {
                setName(t);
                clearError();
              }}
              placeholder="Prénom Nom"
              autoCapitalize="words"
              autoComplete="name"
              editable={!busy}
            />

            <LabeledTextInput
              label="Adresse e-mail"
              labelStyle={styles.fieldLabel}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError();
              }}
              placeholder="exemple@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!busy}
            />

            <ThemedText variant="body2" color="gray600" style={styles.emailHint}>
              Un seul compte par adresse e-mail.
            </ThemedText>

            <LabeledTextInput
              label="Mot de passe"
              labelStyle={styles.fieldLabel}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearError();
              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              autoComplete="password-new"
              editable={!busy}
            />

            <LabeledTextInput
              label="Confirmer le mot de passe"
              labelStyle={styles.fieldLabel}
              value={passwordConfirm}
              onChangeText={(t) => {
                setPasswordConfirm(t);
                clearError();
              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              autoComplete="password-new"
              editable={!busy}
            />

            {error ? (
              <ThemedText
                variant="body2"
                color="danger"
                style={styles.errorText}
              >
                {error}
              </ThemedText>
            ) : null}

            <View style={styles.submitBlock}>
              <Pressable
                onPress={() => void handleSubmitRegister()}
                accessibilityRole="button"
                accessibilityLabel="S’inscrire"
                disabled={busy}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: busy ? 0.7 : 1,
                  },
                ]}
              >
                {busy ? (
                  <ActivityIndicator color={colors.gray50} />
                ) : (
                  <ThemedText
                    variant="subtitle1"
                    color="gray50"
                    style={styles.bold}
                  >
                    S’inscrire
                  </ThemedText>
                )}
              </Pressable>

              <Pressable
                onPress={goToLogin}
                accessibilityRole="link"
                accessibilityLabel="Vous avez un compte, se connecter"
                disabled={busy}
                style={[styles.loginLinkRow, busy && styles.loginLinkDisabled]}
              >
                <View style={styles.loginLinkInner}>
                  <ThemedText variant="body2" color="gray600">
                    Vous avez un compte ?{" "}
                  </ThemedText>
                  <ThemedText
                    variant="subtitle1"
                    color="primary"
                    style={[
                      styles.linkUnderline,
                      { textDecorationColor: colors.primary },
                    ]}
                  >
                    Se connecter
                  </ThemedText>
                </View>
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
  pageTitle: {
    marginTop: 16,
    marginBottom: 24,
  },
  bold: {
    fontWeight: "600",
  },
  fieldLabel: {
    marginTop: 16,
  },
  emailHint: {
    marginTop: 8,
  },
  errorText: {
    marginTop: 12,
  },
  submitBlock: {
    marginTop: 24,
    gap: 16,
    alignSelf: "stretch",
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
  },
  loginLinkRow: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  loginLinkDisabled: {
    opacity: 0.5,
  },
  loginLinkInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  linkUnderline: {
    textDecorationLine: "underline",
  },
});
