"use client";
 
import ResourceCard from "@/components/resources/ResourceCard";
import { ResourceItem } from "@/data/resources";
 
interface ResourceCardWithActionsProps {
  resource: ResourceItem;
  onEdit: (resource: ResourceItem) => void;
  onDelete: (resource: ResourceItem) => void;
}
 
export default function ResourceCardWithActions({
  resource,
  onEdit,
  onDelete,
}: ResourceCardWithActionsProps) {
  return (
    <div style={{ position: "relative" }}>
      {/* Boutons Éditer / Supprimer en haut à gauche */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, zIndex: 10 }}>
        <button
          onClick={() => onEdit(resource)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            border: "1px solid #e2e8f0",
            borderRadius: 8, padding: "5px 10px",
            fontSize: 12, fontWeight: 600, color: "#6366f1",
            cursor: "pointer", transition: "all 0.15s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#6366f1";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.92)";
            e.currentTarget.style.color = "#6366f1";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          ✏️    
        </button>
 
        <button
          onClick={() => onDelete(resource)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            border: "1px solid #e2e8f0",
            borderRadius: 8, padding: "5px 10px",
            fontSize: 12, fontWeight: 600, color: "#ef4444",
            cursor: "pointer", transition: "all 0.15s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.92)";
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          🗑️
        </button>
      </div>
 
      <ResourceCard resource={resource} />
    </div>
  );
}