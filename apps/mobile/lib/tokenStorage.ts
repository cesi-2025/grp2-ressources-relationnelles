import { getPlatformOS } from "@/lib/platformRuntime";

const KEY = "rr_sanctum_token";
type SecureStoreLike = {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SecureStore = require("expo-secure-store") as SecureStoreLike;

export async function getStoredToken(): Promise<string | null> {
  if (getPlatformOS() === "web") {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage.getItem(KEY);
  }
  return SecureStore.getItemAsync(KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  if (getPlatformOS() === "web") {
    globalThis.localStorage?.setItem(KEY, token);
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  if (getPlatformOS() === "web") {
    globalThis.localStorage?.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
