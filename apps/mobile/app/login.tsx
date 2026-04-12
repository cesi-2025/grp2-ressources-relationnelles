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

const NOT_FOUND_DEMO_PATH = "/404-demo" as Href;
const HOME_PATH = "/" as Href;

const REDIRECT_MS = 120;

export default function LoginScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postAuthLoading, setPostAuthLoading] = useState(false);
  const [postAuthMessage, setPostAuthMessage] = useState("Connexion…");
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

  const handleSubmitLogin = useCallback(async () => {
    if (!email.trim() || !password) {
      setError("Renseigne l’e-mail et le mot de passe.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      goHomeAfterAuth("Connexion…");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connexion impossible.");
      setSubmitting(false);
    }
  }, [email, password, signIn, goHomeAfterAuth]);

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

  const toggleMode = useCallback(() => {
    setIsRegister((prev) => !prev);
    setPasswordConfirm("");
    setError(null);
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
          <BackButton disabled={busy} />

          <ThemedText
            variant="headline"
            color="foreground"
            style={styles.pageTitle}
          >
            {isRegister ? "Inscription" : "Connexion"}
          </ThemedText>

          <Card>
            {isRegister ? (
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
            ) : null}

            <LabeledTextInput
              label="Adresse e-mail"
              labelStyle={isRegister ? styles.fieldLabel : undefined}
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

            {isRegister ? (
              <ThemedText variant="body2" color="gray600" style={styles.emailHint}>
                Un seul compte par adresse e-mail.
              </ThemedText>
            ) : null}

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
              autoComplete={isRegister ? "password-new" : "password"}
              editable={!busy}
            />

            {isRegister ? (
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
                autoComplete="password-new"
                editable={!busy}
              />
            ) : null}

            {!isRegister ? (
              <Pressable
                onPress={() => router.push(NOT_FOUND_DEMO_PATH)}
                accessibilityRole="link"
                accessibilityLabel="Mot de passe oublié"
                style={styles.forgotPasswordRow}
              >
                <ThemedText
                  variant="subtitle1"
                  color="primary"
                  style={[
                    styles.forgotPasswordText,
                    { textDecorationColor: colors.primary },
                  ]}
                >
                  Vous avez oublié votre mot de passe ?
                </ThemedText>
              </Pressable>
            ) : null}

            {error ? (
              <ThemedText
                variant="body2"
                color="danger"
                style={styles.errorText}
              >
                {error}
              </ThemedText>
            ) : null}

            <View style={styles.buttonsRow}>
              <Pressable
                onPress={() =>
                  void (isRegister
                    ? handleSubmitRegister()
                    : handleSubmitLogin())
                }
                accessibilityRole="button"
                accessibilityLabel={isRegister ? "S’inscrire" : "Se connecter"}
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
                    {isRegister ? "S’inscrire" : "Se connecter"}
                  </ThemedText>
                )}
              </Pressable>

              <Pressable
                onPress={toggleMode}
                accessibilityRole="button"
                accessibilityLabel={
                  isRegister ? "Se connecter" : "Passer en inscription"
                }
                disabled={busy}
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: colors.gray300,
                    opacity: busy ? 0.5 : 1,
                  },
                ]}
              >
                <ThemedText
                  variant="subtitle1"
                  color="foreground"
                  style={styles.bold}
                >
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
  pageTitle: {
    marginTop: 16,
    marginBottom: 24,
  },
  forgotPasswordRow: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  forgotPasswordText: {
    textDecorationLine: "underline",
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
