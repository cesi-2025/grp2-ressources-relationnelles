import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/tokenStorage";

describe("tokenStorage", () => {
  const originalOs = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { value: originalOs, configurable: true });
    jest.clearAllMocks();
  });

  describe("hors web (SecureStore)", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });
    });

    it("lit le token via SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("abc");

      await expect(getStoredToken()).resolves.toBe("abc");
      expect(SecureStore.getItemAsync).toHaveBeenCalled();
    });

    it("enregistre le token", async () => {
      await setStoredToken("new-token");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "rr_sanctum_token",
        "new-token",
      );
    });

    it("efface le token", async () => {
      await clearStoredToken();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("rr_sanctum_token");
    });
  });

  describe("web (localStorage)", () => {
    beforeEach(() => {
      Object.defineProperty(Platform, "OS", { value: "web", configurable: true });
    });

    it("utilise localStorage quand disponible", async () => {
      const getItem = jest.fn(() => "web-tok");
      const setItem = jest.fn();
      const removeItem = jest.fn();
      const prev = globalThis.localStorage;
      Object.defineProperty(globalThis, "localStorage", {
        value: { getItem, setItem, removeItem },
        configurable: true,
      });

      await expect(getStoredToken()).resolves.toBe("web-tok");
      expect(getItem).toHaveBeenCalledWith("rr_sanctum_token");

      Object.defineProperty(globalThis, "localStorage", {
        value: prev,
        configurable: true,
      });
    });
  });
});
