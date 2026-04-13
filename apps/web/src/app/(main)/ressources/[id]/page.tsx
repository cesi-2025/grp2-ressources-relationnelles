"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResource,
  getComments,
  createComment,
  addFavorite,
  removeFavorite,
  type Resource,
  type Comment,
  ApiRequestError,
} from "@/lib/api";


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
  const { user } = useAuth();
  const resourceId = Number(params.id);

  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getResource(resourceId), getComments(resourceId)])
      .then(([res, coms]) => {
        setResource(res);
        setComments(coms);
      })
      .catch(() => {
        setError("Impossible de charger la ressource.");
      })
      .finally(() => setLoading(false));
  }, [resourceId]);

  async function handleToggleFavorite() {
    try {
      if (isFavorite) {
        await removeFavorite(resourceId);
        setIsFavorite(false);
      } else {
        await addFavorite(resourceId);
        setIsFavorite(true);
      }
    } catch {
      // silently fail
    }
  }

  async function handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const newComment = await createComment(resourceId, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        alert(err.message);
      }
    } finally {
      setCommentLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="text-gray-600">Chargement...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-2xl font-bold text-primary mb-2">Ressource introuvable</h1>
            <p className="text-gray-600 mb-5">{error || "La ressource demandée n'existe pas ou n'est plus disponible."}</p>
            <Link href="/ressources">
              <Button variant="outline">Retour à la liste des ressources</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const categoryName = resource.category?.name ?? "Sans catégorie";
  const categoryVariant = getCategoryVariant(categoryName);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/ressources" className="text-sm font-medium text-primary hover:underline">
            &larr; Retour aux ressources
          </Link>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{resource.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant={categoryVariant}>{categoryName}</Badge>
                {resource.relation_type && <Badge variant="gray">{resource.relation_type.name}</Badge>}
                {resource.resource_type && <Badge variant="warning">{resource.resource_type.name}</Badge>}
              </div>
            </div>

            {user ? (
              <Button
                variant={isFavorite ? "secondary" : "outline"}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? "★ Retiré des favoris" : "☆ Ajouter aux favoris"}
              </Button>
            ) : (
              <p className="text-sm text-gray-600 md:max-w-xs">
                Connectez-vous pour ajouter cette ressource à vos favoris.
                <Link href="/auth/inscription" className="text-primary font-medium hover:underline ml-1">
                  Créer un compte
                </Link>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-7">
            <div>
              <span className="font-semibold text-gray-800">Auteur :</span> {resource.user?.name ?? "Anonyme"}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Publié le :</span>{" "}
              {new Date(resource.created_at).toLocaleDateString("fr-FR")}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Mis à jour le :</span>{" "}
              {new Date(resource.updated_at).toLocaleDateString("fr-FR")}
            </div>
            {resource.resource_type && (
              <div>
                <span className="font-semibold text-gray-800">Type :</span> {resource.resource_type.name}
              </div>
            )}
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contenu</h2>
            <p className="text-gray-700 leading-relaxed">{resource.content}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-primary mb-2">Commentaires</h2>
          {!user && (
            <p className="text-sm text-gray-600 mb-6" role="status" aria-live="polite">
              Vous êtes en mode lecture seule. Connectez-vous pour laisser un commentaire.
            </p>
          )}

          <div className="space-y-4 mb-8">
            {comments.length === 0 ? (
              <p className="text-gray-600">Aucun commentaire pour cette ressource.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{comment.user?.name ?? "Anonyme"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-white border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 text-sm">{reply.user?.name ?? "Anonyme"}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(reply.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form className="space-y-3" onSubmit={handleSubmitComment}>
            <label className="block text-sm font-medium text-gray-700" htmlFor="comment-message">
              Votre commentaire
            </label>
            <textarea
              id="comment-message"
              rows={4}
              disabled={!user}
              aria-disabled={!user}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={
                user
                  ? "Écrivez votre commentaire..."
                  : "Connectez-vous pour écrire un commentaire"
              }
            ></textarea>
            <Button variant="primary" disabled={!user || commentLoading} type="submit">
              {commentLoading ? "Envoi..." : "Publier le commentaire"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
