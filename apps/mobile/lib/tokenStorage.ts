import {
  deleteItemAsync,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";

const KEY = "rr_sanctum_token";

export async function getStoredToken(): Promise<string | null> {
  return getItemAsync(KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  await setItemAsync(KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  await deleteItemAsync(KEY);
}
