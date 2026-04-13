const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
 
interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}
 
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
 
export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;
 
  constructor({ message, errors, status }: ApiError) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
 
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}
 
export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}
 
export function removeToken(): void {
  localStorage.removeItem("auth_token");
}
 
export async function api<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
 
  const token = getToken();
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };
 
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
 
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
 
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Erreur réseau" }));
    throw new ApiRequestError({
      message: errorData.message || `Erreur ${response.status}`,
      errors: errorData.errors,
      status: response.status,
    });
  }
 
  if (response.status === 204) return undefined as T;
  return response.json();
}
// --- Auth ---
 
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}
 
interface AuthResponse {
  token: string;
  token_type: string;
  user: User;
}
 
async function hashEmail(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
 
export async function login(email: string, password: string) {
  const email_hash = await hashEmail(email);
  return api<AuthResponse>("/login", { method: "POST", body: { email, email_hash, password } });
}
 
export function register(name: string, email: string, password: string, password_confirmation: string) {
  return api<AuthResponse>("/register", { method: "POST", body: { name, email, password, password_confirmation } });
}
 
export function logout() {
  return api<{ message: string }>("/logout", { method: "POST" });
}
 
export function getMe() {
  return api<User>("/user");
}
 
// --- Resources ---
 
export interface Resource {
  id: number;
  title: string;
  content: string;
  status: 'pending' | 'published' | 'archived' | 'suspended';
  is_public: boolean;
  user_id: number;
  category_id: number;
  relation_type_id: number;
  resource_type_id: number;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
  category?: { id: number; name: string };
  relation_type?: { id: number; name: string };
  resource_type?: { id: number; name: string };
}
 
export interface PaginatedResources {
  current_page: number;
  data: Resource[];
  last_page: number;
  per_page: number;
  total: number;
}
 
export function getResources(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return api<PaginatedResources>(`/resources${query}`);
}
 
export function getResource(id: number) {
  return api<Resource>(`/resources/${id}`);
}
 
export function createResource(data: { title: string; content: string; category_id: number; relation_type_id: number; resource_type_id: number; is_public?: boolean }) {
  return api<Resource>("/resources", { method: "POST", body: data });
}

export function updateResource(id: number, data: { title: string; content: string; category_id: number; relation_type_id: number; resource_type_id: number; is_public?: boolean }) {
  return api<Resource>(`/resources/${id}`, { method: "PUT", body: data });
}

export function deleteResource(id: number) {
  return api<{ message: string }>(`/admin/resources/${id}`, { method: "DELETE" });
}

export function getShareLink(id: number) {
  return api<{ id: number; title: string; url: string }>(`/resources/${id}/share`);
}
 
// --- Categories ---
 
export interface Category {
  id: number;
  name: string;
}
 
export function getCategories() {
  return api<Category[]>("/categories");
}
 
// --- Comments ---
 
export interface Comment {
  id: number;
  content: string;
  user_id: number;
  resource_id: number;
  parent_id: number | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string };
  replies?: Comment[];
}
 
export function getComments(resourceId: number) {
  return api<Comment[]>(`/resources/${resourceId}/comments`);
}
 
export function createComment(resourceId: number, content: string) {
  return api<Comment>(`/resources/${resourceId}/comments`, { method: "POST", body: { content } });
}

export function replyComment(commentId: number, content: string) {
  return api<Comment>(`/comments/${commentId}/reply`, { method: "POST", body: { content } });
}
 
// --- Favorites ---
 
export function addFavorite(resourceId: number) {
  return api(`/resources/${resourceId}/favorite`, { method: "POST" });
}
 
export function removeFavorite(resourceId: number) {
  return api(`/resources/${resourceId}/favorite`, { method: "DELETE" });
}
 
// --- Progression ---
 
export function markExploited(resourceId: number) {
  return api(`/resources/${resourceId}/exploit`, { method: "POST" });
}
 
export function markSetAside(resourceId: number) {
  return api(`/resources/${resourceId}/set-aside`, { method: "POST" });
}
 
export function getProgression() {
  return api("/progression");
}

// --- Activity sessions ---

export interface ActivityParticipant {
  id: number;
  activity_session_id: number;
  user_id: number;
  user?: { id: number; name: string };
}

export interface ActivitySession {
  id: number;
  resource_id: number;
  owner_id: number;
  started_at: string;
  resource?: Resource;
  owner?: { id: number; name: string };
  participants?: ActivityParticipant[];
}

export interface ActivityMessage {
  id: number;
  activity_session_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: { id: number; name: string };
}

export function startActivity(resourceId: number) {
  return api<{ message: string; session: ActivitySession }>(`/activity/${resourceId}/start`, { method: "POST" });
}

export function getActivitySession(sessionId: number) {
  return api<ActivitySession>(`/activity/sessions/${sessionId}`);
}

export function inviteActivityParticipant(sessionId: number, userId: number) {
  return api<{ message: string; participant: ActivityParticipant }>(`/activity/sessions/${sessionId}/invite`, {
    method: "POST",
    body: { user_id: userId },
  });
}

export function getActivityMessages(sessionId: number) {
  return api<ActivityMessage[]>(`/activity/sessions/${sessionId}/messages`);
}

export function postActivityMessage(sessionId: number, content: string) {
  return api<ActivityMessage>(`/activity/sessions/${sessionId}/messages`, {
    method: "POST",
    body: { content },
  });
}

// --- Statistics export ---

export function getStatsExportUrl(params: Record<string, string>) {
  const query = Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${base}/api/admin/statistics/export${query}`;
}

export async function downloadStatsExport(params: Record<string, string>) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch(getStatsExportUrl(params), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new ApiRequestError({ message: "Export impossible", status: res.status });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `statistiques-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}