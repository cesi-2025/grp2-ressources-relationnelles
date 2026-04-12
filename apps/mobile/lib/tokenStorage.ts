import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "rr_sanctum_token";

export async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage.getItem(KEY);
  }
  return SecureStore.getItemAsync(KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(KEY, token);
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
