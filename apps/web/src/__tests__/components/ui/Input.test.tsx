import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "@/components/ui/Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Saisir..." />);
    expect(screen.getByPlaceholderText("Saisir...")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<Input label="Nom" id="name-input" />);
    const label = screen.getByText("Nom");
    expect(label).toHaveAttribute("for", "name-input");
  });

  it("displays error message", () => {
    render(<Input error="Champ requis" />);
    expect(screen.getByText("Champ requis")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-describedby when error exists", () => {
    render(<Input error="Erreur" id="test-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "test-input-error");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
  });

  it("does not render error paragraph when no error", () => {
    render(<Input />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("applies error border style", () => {
    render(<Input error="Bad" />);
    expect(screen.getByRole("textbox").className).toContain("border-red-500");
  });

  it("handles user typing", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
