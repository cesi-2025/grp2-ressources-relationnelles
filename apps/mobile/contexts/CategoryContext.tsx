import { ALL_CATEGORY_ROW, type CategoryRow } from "@/constants/categories";
import {
  FALLBACK_RELATION_TYPE_OPTIONS,
  FALLBACK_RESOURCE_TYPE_OPTIONS,
  type ResourceMetaOption,
} from "@/constants/resourceMeta";
import {
  apiDiscoverResourceMetaFromResources,
  apiListCategories,
} from "@/lib/resourceApi";
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
export type RelationTypeFilter = "all" | `${number}`;

const DEFAULT_SORT: SortOption = "date";

type CategoryContextValue = {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categoryOptions: readonly CategoryRow[];
  relationTypeId: RelationTypeFilter;
  setRelationTypeId: (id: RelationTypeFilter) => void;
  relationTypeOptions: readonly { id: RelationTypeFilter; name: string }[];
  relationTypePickOptions: readonly ResourceMetaOption[];
  resourceTypePickOptions: readonly ResourceMetaOption[];
  sortBy: SortOption;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategoryId, setSelectedCategoryIdState] =
    useState(ALL_CATEGORY_ROW.id);
  const [relationTypeId, setRelationTypeIdState] =
    useState<RelationTypeFilter>("all");
  const [categoryOptions, setCategoryOptions] = useState<
    readonly CategoryRow[]
  >([ALL_CATEGORY_ROW]);
  const [relationTypePickOptions, setRelationTypePickOptions] = useState<
    readonly ResourceMetaOption[]
  >(FALLBACK_RELATION_TYPE_OPTIONS);
  const [resourceTypePickOptions, setResourceTypePickOptions] = useState<
    readonly ResourceMetaOption[]
  >(FALLBACK_RESOURCE_TYPE_OPTIONS);

  const refreshCatalog = useCallback(async () => {
    const [catRes, metaRes] = await Promise.allSettled([
      apiListCategories(),
      apiDiscoverResourceMetaFromResources(),
    ]);

    if (catRes.status === "fulfilled" && catRes.value.length > 0) {
      setCategoryOptions([
        ALL_CATEGORY_ROW,
        ...catRes.value.map((c) => ({ id: String(c.id), name: c.name })),
      ]);
    } else {
      setCategoryOptions([ALL_CATEGORY_ROW]);
    }

    if (metaRes.status === "fulfilled") {
      const { relationTypes, resourceTypes } = metaRes.value;
      if (relationTypes.length > 0) {
        setRelationTypePickOptions(relationTypes);
      } else {
        setRelationTypePickOptions(FALLBACK_RELATION_TYPE_OPTIONS);
      }
      if (resourceTypes.length > 0) {
        setResourceTypePickOptions(resourceTypes);
      } else {
        setResourceTypePickOptions(FALLBACK_RESOURCE_TYPE_OPTIONS);
      }
    } else {
      setRelationTypePickOptions(FALLBACK_RELATION_TYPE_OPTIONS);
      setResourceTypePickOptions(FALLBACK_RESOURCE_TYPE_OPTIONS);
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  const setSelectedCategoryId = useCallback((id: string) => {
    setSelectedCategoryIdState(id);
  }, []);

  const setRelationTypeId = useCallback((id: RelationTypeFilter) => {
    setRelationTypeIdState(id);
  }, []);

  const relationTypeOptions = useMemo(
    () => [
      { id: "all" as const, name: "Toutes" },
      ...relationTypePickOptions.map((relation) => ({
        id: String(relation.id) as RelationTypeFilter,
        name: relation.name,
      })),
    ],
    [relationTypePickOptions],
  );

  const value = useMemo(
    () => ({
      selectedCategoryId,
      setSelectedCategoryId,
      categoryOptions,
      relationTypeId,
      setRelationTypeId,
      relationTypeOptions,
      relationTypePickOptions,
      resourceTypePickOptions,
      sortBy: DEFAULT_SORT,
    }),
    [
      selectedCategoryId,
      setSelectedCategoryId,
      categoryOptions,
      relationTypeId,
      setRelationTypeId,
      relationTypeOptions,
      relationTypePickOptions,
      resourceTypePickOptions,
    ],
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
