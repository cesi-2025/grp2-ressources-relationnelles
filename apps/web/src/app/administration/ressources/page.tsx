"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ResourceCard from "@/components/resources/ResourceCard";
import { RESOURCES } from "@/data/resources";

const ITEMS_PER_PAGE = 6;

export default function RessourcesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [relationTypeFilter, setRelationTypeFilter] = useState("all");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-recent");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(RESOURCES.map((resource) => resource.category)))],
    []
  );

  const relationTypes = useMemo(
    () => ["all", ...Array.from(new Set(RESOURCES.map((resource) => resource.relationType)))],
    []
  );

  const resourceTypes = useMemo(
    () => ["all", ...Array.from(new Set(RESOURCES.map((resource) => resource.resourceType)))],
    []
  );

  const filteredAndSortedResources = useMemo(() => {
    const filtered = RESOURCES.filter((resource) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchSearch =
        normalizedSearch.length === 0 ||
        resource.title.toLowerCase().includes(normalizedSearch) ||
        resource.excerpt.toLowerCase().includes(normalizedSearch);

      const matchCategory = categoryFilter === "all" || resource.category === categoryFilter;
      const matchRelationType =
        relationTypeFilter === "all" || resource.relationType === relationTypeFilter;
      const matchResourceType =
        resourceTypeFilter === "all" || resource.resourceType === resourceTypeFilter;

      return matchSearch && matchCategory && matchRelationType && matchResourceType;
    });

    const sorted = [...filtered];

    if (sortBy === "date-recent") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (sortBy === "date-old") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (sortBy === "category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category, "fr"));
    }

    return sorted;
  }, [search, categoryFilter, relationTypeFilter, resourceTypeFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredAndSortedResources.length / ITEMS_PER_PAGE));

  const paginatedResources = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedResources.slice(start, end);
  }, [page, filteredAndSortedResources]);

  function onFilterChange(resetFilter: () => void) {
    resetFilter();
    setPage(1);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-3">Ressources Relationnelles</h1>
          <p className="text-lg text-gray-600">
            Explorez les ressources publiques, appliquez des filtres et triez les résultats.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <Input
                placeholder="Rechercher par titre ou extrait..."
                value={search}
                onChange={(event) => onFilterChange(() => setSearch(event.target.value))}
              />
            </div>

            <select
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
              value={categoryFilter}
              onChange={(event) => onFilterChange(() => setCategoryFilter(event.target.value))}
            >
              <option value="all">Toutes catégories</option>
              {categories
                .filter((category) => category !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            <select
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
              value={relationTypeFilter}
              onChange={(event) => onFilterChange(() => setRelationTypeFilter(event.target.value))}
            >
              <option value="all">Tous types de relation</option>
              {relationTypes
                .filter((type) => type !== "all")
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>

            <select
              className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
              value={resourceTypeFilter}
              onChange={(event) => onFilterChange(() => setResourceTypeFilter(event.target.value))}
            >
              <option value="all">Tous types de ressource</option>
              {resourceTypes
                .filter((type) => type !== "all")
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">
              {filteredAndSortedResources.length} résultat(s)
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600" htmlFor="sort-select">
                Trier par
              </label>
              <select
                id="sort-select"
                className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={sortBy}
                onChange={(event) => onFilterChange(() => setSortBy(event.target.value))}
              >
                <option value="date-recent">Date (récent)</option>
                <option value="date-old">Date (ancien)</option>
                <option value="category">Catégorie</option>
              </select>
            </div>
          </div>
        </div>

        {paginatedResources.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune ressource trouvée</h2>
            <p className="text-gray-600 mb-5">Modifiez les filtres ou la recherche pour afficher des résultats.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setRelationTypeFilter("all");
                setResourceTypeFilter("all");
                setSortBy("date-recent");
                setPage(1);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Page {page} sur {pageCount}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                >
                  Précédent
                </Button>

                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pageCount}
                  onClick={() => setPage((previous) => Math.min(pageCount, previous + 1))}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
