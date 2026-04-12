import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { getCategoryLabel } from "@/constants/categories";
import { useCategory } from "@/contexts/CategoryContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { apiListResources, type ApiResource } from "@/lib/resourceApi";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

type Section = { title: string; data: ApiResource[] };

function previewText(text: string, max = 320): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function normalizeLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function categoryColor(title: string): "primary" | "secondary" | "accent" | "foreground" {
  const label = normalizeLabel(title);

  if (label.includes("empathie") || label.includes("collaboration")) return "accent";
  if (label.includes("ecoute active") || label.includes("intelligence emotionnelle")) {
    return "secondary";
  }
  if (label.includes("gestion des conflits") || label.includes("conflits")) return "primary";
  if (label.includes("communication")) return "primary";
  if (label.includes("developpement personnel")) return "secondary";
  if (label.includes("loisirs")) return "accent";

  return "foreground";
}

function formatRelationType(value?: string): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "Relation: Non renseignée";
  return `Relation: ${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function buildSections(items: ApiResource[]): Section[] {
  const map = new Map<string, ApiResource[]>();
  for (const r of items) {
    const title = r.category?.name?.trim() || "Sans catégorie";
    const list = map.get(title);
    if (list) list.push(r);
    else map.set(title, [r]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([title, data]) => ({ title, data }));
}

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList<ApiResource, Section>,
);

export default function Index() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const {
    selectedCategoryId,
    categoryOptions,
    relationTypeId,
    relationTypeOptions,
  } = useCategory();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<ApiResource[]>([]);

  const loadResources = useCallback(async (showRefreshing: boolean) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    try {
      const baseList = await apiListResources({});
      const filtered = baseList.filter((resource) => {
        const categoryOk =
          selectedCategoryId === "all" ||
          resource.category_id === Number(selectedCategoryId);
        const relationOk =
          relationTypeId === "all" ||
          resource.relation_type_id === Number(relationTypeId);
        return categoryOk && relationOk;
      });
      setResources(filtered);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategoryId, relationTypeId]);

  useEffect(() => {
    void loadResources(false);
  }, [loadResources]);

  const sections = useMemo(
    () => buildSections(resources),
    [resources],
  );

  const onRefresh = useCallback(() => {
    void loadResources(true);
  }, [loadResources]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <View style={styles.sectionTitleRow}>
        <ThemedText
          variant="headline"
          color="foreground"
          style={styles.sectionTitle}
        >
          {section.title}
        </ThemedText>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ApiResource }) => (
      <Pressable
        onPress={() =>
          router.push({ pathname: "/resource/[id]", params: { id: String(item.id) } })
        }
        accessibilityRole="button"
      >
        <Card>
          <ThemedText
            variant="headline"
            color="foreground"
            style={styles.resourceTitle}
          >
            {item.title}
          </ThemedText>
          <ThemedText
            variant="subtitle1"
            color="foreground"
            style={styles.relationTypeLabel}
          >
            {formatRelationType(item.relation_type?.name)}
          </ThemedText>
          <View style={styles.metaRow}>
            <ThemedText
              variant="subtitle2"
              color="foreground"
              style={styles.resourceTypeLabel}
            >
              {item.resource_type?.name ?? "Type non renseigné"}
            </ThemedText>
            {item.category?.name ? (
              <ThemedText
                variant="subtitle3"
                color={categoryColor(item.category.name)}
                style={styles.categoryRight}
              >
                {item.category.name}
              </ThemedText>
            ) : null}
          </View>
          <ThemedText variant="body2" color="gray600">
            {previewText(item.content ?? "")}
          </ThemedText>
        </Card>
      </Pressable>
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: ApiResource) => String(item.id),
    [],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        {error ? (
          <Card title="Erreur">
            <ThemedText variant="body2" color="danger">
              {error}
            </ThemedText>
          </Card>
        ) : null}
      </View>
    ),
    [error],
  );

  const listEmpty = useMemo(() => {
    if (loading || resources.length > 0) return null;
    const relationName =
      relationTypeOptions.find((option) => option.id === relationTypeId)?.name ?? null;
    const relationLabel = relationTypeId === "all" ? null : `relation « ${relationName ?? relationTypeId} »`;
    const categoryLabel =
      selectedCategoryId === "all"
        ? null
        : getCategoryLabel(selectedCategoryId, categoryOptions);
    return (
      <Card title="Aucune ressource">
        <ThemedText variant="body2" color="gray600">
          Aucune ressource
          {categoryLabel ? ` pour « ${categoryLabel} »` : ""}
          {relationLabel ? `${categoryLabel ? " et " : " pour "}${relationLabel}` : ""}.
        </ThemedText>
      </Card>
    );
  }, [
    loading,
    resources.length,
    selectedCategoryId,
    categoryOptions,
    relationTypeId,
    relationTypeOptions,
  ]);

  const listContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: contentInsetBottom }],
    [contentInsetBottom],
  );

  return (
    <RootView>
      <Header />
      <AnimatedSectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listContentStyle}
        style={styles.scroll}
      />
    </RootView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  listHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 8,
    fontWeight: "700",
  },
  relationTypeLabel: {
    marginBottom: 3,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  resourceTypeLabel: {
    fontWeight: "600",
    flex: 1,
  },
  categoryRight: {
    textAlign: "right",
    flexShrink: 0,
  },
  loadingWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
