"use client";

import { useState } from "react";
import { monthlyData } from "@/data/tableauBord";

export default function BarChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...monthlyData.map((d) => d.inscrits));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
      {monthlyData.map((d, i) => {
        const pct = (d.inscrits / max) * 100;
        const isHov = hovered === i;
        return (
          <div
            key={d.mois}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, height: "100%", justifyContent: "flex-end" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{
              fontSize: 11, fontWeight: 700, color: "#6366f1",
              marginBottom: 4,
              opacity: isHov ? 1 : 0,
              transition: "opacity 0.15s",
            }}>
              {d.inscrits}
            </div>
            <div style={{
              width: "100%",
              borderRadius: "6px 6px 0 0",
              height: `${pct}%`,
              background: isHov
                ? "linear-gradient(180deg, #818cf8, #6366f1)"
                : "linear-gradient(180deg, #a5b4fc, #818cf8)",
              transition: "all 0.2s ease",
              minHeight: 4,
              cursor: "pointer",
            }} />
            <p style={{ margin: "6px 0 0", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
              {d.mois}
            </p>
          </div>
        );
      })}
    </div>
  );
}