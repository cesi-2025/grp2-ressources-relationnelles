"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import ResourceCardWithActions from "@/components/resources/ressourceCardAction";
import ResourceFilters from "@/components/resources/filtre";
import ResourcePagination from "@/components/resources/pagination";
import ResourceFormModal from "./modification";
import ResourceDeleteModal from "./suppresion";
import { getResources, getCategories, type Resource, type Category } from "@/lib/api";

const ITEMS_PER_PAGE = 6;

export default function RessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [relationTypeFilter, setRelationTypeFilter] = useState("all");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-recent");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResources();
      setResources(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
    getCategories().then(setCategories).catch(() => {});
  }, [fetchResources]);

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories]);
  const relationTypes = useMemo(() => Array.from(new Set(resources.map((r) => r.relation_type?.name).filter(Boolean))) as string[], [resources]);
  const resourceTypes = useMemo(() => Array.from(new Set(resources.map((r) => r.resource_type?.name).filter(Boolean))) as string[], [resources]);

  const filteredAndSorted = useMemo(() => {
    const filtered = resources.filter((r) => {
      const q = search.trim().toLowerCase();
      return (
        (!q || r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)) &&
        (categoryFilter === "all" || r.category?.name === categoryFilter) &&
        (relationTypeFilter === "all" || r.relation_type?.name === relationTypeFilter) &&
        (resourceTypeFilter === "all" || r.resource_type?.name === resourceTypeFilter)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "date-recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "date-old") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "category") return (a.category?.name ?? "").localeCompare(b.category?.name ?? "", "fr");
      return 0;
    });
  }, [resources, search, categoryFilter, relationTypeFilter, resourceTypeFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredAndSorted]);

  function onFilterChange(fn: () => void) { fn(); setPage(1); }

  function handleCreate() {
    setCreateOpen(false);
    fetchResources();
  }

  function handleEdit() {
    setEditTarget(null);
    fetchResources();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-3">Ressources Relationnelles</h1>
            <p className="text-lg text-gray-600">
              Explorez les ressources publiques, appliquez des filtres et triez les résultats.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#6366f1", color: "#fff",
              border: "none", borderRadius: 12,
              padding: "12px 20px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#4f46e5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: 18 }}>＋</span> Nouvelle ressource
          </button>
        </div>

        <ResourceFilters
          search={search}
          categoryFilter={categoryFilter}
          relationTypeFilter={relationTypeFilter}
          resourceTypeFilter={resourceTypeFilter}
          sortBy={sortBy}
          categories={categoryNames}
          relationTypes={relationTypes}
          resourceTypes={resourceTypes}
          totalResults={filteredAndSorted.length}
          onSearchChange={(v) => onFilterChange(() => setSearch(v))}
          onCategoryChange={(v) => onFilterChange(() => setCategoryFilter(v))}
          onRelationTypeChange={(v) => onFilterChange(() => setRelationTypeFilter(v))}
          onResourceTypeChange={(v) => onFilterChange(() => setResourceTypeFilter(v))}
          onSortChange={(v) => onFilterChange(() => setSortBy(v))}
        />

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune ressource trouvée</h2>
            <p className="text-gray-600 mb-5">Modifiez les filtres ou la recherche pour afficher des résultats.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch(""); setCategoryFilter("all");
                setRelationTypeFilter("all"); setResourceTypeFilter("all");
                setSortBy("date-recent"); setPage(1);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((resource) => (
                <ResourceCardWithActions
                  key={resource.id}
                  resource={resource}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>

            <ResourcePagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {createOpen && (
        <ResourceFormModal
          initial={{ title: "", description: "" }}
          categories={categoryNames}
          relationTypes={relationTypes}
          resourceTypes={resourceTypes}
          onClose={() => setCreateOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editTarget && (
        <ResourceFormModal
          initial={{ id: editTarget.id, title: editTarget.title, description: editTarget.content }}
          categories={categoryNames}
          relationTypes={relationTypes}
          resourceTypes={resourceTypes}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {deleteTarget && (
        <ResourceDeleteModal
          title={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
