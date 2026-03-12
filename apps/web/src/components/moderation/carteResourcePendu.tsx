"use client";
 
import { useState } from "react";
import { ResourceItem } from "@/data/resources";
import { Badge, IconBtn } from "@/components/ui/moderation/uiModeration";
 
interface PendingResourceCardProps {
  resource: ResourceItem;
  onApprove: () => void;
  onReject: () => void;
}
 
export default function PendingResourceCard({ resource, onApprove, onReject }: PendingResourceCardProps) {
  const [expanded, setExpanded] = useState(false);
 
  return (
    <div
      style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "hidden", transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
    >
      {/* Bandeau coloré */}
      <div style={{ height: 4, background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
 
      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            <Badge label={resource.category}     color="indigo" />
            <Badge label={resource.resourceType} color="slate"  />
            <Badge label={resource.relationType} color="amber"  />
          </div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
            {resource.title}
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
            par <strong style={{ color: "#475569" }}>{resource.author}</strong>
            {" · "}
            {new Date(resource.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
 
        {/* Extrait */}
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          {resource.excerpt}
        </p>
 
        {/* Contenu expandable */}
        {expanded && (
          <div style={{
            margin: "0 0 12px", padding: "12px 14px",
            background: "#f8fafc", borderRadius: 8,
            borderLeft: "3px solid #6366f1",
            fontSize: 13, color: "#334155", lineHeight: 1.7,
          }}>
            {resource.content}
          </div>
        )}
 
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: "#6366f1", fontWeight: 600,
            padding: 0, marginBottom: 14,
          }}
        >
          {expanded ? "▲ Réduire" : "▼ Lire le contenu complet"}
        </button>
 
        {/* Actions */}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
          <IconBtn icon="✓" label="Approuver" variant="primary" onClick={onApprove} />
          <IconBtn icon="✕" label="Refuser"   variant="danger"  onClick={onReject}  />
        </div>
      </div>
    </div>
  );
}
 