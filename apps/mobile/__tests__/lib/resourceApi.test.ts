import {
  apiCreateComment,
  apiCreateResource,
  apiReplyComment,
  apiSetFavorite,
} from "@/lib/resourceApi";

describe("resourceApi auth flows", () => {
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

  it("creates resource with bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 77 }),
    });

    await apiCreateResource("tok", {
      title: "Titre",
      content: "Contenu valide pour test",
      category_id: 1,
      relation_type_id: 1,
      resource_type_id: 1,
      is_public: false,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/resources",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });

  it("creates comment with bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 101 }),
    });

    await apiCreateComment("tok", 33, "Mon commentaire");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/resources/33/comments",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });

  it("creates reply with bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ id: 202 }),
    });

    await apiReplyComment("tok", 9, "Ma reponse");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/comments/9/reply",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });

  it("adds favorite with POST and bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ message: "ok" }),
    });

    await apiSetFavorite("tok", 44, true);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/resources/44/favorite",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });

  it("removes favorite with DELETE and bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ message: "ok" }),
    });

    await apiSetFavorite("tok", 44, false);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/resources/44/favorite",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });
});
