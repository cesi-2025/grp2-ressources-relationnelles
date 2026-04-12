import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { apiGetProgression, apiSetFavorite, type ApiResource } from "@/lib/resourceApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

type FavoriteRow = { resource_id?: number; resource?: ApiResource };

function toResource(row: FavoriteRow): { id: number; title: string } | null {
  if (row.resource) {
    return { id: row.resource.id, title: row.resource.title };
  }
  if (typeof row.resource_id === "number") {
    return { id: row.resource_id, title: `Ressource #${row.resource_id}` };
  }
  return null;
}

export default function FavoritesScreen() {
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { token, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!token || !isLoggedIn) {
      router.replace({ pathname: "/login" });
      return;
    }
    setLoading(true);
    try {
      const progression = await apiGetProgression(token);
      setFavorites(progression.favorites ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useFocusEffect(
    useCallback(() => {
      void loadFavorites();
    }, [loadFavorites]),
  );

  const resources = useMemo(
    () => favorites.map(toResource).filter((r): r is { id: number; title: string } => r !== null),
    [favorites],
  );

  const handleRemoveFavorite = useCallback(
    async (resourceId: number) => {
      if (!token) return;
      setRemovingId(resourceId);
      const previous = favorites;
      setFavorites((rows) =>
        rows.filter(
          (row) => row.resource?.id !== resourceId && row.resource_id !== resourceId,
        ),
      );
      try {
        await apiSetFavorite(token, resourceId, false);
      } catch (e) {
        setFavorites(previous);
        Alert.alert(
          "Erreur",
          e instanceof Error ? e.message : "Impossible de retirer le favori.",
        );
      } finally {
        setRemovingId(null);
      }
    },
    [favorites, token],
  );

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
      >
        <BackButton />

        <ThemedText variant="headline" color="foreground" style={styles.pageTitle}>
          Mes favoris
        </ThemedText>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error ? (
          <Card title="Erreur">
            <ThemedText variant="body2" color="danger">
              {error}
            </ThemedText>
          </Card>
        ) : resources.length === 0 ? (
          <Card title="Aucun favori">
            <ThemedText variant="body2" color="gray600">
              Vous n’avez encore ajouté aucune ressource en favori.
            </ThemedText>
          </Card>
        ) : (
          <Card title="Ressources favorites">
            {resources.map((resource) => (
              <View
                key={`favorite-${resource.id}`}
                style={[styles.itemRow, { borderBottomColor: colors.gray200 }]}
              >
                <View style={styles.itemLeft}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/resource/[id]",
                        params: { id: String(resource.id) },
                      })
                    }
                    accessibilityRole="button"
                    style={styles.titlePressable}
                  >
                    <View style={styles.itemLeft}>
                      <Ionicons name="heart" size={16} color={colors.primary} />
                      <ThemedText variant="body1" color="foreground">
                        {resource.title}
                      </ThemedText>
                    </View>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => void handleRemoveFavorite(resource.id)}
                  disabled={removingId === resource.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Retirer ${resource.title} des favoris`}
                  style={styles.removeButton}
                >
                  <ThemedText variant="subtitle2" color="danger">
                    {removingId === resource.id ? "..." : "Retirer"}
                  </ThemedText>
                </Pressable>
              </View>
            ))}
          </Card>
        )}
      </Animated.ScrollView>
    </RootView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  pageTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  loader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  itemRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  titlePressable: {
    flexShrink: 1,
  },
  removeButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
