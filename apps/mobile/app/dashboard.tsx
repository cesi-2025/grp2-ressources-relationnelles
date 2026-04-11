import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { MOCK_PROGRESSION } from "@/data/mockProgression";
import type { MockProgressionRow } from "@/data/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type ResourceItem = { id: number; title: string; content?: string };

function resolveResource(row: MockProgressionRow): ResourceItem | null {
  if (row.resource) {
    return { id: row.resource.id, title: row.resource.title };
  }
  if (typeof row.resource_id === "number") {
    return { id: row.resource_id, title: `Ressource #${row.resource_id}` };
  }
  return null;
}

function ResourceListSection({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: MockProgressionRow[];
  emptyLabel: string;
}) {
  const colors = useThemeColors();
  const resources = useMemo(
    () => rows.map(resolveResource).filter((r): r is ResourceItem => r !== null),
    [rows],
  );

  return (
    <Card title={title}>
      {resources.length === 0 ? (
        <ThemedText variant="body2" color="gray600">
          {emptyLabel}
        </ThemedText>
      ) : (
        resources.map((resource) => (
          <Pressable
            key={`${title}-${resource.id}`}
            onPress={() =>
              router.push({
                pathname: "/resource/[id]",
                params: { id: String(resource.id) },
              })
            }
            accessibilityRole="button"
            style={[styles.itemRow, { borderBottomColor: colors.gray200 }]}
          >
            <View style={styles.itemRowLeft}>
              <Ionicons name="document-text-outline" size={16} color={colors.gray500} />
              <ThemedText variant="body1" color="foreground">
                {resource.title}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
          </Pressable>
        ))
      )}
    </Card>
  );
}

export default function DashboardScreen() {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  return (
    <RootView>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
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
          Ma progression
        </ThemedText>

        <ThemedText variant="body2" color="gray600" style={styles.banner}>
          La synchronisation de votre progression n’est pas encore implémentée ; les
          listes ci-dessous servent d’aperçu.
        </ThemedText>

        <ResourceListSection
          title="Favoris"
          rows={MOCK_PROGRESSION.favorites}
          emptyLabel="Aucune ressource en favoris."
        />
        <View style={styles.sectionGap} />
        <ResourceListSection
          title="Exploitées"
          rows={MOCK_PROGRESSION.exploited}
          emptyLabel="Aucune ressource exploitée."
        />
        <View style={styles.sectionGap} />
        <ResourceListSection
          title="Mises de côté"
          rows={MOCK_PROGRESSION.set_aside}
          emptyLabel="Aucune ressource mise de côté."
        />
      </ScrollView>
    </RootView>
  );
}

const styles = StyleSheet.create({
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
  banner: {
    marginBottom: 16,
  },
  sectionGap: {
    height: 12,
  },
  itemRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
});
