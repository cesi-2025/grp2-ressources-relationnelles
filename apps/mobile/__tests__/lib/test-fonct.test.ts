import { apiLogin, apiLogout, apiRegister } from "@/lib/authApi";
import { buildSections } from "@/lib/homeResourceUtils";
import { setPlatformOverrideForTests } from "@/lib/platformRuntime";
import {
  apiGetProgression,
  apiGetResource,
  apiListResourcesAllPages,
  apiSetFavorite,
  apiSetProgression,
} from "@/lib/resourceApi";

function okJson(body: unknown) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify(body),
  };
}

function installApiTestHooks() {
  beforeAll(() => {
    setPlatformOverrideForTests("ios");
    process.env.EXPO_PUBLIC_API_URL = "http://127.0.0.1:8000";
  });
  beforeEach(() => {
    global.fetch = jest.fn();
  });
}

installApiTestHooks();

describe("TF-01 Liste ressources (invité) — chargement", () => {
  it("GET /api/resources sans en-tête Authorization", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        data: [
          {
            id: 1,
            title: "Publique",
            content: "x",
            category_id: 1,
            relation_type_id: 1,
            resource_type_id: 1,
            status: "published",
            is_public: true,
            created_at: "2026-01-01",
          },
        ],
        last_page: 1,
      }),
    );
    await apiListResourcesAllPages(
      { categoryId: "all", relationTypeId: "all", sortBy: "date" },
      { maxPages: 1 },
    );
    const init = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    if (init.headers) {
      const h = new Headers(init.headers);
      expect(h.get("Authorization")).toBeNull();
    }
  });
});

describe("TF-02 Détail ressource", () => {
  it("GET /api/resources/:id", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        id: 9,
        title: "Détail",
        content: "Corps",
        category_id: 1,
        relation_type_id: 1,
        resource_type_id: 1,
        status: "published",
        is_public: true,
        created_at: "2026-01-01",
        category: { id: 1, name: "Cat" },
      }),
    );
    const r = await apiGetResource(9);
    expect(r.title).toBe("Détail");
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "/api/resources/9",
    );
  });
});

describe("TF-03 Filtrage catégorie", () => {
  it("passe category= dans l’URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({ data: [], last_page: 1 }),
    );
    await apiListResourcesAllPages(
      { categoryId: "3", relationTypeId: "all", sortBy: "date" },
      { maxPages: 1 },
    );
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "category=3",
    );
  });
});

describe("TF-04 Tri ressources", () => {
  it("passe sort=title dans l’URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({ data: [], last_page: 1 }),
    );
    await apiListResourcesAllPages(
      { categoryId: "all", relationTypeId: "all", sortBy: "title" },
      { maxPages: 1 },
    );
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "sort=title",
    );
  });

  it("regroupe l’affichage par catégorie (sections triées FR)", () => {
    const sections = buildSections([
      {
        id: 1,
        title: "A",
        content: "x",
        category_id: 1,
        relation_type_id: 1,
        resource_type_id: 1,
        status: "published",
        is_public: true,
        created_at: "",
        category: { id: 1, name: "Zoo" },
      },
      {
        id: 2,
        title: "B",
        content: "x",
        category_id: 2,
        relation_type_id: 1,
        resource_type_id: 1,
        status: "published",
        is_public: true,
        created_at: "",
        category: { id: 2, name: "Alpha" },
      },
    ]);
    expect(sections.map((s) => s.title)).toEqual(["Alpha", "Zoo"]);
  });
});

describe("TF-05 Inscription", () => {
  it("POST /api/register avec confirmation mot de passe", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        token: "t-register",
        token_type: "Bearer",
        user: {
          id: 1,
          name: "N",
          email: "n@test.fr",
          role: "citizen",
        },
      }),
    );
    const res = await apiRegister("N", "n@test.fr", "Password1!");
    expect(res.token).toBe("t-register");
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect((init as RequestInit).method).toBe("POST");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.password_confirmation).toBe("Password1!");
  });
});

describe("TF-06 Connexion / déconnexion", () => {
  it("POST /api/login", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        token: "t-login",
        token_type: "Bearer",
        user: { id: 1, email: "a@b.fr", name: "A", role: "citizen" },
      }),
    );
    const res = await apiLogin("a@b.fr", "Password1!");
    expect(res.token).toBe("t-login");
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.email).toBe("a@b.fr");
  });

  it("POST /api/logout avec Bearer", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(okJson({ message: "ok" }));
    await apiLogout("tok");
    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    const h = new Headers((init as RequestInit).headers);
    expect(h.get("Authorization")).toBe("Bearer tok");
    expect((init as RequestInit).method).toBe("POST");
  });
});

describe("TF-07 Favoris", () => {
  it("POST favori puis DELETE", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(okJson({ message: "ok" }));

    await apiSetFavorite("tok", 5, true);
    let url = String((global.fetch as jest.Mock).mock.calls[0][0]);
    let init = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    expect(url).toContain("/api/resources/5/favorite");
    expect(init.method).toBe("POST");

    await apiSetFavorite("tok", 5, false);
    url = String((global.fetch as jest.Mock).mock.calls[1][0]);
    init = (global.fetch as jest.Mock).mock.calls[1][1] as RequestInit;
    expect(init.method).toBe("DELETE");
  });
});

describe("TF-08 Progression", () => {
  it("POST exploit puis set-aside", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(okJson({ message: "ok" }));

    await apiSetProgression("tok", 7, "exploited");
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "/api/resources/7/exploit",
    );

    await apiSetProgression("tok", 7, "set_aside");
    expect(String((global.fetch as jest.Mock).mock.calls[1][0])).toContain(
      "/api/resources/7/set-aside",
    );
  });
});

describe("TF-09 Tableau de bord — données progression", () => {
  it("normalise favorites / exploited / set_aside (objet ou tableau)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        favorites: { 0: { resource_id: 1, resource: { id: 1, title: "F" } } },
        exploited: [{ resource_id: 2 }],
        set_aside: [],
      }),
    );
    const p = await apiGetProgression("tok");
    expect(p.favorites).toHaveLength(1);
    expect(p.favorites[0].resource?.title).toBe("F");
    expect(p.exploited).toHaveLength(1);
    expect(p.set_aside).toHaveLength(0);
  });
});
