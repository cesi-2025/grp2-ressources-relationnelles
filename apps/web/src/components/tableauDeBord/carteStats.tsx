interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: string;
}

export default function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 24px",
      border: "1px solid #e2e8f0", flex: 1,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      display: "flex", alignItems: "flex-start", gap: 16,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: color + "22",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
          {label}
        </p>
        <p style={{ margin: "6px 0 4px", fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>
          {value}
        </p>
        {sub && <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{sub}</p>}
      </div>
    </div>
  );
}