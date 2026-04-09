const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
 
const TOKEN_KEY = 'sanctum_token';
 
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
 
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();
 
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
 
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
 
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new ApiError(res.status, error.message ?? 'Une erreur est survenue', error.errors);
  }
 
  if (res.status === 204) return undefined as T;
  return res.json();
}
 
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
 
// ── Auth ─────────────────────────────────────────────────────────────────────
 
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'citoyen' | 'moderateur' | 'admin' | 'super_admin';
  created_at: string;
}
 
export interface AuthResponse {
  token: string;
  user: User;
}
 
export const auth = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    request<AuthResponse>('/register', { method: 'POST', body: JSON.stringify(data) }),
 
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/login', { method: 'POST', body: JSON.stringify(data) }),
 
  logout: () =>
    request<void>('/logout', { method: 'POST' }),
 
  me: () =>
    request<User>('/user'),
 
  deleteAccount: () =>
    request<void>('/user', { method: 'DELETE' }),
};
 
// ── Resources ────────────────────────────────────────────────────────────────
 
export interface Resource {
  id: number;
  title: string;
  content: string;
  category_id: number;
  relation_type_id: number;
  resource_type_id: number;
  user_id: number;
  status: 'pending' | 'validated' | 'suspended';
  is_public: boolean;
  created_at: string;
}
 
export interface RelationType {
  id: number;
  name: string;
}
 
export interface ResourceType {
  id: number;
  name: string;
}
 
export const relationTypes = {
  list: () => request<RelationType[]>('/relation-types'),
};
 
export const resourceTypes = {
  list: () => request<ResourceType[]>('/resource-types'),
};
export const resources = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{data: Resource[]}>(`/resources${qs}`);
  },
  get: (id: number) => request<Resource>(`/resources/${id}`),
  create: (data: Partial<Resource>) =>
    request<Resource>('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Resource>) =>
    request<Resource>(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
 
// ── Categories ───────────────────────────────────────────────────────────────
 
export interface Category {
  id: number;
  name: string;
}
 
export const categories = {
  list: () => request<Category[]>('/categories'),
};
 
// ── Comments ─────────────────────────────────────────────────────────────────
 
export interface Comment {
  id: number;
  content: string;
  user: User;
  approved: boolean;
  created_at: string;
  replies?: Comment[];
}
 
export const comments = {
  byResource: (resourceId: number) => request<Comment[]>(`/resources/${resourceId}/comments`),
  create: (resourceId: number, content: string) =>
    request<Comment>(`/resources/${resourceId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  reply: (commentId: number, content: string) =>
    request<Comment>(`/comments/${commentId}/reply`, { method: 'POST', body: JSON.stringify({ content }) }),
};
 
// ── Favorites ────────────────────────────────────────────────────────────────
 
export const favorites = {
  add: (resourceId: number) =>
    request<void>(`/resources/${resourceId}/favorite`, { method: 'POST' }),
  remove: (resourceId: number) =>
    request<void>(`/resources/${resourceId}/favorite`, { method: 'DELETE' }),
};
 
// ── Progression ──────────────────────────────────────────────────────────────
 
export const progression = {
  list: () => request<Resource[]>('/progression'),
  exploit: (resourceId: number) =>
    request<void>(`/resources/${resourceId}/exploit`, { method: 'POST' }),
  setAside: (resourceId: number) =>
    request<void>(`/resources/${resourceId}/set-aside`, { method: 'POST' }),
};
 
// ── Admin ────────────────────────────────────────────────────────────────────
 
export const admin = {
  statistics: () => request<Record<string, number>>('/admin/statistics'),
  listResources: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Resource[] }>(`/admin/resources${qs}`);
  },
  suspendResource: (resourceId: number) =>
    request<Resource>(`/admin/resources/${resourceId}/suspend`, { method: 'PUT' }),
  reactivateResource: (resourceId: number) =>
    request<Resource>(`/resources/${resourceId}`, { 
      method: 'PUT', 
      body: JSON.stringify({ status: 'published' }) 
    }),
};
 
// ── Moderation ───────────────────────────────────────────────────────────────
 
export const moderation = {
  validateResource: (resourceId: number) =>
    request<void>(`/moderation/resources/${resourceId}/validate`, { method: 'PUT' }),
  approveComment: (commentId: number) =>
    request<void>(`/moderation/comments/${commentId}/approve`, { method: 'PUT' }),
  deleteComment: (commentId: number) =>
    request<void>(`/moderation/comments/${commentId}`, { method: 'DELETE' }),
};
 
// ── Super Admin ───────────────────────────────────────────────────────────────
 
export const superAdmin = {
  createPrivilegedUser: (data: { name: string; email: string; password: string; role: string }) =>
    request<User>('/super-admin/users', { method: 'POST', body: JSON.stringify(data) }),
};