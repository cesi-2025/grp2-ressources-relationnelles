// Suppression du slash final de l'URL.
function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function stripTrailingApiSegment(url: string): string {
  return url.replace(/\/api$/i, "");
}

function normalizeApiPrefix(prefix: string): string {
  const trimmed = prefix.trim();
  if (!trimmed) return "/api";
  const noTrailingSlash = trimmed.replace(/\/+$/, "");
  return noTrailingSlash.startsWith("/")
    ? noTrailingSlash
    : `/${noTrailingSlash}`;
}

// Récupération de l'URL de base de l'API.
export function getApiBaseUrl(): string {
  const raw =
    process.env.EXPO_PUBLIC_API_URL?.trim() ?? process.env.APP_URL?.trim();
  if (raw) {
    const clean = stripTrailingSlash(raw);
    // Evite les URLs du type http://host:port/api + prefix /api => /api/api.
    return stripTrailingApiSegment(clean);
  }
  return "http://127.0.0.1:8000";
}

export function getApiPrefix(): string {
  const raw = process.env.EXPO_PUBLIC_API_PREFIX?.trim() ?? "/api";
  return normalizeApiPrefix(raw);
}

// Concaténation de l'URL de base et du chemin.
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const prefix = getApiPrefix();
  const p = path.startsWith("/") ? path : `/${path}`;
  const fullPath =
    p === prefix || p.startsWith(`${prefix}/`) ? p : `${prefix}${p}`;
  return `${base}${fullPath}`;
}
