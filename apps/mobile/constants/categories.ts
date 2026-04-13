export type CategoryRow = { id: string; name: string };

export const ALL_CATEGORY_ID = "all";

/** Filtre « toutes les catégories » (ligne synthétique, hors API). */
export const ALL_CATEGORY_ROW: CategoryRow = {
  id: ALL_CATEGORY_ID,
  name: "Toutes les catégories",
};

export function getCategoryLabel(
  id: string,
  catalog: readonly CategoryRow[],
): string {
  const row = catalog.find((c) => c.id === id);
  return row?.name ?? id;
}
