import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourcePagination from "@/components/resources/pagination";

describe("ResourcePagination", () => {
  it("displays current page and total", () => {
    render(<ResourcePagination page={2} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByText("Page 2 sur 5")).toBeInTheDocument();
  });

  it("renders all page number buttons", () => {
    render(<ResourcePagination page={1} pageCount={3} onPageChange={vi.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("disables Précédent on first page", () => {
    render(<ResourcePagination page={1} pageCount={3} onPageChange={vi.fn()} />);
    expect(screen.getByText("Précédent")).toBeDisabled();
  });

  it("disables Suivant on last page", () => {
    render(<ResourcePagination page={3} pageCount={3} onPageChange={vi.fn()} />);
    expect(screen.getByText("Suivant")).toBeDisabled();
  });

  it("calls onPageChange with next page", async () => {
    const onPageChange = vi.fn();
    render(<ResourcePagination page={1} pageCount={3} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByText("Suivant"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with previous page", async () => {
    const onPageChange = vi.fn();
    render(<ResourcePagination page={2} pageCount={3} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByText("Précédent"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange when clicking a page number", async () => {
    const onPageChange = vi.fn();
    render(<ResourcePagination page={1} pageCount={3} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not go below page 1", async () => {
    const onPageChange = vi.fn();
    render(<ResourcePagination page={1} pageCount={3} onPageChange={onPageChange} />);

    // Précédent is disabled so no call expected
    expect(screen.getByText("Précédent")).toBeDisabled();
  });

  it("does not go above pageCount", async () => {
    const onPageChange = vi.fn();
    render(<ResourcePagination page={3} pageCount={3} onPageChange={onPageChange} />);

    expect(screen.getByText("Suivant")).toBeDisabled();
  });
});
