"use client";

import { useMemo, useState } from "react";
import { categoryData } from "@/data/tableauBord";

const SIZE = 170;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 65;
const INNER = 38;

function buildSlices() {
  const total = categoryData.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;

  return categoryData.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    const end = cumAngle;
    const mid = start + angle / 2;

    const path = [
      `M ${CX + INNER * Math.cos(start)} ${CY + INNER * Math.sin(start)}`,
      `L ${CX + R * Math.cos(start)} ${CY + R * Math.sin(start)}`,
      `A ${R} ${R} 0 ${angle > Math.PI ? 1 : 0} 1 ${CX + R * Math.cos(end)} ${CY + R * Math.sin(end)}`,
      `L ${CX + INNER * Math.cos(end)} ${CY + INNER * Math.sin(end)}`,
      `A ${INNER} ${INNER} 0 ${angle > Math.PI ? 1 : 0} 0 ${CX + INNER * Math.cos(start)} ${CY + INNER * Math.sin(start)}`,
      "Z",
    ].join(" ");

    return { ...d, path, mid, index: i, total };
  });
}

export default function DonutChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const slices = useMemo(() => buildSlices(), []);
  const total = slices[0]?.total ?? 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={SIZE} height={SIZE} style={{ flexShrink: 0, overflow: "visible" }}>
        {slices.map((s) => {
          const isHov = hovered === s.index;
          const offsetX = isHov ? Math.cos(s.mid) * 6 : 0;
          const offsetY = isHov ? Math.sin(s.mid) * 6 : 0;
          return (
            <path
              key={s.index}
              d={s.path}
              fill={s.color}
              opacity={hovered === null || isHov ? 1 : 0.35}
              transform={`translate(${offsetX}, ${offsetY})`}
              style={{ transition: "all 0.2s ease", cursor: "pointer" }}
              onMouseEnter={() => setHovered(s.index)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        <text x={CX} y={CY - 7} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">
          {total}
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
          RESSOURCES
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {slices.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer",
              opacity: hovered === null || hovered === i ? 1 : 0.4,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#475569", flex: 1, lineHeight: 1.3 }}>{s.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}