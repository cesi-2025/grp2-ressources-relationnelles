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

const FORGOT_PASSWORD_PATH = "/404-demo" as Href;
const HOME_PATH = "/" as Href;
const REGISTER_PATH = "/register" as Href;

const REDIRECT_MS = 120;

export default function LoginScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const goToRegister = useCallback(() => {
    router.replace(REGISTER_PATH);
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
            Connexion
          </ThemedText>

          <Card>
            <LabeledTextInput
              label="Adresse e-mail"
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
              autoComplete="password"
              editable={!busy}
            />

            <Pressable
              onPress={() => router.push(FORGOT_PASSWORD_PATH)}
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
                onPress={() => void handleSubmitLogin()}
                accessibilityRole="button"
                accessibilityLabel="Se connecter"
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
                    Se connecter
                  </ThemedText>
                )}
              </Pressable>

              <Pressable
                onPress={goToRegister}
                accessibilityRole="button"
                accessibilityLabel="Aller à l’inscription"
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
                  S’inscrire
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
