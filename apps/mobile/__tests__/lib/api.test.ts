import { Platform } from "react-native";
import { apiUrl, getApiBaseUrl } from "@/lib/api";

describe("api", () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;
  const originalOs = Platform.OS;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalEnv;
    }
    Object.defineProperty(Platform, "OS", { value: originalOs, configurable: true });
  });

  it("apiUrl concatène la base et le chemin", () => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.test";
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });

    expect(apiUrl("/api/login")).toBe("https://api.test/api/login");
    expect(apiUrl("api/ping")).toBe("https://api.test/api/ping");
  });

  it("retire le slash final de la base", () => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.test/";
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });

    expect(getApiBaseUrl()).toBe("https://api.test");
  });

  it("sur Android remplace localhost par 10.0.2.2", () => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:8000";
    Object.defineProperty(Platform, "OS", { value: "android", configurable: true });

    expect(getApiBaseUrl()).toBe("http://10.0.2.2:8000");
  });

  it("sans env utilise 127.0.0.1:8000 sur iOS", () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });

    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8000");
  });
});
