import { apiUrl, getApiBaseUrl } from "@/lib/api";
import { setPlatformOverrideForTests } from "@/lib/platformRuntime";

describe("api", () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalEnv;
    }
    setPlatformOverrideForTests(null);
  });

  it("apiUrl concatène la base et le chemin", () => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.test";
    setPlatformOverrideForTests("ios");

    expect(apiUrl("/api/login")).toBe("https://api.test/api/login");
    expect(apiUrl("api/ping")).toBe("https://api.test/api/ping");
  });

  it("retire le slash final de la base", () => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.test/";
    setPlatformOverrideForTests("ios");

    expect(getApiBaseUrl()).toBe("https://api.test");
  });

  it("sur Android remplace localhost par 10.0.2.2", () => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:8000";
    setPlatformOverrideForTests("android");

    expect(getApiBaseUrl()).toBe("http://10.0.2.2:8000");
  });

  it("sans env utilise 127.0.0.1:8000 sur iOS", () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    setPlatformOverrideForTests("ios");

    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8000");
  });
});
