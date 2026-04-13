import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies medium padding by default", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass("p-6");
  });

  it("applies small padding", () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    expect(container.firstChild).toHaveClass("p-4");
  });

  it("applies large padding", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass("p-8");
  });

  it("applies no padding", () => {
    const { container } = render(<Card padding="none">Content</Card>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).not.toContain("p-4");
    expect(div.className).not.toContain("p-6");
    expect(div.className).not.toContain("p-8");
  });

  it("applies hover styles when hover is true", () => {
    const { container } = render(<Card hover>Content</Card>);
    expect(container.firstChild).toHaveClass("hover:shadow-lg");
  });

  it("does not apply hover styles by default", () => {
    const { container } = render(<Card>Content</Card>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).not.toContain("hover:shadow-lg");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="extra">Content</Card>);
    expect(container.firstChild).toHaveClass("extra");
  });
});
