import { apiUrl } from "@/lib/api";

// Message d'erreur API.
type ApiMessage = { message?: string; errors?: Record<string, string[]> };
const API_CRYPTO_HINTS: Record<string, string> = {
  "The MAC is invalid.":
    "Donnees chiffrees invalides cote API (APP_KEY changee). Redemarre l'API avec une APP_KEY stable ou regenere les donnees.",
};

// Catégorie API.
export type ApiCategory = {
  id: number;
  name: string;
};

// Type de ressource API.
export type ApiResourceMeta = {
  id: number;
  name: string;
};

// Utilisateur API.
export type ApiResourceUser = {
  id: number;
  name: string;
  role?: string;
};

// Ressource API.
export type ApiResource = {
  id: number;
  user_id?: number;
  title: string;
  content: string;
  category_id: number;
  relation_type_id: number;
  resource_type_id: number;
  status: string;
  is_public: boolean;
  created_at: string;
  user?: ApiResourceUser;
  category?: ApiCategory;
  relation_type?: ApiResourceMeta;
  resource_type?: ApiResourceMeta;
};

// Commentaire API.
export type ApiComment = {
  id: number;
  content: string;
  user_id: number;
  resource_id: number;
  parent_id: number | null;
  is_approved: boolean;
  created_at: string;
  user?: ApiResourceUser;
  resource?: ApiResource;
  replies?: ApiComment[];
};

// Pagination API.
type Paginated<T> = { data: T[] };

type LaravelResourcePage = Paginated<ApiResource> & {
  last_page?: number;
  current_page?: number;
};

// Headers JSON pour les endpoints de ressources.
const jsonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Configuration de fetch.
const fetchDefaults: Pick<RequestInit, "credentials"> = {
  credentials: "omit",
};
const FETCH_TIMEOUT_MS = 12000;

// Headers d'authentification.
function authHeaders(token: string): HeadersInit {
  return {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };
}

// Parsing de la réponse JSON.
async function parseJsonResponse<T>(res: Response): Promise<T> {
  const raw = await res.text();
  return (raw ? JSON.parse(raw) : {}) as T;
}

// Message d'erreur.
function errorMessage(data: ApiMessage | null, fallback: string): string {
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) {
      return first;
    }
  }
  if (data?.message) {
    return API_CRYPTO_HINTS[data.message] ?? data.message;
  }
  return fallback;
}

// Fetch sécurisé.
async function safeFetch<T>(
  input: string,
  init: RequestInit,
  fallbackError: string,
): Promise<T> {
  let res: Response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    res = await fetch(input, {
      ...fetchDefaults,
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Le serveur met trop de temps a repondre.");
    }
    throw new Error("Impossible de joindre le serveur.");
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await parseJsonResponse<T | ApiMessage>(res);
  if (!res.ok) {
    throw new Error(errorMessage(data as ApiMessage, fallbackError));
  }
  return data as T;
}

/** Taille de page côté API (max 60 côté serveur) pour limiter le nombre de requêtes sur l’accueil. */
const RESOURCE_LIST_PER_PAGE = 45;

async function fetchResourcesPage(params: {
  categoryId?: string;
  relationTypeId?: string;
  sortBy?: "date" | "title";
  page: number;
  perPage?: number;
}): Promise<{ items: ApiResource[]; lastPage: number }> {
  const query = new URLSearchParams();
  if (params.categoryId && params.categoryId !== "all") {
    query.set("category", params.categoryId);
  }
  if (params.relationTypeId && params.relationTypeId !== "all") {
    query.set("relation_type", params.relationTypeId);
  }
  if (params.sortBy) {
    query.set("sort", params.sortBy);
  }
  query.set(
    "per_page",
    String(Math.min(60, Math.max(1, params.perPage ?? RESOURCE_LIST_PER_PAGE))),
  );
  query.set("page", String(Math.max(1, params.page)));
  const data = await safeFetch<LaravelResourcePage>(
    apiUrl(`/resources?${query.toString()}`),
    { method: "GET" },
    "Chargement des ressources impossible.",
  );
  const lastPage =
    typeof data.last_page === "number" && data.last_page >= 1
      ? data.last_page
      : 1;
  return { items: data.data ?? [], lastPage };
}

export async function apiListResourcesAllPages(
  params: {
    categoryId?: string;
    relationTypeId?: string;
    sortBy?: "date" | "title";
  },
  options?: { maxPages?: number },
): Promise<ApiResource[]> {
  const maxPages = options?.maxPages ?? 10;
  if (maxPages < 1) {
    return [];
  }
  const { items: firstItems, lastPage: firstLast } = await fetchResourcesPage({
    ...params,
    page: 1,
  });
  const merged: ApiResource[] = [...firstItems];
  const lastPage = Math.min(firstLast, maxPages);
  const parallelBatch = 12;
  let nextPage = 2;
  while (nextPage <= lastPage) {
    const batchEnd = Math.min(lastPage, nextPage + parallelBatch - 1);
    const pages: number[] = [];
    for (let p = nextPage; p <= batchEnd; p += 1) {
      pages.push(p);
    }
    const chunks = await Promise.all(
      pages.map((page) => fetchResourcesPage({ ...params, page })),
    );
    for (const { items } of chunks) {
      merged.push(...items);
    }
    nextPage = batchEnd + 1;
  }
  return merged;
}

export function apiGetResource(id: number): Promise<ApiResource> {
  return safeFetch<ApiResource>(
    apiUrl(`/resources/${id}`),
    { method: "GET" },
    "Ressource introuvable.",
  );
}

export function apiCreateResource(
  token: string,
  payload: {
    title: string;
    content: string;
    category_id: number;
    relation_type_id: number;
    resource_type_id: number;
    is_public: boolean;
  },
): Promise<ApiResource> {
  return safeFetch<ApiResource>(
    apiUrl("/resources"),
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    },
    "Creation de ressource impossible.",
  );
}

export function apiUpdateResource(
  token: string,
  resourceId: number,
  payload: {
    title: string;
    content: string;
    category_id: number;
    relation_type_id: number;
    resource_type_id: number;
    is_public: boolean;
  },
): Promise<ApiResource> {
  return safeFetch<ApiResource>(
    apiUrl(`/resources/${resourceId}`),
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    },
    "Modification de ressource impossible.",
  );
}

export function apiListCategories(): Promise<ApiCategory[]> {
  return safeFetch<ApiCategory[]>(
    apiUrl("/categories"),
    { method: "GET" },
    "Chargement des categories impossible.",
  );
}

function recordUniqueMeta(
  map: Map<number, string>,
  id: number | undefined,
  name: string | undefined,
) {
  if (id == null || map.has(id)) return;
  const label = name?.trim();
  map.set(id, label && label.length > 0 ? label : String(id));
}

function sortedMetaFromMap(map: Map<number, string>): ApiResourceMeta[] {
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/** Pages max pour la découverte des types  */
const DISCOVER_META_MAX_PAGES = 5;
const DISCOVER_META_PER_PAGE = 60;

export async function apiDiscoverResourceMetaFromResources(): Promise<{
  relationTypes: ApiResourceMeta[];
  resourceTypes: ApiResourceMeta[];
}> {
  const relationMap = new Map<number, string>();
  const resourceTypeMap = new Map<number, string>();
  const { items: firstChunk, lastPage: firstLast } = await fetchResourcesPage({
    sortBy: "title",
    page: 1,
    perPage: DISCOVER_META_PER_PAGE,
  });
  const lastPage = Math.min(firstLast, DISCOVER_META_MAX_PAGES);
  const applyChunk = (chunk: ApiResource[]) => {
    for (const r of chunk) {
      recordUniqueMeta(
        relationMap,
        r.relation_type?.id ?? r.relation_type_id,
        r.relation_type?.name,
      );
      recordUniqueMeta(
        resourceTypeMap,
        r.resource_type?.id ?? r.resource_type_id,
        r.resource_type?.name,
      );
    }
  };
  applyChunk(firstChunk);
  if (lastPage > 1) {
    const rest = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        fetchResourcesPage({
          sortBy: "title",
          page: i + 2,
          perPage: DISCOVER_META_PER_PAGE,
        }),
      ),
    );
    for (const { items } of rest) {
      applyChunk(items);
    }
  }

  return {
    relationTypes: sortedMetaFromMap(relationMap),
    resourceTypes: sortedMetaFromMap(resourceTypeMap),
  };
}

export function apiListComments(resourceId: number): Promise<ApiComment[]> {
  return safeFetch<ApiComment[]>(
    apiUrl(`/resources/${resourceId}/comments`),
    { method: "GET" },
    "Chargement des commentaires impossible.",
  );
}

export function apiCreateComment(
  token: string,
  resourceId: number,
  content: string,
): Promise<ApiComment> {
  return safeFetch<ApiComment>(
    apiUrl(`/resources/${resourceId}/comments`),
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    },
    "Commentaire impossible.",
  );
}

export function apiReplyComment(
  token: string,
  commentId: number,
  content: string,
): Promise<ApiComment> {
  return safeFetch<ApiComment>(
    apiUrl(`/comments/${commentId}/reply`),
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    },
    "Reponse impossible.",
  );
}

export async function apiSetFavorite(
  token: string,
  resourceId: number,
  favorite: boolean,
): Promise<void> {
  await safeFetch<{ message: string }>(
    apiUrl(`/resources/${resourceId}/favorite`),
    {
      method: favorite ? "POST" : "DELETE",
      headers: authHeaders(token),
    },
    "Mise a jour du favori impossible.",
  );
}

export async function apiSetProgression(
  token: string,
  resourceId: number,
  status: "exploited" | "set_aside",
): Promise<void> {
  const endpoint = status === "exploited" ? "exploit" : "set-aside";
  await safeFetch<{ message: string }>(
    apiUrl(`/resources/${resourceId}/${endpoint}`),
    {
      method: "POST",
      headers: authHeaders(token),
    },
    "Mise a jour de progression impossible.",
  );
}

export type ApiProgression = {
  favorites: { resource_id?: number; resource?: ApiResource }[];
  exploited: { resource_id?: number; resource?: ApiResource }[];
  set_aside: { resource_id?: number; resource?: ApiResource }[];
};

type ApiProgressionRow = ApiProgression["favorites"][number];

function coerceProgressionRows(value: unknown): ApiProgressionRow[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value as ApiProgressionRow[];
  if (typeof value === "object") {
    return Object.values(value) as ApiProgressionRow[];
  }
  return [];
}

export async function apiGetProgression(
  token: string,
): Promise<ApiProgression> {
  const data = await safeFetch<{
    favorites?: unknown;
    exploited?: unknown;
    set_aside?: unknown;
  }>(
    apiUrl("/progression"),
    {
      method: "GET",
      headers: authHeaders(token),
    },
    "Chargement de progression impossible.",
  );
  return {
    favorites: coerceProgressionRows(data.favorites),
    exploited: coerceProgressionRows(data.exploited),
    set_aside: coerceProgressionRows(data.set_aside),
  };
}
