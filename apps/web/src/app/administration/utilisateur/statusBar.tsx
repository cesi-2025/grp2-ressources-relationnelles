interface StatusBadgeProps {
  status: string;
}

const colorMap: Record<string, { bg: string; color: string }> = {
  "Actif":    { bg: "#dcfce7", color: "#166534" },
  "Désactivé": { bg: "#fec3c3", color: "#854d0e" },
  "Archivé":   { bg: "#f1f5f9", color: "#475569" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = colorMap[status] ?? { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}