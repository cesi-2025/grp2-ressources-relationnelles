import {
  ALL_CATEGORY_ID,
  DEFAULT_CATEGORIES,
  type CategoryRow,
} from "@/constants/categories";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SortOption = "date" | "title";

type CategoryContextValue = {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  categoryOptions: readonly CategoryRow[];
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY_ID);
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const value = useMemo(
    () => ({
      selectedCategoryId,
      setSelectedCategoryId,
      categoryOptions: DEFAULT_CATEGORIES,
      sortBy,
      setSortBy,
    }),
    [selectedCategoryId, sortBy],
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
