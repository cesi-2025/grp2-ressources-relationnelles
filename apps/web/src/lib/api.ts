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

export function login(email: string, password: string) {
  return api<AuthResponse>("/login", { method: "POST", body: { email, password } });
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
  status: string;
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

export function createResource(data: { title: string; description: string; category_id: number; relation_type_id: number; resource_type_id: number; is_public?: boolean }) {
  return api<Resource>("/resources", { method: "POST", body: data });
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
