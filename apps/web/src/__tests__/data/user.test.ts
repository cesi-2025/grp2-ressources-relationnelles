import { describe, it, expect } from "vitest";
import { USERS, ROLES, STATUSES, getUserById } from "@/data/user";

describe("USERS data", () => {
  it("contains 12 users", () => {
    expect(USERS).toHaveLength(12);
  });

  it("has unique IDs", () => {
    const ids = USERS.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each user has required fields", () => {
    for (const u of USERS) {
      expect(u.nom).toBeTruthy();
      expect(u.email).toContain("@");
      expect(u.role).toBeTruthy();
      expect(u.status).toBeTruthy();
    }
  });
});

describe("getUserById", () => {
  it("returns the correct user", () => {
    const user = getUserById(2);
    expect(user).toBeDefined();
    expect(user!.nom).toBe("Julie Renard");
    expect(user!.role).toBe("super-admin");
  });

  it("returns undefined for unknown id", () => {
    expect(getUserById(999)).toBeUndefined();
  });
});

describe("ROLES", () => {
  it("contains expected roles", () => {
    expect(ROLES).toContain("admin");
    expect(ROLES).toContain("citoyen");
  });
});

describe("STATUSES", () => {
  it("contains Actif and Désactivé", () => {
    expect(STATUSES).toContain("Actif");
    expect(STATUSES).toContain("Désactivé");
  });
});
