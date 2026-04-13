import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DonutChart from "@/components/tableauDeBord/DonutChart";

describe("DonutChart", () => {
  it("renders the total in the center", () => {
    // Total = 18 + 14 + 12 + 10 + 9 + 8 = 71
    render(<DonutChart />);
    expect(screen.getByText("71")).toBeInTheDocument();
  });

  it('renders "RESSOURCES" label', () => {
    render(<DonutChart />);
    expect(screen.getByText("RESSOURCES")).toBeInTheDocument();
  });

  it("renders all category names in the legend", () => {
    render(<DonutChart />);
    expect(screen.getByText("Communication")).toBeInTheDocument();
    expect(screen.getByText("Écoute active")).toBeInTheDocument();
    expect(screen.getByText("Empathie")).toBeInTheDocument();
    expect(screen.getByText("Gestion des conflits")).toBeInTheDocument();
    expect(screen.getByText("Intelligence émotionnelle")).toBeInTheDocument();
    expect(screen.getByText("Collaboration")).toBeInTheDocument();
  });

  it("renders percentage values", () => {
    render(<DonutChart />);
    // Communication: 18/71 ≈ 25%
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("renders SVG paths for each slice", () => {
    const { container } = render(<DonutChart />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(6); // 6 categories
  });

  it("renders an SVG element", () => {
    const { container } = render(<DonutChart />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
