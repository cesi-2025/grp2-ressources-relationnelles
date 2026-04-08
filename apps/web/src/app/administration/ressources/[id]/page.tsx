"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getCommentsByResourceId, getResourceById } from "@/data/resources";
import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

  const resourceId = Number(params.id);
  const isLoggedIn = searchParams.get("connected") === "1";

  const resource = useMemo(() => getResourceById(resourceId), [resourceId]);
  const comments = useMemo(() => getCommentsByResourceId(resourceId), [resourceId]);

  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role !== "citoyen") router.replace("/administration");
  }, [user,loading,router])

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

            {isLoggedIn ? (
              <Button
                variant={isFavorite ? "secondary" : "outline"}
                onClick={() => setIsFavorite((previous) => !previous)}
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

          <div className="space-y-4 mb-8">
            {comments.length === 0 ? (
              <p className="text-gray-600">Aucun commentaire pour cette ressource.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{comment.author}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Votre commentaire</label>
            <textarea
              rows={4}
              disabled={!isLoggedIn}
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={
                isLoggedIn
                  ? "Écrivez votre commentaire..."
                  : "Connectez-vous pour écrire un commentaire"
              }
            ></textarea>
            <Button variant="primary" disabled={!isLoggedIn}>
              Publier le commentaire
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
