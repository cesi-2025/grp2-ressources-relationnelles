import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { apiGetProgression } from "@/lib/resourceApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

type ResourceItem = { id: number; title: string };

function resolveResource(row: {
  resource_id?: number;
  resource?: { id: number; title?: string };
}): ResourceItem | null {
  if (row.resource && typeof row.resource.id === "number") {
    const id = row.resource.id;
    const label = row.resource.title?.trim();
    return {
      id,
      title: label && label.length > 0 ? label : `Ressource #${id}`,
    };
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
  rows: { resource_id?: number; resource?: { id: number; title: string } }[];
  emptyLabel: string;
}) {
  const colors = useThemeColors();
  const resources = useMemo(
    () =>
      rows.map(resolveResource).filter((r): r is ResourceItem => r !== null),
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
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.gray500}
              />
              <ThemedText variant="body1" color="foreground">
                {resource.title}
              </ThemedText>
            </View>
            <View style={styles.itemActions}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.gray500}
              />
            </View>
          </Pressable>
        ))
      )}
    </Card>
  );
}

export default function DashboardScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { token, isLoggedIn, isReady } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progression, setProgression] = useState<Awaited<
    ReturnType<typeof apiGetProgression>
  > | null>(null);

  const loadData = useCallback(
    async (showRefreshing: boolean) => {
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      try {
        setProgression(await apiGetProgression(token));
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Chargement impossible.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace({ pathname: "/login" });
      return;
    }
    void loadData(false);
  }, [isLoggedIn, isReady, loadData]);

  const onRefresh = useCallback(() => {
    void loadData(true);
  }, [loadData]);

  const scrollContentStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: contentInsetBottom }],
    [contentInsetBottom],
  );

  return (
    <RootView>
      <Animated.ScrollView
        contentContainerStyle={scrollContentStyle}
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
          Tableau de bord progression
        </ThemedText>

        {error ? (
          <ThemedText variant="body2" color="danger" style={styles.banner}>
            {error}
          </ThemedText>
        ) : null}

        {!isReady ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !isLoggedIn ? null : loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.sectionGap} />
            <ResourceListSection
              title="Liste des ressources déjà exploitées:"
              rows={progression?.exploited ?? []}
              emptyLabel="Aucune ressource exploitée."
            />
            <View style={styles.sectionGap} />
            <ResourceListSection
              title="Liste des ressources mises de côté:"
              rows={progression?.set_aside ?? []}
              emptyLabel="Aucune ressource mise de côté."
            />
          </>
        )}
      </Animated.ScrollView>
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
  loader: {
    paddingVertical: 18,
    alignItems: "center",
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
  itemActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
