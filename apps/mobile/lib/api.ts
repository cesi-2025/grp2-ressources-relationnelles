import { getPlatformOS } from "@/lib/platformRuntime";

// Suppression du slash final de l'URL.
function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

// Adaptation de l'URL pour Android.
function adaptAndroidLoopback(baseUrl: string): string {
  return baseUrl
    .replace("://127.0.0.1:", "://10.0.2.2:")
    .replace("://localhost:", "://10.0.2.2:");
}

// Récupération de l'URL de base de l'API.
export function getApiBaseUrl(): string {
  const os = getPlatformOS();
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  const env = raw ? stripTrailingSlash(raw) : "";
  // Si l'URL est définie, on l'adapte pour Android.
  if (env) {
    if (os === "android") {
      return adaptAndroidLoopback(env);
    }
    return env;
  }
  // Si l'URL n'est pas définie, on utilise l'URL par défaut pour Android.
  if (os === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://127.0.0.1:8000";
}

// Concaténation de l'URL de base et du chemin.
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
