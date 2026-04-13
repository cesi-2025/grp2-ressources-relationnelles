import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Communication</Badge>);
    expect(screen.getByText("Communication")).toBeInTheDocument();
  });

  it("renders as a span", () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag").tagName).toBe("SPAN");
  });

  it("applies primary variant by default", () => {
    render(<Badge>Primary</Badge>);
    expect(screen.getByText("Primary").className).toContain("bg-primary-light");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active").className).toContain("bg-green-100");
  });

  it("applies error variant", () => {
    render(<Badge variant="error">Erreur</Badge>);
    expect(screen.getByText("Erreur").className).toContain("bg-red-100");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Attention</Badge>);
    expect(screen.getByText("Attention").className).toContain("bg-yellow-100");
  });

  it("applies small size", () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small").className).toContain("text-xs");
  });

  it("applies medium size by default", () => {
    render(<Badge>Medium</Badge>);
    expect(screen.getByText("Medium").className).toContain("text-sm");
  });

  it("merges custom className", () => {
    render(<Badge className="my-class">Custom</Badge>);
    expect(screen.getByText("Custom").className).toContain("my-class");
  });
});
