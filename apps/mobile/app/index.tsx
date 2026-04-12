import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { getCategoryLabel } from "@/constants/categories";
import { useCategory } from "@/contexts/CategoryContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { MOCK_RESOURCES } from "@/data/mockResources";
import type { MockResourceListItem } from "@/data/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

type Section = { title: string; data: MockResourceListItem[] };

function previewText(text: string, max = 320): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function buildSections(items: MockResourceListItem[]): Section[] {
  const map = new Map<string, MockResourceListItem[]>();
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
  SectionList<MockResourceListItem, Section>,
);

export default function Index() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { selectedCategoryId, categoryOptions, sortBy } = useCategory();
  const [refreshing, setRefreshing] = useState(false);

  const filteredSorted = useMemo(() => {
    let list = [...MOCK_RESOURCES];
    if (selectedCategoryId !== "all") {
      const cid = Number(selectedCategoryId);
      list = list.filter((r) => r.category_id === cid);
    }
    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return list;
  }, [selectedCategoryId, sortBy]);

  const sections = useMemo(
    () => buildSections(filteredSorted),
    [filteredSorted],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <ThemedText
        variant="subtitle1"
        color="foreground"
        style={styles.sectionTitle}
      >
        {section.title}
      </ThemedText>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: MockResourceListItem }) => (
      <Pressable
        onPress={() =>
          router.push({ pathname: "/resource/[id]", params: { id: String(item.id) } })
        }
        accessibilityRole="button"
      >
        <Card title={item.title}>
          <ThemedText
            variant="subtitle3"
            color="gray500"
            style={styles.resourceMeta}
          >
            {[item.resource_type?.name, item.relation_type?.name]
              .filter(Boolean)
              .join(" · ")}
          </ThemedText>
          <ThemedText variant="body2" color="gray600">
            {previewText(item.content ?? "")}
          </ThemedText>
        </Card>
      </Pressable>
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: MockResourceListItem) => String(item.id),
    [],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <Card title="Information">
          <ThemedText variant="body2" color="gray600">
            Plusieurs fonctionnalités (compte, publication, progression, etc.) ne
            sont pas encore implémentées.
          </ThemedText>
        </Card>
      </View>
    ),
    [],
  );

  const listEmpty = useMemo(() => {
    if (filteredSorted.length > 0) return null;
    return (
      <Card title="Aucune ressource">
        <ThemedText variant="body2" color="gray600">
          Aucune ressource pour «{" "}
          {getCategoryLabel(selectedCategoryId, categoryOptions)} ».
        </ThemedText>
      </Card>
    );
  }, [filteredSorted.length, selectedCategoryId, categoryOptions]);

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
    fontWeight: "700",
    marginTop: 4,
    paddingHorizontal: 2,
    marginBottom: 6,
  },
  resourceMeta: {
    marginBottom: 6,
  },
});
