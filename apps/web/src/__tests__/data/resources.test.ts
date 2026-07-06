import { describe, it, expect } from "vitest";
import {
  RESOURCES,
  RESOURCE_COMMENTS,
  getResourceById,
  getCommentsByResourceId,
  EMPTY_RESOURCE,
} from "@/data/resources";

describe("RESOURCES data", () => {
  it("contains 12 resources", () => {
    expect(RESOURCES).toHaveLength(12);
  });

  it("each resource has all required fields", () => {
    for (const r of RESOURCES) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("title");
      expect(r).toHaveProperty("category");
      expect(r).toHaveProperty("relationType");
      expect(r).toHaveProperty("resourceType");
      expect(r).toHaveProperty("content");
      expect(r).toHaveProperty("author");
      expect(r).toHaveProperty("createdAt");
    }
  });

  it("has unique IDs", () => {
    const ids = RESOURCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("RESOURCE_COMMENTS data", () => {
  it("contains 4 comments", () => {
    expect(RESOURCE_COMMENTS).toHaveLength(4);
  });
});

describe("getResourceById", () => {
  it("returns the correct resource for a valid id", () => {
    const resource = getResourceById(1);
    expect(resource).toBeDefined();
    expect(resource!.title).toBe("Mieux communiquer en équipe au quotidien");
  });

  it("returns undefined for an unknown id", () => {
    expect(getResourceById(999)).toBeUndefined();
  });
});

describe("getCommentsByResourceId", () => {
  it("returns comments for resource 1", () => {
    const comments = getCommentsByResourceId(1);
    expect(comments).toHaveLength(2);
    expect(comments.every((c) => c.resourceId === 1)).toBe(true);
  });

  it("returns empty array for resource with no comments", () => {
    expect(getCommentsByResourceId(999)).toEqual([]);
  });
});

describe("EMPTY_RESOURCE", () => {
  it("has empty string fields", () => {
    expect(EMPTY_RESOURCE.title).toBe("");
    expect(EMPTY_RESOURCE.category).toBe("");
    expect(EMPTY_RESOURCE.content).toBe("");
  });

  it("has date fields set to today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(EMPTY_RESOURCE.createdAt).toBe(today);
  });
});
