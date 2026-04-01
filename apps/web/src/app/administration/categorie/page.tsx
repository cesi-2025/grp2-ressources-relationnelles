"use client";

import { useState } from "react";
import { CategorieItems, CATEGORIE } from "@/data/categorie";
import EditModal from "./modification";
import DeleteModal from "./suppresion";
import CreateModal from "./creation";


const COLUMNS = ["Nom", "Description", "Action"];

export default function RessourcesPage() {
  const [items, setItems] = useState<CategorieItems[]>(CATEGORIE);
  const [editTarget, setEditTarget] = useState<CategorieItems | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategorieItems | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    [item.nom].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSave = (updated: CategorieItems) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };
  
  const handleCreate = (newUser: CategorieItems) => {
    setItems((prev) => [...prev, newUser]);
  };

  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  
  return (<div style={{ padding: "40px 24px", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a" }}>Utilisateurs</h1>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
              {filtered.length} Categorie{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Recherche + bouton créer */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 10, padding: "8px 14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                style={{ border: "none", outline: "none", fontSize: 14, color: "#0f172a", width: 200, background: "transparent" }}
              />
            </div>

            <button
              onClick={() => setShowCreate(true)}
              style={{ background: "#10b981", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              ＋ Créer
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #e2e8f0",
          display: "table",
          margin: "0 auto",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <table style={{ width: "", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {COLUMNS.map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
                    letterSpacing: 1, textTransform: "uppercase",
                    borderBottom: "1px solid #e2e8f0",
                    whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", width: 160, alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                        {item.nom}
                      </span>
                    </div>
                  </td>

                  
                  {/* Catégorie (description) */}
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {item.description}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setEditTarget(item)}
                        style={{ background: "#eef2ff", color: "#6366f1", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#6366f1"; }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        style={{ background: "#fef2f2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTarget && (
        <EditModal item={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
      )}
      {deleteTarget && (
        <DeleteModal item={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} nextId={nextId} />
      )}
    </div>
  );
}
