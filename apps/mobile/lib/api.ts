import { Platform } from "react-native";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  const env = raw ? stripTrailingSlash(raw) : "";

  if (env) {
    if (Platform.OS === "android") {
      return env
        .replace("://127.0.0.1:", "://10.0.2.2:")
        .replace("://localhost:", "://10.0.2.2:");
    }
    return env;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }
  return "http://127.0.0.1:8000";
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
