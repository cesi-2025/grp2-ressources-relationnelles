"use client";
 
// ─── Badge ────────────────────────────────────────────────────────────────────
 
type BadgeColor = "indigo" | "amber" | "red" | "green" | "slate";
 
const BADGE_COLORS: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  indigo: { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe" },
  amber:  { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
  red:    { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  green:  { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  slate:  { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};
 
export function Badge({ label, color }: { label: string; color: BadgeColor }) {
  const c = BADGE_COLORS[color];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {label}
    </span>
  );
}
 
// ─── IconBtn ──────────────────────────────────────────────────────────────────
 
type IconBtnVariant = "primary" | "danger" | "ghost";
 
const ICON_BTN_STYLES: Record<IconBtnVariant, React.CSSProperties> = {
  primary: { background: "#1e293b", color: "#fff",    border: "none" },
  danger:  { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
  ghost:   { background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" },
};
 
export function IconBtn({ icon, label, variant, onClick }: {
  icon: string; label: string; variant: IconBtnVariant; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        ...ICON_BTN_STYLES[variant],
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 8,
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        transition: "all 0.15s", whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}
 