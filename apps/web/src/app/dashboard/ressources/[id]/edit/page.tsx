"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { getResourceById } from "@/data/resources";

export default function EditRessourcePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isLoggedIn = searchParams.get("connected") === "1";
  const resourceId = Number(params.id);

  const resource = useMemo(() => getResourceById(resourceId), [resourceId]);

  if (!resource) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-2xl font-bold text-primary mb-2">Ressource introuvable</h1>
            <p className="text-gray-600 mb-5">Impossible d&apos;éditer cette ressource.</p>
            <Link href="/ressources">
              <Button variant="outline">Retour aux ressources</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-2xl font-bold text-primary mb-2">Connexion requise</h1>
            <p className="text-gray-600 mb-5">
              Vous devez être connecté pour éditer une ressource.
            </p>
            <Link href="/auth/connexion">
              <Button variant="primary">Se connecter</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Éditer la ressource</h1>
            <p className="text-gray-600">Modifiez le contenu avant republication.</p>
          </div>
          <Link href={`/ressources/${resource.id}?connected=1&author=1`}>
            <Button variant="outline">Voir la ressource</Button>
          </Link>
        </div>

        <Card>
          <form className="space-y-5">
            <Input label="Titre" defaultValue={resource.title} required />
            <Input label="Extrait" defaultValue={resource.excerpt} required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                rows={10}
                defaultValue={resource.content}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="primary" type="submit">Mettre à jour</Button>
              <Button variant="outline" type="button">Annuler</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
