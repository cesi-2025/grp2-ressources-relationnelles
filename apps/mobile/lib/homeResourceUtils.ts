import type { ApiResource } from "@/lib/resourceApi";

type HomeSection = { title: string; data: ApiResource[] };
export function isPublishedHomeResource(resource: ApiResource): boolean {
  return (resource.status ?? "").toLowerCase() === "published";
}

export function previewText(text: string, max = 320): string {
  const t = text.trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max).trim()}…`;
}

export function formatResourceType(value?: string): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return "Non renseignée";
  }
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

export function buildSections(items: ApiResource[]): HomeSection[] {
  const map = new Map<string, ApiResource[]>();
  for (const r of items) {
    const title = r.category?.name?.trim() || "Sans catégorie";
    const list = map.get(title);
    if (list) list.push(r);
    else map.set(title, [r]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([title, data]) => ({ title, data }));
}
