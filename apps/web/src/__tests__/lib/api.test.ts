import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ApiRequestError,
  setToken,
  removeToken,
  api,
  login,
  register,
  logout,
  getMe,
  getResources,
  getResource,
  createResource,
  getCategories,
  getComments,
  createComment,
  addFavorite,
  removeFavorite,
  markExploited,
  markSetAside,
  getProgression,
} from "@/lib/api";

// ── helpers ──

const mockFetch = vi.fn();
global.fetch = mockFetch;

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  };
}

beforeEach(() => {
  localStorage.clear();
  mockFetch.mockReset();
});

// ── Token management ──

describe("Token helpers", () => {
  it("setToken stores the token in localStorage", () => {
    setToken("abc123");
    expect(localStorage.getItem("auth_token")).toBe("abc123");
  });

  it("removeToken clears the token from localStorage", () => {
    localStorage.setItem("auth_token", "abc123");
    removeToken();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

// ── ApiRequestError ──

describe("ApiRequestError", () => {
  it("carries status and field errors", () => {
    const err = new ApiRequestError({
      message: "Validation failed",
      status: 422,
      errors: { email: ["already taken"] },
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Validation failed");
    expect(err.status).toBe(422);
    expect(err.errors?.email).toEqual(["already taken"]);
  });
});

// ── api() wrapper ──

describe("api()", () => {
  it("sends GET request with correct headers", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await api("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/test"),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("includes Authorization header when token exists", async () => {
    localStorage.setItem("auth_token", "my-token");
    mockFetch.mockResolvedValueOnce(jsonResponse({}));

    await api("/secured");

    const call = mockFetch.mock.calls[0];
    expect(call[1].headers.Authorization).toBe("Bearer my-token");
  });

  it("does not include Authorization header when no token", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));

    await api("/public");

    const call = mockFetch.mock.calls[0];
    expect(call[1].headers.Authorization).toBeUndefined();
  });

  it("sends body as JSON for POST requests", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 1 }));

    await api("/items", { method: "POST", body: { name: "test" } });

    const call = mockFetch.mock.calls[0];
    expect(call[1].body).toBe(JSON.stringify({ name: "test" }));
  });

  it("returns undefined for 204 responses", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn() });

    const result = await api("/delete-something", { method: "DELETE" });
    expect(result).toBeUndefined();
  });

  it("throws ApiRequestError on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: "Not found" }, 404)
    );

    await expect(api("/missing")).rejects.toThrow(ApiRequestError);
    await mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: "Not found" }, 404)
    );
    try {
      await api("/missing");
    } catch (e) {
      expect((e as ApiRequestError).status).toBe(404);
    }
  });

  it("handles non-JSON error responses gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("not json")),
    });

    await expect(api("/broken")).rejects.toThrow("Erreur réseau");
  });
});

// ── Auth endpoints ──

describe("Auth API functions", () => {
  it("login sends email and password", async () => {
    const fakeResponse = { token: "tok", token_type: "bearer", user: { id: 1, name: "A", email: "a@b.c", role: "citizen", is_active: true } };
    mockFetch.mockResolvedValueOnce(jsonResponse(fakeResponse));

    const result = await login("a@b.c", "pass");
    expect(result.token).toBe("tok");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    // login envoie aussi un email_hash (SHA-256) pour la confidentialité RGPD.
    expect(body).toMatchObject({ email: "a@b.c", password: "pass" });
    expect(typeof body.email_hash).toBe("string");
  });

  it("register sends all fields", async () => {
    const fakeResponse = { token: "tok", token_type: "bearer", user: { id: 1, name: "A", email: "a@b.c", role: "citizen", is_active: true } };
    mockFetch.mockResolvedValueOnce(jsonResponse(fakeResponse));

    await register("Alice", "a@b.c", "pass", "pass");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body).toEqual({ name: "Alice", email: "a@b.c", password: "pass", password_confirmation: "pass" });
  });

  it("logout calls POST /logout", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ message: "ok" }));

    await logout();

    expect(mockFetch.mock.calls[0][0]).toContain("/api/logout");
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
  });

  it("getMe calls GET /user", async () => {
    const user = { id: 1, name: "A", email: "a@b.c", role: "citizen", is_active: true };
    mockFetch.mockResolvedValueOnce(jsonResponse(user));

    const result = await getMe();
    expect(result).toEqual(user);
  });
});

// ── Resource endpoints ──

describe("Resource API functions", () => {
  it("getResources appends query params", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 }));

    await getResources({ page: "2", category: "1" });

    expect(mockFetch.mock.calls[0][0]).toContain("page=2");
    expect(mockFetch.mock.calls[0][0]).toContain("category=1");
  });

  it("getResources works without params", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: [] }));

    await getResources();

    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources");
    expect(mockFetch.mock.calls[0][0]).not.toContain("?");
  });

  it("getResource calls /resources/:id", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 5, title: "Test" }));

    await getResource(5);

    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources/5");
  });

  it("createResource sends POST with data", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 1 }));
    const data = { title: "T", content: "D", category_id: 1, relation_type_id: 1, resource_type_id: 1 };

    await createResource(data);

    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual(data);
  });
});

// ── Other endpoints ──

describe("Other API functions", () => {
  it("getCategories calls /categories", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    await getCategories();
    expect(mockFetch.mock.calls[0][0]).toContain("/api/categories");
  });

  it("getComments calls /resources/:id/comments", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    await getComments(3);
    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources/3/comments");
  });

  it("createComment sends POST", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: 1, content: "Hello" }));
    await createComment(3, "Hello");
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({ content: "Hello" });
  });

  it("addFavorite sends POST", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await addFavorite(7);
    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources/7/favorite");
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
  });

  it("removeFavorite sends DELETE", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await removeFavorite(7);
    expect(mockFetch.mock.calls[0][1].method).toBe("DELETE");
  });

  it("markExploited sends POST", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await markExploited(2);
    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources/2/exploit");
  });

  it("markSetAside sends POST", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await markSetAside(2);
    expect(mockFetch.mock.calls[0][0]).toContain("/api/resources/2/set-aside");
  });

  it("getProgression calls /progression", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({}));
    await getProgression();
    expect(mockFetch.mock.calls[0][0]).toContain("/api/progression");
  });
});
