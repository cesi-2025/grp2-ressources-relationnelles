import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { FullScreenLoadingOverlay } from "@/components/FullScreenLoadingOverlay";
import { LabeledTextInput } from "@/components/LabeledTextInput";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { type ResourceMetaOption } from "@/constants/resourceMeta";
import { useCategory } from "@/contexts/CategoryContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { canEditResource } from "@/lib/resourcePermissions";
import { apiGetResource, apiUpdateResource } from "@/lib/resourceApi";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

function SelectRow({
  label,
  options,
  selectedId,
  onSelect,
  disabled = false,
}: {
  label: string;
  options: readonly ResourceMetaOption[];
  selectedId: number;
  onSelect: (id: number) => void;
  disabled?: boolean;
}) {
  const colors = useThemeColors();

  return (
    <View>
      <ThemedText variant="subtitle2" color="gray600" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              disabled={disabled}
              style={[
                styles.optionChip,
                {
                  borderColor: selected ? colors.primary : colors.gray300,
                  backgroundColor: selected ? colors.primary : colors.background,
                },
              ]}
            >
              <ThemedText variant="body2" color={selected ? "gray50" : "foreground"}>
                {option.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function EditResourceScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { token, isLoggedIn, user } = useAuth();
  const {
    categoryOptions,
    relationTypePickOptions,
    resourceTypePickOptions,
  } = useCategory();
  const params = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(params.id);

  const goToHome = useCallback(() => {
    router.replace({ pathname: "/" });
  }, []);

  const validCategories = useMemo(
    () => categoryOptions.filter((category) => category.id !== "all"),
    [categoryOptions],
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [relationTypeId, setRelationTypeId] = useState<number>(1);
  const [resourceTypeId, setResourceTypeId] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isLoggedIn || !token || Number.isNaN(resourceId)) {
      router.replace({ pathname: "/login" });
      return;
    }
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const resource = await apiGetResource(resourceId);
        if (cancelled) return;
        const ownerRaw = resource.user?.id ?? resource.user_id;
        const ownerId =
          ownerRaw === null || ownerRaw === undefined ? undefined : Number(ownerRaw);
        const userId =
          user?.id === null || user?.id === undefined ? undefined : Number(user.id);
        const canEdit = canEditResource({
          isLoggedIn,
          userId,
          ownerId,
        });
        if (!canEdit) {
          setError("Vous ne pouvez pas modifier cette ressource.");
          return;
        }
        setTitle(resource.title ?? "");
        setContent(resource.content ?? "");
        setCategoryId(resource.category_id ?? 1);
        setRelationTypeId(resource.relation_type_id ?? 1);
        setResourceTypeId(resource.resource_type_id ?? 1);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Chargement impossible.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, resourceId, token, user?.id, user?.role]);

  const handleSubmit = async () => {
    if (!isLoggedIn || !token) {
      router.push({ pathname: "/login" });
      return;
    }
    if (title.trim().length < 3) {
      setError("Le titre doit contenir au moins 3 caractères.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Le contenu doit contenir au moins 10 caractères.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiUpdateResource(token, resourceId, {
        title: title.trim(),
        content: content.trim(),
        category_id: categoryId,
        relation_type_id: relationTypeId,
        resource_type_id: resourceTypeId,
        is_public: true,
      });
      router.replace({
        pathname: "/resource/[id]",
        params: { id: String(resourceId) },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Modification impossible.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <BackButton
            onPress={goToHome}
            accessibilityLabel="Retour à l’accueil"
          />
          <ThemedText variant="headline" color="foreground" style={styles.pageTitle}>
            Modifier la ressource
          </ThemedText>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <Card>
              <LabeledTextInput
                label="Titre"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setError(null);
                }}
                placeholder="Titre de la ressource"
              />

              <LabeledTextInput
                label="Contenu"
                labelStyle={styles.fieldLabel}
                value={content}
                onChangeText={(text) => {
                  setContent(text);
                  setError(null);
                }}
                placeholder="Décrivez votre ressource"
                multiline
                textAlignVertical="top"
                inputStyle={styles.multiline}
              />

              <ThemedText variant="subtitle2" color="gray600" style={styles.fieldLabel}>
                Catégorie
              </ThemedText>
              <View style={styles.optionsWrap}>
                {validCategories.map((category) => {
                  const id = Number(category.id);
                  const selected = id === categoryId;
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => {
                        setCategoryId(id);
                        setError(null);
                      }}
                      disabled={submitting}
                      style={[
                        styles.optionChip,
                        {
                          borderColor: selected ? colors.primary : colors.gray300,
                          backgroundColor: selected ? colors.primary : colors.background,
                        },
                      ]}
                    >
                      <ThemedText
                        variant="body2"
                        color={selected ? "gray50" : "foreground"}
                      >
                        {category.name}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <SelectRow
                label="Type de relation"
                options={relationTypePickOptions}
                selectedId={relationTypeId}
                disabled={submitting}
                onSelect={(id) => {
                  setRelationTypeId(id);
                  setError(null);
                }}
              />

              <SelectRow
                label="Type de ressource"
                options={resourceTypePickOptions}
                selectedId={resourceTypeId}
                disabled={submitting}
                onSelect={(id) => {
                  setResourceTypeId(id);
                  setError(null);
                }}
              />

              <ThemedText variant="body2" color="gray600" style={styles.visibilityHint}>
                La ressource repasse en public après modification.
              </ThemedText>

              {error ? (
                <ThemedText variant="body2" color="danger" style={styles.errorText}>
                  {error}
                </ThemedText>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Enregistrer la ressource"
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
              >
                <ThemedText variant="subtitle1" color="gray50" style={styles.buttonText}>
                  Enregistrer
                </ThemedText>
              </Pressable>
            </Card>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
      <FullScreenLoadingOverlay
        visible={submitting}
        message="Modification..."
        accessibilityLabel="Modification de la ressource"
      />
    </RootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  loader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  fieldLabel: {
    marginTop: 16,
  },
  multiline: {
    minHeight: 120,
  },
  optionsWrap: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  visibilityHint: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 12,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
  },
  buttonText: {
    fontWeight: "600",
  },
});
