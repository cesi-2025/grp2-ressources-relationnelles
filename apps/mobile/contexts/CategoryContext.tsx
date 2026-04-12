import {
  ALL_CATEGORY_ID,
  DEFAULT_CATEGORIES,
  type CategoryRow,
} from "@/constants/categories";
import { RELATION_TYPE_OPTIONS } from "@/constants/resourceMeta";
import { apiListCategories } from "@/lib/resourceApi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SortOption = "date" | "title";
export type VisibilityOption = "all" | "public" | "restricted";
export type RelationTypeFilter = "all" | `${number}`;

type CategoryContextValue = {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categoryOptions: readonly CategoryRow[];
  relationTypeId: RelationTypeFilter;
  setRelationTypeId: (id: RelationTypeFilter) => void;
  relationTypeOptions: readonly { id: RelationTypeFilter; name: string }[];
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  visibility: VisibilityOption;
  setVisibility: (visibility: VisibilityOption) => void;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategoryId, setSelectedCategoryIdState] = useState(ALL_CATEGORY_ID);
  const [relationTypeId, setRelationTypeIdState] = useState<RelationTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [visibility, setVisibility] = useState<VisibilityOption>("all");
  const [categoryOptions, setCategoryOptions] =
    useState<readonly CategoryRow[]>(DEFAULT_CATEGORIES);

  const refreshCategories = useCallback(async () => {
    try {
      const categories = await apiListCategories();
      setCategoryOptions([
        DEFAULT_CATEGORIES[0],
        ...categories.map((c) => ({ id: String(c.id), name: c.name })),
      ]);
    } catch {
      setCategoryOptions(DEFAULT_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  const setSelectedCategoryId = useCallback((id: string) => {
    setSelectedCategoryIdState(id);
  }, []);

  const setRelationTypeId = useCallback((id: RelationTypeFilter) => {
    setRelationTypeIdState(id);
  }, []);

  const value = useMemo(
    () => ({
      selectedCategoryId,
      setSelectedCategoryId,
      categoryOptions,
      relationTypeId,
      setRelationTypeId,
      relationTypeOptions: [
        { id: "all", name: "Toutes" },
        ...RELATION_TYPE_OPTIONS.map((relation) => ({
          id: String(relation.id) as RelationTypeFilter,
          name: relation.name,
        })),
      ],
      sortBy,
      setSortBy,
      visibility,
      setVisibility,
    }),
    [selectedCategoryId, categoryOptions, relationTypeId, sortBy, visibility],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategory doit être utilisé dans un CategoryProvider");
  }
  return ctx;
}
