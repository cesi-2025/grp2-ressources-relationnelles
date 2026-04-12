export type CategoryRow = { id: string; name: string };

export const ALL_CATEGORY_ID = "all";

export const DEFAULT_CATEGORIES: readonly CategoryRow[] = [
  { id: ALL_CATEGORY_ID, name: "Toutes les catégories" },
  { id: "1", name: "Communication" },
  { id: "2", name: "Conflits" },
  { id: "3", name: "Développement personnel" },
  { id: "4", name: "Loisirs" },
];

export type ContentCategoryId = Exclude<
  (typeof DEFAULT_CATEGORIES)[number]["id"],
  typeof ALL_CATEGORY_ID
>;

export function getCategoryLabel(
  id: string,
  catalog: readonly CategoryRow[],
): string {
  const row = catalog.find((c) => c.id === id);
  return row?.name ?? id;
}
