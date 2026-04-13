import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";
import { getPlatformOS } from "@/lib/platformRuntime";

const KEY = "rr_sanctum_token";

function isWebRuntime(): boolean {
  return getPlatformOS() === "web";
}

export async function getStoredToken(): Promise<string | null> {
  if (isWebRuntime()) {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage.getItem(KEY);
  }
  return getItemAsync(KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  if (isWebRuntime()) {
    globalThis.localStorage?.setItem(KEY, token);
    return;
  }
  await setItemAsync(KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  if (isWebRuntime()) {
    globalThis.localStorage?.removeItem(KEY);
    return;
  }
  await deleteItemAsync(KEY);
}
