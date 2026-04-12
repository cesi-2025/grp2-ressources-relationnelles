import { apiUrl } from "@/lib/api";

type ApiMessage = { message?: string; errors?: Record<string, string[]> };

export type ApiCategory = {
  id: number;
  name: string;
};

export type ApiResourceMeta = {
  id: number;
  name: string;
};

export type ApiResourceUser = {
  id: number;
  name: string;
  role?: string;
};

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

type Paginated<T> = { data: T[] };

const jsonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const fetchDefaults: Pick<RequestInit, "credentials"> = {
  credentials: "omit",
};

function authHeaders(token: string): HeadersInit {
  return {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const raw = await res.text();
  return (raw ? JSON.parse(raw) : {}) as T;
}

function errorMessage(data: ApiMessage | null, fallback: string): string {
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  if (data?.message) return data.message;
  return fallback;
}

async function safeFetch<T>(input: string, init: RequestInit, fallbackError: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(input, { ...fetchDefaults, ...init });
  } catch {
    throw new Error("Impossible de joindre le serveur.");
  }

  const data = await parseJsonResponse<T | ApiMessage>(res);
  if (!res.ok) {
    throw new Error(errorMessage(data as ApiMessage, fallbackError));
  }
  return data as T;
}

export async function apiListResources(params: {
  categoryId?: string;
  relationTypeId?: string;
  sortBy?: "date" | "title";
}): Promise<ApiResource[]> {
  const query = new URLSearchParams();
  if (params.categoryId && params.categoryId !== "all") query.set("category", params.categoryId);
  if (params.relationTypeId && params.relationTypeId !== "all") {
    query.set("relation_type", params.relationTypeId);
  }
  if (params.sortBy) query.set("sort", params.sortBy);
  const endpoint = query.size > 0 ? `/api/resources?${query.toString()}` : "/api/resources";
  const data = await safeFetch<Paginated<ApiResource>>(apiUrl(endpoint), { method: "GET" }, "Chargement des ressources impossible.");
  return data.data ?? [];
}

export function apiGetResource(id: number): Promise<ApiResource> {
  return safeFetch<ApiResource>(apiUrl(`/api/resources/${id}`), { method: "GET" }, "Ressource introuvable.");
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
    apiUrl("/api/resources"),
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
    apiUrl(`/api/resources/${resourceId}`),
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    },
    "Modification de ressource impossible.",
  );
}

export function apiListCategories(): Promise<ApiCategory[]> {
  return safeFetch<ApiCategory[]>(apiUrl("/api/categories"), { method: "GET" }, "Chargement des categories impossible.");
}

export function apiListComments(resourceId: number): Promise<ApiComment[]> {
  return safeFetch<ApiComment[]>(apiUrl(`/api/resources/${resourceId}/comments`), { method: "GET" }, "Chargement des commentaires impossible.");
}

export function apiCreateComment(token: string, resourceId: number, content: string): Promise<ApiComment> {
  return safeFetch<ApiComment>(
    apiUrl(`/api/resources/${resourceId}/comments`),
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    },
    "Commentaire impossible.",
  );
}

export function apiReplyComment(token: string, commentId: number, content: string): Promise<ApiComment> {
  return safeFetch<ApiComment>(
    apiUrl(`/api/comments/${commentId}/reply`),
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    },
    "Reponse impossible.",
  );
}

export async function apiSetFavorite(token: string, resourceId: number, favorite: boolean): Promise<void> {
  await safeFetch<{ message: string }>(
    apiUrl(`/api/resources/${resourceId}/favorite`),
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
    apiUrl(`/api/resources/${resourceId}/${endpoint}`),
    {
      method: "POST",
      headers: authHeaders(token),
    },
    "Mise a jour de progression impossible.",
  );
}

export type ApiProgression = {
  favorites: Array<{ resource_id?: number; resource?: ApiResource }>;
  exploited: Array<{ resource_id?: number; resource?: ApiResource }>;
  set_aside: Array<{ resource_id?: number; resource?: ApiResource }>;
};

export function apiGetProgression(token: string): Promise<ApiProgression> {
  return safeFetch<ApiProgression>(
    apiUrl("/api/progression"),
    {
      method: "GET",
      headers: authHeaders(token),
    },
    "Chargement de progression impossible.",
  );
}

export function apiModerationPendingResources(token: string): Promise<ApiResource[]> {
  return safeFetch<ApiResource[]>(
    apiUrl("/api/moderation/resources/pending"),
    {
      method: "GET",
      headers: authHeaders(token),
    },
    "Chargement des ressources en attente impossible.",
  );
}

export function apiModerationPendingComments(token: string): Promise<ApiComment[]> {
  return safeFetch<ApiComment[]>(
    apiUrl("/api/moderation/comments/pending"),
    {
      method: "GET",
      headers: authHeaders(token),
    },
    "Chargement des commentaires en attente impossible.",
  );
}

export async function apiModerationValidateResource(token: string, resourceId: number): Promise<void> {
  await safeFetch<{ message: string }>(
    apiUrl(`/api/moderation/resources/${resourceId}/validate`),
    {
      method: "PUT",
      headers: authHeaders(token),
    },
    "Validation de ressource impossible.",
  );
}

export async function apiModerationApproveComment(token: string, commentId: number): Promise<void> {
  await safeFetch<{ message: string }>(
    apiUrl(`/api/moderation/comments/${commentId}/approve`),
    {
      method: "PUT",
      headers: authHeaders(token),
    },
    "Approbation du commentaire impossible.",
  );
}

export async function apiModerationDeleteComment(token: string, commentId: number): Promise<void> {
  await safeFetch<{ message: string }>(
    apiUrl(`/api/moderation/comments/${commentId}`),
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
    "Suppression du commentaire impossible.",
  );
}
