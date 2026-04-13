"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResource,
  getCategories,
  getResources,
  updateResource,
  ApiRequestError,
  type Category,
  type Resource,
} from "@/lib/api";

interface Meta { id: number; name: string }

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const resourceId = Number(params.id);
  const { user, loading } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relationTypes, setRelationTypes] = useState<Meta[]>([]);
  const [resourceTypes, setResourceTypes] = useState<Meta[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [relationTypeId, setRelationTypeId] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/connexion");
    }
  }, [loading, user, router]);

  useEffect(() => {
    getResource(resourceId)
      .then((r) => {
        setResource(r);
        setTitle(r.title);
        setContent(r.content);
        setCategoryId(String(r.category_id));
        setRelationTypeId(String(r.relation_type_id));
        setResourceTypeId(String(r.resource_type_id));
        setIsPublic(r.is_public);
      })
      .catch(() => setGlobalError("Ressource introuvable."));

    getCategories().then(setCategories).catch(() => {});

    getResources({ per_page: "60" }).then((res) => {
      const list = res.data ?? [];
      const uniqueById = <T extends { id: number }>(arr: T[]) =>
        arr.filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);
      setRelationTypes(uniqueById(list.map((r) => r.relation_type).filter(Boolean) as Meta[]));
      setResourceTypes(uniqueById(list.map((r) => r.resource_type).filter(Boolean) as Meta[]));
    }).catch(() => {});
  }, [resourceId]);

  const isOwner = Boolean(resource && user && resource.user_id === user.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGlobalError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      await updateResource(resourceId, {
        title,
        content,
        category_id: Number(categoryId),
        relation_type_id: Number(relationTypeId),
        resource_type_id: Number(resourceTypeId),
        is_public: isPublic,
      });
      router.push(`/ressources/${resourceId}`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.errors) {
        const flat: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => (flat[k] = v[0]));
        setFieldErrors(flat);
      } else {
        setGlobalError(err instanceof ApiRequestError ? err.message : "Une erreur est survenue.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user || !resource) return null;

  if (!isOwner) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <p className="text-gray-700">Vous ne pouvez éditer que vos propres ressources.</p>
            <Link href={`/ressources/${resourceId}`}>
              <Button variant="outline" className="mt-4">Retour à la ressource</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/ressources/${resourceId}`} className="text-sm font-medium text-primary hover:underline">
            &larr; Retour à la ressource
          </Link>
        </div>

        <Card>
          <h1 className="text-3xl font-bold text-primary mb-6">Modifier la ressource</h1>

          {globalError && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg p-3 mb-4">
              {globalError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
            {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-content">Contenu</label>
              <textarea
                id="edit-content"
                rows={6}
                required
                minLength={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {fieldErrors.content && <p className="text-xs text-red-600">{fieldErrors.content}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900"
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de relation</label>
                <select
                  required
                  value={relationTypeId}
                  onChange={(e) => setRelationTypeId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900"
                >
                  <option value="">—</option>
                  {relationTypes.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de ressource</label>
                <select
                  required
                  value={resourceTypeId}
                  onChange={(e) => setResourceTypeId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900"
                >
                  <option value="">—</option>
                  {resourceTypes.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Ressource publique
            </label>

            <div className="pt-2 flex gap-2">
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Link href={`/ressources/${resourceId}`}>
                <Button variant="outline" type="button">Annuler</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
