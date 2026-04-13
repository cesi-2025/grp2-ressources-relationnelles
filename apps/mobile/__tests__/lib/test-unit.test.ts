import { apiRegister } from "@/lib/authApi";
import { isPublishedHomeResource } from "@/lib/homeResourceUtils";
import type { ApiResource } from "@/lib/resourceApi";
import { apiListResourcesAllPages } from "@/lib/resourceApi";

function okJson(body: unknown) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify(body),
  };
}

function errJson(status: number, body: unknown) {
  return {
    ok: false,
    status,
    text: async () => JSON.stringify(body),
  };
}

function installApiTestHooks() {
  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://127.0.0.1:8000";
  });
  beforeEach(() => {
    global.fetch = jest.fn();
  });
}

installApiTestHooks();

describe("TU-01 Ressources — liste publique (client)", () => {
  it("filtre défensif : seules les entrées published sont conservées à l’affichage", () => {
    const mixed: ApiResource[] = [
      {
        id: 1,
        title: "Ok",
        content: "c",
        category_id: 1,
        relation_type_id: 1,
        resource_type_id: 1,
        status: "published",
        is_public: true,
        created_at: "2026-01-01",
      },
      {
        id: 2,
        title: "Pending",
        content: "c",
        category_id: 1,
        relation_type_id: 1,
        resource_type_id: 1,
        status: "pending",
        is_public: true,
        created_at: "2026-01-01",
      },
    ];
    expect(mixed.filter(isPublishedHomeResource)).toHaveLength(1);
  });
});

describe("TU-02 Ressources — filtre catégorie (requête)", () => {
  it("ajoute category= à l’URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      okJson({
        data: [],
        last_page: 1,
        current_page: 1,
        per_page: 45,
        total: 0,
      }),
    );
    await apiListResourcesAllPages(
      { categoryId: "12", relationTypeId: "all", sortBy: "date" },
      { maxPages: 1 },
    );
    expect(String((global.fetch as jest.Mock).mock.calls[0][0])).toContain(
      "category=12",
    );
  });
});

describe("TU-04 Comptes — e-mail unique", () => {
  it("message utilisateur si e-mail déjà pris", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      errJson(422, {
        message: "The given data was invalid.",
        errors: { email: ["The email has already been taken."] },
      }),
    );
    await expect(
      apiRegister("Nom", "dup@example.com", "Password1!"),
    ).rejects.toThrow("Cet e-mail est déjà utilisé.");
  });
});
