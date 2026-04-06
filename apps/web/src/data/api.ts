// Configuration API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Helper pour les appels API
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchOptions } = options || {};

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw error;
  }

  return response.json();
}

// Resources
export async function getResources(params?: Record<string, any>) {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/resources${query ? `?${query}` : ""}`);
}

export async function getResource(id: number) {
  return apiCall(`/resources/${id}`);
}

export async function createResource(data: any, token: string) {
  return apiCall("/resources", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export async function updateResource(id: number, data: any, token: string) {
  return apiCall(`/resources/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

// Categories
export async function getCategories() {
  return apiCall("/categories");
}

// Comments
export async function getResourceComments(resourceId: number) {
  return apiCall(`/resources/${resourceId}/comments`);
}

export async function createComment(
  resourceId: number,
  content: string,
  token: string
) {
  return apiCall(`/resources/${resourceId}/comments`, {
    method: "POST",
    token,
    body: JSON.stringify({ content }),
  });
}

// Auth
export async function login(email: string, password: string) {
  return apiCall("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  return apiCall("/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation,
    }),
  });
}

export async function logout(token: string) {
  return apiCall("/logout", {
    method: "POST",
    token,
  });
}

export async function getCurrentUser(token: string) {
  return apiCall("/user", { token });
}

// Favorites
export async function addFavorite(resourceId: number, token: string) {
  return apiCall(`/resources/${resourceId}/favorite`, {
    method: "POST",
    token,
  });
}

export async function removeFavorite(resourceId: number, token: string) {
  return apiCall(`/resources/${resourceId}/favorite`, {
    method: "DELETE",
    token,
  });
}

// Comments - Reply
export async function replyToComment(
  commentId: number,
  content: string,
  token: string
) {
  return apiCall(`/comments/${commentId}/reply`, {
    method: "POST",
    token,
    body: JSON.stringify({ content }),
  });
}

// Progression
export async function markResourceAsExploited(
  resourceId: number,
  token: string
) {
  return apiCall(`/resources/${resourceId}/exploit`, {
    method: "POST",
    token,
  });
}

export async function setResourceAside(resourceId: number, token: string) {
  return apiCall(`/resources/${resourceId}/set-aside`, {
    method: "POST",
    token,
  });
}

export async function getProgression(token: string) {
  return apiCall("/progression", { token });
}
