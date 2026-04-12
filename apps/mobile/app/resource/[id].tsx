import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { getMockComments, getMockResourceById } from "@/data/mockResources";
import { MOCK_PROGRESSION } from "@/data/mockProgression";
import type { MockComment, MockResourceDetail } from "@/data/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function rowMatchesResource(
  row: { resource_id?: number; resource?: { id: number } },
  resourceId: number,
): boolean {
  return row.resource_id === resourceId || row.resource?.id === resourceId;
}

function progressionFlags(resourceId: number) {
  return {
    favorited: MOCK_PROGRESSION.favorites.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
    exploited: MOCK_PROGRESSION.exploited.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
    setAside: MOCK_PROGRESSION.set_aside.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
  };
}

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(id);
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();

  const [resource, setResource] = useState<MockResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<MockComment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isExploited, setIsExploited] = useState(false);
  const [isSetAside, setIsSetAside] = useState(false);

  useEffect(() => {
    if (!resourceId) {
      setResource(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      const r = getMockResourceById(resourceId);
      setResource(r ?? null);
      setComments(getMockComments(resourceId));
      const flags = progressionFlags(resourceId);
      setIsFavorited(flags.favorited);
      setIsExploited(flags.exploited);
      setIsSetAside(flags.setAside);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [resourceId]);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorited((v) => !v);
  }, []);

  const handleSetProgression = useCallback((next: "exploited" | "set_aside") => {
    if (next === "exploited") {
      setIsExploited((v) => !v);
      setIsSetAside(false);
    } else {
      setIsSetAside((v) => !v);
      setIsExploited(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!resource) return;
    try {
      await Share.share({
        message: `${resource.title}\n\n${resource.content}`,
        title: resource.title,
      });
    } catch {
      Alert.alert("Erreur", "Le partage a échoué.");
    }
  }, [resource]);

  const handlePostComment = useCallback(() => {
    if (commentDraft.trim().length < 2) {
      Alert.alert("Commentaire trop court", "Ajoutez un peu plus de contenu.");
      return;
    }
    Alert.alert(
      "Pas encore implémenté",
      "L’envoi de commentaires n’est pas disponible pour le moment.",
    );
    setCommentDraft("");
  }, [commentDraft]);

  const handleReply = useCallback(() => {
    if (!replyToCommentId) return;
    if (replyDraft.trim().length < 2) {
      Alert.alert("Réponse trop courte", "Ajoutez un peu plus de contenu.");
      return;
    }
    Alert.alert(
      "Pas encore implémenté",
      "L’envoi de réponses n’est pas disponible pour le moment.",
    );
    setReplyDraft("");
    setReplyToCommentId(null);
  }, [replyDraft, replyToCommentId]);

  const hasActions = useMemo(() => Boolean(resource), [resource]);

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

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : !resource ? (
          <Card>
            <ThemedText variant="body1" color="gray600">
              Ressource introuvable dans le jeu de données local.
            </ThemedText>
          </Card>
        ) : (
          <>
            <ThemedText
              variant="headline"
              color="foreground"
              style={styles.title}
            >
              {resource.title}
            </ThemedText>

            {hasActions ? (
              <View style={styles.actionsRow}>
                <Pressable
                  onPress={handleFavoriteToggle}
                  accessibilityRole="button"
                  accessibilityLabel="Favori"
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={isFavorited ? "heart" : "heart-outline"}
                    size={22}
                    color={isFavorited ? colors.primary : colors.foreground}
                  />
                </Pressable>
                <Pressable
                  onPress={() => handleSetProgression("exploited")}
                  accessibilityRole="button"
                  accessibilityLabel="Marquer comme exploitée"
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={isExploited ? "checkmark-circle" : "checkmark-circle-outline"}
                    size={22}
                    color={isExploited ? colors.primary : colors.foreground}
                  />
                </Pressable>
                <Pressable
                  onPress={() => handleSetProgression("set_aside")}
                  accessibilityRole="button"
                  accessibilityLabel="Mettre de côté"
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={isSetAside ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={isSetAside ? colors.primary : colors.foreground}
                  />
                </Pressable>
                <Pressable
                  onPress={() => void handleShare()}
                  accessibilityRole="button"
                  accessibilityLabel="Partager la ressource"
                  style={styles.iconButton}
                >
                  <Ionicons name="share-outline" size={22} color={colors.foreground} />
                </Pressable>
              </View>
            ) : null}

            <View style={styles.metaRow}>
              {resource.category ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.category.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.resource_type ? (
                <View style={[styles.badge, { backgroundColor: colors.gray500 }]}>
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.resource_type.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.relation_type ? (
                <View style={[styles.badge, { backgroundColor: colors.gray500 }]}>
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.relation_type.name}
                  </ThemedText>
                </View>
              ) : null}
            </View>

            <Card>
              <ThemedText variant="body1" color="foreground" style={styles.content}>
                {resource.content}
              </ThemedText>
            </Card>

            <Card>
              {resource.user ? (
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={16} color={colors.gray500} />
                  <ThemedText variant="body2" color="gray600">
                    {resource.user.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.created_at ? (
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.gray500} />
                  <ThemedText variant="body2" color="gray600">
                    {formatDate(resource.created_at)}
                  </ThemedText>
                </View>
              ) : null}
            </Card>

            <Card title="Commentaires">
              {comments.length === 0 ? (
                <ThemedText variant="body2" color="gray600">
                  Aucun commentaire pour cette ressource.
                </ThemedText>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.id}
                    style={[styles.commentBlock, { borderBottomColor: colors.gray300 }]}
                  >
                    <ThemedText variant="body1" color="foreground">
                      {comment.content}
                    </ThemedText>
                    <ThemedText variant="body2" color="gray600" style={styles.commentMeta}>
                      {comment.user?.name ?? "Anonyme"} · {formatDate(comment.created_at)}
                    </ThemedText>
                    <Pressable
                      onPress={() =>
                        setReplyToCommentId((prev) =>
                          prev === comment.id ? null : comment.id,
                        )
                      }
                      accessibilityRole="button"
                    >
                      <ThemedText variant="subtitle2" color="foreground">
                        Répondre
                      </ThemedText>
                    </Pressable>

                    {replyToCommentId === comment.id ? (
                      <View style={styles.replyComposer}>
                        <TextInput
                          value={replyDraft}
                          onChangeText={setReplyDraft}
                          placeholder="Votre réponse"
                          placeholderTextColor={colors.gray400}
                          multiline
                          style={[
                            styles.input,
                            { borderColor: colors.gray300, color: colors.foreground },
                          ]}
                        />
                        <Pressable
                          onPress={handleReply}
                          accessibilityRole="button"
                          style={[
                            styles.replyButton,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <ThemedText variant="subtitle1" color="gray50">
                            Envoyer
                          </ThemedText>
                        </Pressable>
                      </View>
                    ) : null}

                    {comment.replies?.length ? (
                      <View style={styles.repliesWrap}>
                        {comment.replies.map((reply) => (
                          <View
                            key={reply.id}
                            style={[styles.replyItem, { borderLeftColor: colors.gray300 }]}
                          >
                            <ThemedText variant="body2" color="foreground">
                              {reply.content}
                            </ThemedText>
                            <ThemedText
                              variant="body2"
                              color="gray600"
                              style={styles.commentMeta}
                            >
                              {reply.user?.name ?? "Anonyme"} ·{" "}
                              {formatDate(reply.created_at)}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))
              )}

              <View style={styles.commentComposer}>
                <TextInput
                  value={commentDraft}
                  onChangeText={setCommentDraft}
                  placeholder="Ajouter un commentaire"
                  placeholderTextColor={colors.gray400}
                  multiline
                  style={[
                    styles.input,
                    { borderColor: colors.gray300, color: colors.foreground },
                  ]}
                />
                <Pressable
                  onPress={handlePostComment}
                  accessibilityRole="button"
                  style={[styles.commentButton, { backgroundColor: colors.primary }]}
                >
                  <ThemedText variant="subtitle1" color="gray50">
                    Commenter
                  </ThemedText>
                </Pressable>
              </View>
            </Card>
          </>
        )}
      </Animated.ScrollView>
    </RootView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    paddingVertical: 48,
    alignItems: "center",
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  commentBlock: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentMeta: {
    marginTop: 4,
    marginBottom: 8,
  },
  repliesWrap: {
    marginTop: 10,
    paddingLeft: 10,
    gap: 8,
  },
  replyItem: {
    borderLeftWidth: 2,
    paddingLeft: 10,
  },
  commentComposer: {
    marginTop: 8,
  },
  replyComposer: {
    marginTop: 8,
  },
  input: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: "top",
  },
  commentButton: {
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  replyButton: {
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
  },
});
