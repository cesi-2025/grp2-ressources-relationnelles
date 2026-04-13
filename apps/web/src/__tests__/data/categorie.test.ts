import { describe, it, expect } from "vitest";
import { CATEGORIE, getUserById } from "@/data/categorie";

describe("CATEGORIE data", () => {
  it("contains 12 categories", () => {
    expect(CATEGORIE).toHaveLength(12);
  });

  it("has unique IDs", () => {
    const ids = CATEGORIE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each category has a non-empty name and description", () => {
    for (const c of CATEGORIE) {
      expect(c.nom.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
    }
  });
});

describe("getUserById (category)", () => {
  it("returns the correct category", () => {
    const cat = getUserById(1);
    expect(cat).toBeDefined();
    expect(cat!.nom).toBe("Respiration");
  });

  it("returns undefined for unknown id", () => {
    expect(getUserById(999)).toBeUndefined();
  });
});
