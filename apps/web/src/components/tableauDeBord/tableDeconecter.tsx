"use client";

import { UserItem } from "@/data/user";

const AVATAR_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function Avatar({ name, id }: { name: string; id: number }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: AVATAR_COLORS[id % AVATAR_COLORS.length],
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

interface DisconnectedTableProps {
  users: UserItem[];
}

export default function DisconnectedTable({ users }: DisconnectedTableProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
          Surveillance
        </p>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
          Utilisateurs déconnectés
          <span style={{ background: "#fee2e2", color: "#ef4444", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            {users.length}
          </span>
        </h2>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["Nom", "Catégorie", "Email", "Statut", "Date"].map((h) => (
              <th key={h} style={{
                padding: "10px 16px", textAlign: "left",
                fontSize: 10, fontWeight: 700, color: "#94a3b8",
                letterSpacing: 1, textTransform: "uppercase",
                borderBottom: "1px solid #f1f5f9",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={user.id}
              style={{ borderBottom: i < users.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={user.nom} id={user.id} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{user.nom}</span>
                </div>
              </td>
              <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>{user.role}</td>
              <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{user.email}</td>
              <td style={{ padding: "12px 16px" }}>
                <span style={{
                  background: user.status === "Désactivé" ? "#fee2e2" : "#f1f5f9",
                  color: user.status === "Désactivé" ? "#ef4444" : "#64748b",
                  padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                {new Date(user.joined).toLocaleDateString("fr-FR")}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                Aucun utilisateur déconnecté.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}