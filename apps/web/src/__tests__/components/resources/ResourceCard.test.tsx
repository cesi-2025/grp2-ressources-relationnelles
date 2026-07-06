import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResourceCard from "@/components/resources/ResourceCard";
import type { Resource } from "@/lib/api";

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    title: "Test Resource",
    content: "Some content here",
    status: "published",
    is_public: true,
    user_id: 1,
    category_id: 1,
    relation_type_id: 1,
    resource_type_id: 1,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    category: { id: 1, name: "Communication" },
    relation_type: { id: 1, name: "Professionnelle" },
    resource_type: { id: 1, name: "Article" },
    user: { id: 1, name: "Alice" },
    ...overrides,
  };
}

describe("ResourceCard", () => {
  it("renders the title", () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText("Test Resource")).toBeInTheDocument();
  });

  it("renders the content", () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText("Some content here")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText("Communication")).toBeInTheDocument();
  });

  it("renders relation type badge", () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText("Professionnelle")).toBeInTheDocument();
  });

  it("renders resource type badge", () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText("Article")).toBeInTheDocument();
  });

  it("displays formatted date in French", () => {
    render(<ResourceCard resource={makeResource({ created_at: "2026-03-01T00:00:00Z" })} />);
    expect(screen.getByText(/01\/03\/2026/)).toBeInTheDocument();
  });

  it('shows "Sans catégorie" when no category', () => {
    render(<ResourceCard resource={makeResource({ category: undefined })} />);
    expect(screen.getByText("Sans catégorie")).toBeInTheDocument();
  });

  it("renders a link to the detail page", () => {
    render(<ResourceCard resource={makeResource({ id: 42 })} />);
    const link = screen.getByText("Voir le détail →");
    expect(link).toHaveAttribute("href", "/ressources/42");
  });

  it("does not render relation_type badge when absent", () => {
    render(<ResourceCard resource={makeResource({ relation_type: undefined })} />);
    expect(screen.queryByText("Professionnelle")).not.toBeInTheDocument();
  });

  it("does not render resource_type badge when absent", () => {
    render(<ResourceCard resource={makeResource({ resource_type: undefined })} />);
    expect(screen.queryByText("Article")).not.toBeInTheDocument();
  });
});
