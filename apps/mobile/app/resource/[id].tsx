import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { useFooterScroll } from "@/contexts/FooterScrollContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  apiCreateComment,
  apiGetProgression,
  apiGetResource,
  apiListComments,
  apiReplyComment,
  apiSetFavorite,
  apiSetProgression,
  type ApiComment,
  type ApiResource,
} from "@/lib/resourceApi";
import {
  canComment as canCommentPermission,
  canEditResource as canEditResourcePermission,
  canManageFavorites as canManageFavoritesPermission,
} from "@/lib/resourcePermissions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
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

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

function progressionFlags(
  resourceId: number,
  progression: Awaited<ReturnType<typeof apiGetProgression>>,
) {
  return {
    favorited: progression.favorites.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
    exploited: progression.exploited.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
    setAside: progression.set_aside.some((r) =>
      rowMatchesResource(r, resourceId),
    ),
  };
}

function normalizeCommentsTree(list: ApiComment[]): ApiComment[] {
  const deduped = new Map<number, ApiComment>();

  const collect = (comment: ApiComment) => {
    if (!deduped.has(comment.id)) {
      deduped.set(comment.id, { ...comment, replies: [] });
    }
    if (comment.replies?.length) {
      comment.replies.forEach(collect);
    }
  };

  list.forEach(collect);

  const roots: ApiComment[] = [];
  const all = Array.from(deduped.values());
  all.forEach((comment) => {
    if (comment.parent_id && deduped.has(comment.parent_id)) {
      const parent = deduped.get(comment.parent_id);
      if (parent) {
        parent.replies = [...(parent.replies ?? []), comment];
      }
      return;
    }
    roots.push(comment);
  });

  return roots;
}

function appendCommentInTree(
  list: ApiComment[],
  comment: ApiComment,
): ApiComment[] {
  if (!comment.parent_id) {
    return [...list, { ...comment, replies: comment.replies ?? [] }];
  }

  return list.map((parent) => {
    if (parent.id !== comment.parent_id) return parent;
    return {
      ...parent,
      replies: [
        ...(parent.replies ?? []),
        { ...comment, replies: comment.replies ?? [] },
      ],
    };
  });
}

function isPendingModeration(comment: ApiComment): boolean {
  return !comment.is_approved;
}

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(id);
  const colors = useThemeColors();
  const { scrollHandler, contentInsetBottom } = useFooterScroll();
  const { token, user, isLoggedIn } = useAuth();
  const canComment = canCommentPermission({ isLoggedIn, token });
  const canManageFavorites = canManageFavoritesPermission({
    isLoggedIn,
    token,
  });

  const [resource, setResource] = useState<ApiResource | null>(null);
  const [resourceLoading, setResourceLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [busyAction, setBusyAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isExploited, setIsExploited] = useState(false);
  const [isSetAside, setIsSetAside] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const applyProgressionPayload = useCallback(
    (progression: Awaited<ReturnType<typeof apiGetProgression>> | null) => {
      if (!resourceId) return;
      if (!progression) {
        setIsFavorited(false);
        setIsExploited(false);
        setIsSetAside(false);
        return;
      }
      const flags = progressionFlags(resourceId, progression);
      setIsFavorited(flags.favorited);
      setIsExploited(flags.exploited);
      setIsSetAside(flags.setAside);
    },
    [resourceId],
  );

  const refreshFavoriteStatus = useCallback(async () => {
    if (!token || !resourceId) {
      setIsFavorited(false);
      setIsExploited(false);
      setIsSetAside(false);
      return;
    }
    try {
      const progression = await apiGetProgression(token);
      applyProgressionPayload(progression);
    } catch {
      applyProgressionPayload(null);
    }
  }, [applyProgressionPayload, resourceId, token]);

  const refreshComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const list = await apiListComments(resourceId);
      setComments(normalizeCommentsTree(list));
      setCommentsError(null);
    } catch (e) {
      setCommentsError(
        e instanceof Error
          ? e.message
          : "Chargement des commentaires impossible.",
      );
      throw e;
    } finally {
      setCommentsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    if (!resourceId) {
      setResource(null);
      setResourceLoading(false);
      setCommentsLoading(false);
      return;
    }
    let cancelled = false;
    setResourceLoading(true);
    setCommentsLoading(true);
    setError(null);
    setCommentsError(null);
    setComments([]);
    void (async () => {
      try {
        const settled = await Promise.allSettled([
          apiGetResource(resourceId),
          apiListComments(resourceId),
          token ? apiGetProgression(token) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        const [resSettled, commentsSettled, progressionSettled] = settled;
        if (resSettled.status === "fulfilled") {
          setResource(resSettled.value);
          setError(null);
        } else {
          setError(
            resSettled.reason instanceof Error
              ? resSettled.reason.message
              : "Chargement impossible.",
          );
          setResource(null);
        }
        if (commentsSettled.status === "fulfilled") {
          setComments(normalizeCommentsTree(commentsSettled.value));
          setCommentsError(null);
        } else {
          setCommentsError(
            commentsSettled.reason instanceof Error
              ? commentsSettled.reason.message
              : "Chargement des commentaires impossible.",
          );
          setComments([]);
        }
        if (token) {
          if (
            progressionSettled.status === "fulfilled" &&
            progressionSettled.value
          ) {
            applyProgressionPayload(progressionSettled.value);
          } else {
            applyProgressionPayload(null);
          }
        } else {
          applyProgressionPayload(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Chargement impossible.");
          setResource(null);
        }
      } finally {
        if (!cancelled) {
          setResourceLoading(false);
          setCommentsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyProgressionPayload, resourceId, token]);

  const resolveCreatedComment = useCallback(
    async (created: ApiComment): Promise<"appended" | "pending"> => {
      if (isPendingModeration(created)) {
        return "pending";
      }
      setComments((prev) => appendCommentInTree(prev, created));
      return "appended";
    },
    [],
  );

  const handleFavoriteToggle = useCallback(async () => {
    if (!canManageFavorites || !token) return;
    const next = !isFavorited;
    setIsFavorited(next);
    try {
      await apiSetFavorite(token, resourceId, next);
    } catch (e) {
      setIsFavorited(!next);
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Action impossible.",
      );
    }
  }, [canManageFavorites, isFavorited, resourceId, token]);

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

  const handleSetProgression = useCallback(
    async (status: "exploited" | "set_aside") => {
      if (!token) {
        router.push({ pathname: "/login" });
        return;
      }
      setBusyAction(true);
      try {
        await apiSetProgression(token, resourceId, status);
        if (status === "exploited") {
          setIsExploited(true);
          setIsSetAside(false);
        } else {
          setIsSetAside(true);
          setIsExploited(false);
        }
      } catch (e) {
        Alert.alert(
          "Erreur",
          e instanceof Error ? e.message : "Mise à jour impossible.",
        );
      } finally {
        setBusyAction(false);
      }
    },
    [resourceId, token],
  );

  const handlePostComment = useCallback(async () => {
    if (!canComment || !token) {
      router.push({ pathname: "/login" });
      return;
    }
    if (commentDraft.trim().length < 2) {
      Alert.alert("Commentaire trop court", "Ajoutez un peu plus de contenu.");
      return;
    }
    setBusyAction(true);
    try {
      const created = await apiCreateComment(
        token,
        resourceId,
        commentDraft.trim(),
      );
      const status = await resolveCreatedComment(created);
      if (status === "pending") {
        Alert.alert(
          "Commentaire envoyé",
          "Votre commentaire est en attente de modération.",
        );
      }
      setCommentDraft("");
    } catch (e) {
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Publication impossible.",
      );
    } finally {
      setBusyAction(false);
    }
  }, [canComment, commentDraft, resolveCreatedComment, resourceId, token]);

  const handleReply = useCallback(async () => {
    if (!canComment || !token) {
      router.push({ pathname: "/login" });
      return;
    }
    if (!replyToCommentId) return;
    if (replyDraft.trim().length < 2) {
      Alert.alert("Réponse trop courte", "Ajoutez un peu plus de contenu.");
      return;
    }
    setBusyAction(true);
    try {
      const created = await apiReplyComment(
        token,
        replyToCommentId,
        replyDraft.trim(),
      );
      const status = await resolveCreatedComment(created);
      if (status === "pending") {
        Alert.alert(
          "Réponse envoyée",
          "Votre réponse est en attente de modération.",
        );
      }
      setReplyDraft("");
      setReplyToCommentId(null);
    } catch (e) {
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Réponse impossible.",
      );
    } finally {
      setBusyAction(false);
    }
  }, [canComment, replyDraft, replyToCommentId, resolveCreatedComment, token]);

  const handleRefresh = useCallback(async () => {
    if (!resourceId) return;
    setRefreshing(true);
    try {
      const settled = await Promise.allSettled([
        apiGetResource(resourceId),
        refreshComments(),
        refreshFavoriteStatus(),
      ]);
      const [resSettled] = settled;
      if (resSettled.status === "fulfilled") {
        setResource(resSettled.value);
        setError(null);
      } else {
        setError(
          resSettled.reason instanceof Error
            ? resSettled.reason.message
            : "Chargement impossible.",
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chargement impossible.");
    } finally {
      setRefreshing(false);
    }
  }, [refreshComments, refreshFavoriteStatus, resourceId]);
  const canEditResource = useMemo(() => {
    if (!resource) return false;
    const ownerRaw = resource.user?.id ?? resource.user_id;
    const ownerId =
      ownerRaw === null || ownerRaw === undefined ? undefined : Number(ownerRaw);
    const userId =
      user?.id === null || user?.id === undefined ? undefined : Number(user.id);
    return canEditResourcePermission({
      isLoggedIn,
      userId,
      ownerId,
    });
  }, [isLoggedIn, resource, user]);

  const navigateToEdit = useCallback(() => {
    if (!resource) return;
    router.push({
      pathname: "/resource/edit/[id]",
      params: { id: String(resource.id) },
    });
  }, [resource]);

  const goToHome = useCallback(() => {
    router.replace({ pathname: "/" });
  }, []);

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
            onRefresh={() => void handleRefresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <BackButton
          onPress={goToHome}
          accessibilityLabel="Retour à l’accueil"
        />

        {resourceLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : !resource ? (
          <Card>
            <ThemedText variant="body1" color={error ? "danger" : "gray600"}>
              {error ?? "Ressource introuvable."}
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

            <View style={styles.actionsRow}>
              {canEditResource ? (
                <Pressable
                  onPress={navigateToEdit}
                  accessibilityRole="button"
                  accessibilityLabel="Modifier la ressource"
                  style={styles.iconButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={colors.foreground}
                  />
                </Pressable>
              ) : null}
              {canManageFavorites ? (
                <Pressable
                  onPress={() => void handleFavoriteToggle()}
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
              ) : null}
              <Pressable
                onPress={() => void handleShare()}
                accessibilityRole="button"
                accessibilityLabel="Partager la ressource"
                style={styles.iconButton}
              >
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={colors.foreground}
                />
              </Pressable>
            </View>

            <View style={styles.metaRow}>
              {resource.category ? (
                <View
                  style={[styles.badge, { backgroundColor: colors.primary }]}
                >
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.category.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.resource_type ? (
                <View
                  style={[styles.badge, { backgroundColor: colors.gray500 }]}
                >
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.resource_type.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.relation_type ? (
                <View
                  style={[styles.badge, { backgroundColor: colors.gray500 }]}
                >
                  <ThemedText variant="subtitle3" color="gray50">
                    {resource.relation_type.name}
                  </ThemedText>
                </View>
              ) : null}
            </View>

            <Card style={styles.contentCard}>
              <ThemedText
                variant="body1"
                color="foreground"
                style={styles.content}
              >
                {resource.content}
              </ThemedText>
            </Card>

            <Card>
              {resource.user ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={colors.gray500}
                  />
                  <ThemedText variant="body2" color="gray600">
                    {resource.user.name}
                  </ThemedText>
                </View>
              ) : null}
              {resource.created_at ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colors.gray500}
                  />
                  <ThemedText variant="body2" color="gray600">
                    {formatDate(resource.created_at)}
                  </ThemedText>
                </View>
              ) : null}
            </Card>

            <Card title="Suivi de la ressource">
              <View style={styles.progressActionsRow}>
                <Pressable
                  onPress={() => void handleSetProgression("exploited")}
                  disabled={busyAction || !canManageFavorites}
                  accessibilityRole="button"
                  accessibilityLabel="Marquer comme exploitée"
                  style={[
                    styles.progressButton,
                    {
                      backgroundColor: isExploited
                        ? colors.primary
                        : colors.background,
                      borderColor: isExploited
                        ? colors.primary
                        : colors.gray300,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      isExploited
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={16}
                    color={isExploited ? colors.gray50 : colors.foreground}
                  />
                  <ThemedText
                    variant="subtitle2"
                    color={isExploited ? "gray50" : "foreground"}
                  >
                    {isExploited ? "Exploitée" : "Marquer exploitée"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => void handleSetProgression("set_aside")}
                  disabled={busyAction || !canManageFavorites}
                  accessibilityRole="button"
                  accessibilityLabel="Mettre de côté"
                  style={[
                    styles.progressButton,
                    {
                      backgroundColor: isSetAside
                        ? colors.secondary
                        : colors.background,
                      borderColor: isSetAside
                        ? colors.secondary
                        : colors.gray300,
                    },
                  ]}
                >
                  <Ionicons
                    name={isSetAside ? "pause-circle" : "pause-circle-outline"}
                    size={16}
                    color={isSetAside ? colors.gray50 : colors.foreground}
                  />
                  <ThemedText
                    variant="subtitle2"
                    color={isSetAside ? "gray50" : "foreground"}
                  >
                    {isSetAside ? "Mise de côté" : "Mettre de côté"}
                  </ThemedText>
                </Pressable>
              </View>
              {!canManageFavorites ? (
                <ThemedText
                  variant="body2"
                  color="gray600"
                  style={styles.progressHint}
                >
                  Connectez-vous pour suivre cette ressource.
                </ThemedText>
              ) : null}
            </Card>

            <Card title="Commentaires">
              {commentsLoading ? (
                <View style={styles.commentsLoader}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : commentsError ? (
                <ThemedText variant="body2" color="danger">
                  {commentsError}
                </ThemedText>
              ) : comments.length === 0 ? (
                <ThemedText variant="body2" color="gray600">
                  Aucun commentaire pour cette ressource.
                </ThemedText>
              ) : (
                comments.map((comment) => (
                  <View
                    key={comment.id}
                    style={[
                      styles.commentBlock,
                      { borderBottomColor: colors.gray300 },
                    ]}
                  >
                    <ThemedText variant="body1" color="foreground">
                      {comment.content}
                    </ThemedText>
                    <ThemedText
                      variant="body2"
                      color="gray600"
                      style={styles.commentMeta}
                    >
                      {comment.user?.name ?? "Anonyme"} ·{" "}
                      {formatDateTime(comment.created_at)}
                    </ThemedText>
                    {isPendingModeration(comment) ? (
                      <ThemedText
                        variant="subtitle3"
                        color="accent"
                        style={styles.pendingMeta}
                      >
                        En attente de modération
                      </ThemedText>
                    ) : null}
                    {canComment ? (
                      <Pressable
                        onPress={() =>
                          setReplyToCommentId((prev) =>
                            prev === comment.id ? null : comment.id,
                          )
                        }
                        disabled={busyAction}
                        accessibilityRole="button"
                      >
                        <ThemedText variant="subtitle2" color="foreground">
                          Répondre
                        </ThemedText>
                      </Pressable>
                    ) : null}

                    {canComment && replyToCommentId === comment.id ? (
                      <View style={styles.replyComposer}>
                        <TextInput
                          value={replyDraft}
                          onChangeText={setReplyDraft}
                          placeholder="Votre réponse"
                          placeholderTextColor={colors.gray400}
                          editable={!busyAction}
                          multiline
                          style={[
                            styles.input,
                            {
                              borderColor: colors.gray300,
                              color: colors.foreground,
                            },
                          ]}
                        />
                        <Pressable
                          onPress={handleReply}
                          disabled={busyAction}
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
                            style={[
                              styles.replyItem,
                              { borderLeftColor: colors.gray300 },
                            ]}
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
                              {formatDateTime(reply.created_at)}
                            </ThemedText>
                            {isPendingModeration(reply) ? (
                              <ThemedText
                                variant="subtitle3"
                                color="accent"
                                style={styles.pendingMeta}
                              >
                                En attente de modération
                              </ThemedText>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))
              )}

              {canComment ? (
                <View style={styles.commentComposer}>
                  <TextInput
                    value={commentDraft}
                    onChangeText={setCommentDraft}
                    placeholder="Ajouter un commentaire"
                    placeholderTextColor={colors.gray400}
                    editable={!busyAction}
                    multiline
                    style={[
                      styles.input,
                      { borderColor: colors.gray300, color: colors.foreground },
                    ]}
                  />
                  <Pressable
                    onPress={handlePostComment}
                    disabled={busyAction}
                    accessibilityRole="button"
                    style={[
                      styles.commentButton,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <ThemedText variant="subtitle1" color="gray50">
                      Commenter
                    </ThemedText>
                  </Pressable>
                </View>
              ) : (
                <ThemedText
                  variant="body2"
                  color="gray600"
                  style={styles.commentComposer}
                >
                  Connectez-vous pour commenter et répondre.
                </ThemedText>
              )}
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
    paddingTop: 100,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: "88%",
  },
  contentCard: {
    width: "100%",
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
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
  pendingMeta: {
    marginTop: -2,
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
  commentsLoader: {
    paddingVertical: 8,
    alignItems: "center",
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
  progressActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  progressButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  progressHint: {
    marginTop: 10,
  },
});
