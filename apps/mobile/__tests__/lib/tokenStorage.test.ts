import { setPlatformOverrideForTests } from "@/lib/platformRuntime";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/tokenStorage";
import * as SecureStore from "expo-secure-store";

describe("tokenStorage", () => {
  afterEach(() => {
    setPlatformOverrideForTests(null);
    jest.clearAllMocks();
  });

  describe("hors web (SecureStore)", () => {
    beforeEach(() => {
      setPlatformOverrideForTests("ios");
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

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "rr_sanctum_token",
      );
    });
  });

  describe("web (localStorage)", () => {
    beforeEach(() => {
      setPlatformOverrideForTests("web");
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
