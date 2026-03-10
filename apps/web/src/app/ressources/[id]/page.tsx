"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getCommentsByResourceId, getResourceById } from "@/data/resources";

function getCategoryVariant(category: string): "primary" | "secondary" | "accent" {
  if (category === "Communication" || category === "Gestion des conflits") {
    return "primary";
  }
  if (category === "Écoute active" || category === "Intelligence émotionnelle") {
    return "secondary";
  }
  return "accent";
}

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [openedReplyFor, setOpenedReplyFor] = useState<number | null>(null);

  const resourceId = Number(params.id);
  const isLoggedIn = searchParams.get("connected") === "1";
  const isAuthor = searchParams.get("author") === "1";

  const resource = useMemo(() => getResourceById(resourceId), [resourceId]);
  const initialComments = useMemo(() => getCommentsByResourceId(resourceId), [resourceId]);
  const [comments, setComments] = useState(initialComments);

  if (!resource) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-2xl font-bold text-primary mb-2">Ressource introuvable</h1>
            <p className="text-gray-600 mb-5">La ressource demandée n&apos;existe pas ou n&apos;est plus disponible.</p>
            <Link href="/ressources">
              <Button variant="outline">Retour à la liste des ressources</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const categoryVariant = getCategoryVariant(resource.category);

  const approvedTopLevelComments = comments.filter(
    (comment) => comment.parentId === null && comment.status === "approved"
  );
  const pendingComments = comments.filter((comment) => comment.status === "pending");

  async function sharePublication() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Lien copié dans le presse-papiers ✅");
    } catch {
      setShareMessage("Impossible de copier automatiquement. Copiez l'URL manuellement.");
    }
  }

  function addComment() {
    const message = newComment.trim();
    if (!message) {
      return;
    }

    setComments((previous) => [
      ...previous,
      {
        id: previous.length + 100,
        resourceId,
        author: "Vous",
        message,
        createdAt: new Date().toISOString().slice(0, 10),
        parentId: null,
        status: "pending",
      },
    ]);
    setNewComment("");
  }

  function addReply(parentId: number) {
    const message = (replyDrafts[parentId] || "").trim();
    if (!message) {
      return;
    }

    setComments((previous) => [
      ...previous,
      {
        id: previous.length + 100,
        resourceId,
        author: "Vous",
        message,
        createdAt: new Date().toISOString().slice(0, 10),
        parentId,
        status: "pending",
      },
    ]);
    setReplyDrafts((previous) => ({ ...previous, [parentId]: "" }));
    setOpenedReplyFor(null);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/ressources" className="text-sm font-medium text-primary hover:underline">
            ← Retour aux ressources
          </Link>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{resource.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant={categoryVariant}>{resource.category}</Badge>
                <Badge variant="gray">{resource.relationType}</Badge>
                <Badge variant="warning">{resource.resourceType}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <Button variant="outline" onClick={sharePublication}>
                Partager la publication
              </Button>
              {shareMessage ? <p className="text-xs text-gray-600">{shareMessage}</p> : null}

              {isLoggedIn ? (
                <>
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={() => setIsFavorite((previous) => !previous)}
                  >
                    {isFavorite ? "★ Retiré des favoris" : "☆ Ajouter aux favoris"}
                  </Button>
                  <Link href={`/dashboard/ressources/${resource.id}/edit?connected=1`}>
                    <Button variant="primary">Éditer la ressource</Button>
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-600 md:max-w-xs">
                  Connectez-vous pour ajouter cette ressource à vos favoris.
                  <Link href="/auth/inscription" className="text-primary font-medium hover:underline ml-1">
                    Créer un compte
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-7">
            <div>
              <span className="font-semibold text-gray-800">Auteur :</span> {resource.author}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Publié le :</span>{" "}
              {new Date(resource.createdAt).toLocaleDateString("fr-FR")}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Mis à jour le :</span>{" "}
              {new Date(resource.updatedAt).toLocaleDateString("fr-FR")}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Type :</span> {resource.resourceType}
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contenu</h2>
            <p className="text-gray-700 leading-relaxed">{resource.content}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-primary mb-2">Commentaires</h2>
          {!isLoggedIn && (
            <p className="text-sm text-gray-600 mb-6">
              Vous êtes en mode lecture seule. Connectez-vous pour laisser un commentaire.
            </p>
          )}

          {isAuthor && pendingComments.length > 0 ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Commentaires en attente de modération</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                {pendingComments.map((comment) => (
                  <li key={comment.id}>
                    • {comment.author} : {comment.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-4 mb-8">
            {approvedTopLevelComments.length === 0 ? (
              <p className="text-gray-600">Aucun commentaire pour cette ressource.</p>
            ) : (
              approvedTopLevelComments.map((comment) => {
                const replies = comments.filter(
                  (reply) => reply.parentId === comment.id && reply.status === "approved"
                );

                return (
                  <div key={comment.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.message}</p>

                    <div className="mt-3">
                      {isLoggedIn ? (
                        <button
                          className="text-sm text-primary hover:underline"
                          onClick={() => setOpenedReplyFor(openedReplyFor === comment.id ? null : comment.id)}
                        >
                          Répondre
                        </button>
                      ) : null}

                      {openedReplyFor === comment.id ? (
                        <div className="mt-3 space-y-2">
                          <textarea
                            rows={3}
                            value={replyDrafts[comment.id] || ""}
                            onChange={(event) =>
                              setReplyDrafts((previous) => ({
                                ...previous,
                                [comment.id]: event.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Votre réponse..."
                          />
                          <Button size="sm" onClick={() => addReply(comment.id)}>
                            Envoyer la réponse
                          </Button>
                        </div>
                      ) : null}

                      {replies.length > 0 ? (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                          {replies.map((reply) => (
                            <div key={reply.id}>
                              <p className="text-xs text-gray-500 mb-1">
                                {reply.author} • {new Date(reply.createdAt).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-sm text-gray-700">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Votre commentaire</label>
            <textarea
              rows={4}
              disabled={!isLoggedIn}
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={
                isLoggedIn
                  ? "Écrivez votre commentaire..."
                  : "Connectez-vous pour écrire un commentaire"
              }
            ></textarea>
            <Button variant="primary" disabled={!isLoggedIn || newComment.trim().length === 0} onClick={addComment}>
              Publier le commentaire
            </Button>
            {isLoggedIn ? (
              <p className="text-xs text-gray-500">
                Votre commentaire sera soumis à modération avant publication.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
