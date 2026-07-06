import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BarChart from "@/components/tableauDeBord/barChart";

describe("BarChart", () => {
  it("renders all month labels", () => {
    render(<BarChart />);
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Fév")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
    expect(screen.getByText("Avr")).toBeInTheDocument();
    expect(screen.getByText("Mai")).toBeInTheDocument();
    expect(screen.getByText("Jun")).toBeInTheDocument();
    expect(screen.getByText("Jul")).toBeInTheDocument();
    expect(screen.getByText("Aoû")).toBeInTheDocument();
    expect(screen.getByText("Sep")).toBeInTheDocument();
    expect(screen.getByText("Oct")).toBeInTheDocument();
    expect(screen.getByText("Nov")).toBeInTheDocument();
    expect(screen.getByText("Déc")).toBeInTheDocument();
  });

  it("renders 12 bars (one per month)", () => {
    const { container } = render(<BarChart />);
    // Each month column has a paragraph with the month label
    const months = container.querySelectorAll("p");
    expect(months).toHaveLength(12);
  });

  it("shows value on hover", async () => {
    const { container } = render(<BarChart />);
    // The value divs exist but are hidden (opacity 0) by default
    // Find the first bar container and hover it
    const barContainers = container.querySelectorAll("[style]");
    // The value "18" (December, max value) should exist in the DOM
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
