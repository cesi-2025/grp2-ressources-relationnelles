"use client";
 
import Input from "@/components/ui/Input";
 
interface ResourceFiltersProps {
  search: string;
  categoryFilter: string;
  relationTypeFilter: string;
  resourceTypeFilter: string;
  sortBy: string;
  categories: string[];
  relationTypes: string[];
  resourceTypes: string[];
  totalResults: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onRelationTypeChange: (value: string) => void;
  onResourceTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}
 
const selectClass =
  "w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm";
 
export default function ResourceFilters({
  search,
  categoryFilter,
  relationTypeFilter,
  resourceTypeFilter,
  sortBy,
  categories,
  relationTypes,
  resourceTypes,
  totalResults,
  onSearchChange,
  onCategoryChange,
  onRelationTypeChange,
  onResourceTypeChange,
  onSortChange,
}: ResourceFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2">
          <Input
            placeholder="Rechercher par titre ou extrait..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
 
        <select className={selectClass} value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Toutes catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
 
        <select className={selectClass} value={relationTypeFilter} onChange={(e) => onRelationTypeChange(e.target.value)}>
          <option value="all">Tous types de relation</option>
          {relationTypes.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
 
        <select className={selectClass} value={resourceTypeFilter} onChange={(e) => onResourceTypeChange(e.target.value)}>
          <option value="all">Tous types de ressource</option>
          {resourceTypes.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
 
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-600">{totalResults} résultat(s)</div>
 
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600" htmlFor="sort-select">Trier par</label>
          <select
            id="sort-select"
            className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date-recent">Date (récent)</option>
            <option value="date-old">Date (ancien)</option>
            <option value="category">Catégorie</option>
          </select>
        </div>
      </div>
    </div>
  );
}