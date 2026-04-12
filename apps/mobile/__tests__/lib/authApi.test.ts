import {
  apiDeleteAccount,
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
} from "@/lib/authApi";

describe("authApi", () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://127.0.0.1:8000";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = originalEnv;
    }
  });

  describe("apiLogin", () => {
    it("envoie l’e-mail en minuscules et renvoie token + user", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            token: "sanctum-token",
            token_type: "Bearer",
            user: {
              id: 2,
              name: "Test",
              email: "test@example.com",
              role: "citizen",
            },
          }),
      });

      const result = await apiLogin("  USER@EXAMPLE.COM  ", "secret-pass");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/login",
        expect.objectContaining({
          credentials: "omit",
          method: "POST",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: "user@example.com",
            password: "secret-pass",
          }),
        }),
      );
      expect(result.token).toBe("sanctum-token");
      expect(result.user.email).toBe("test@example.com");
    });

    it("traduit les identifiants invalides", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ message: "Invalid credentials." }),
      });

      await expect(apiLogin("a@b.c", "wrong")).rejects.toThrow(
        "E-mail ou mot de passe incorrect.",
      );
    });

    it("traduit un compte désactivé", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => JSON.stringify({ message: "User account is disabled." }),
      });

      await expect(apiLogin("a@b.c", "ok")).rejects.toThrow("Ce compte est désactivé.");
    });

    it("traduit l’erreur MAC Laravel", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 419,
        text: async () => JSON.stringify({ message: "The MAC is invalid." }),
      });

      await expect(apiLogin("a@b.c", "x")).rejects.toThrow(/Laravel/);
    });

    it("lève une erreur réseau si fetch échoue", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(apiLogin("a@b.c", "x")).rejects.toThrow(/Impossible de joindre le serveur/);
    });
  });

  describe("apiRegister", () => {
    it("envoie name, email, password et password_confirmation", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            token: "t-reg",
            token_type: "Bearer",
            user: { id: 3, name: "New", email: "new@example.com", role: "citizen" },
          }),
      });

      await apiRegister("  New User  ", "  NEW@EXAMPLE.COM  ", "Password123!");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/register",
        expect.objectContaining({
          credentials: "omit",
          method: "POST",
          body: JSON.stringify({
            name: "New User",
            email: "new@example.com",
            password: "Password123!",
            password_confirmation: "Password123!",
          }),
        }),
      );
    });

    it("extrait la première erreur de validation Laravel", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () =>
          JSON.stringify({
            message: "The given data was invalid.",
            errors: { email: ["The email has already been taken."] },
          }),
      });

      await expect(apiRegister("A", "dup@example.com", "Password123!")).rejects.toThrow(
        "Cet e-mail est déjà utilisé.",
      );
    });

    it("traduit l’unicité sur email_hash", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: async () =>
          JSON.stringify({
            message: "The given data was invalid.",
            errors: {
              email_hash: ["The email hash has already been taken."],
            },
          }),
      });

      await expect(apiRegister("A", "dup@example.com", "Password123!")).rejects.toThrow(
        "Cet e-mail est déjà utilisé.",
      );
    });
  });

  describe("apiLogout", () => {
    it("appelle POST /api/logout avec Bearer", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await apiLogout("my-token");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/logout",
        expect.objectContaining({
          credentials: "omit",
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        }),
      );
    });
  });

  describe("apiMe", () => {
    it("renvoie l’utilisateur JSON", async () => {
      const user = { id: 1, name: "Me", email: "me@x.com", role: "citizen" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => user,
      });

      await expect(apiMe("tok")).resolves.toEqual(user);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/user",
        expect.objectContaining({
          credentials: "omit",
          headers: expect.objectContaining({ Authorization: "Bearer tok" }),
        }),
      );
    });

    it("lève si la session est invalide", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(apiMe("bad")).rejects.toThrow("Session invalide");
    });
  });

  describe("apiDeleteAccount", () => {
    it("réussit si 2xx", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await expect(apiDeleteAccount("tok")).resolves.toBeUndefined();
    });

    it("lève si échec", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(apiDeleteAccount("tok")).rejects.toThrow("Suppression du compte impossible.");
    });
  });
});
