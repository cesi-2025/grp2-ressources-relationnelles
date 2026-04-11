import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { inputStyles } from "@/constants/styles";
import {
  RELATION_TYPE_OPTIONS,
  RESOURCE_TYPE_OPTIONS,
  type ResourceMetaOption,
} from "@/constants/resourceMeta";
import { useCategory } from "@/contexts/CategoryContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

function SelectRow({
  label,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  options: readonly ResourceMetaOption[];
  selectedId: number;
  onSelect: (id: number) => void;
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

export default function CreateResourceScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { categoryOptions } = useCategory();

  const validCategories = useMemo(
    () => categoryOptions.filter((category) => category.id !== "all"),
    [categoryOptions],
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [relationTypeId, setRelationTypeId] = useState<number>(1);
  const [resourceTypeId, setResourceTypeId] = useState<number>(1);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (title.trim().length < 3) {
      setError("Le titre doit contenir au moins 3 caractères.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Le contenu doit contenir au moins 10 caractères.");
      return;
    }

    Alert.alert(
      "Pas encore implémenté",
      "La publication de ressources n’est pas disponible pour le moment.",
      [{ text: "OK", onPress: () => router.replace({ pathname: "/" }) }],
    );
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

          <ThemedText variant="headline" color="foreground" style={styles.pageTitle}>
            Proposer une ressource
          </ThemedText>

          <Card>
            <ThemedText variant="subtitle2" color="gray600">
              Titre
            </ThemedText>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError(null);
              }}
              placeholder="Titre de la ressource"
              placeholderTextColor={colors.gray400}
              style={[
                inputStyles.base,
                { borderColor: colors.gray200, color: colors.foreground },
              ]}
            />

            <ThemedText variant="subtitle2" color="gray600" style={styles.fieldLabel}>
              Contenu
            </ThemedText>
            <TextInput
              value={content}
              onChangeText={(text) => {
                setContent(text);
                setError(null);
              }}
              placeholder="Décrivez votre ressource"
              placeholderTextColor={colors.gray400}
              multiline
              textAlignVertical="top"
              style={[
                inputStyles.base,
                styles.multiline,
                { borderColor: colors.gray200, color: colors.foreground },
              ]}
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
              options={RELATION_TYPE_OPTIONS}
              selectedId={relationTypeId}
              onSelect={(id) => {
                setRelationTypeId(id);
                setError(null);
              }}
            />

            <SelectRow
              label="Type de ressource"
              options={RESOURCE_TYPE_OPTIONS}
              selectedId={resourceTypeId}
              onSelect={(id) => {
                setResourceTypeId(id);
                setError(null);
              }}
            />

            <View style={styles.switchRow}>
              <ThemedText variant="body1" color="foreground">
                Rendre la ressource publique
              </ThemedText>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: colors.gray300, true: colors.primary }}
                thumbColor={colors.gray50}
              />
            </View>

            {error ? (
              <ThemedText variant="body2" color="gray600" style={styles.errorText}>
                {error}
              </ThemedText>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Publier la ressource"
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
            >
              <ThemedText variant="subtitle1" color="gray50" style={styles.buttonText}>
                Publier
              </ThemedText>
            </Pressable>
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
  switchRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    marginTop: 12,
    color: "#B91C1C",
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
