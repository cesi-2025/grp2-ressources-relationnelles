const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

interface AvatarProps {
  name: string;
  id: number;
}

export default function Avatar({ name, id }: AvatarProps) {
  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: COLORS[id % COLORS.length],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}