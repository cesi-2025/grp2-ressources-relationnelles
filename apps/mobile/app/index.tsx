import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { getCategoryLabel } from "@/constants/categories";
import { useCategory } from "@/contexts/CategoryContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  buildSections,
  formatResourceType,
  isPublishedHomeResource,
  previewText,
} from "@/lib/homeResourceUtils";
import { apiListResourcesAllPages, type ApiResource } from "@/lib/resourceApi";
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

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList<ApiResource, Section>,
);

function ResourceCard({
  item,
  contentBorderColor,
}: {
  item: ApiResource;
  contentBorderColor: string;
}) {
  return (
    <Card style={styles.resourceCard}>
      {/* Bloc 1: titre */}
      <ThemedText
        variant="headline"
        color="foreground"
        style={styles.resourceTitle}
      >
        {item.title}
      </ThemedText>

      {/* Bloc 2: type de relation */}
      <ThemedText
        variant="subtitle1"
        color="foreground"
        style={styles.relationTypeLabel}
      >
        {"Relation: " + (item.relation_type?.name ?? "Relation non renseignée")}
      </ThemedText>

      {/* Bloc 3: type de ressource */}
      <ThemedText
        variant="subtitle2"
        color="foreground"
        style={styles.resourceTypeLabel}
      >
        {formatResourceType(item.resource_type?.name) ?? "Type non renseigné"}
      </ThemedText>

      {/* Bloc 4: contenu */}

      <ThemedText
        variant="body2"
        color="gray600"
        style={styles.resourceContent}
      >
        {previewText(item.content ?? "")}
      </ThemedText>
    </Card>
  );
}

export default function Index() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const {
    selectedCategoryId,
    categoryOptions,
    relationTypeId,
    relationTypeOptions,
    sortBy,
  } = useCategory();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<ApiResource[]>([]);

  const loadResources = useCallback(
    async (showRefreshing: boolean) => {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const baseList = await apiListResourcesAllPages({
          categoryId: selectedCategoryId,
          relationTypeId,
          sortBy,
        });
        const publishedList = baseList.filter(isPublishedHomeResource);
        setResources(publishedList);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Chargement impossible.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [relationTypeId, selectedCategoryId, sortBy],
  );

  useEffect(() => {
    void loadResources(false);
  }, [loadResources]);

  const sections = useMemo(() => {
    return buildSections(resources);
  }, [resources]);

  const onRefresh = useCallback(() => {
    void loadResources(true);
  }, [loadResources]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => {
      return (
        <View style={styles.sectionTitleRow}>
          <ThemedText
            variant="headline"
            color="foreground"
            style={styles.sectionTitle}
          >
            {section.title}
          </ThemedText>
        </View>
      );
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ApiResource }) => {
      const handlePress = () => {
        router.push({
          pathname: "/resource/[id]",
          params: { id: String(item.id) },
        });
      };

      return (
        <Pressable onPress={handlePress} accessibilityRole="button">
          <ResourceCard item={item} contentBorderColor={colors.gray200} />
        </Pressable>
      );
    },
    [colors.gray200],
  );

  const keyExtractor = useCallback((item: ApiResource) => {
    return String(item.id);
  }, []);

  const listHeader = useMemo(() => {
    return (
      <View style={styles.listHeader}>
        {error ? (
          <Card title="Erreur">
            <ThemedText variant="body2" color="danger">
              {error}
            </ThemedText>
          </Card>
        ) : null}
      </View>
    );
  }, [error]);

  const listEmpty = useMemo(() => {
    if (loading || resources.length > 0) {
      return null;
    }

    const relationName =
      relationTypeOptions.find((option) => option.id === relationTypeId)
        ?.name ?? null;
    const relationLabel =
      relationTypeId === "all"
        ? null
        : `relation « ${relationName ?? relationTypeId} »`;
    const categoryLabel =
      selectedCategoryId === "all"
        ? null
        : getCategoryLabel(selectedCategoryId, categoryOptions);
    return (
      <Card title="Aucune ressource">
        <ThemedText variant="body2" color="gray600">
          Aucune ressource
          {categoryLabel ? ` pour « ${categoryLabel} »` : ""}
          {relationLabel
            ? `${categoryLabel ? " et " : " pour "}${relationLabel}`
            : ""}
          .
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

  const listFooter = useMemo(() => {
    if (!loading) {
      return null;
    }

    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }, [colors.primary, loading]);

  const listRefreshControl = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[colors.primary]}
        tintColor={colors.primary}
      />
    );
  }, [colors.primary, onRefresh, refreshing]);

  return (
    <RootView>
      <Header />
      <View style={styles.listContainer}>
        <AnimatedSectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={listFooter}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={listRefreshControl}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContentStyle}
          style={styles.scroll}
        />
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    alignSelf: "stretch",
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
    textAlign: "left",
    alignSelf: "stretch",
  },
  relationTypeLabel: {
    marginBottom: 6,
    fontWeight: "700",
    textAlign: "left",
    alignSelf: "stretch",
  },
  resourceTypeLabel: {
    fontWeight: "600",
    textAlign: "left",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  resourceCard: {
    minHeight: 300,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 4,
  },
  resourceContent: {
    width: "100%",
    paddingVertical: 50,
    textAlign: "center",
    justifyContent: "center",
  },
  loadingWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
