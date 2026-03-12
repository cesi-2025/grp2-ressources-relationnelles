"use client";

import { adminServices } from "@/data/tableauBord";

export default function AdminPanel() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        Accès rapide
      </p>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
        Administration
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {adminServices.map((service) => (
          <button
            key={service.label}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: service.bg, border: "none",
              borderRadius: 12, padding: "12px 16px",
              cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
              textAlign: "left", width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(4px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: 18 }}>{service.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: service.color }}>{service.label}</span>
            <span style={{ marginLeft: "auto", color: service.color, fontSize: 14, opacity: 0.5 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}