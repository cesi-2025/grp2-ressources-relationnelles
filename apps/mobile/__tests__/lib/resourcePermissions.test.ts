import {
  canComment,
  canCreateResource,
  canEditResource,
  canManageFavorites,
} from "@/lib/resourcePermissions";

describe("resourcePermissions", () => {
  describe("canEditResource", () => {
    it("denies visitor", () => {
      expect(
        canEditResource({
          isLoggedIn: false,
          userId: undefined,
          ownerId: 2,
        }),
      ).toBe(false);
    });

    it("allows connected citizen only when owner", () => {
      expect(
        canEditResource({
          isLoggedIn: true,
          userId: 10,
          ownerId: 10,
        }),
      ).toBe(true);
      expect(
        canEditResource({
          isLoggedIn: true,
          userId: 10,
          ownerId: 11,
        }),
      ).toBe(false);
    });

    it("still denies moderator/admin/super_admin when not owner", () => {
      expect(
        canEditResource({
          isLoggedIn: true,
          userId: 3,
          ownerId: 999,
        }),
      ).toBe(false);
      expect(
        canEditResource({
          isLoggedIn: true,
          userId: 4,
          ownerId: 999,
        }),
      ).toBe(false);
      expect(
        canEditResource({
          isLoggedIn: true,
          userId: 5,
          ownerId: 999,
        }),
      ).toBe(false);
    });
  });

  describe("canComment", () => {
    it("allows only connected users with token", () => {
      expect(canComment({ isLoggedIn: true, token: "abc" })).toBe(true);
      expect(canComment({ isLoggedIn: true, token: null })).toBe(false);
      expect(canComment({ isLoggedIn: false, token: "abc" })).toBe(false);
    });
  });

  describe("canCreateResource", () => {
    it("allows only connected users with token", () => {
      expect(canCreateResource({ isLoggedIn: true, token: "abc" })).toBe(true);
      expect(canCreateResource({ isLoggedIn: true, token: null })).toBe(false);
      expect(canCreateResource({ isLoggedIn: false, token: "abc" })).toBe(false);
    });
  });

  describe("canManageFavorites", () => {
    it("allows favorites only when connected", () => {
      expect(canManageFavorites({ isLoggedIn: true, token: "abc" })).toBe(true);
      expect(canManageFavorites({ isLoggedIn: true, token: null })).toBe(false);
      expect(canManageFavorites({ isLoggedIn: false, token: "abc" })).toBe(false);
    });
  });
});
