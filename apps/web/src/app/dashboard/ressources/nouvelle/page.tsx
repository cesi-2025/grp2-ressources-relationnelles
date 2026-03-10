"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function NouvelleRessourcePage() {
  const searchParams = useSearchParams();
  const isLoggedIn = searchParams.get("connected") === "1";

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-2xl font-bold text-primary mb-2">Connexion requise</h1>
            <p className="text-gray-600 mb-5">
              Vous devez être connecté pour créer une ressource citoyenne.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/connexion">
                <Button variant="primary">Se connecter</Button>
              </Link>
              <Link href="/auth/inscription">
                <Button variant="outline">Créer un compte</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Nouvelle ressource</h1>
          <p className="text-gray-600">Publiez une ressource pour la communauté citoyenne.</p>
        </div>

        <Card>
          <form className="space-y-5">
            <Input label="Titre" placeholder="Ex: Comment gérer un désaccord en famille" required />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm">
                  <option>Communication</option>
                  <option>Écoute active</option>
                  <option>Empathie</option>
                  <option>Gestion des conflits</option>
                  <option>Intelligence émotionnelle</option>
                  <option>Collaboration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de relation</label>
                <select className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm">
                  <option>Personnelle</option>
                  <option>Familiale</option>
                  <option>Sociale</option>
                  <option>Professionnelle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de ressource</label>
                <select className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm">
                  <option>Article</option>
                  <option>Guide</option>
                  <option>Vidéo</option>
                  <option>Podcast</option>
                </select>
              </div>
            </div>

            <Input label="Extrait" placeholder="Résumé court de la ressource" required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                rows={8}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
                placeholder="Rédigez votre ressource..."
                required
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="primary" type="submit">Publier la ressource</Button>
              <Button variant="outline" type="button">Enregistrer comme brouillon</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
