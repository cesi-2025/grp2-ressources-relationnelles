"use client";
 
import { Comment } from "@/data/moderation";
import { Badge, IconBtn } from "@/components/ui/moderation/uiModeration";
 
interface CommentRowProps {
  comment: Comment;
  onEdit: () => void;
  onDelete: () => void;
}
 
export default function CommentRow({ comment, onEdit, onDelete }: CommentRowProps) {
  return (
    <div
      style={{
        display: "grid", gridTemplateColumns: "1fr auto",
        gap: 16, alignItems: "start",
        padding: "16px 20px",
        borderBottom: "1px solid #f1f5f9",
        background: comment.flagged ? "#fffbeb" : "#fff",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = comment.flagged ? "#fef9ec" : "#f8fafc"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = comment.flagged ? "#fffbeb" : "#fff"; }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          {/* Avatar initiales */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#1e293b", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, flexShrink: 0,
          }}>
            {comment.author.charAt(0)}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{comment.author}</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>sur</span>
          <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{comment.resourceTitle}</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            · {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </span>
          {comment.flagged && <Badge label="⚑ Signalé" color="red" />}
        </div>
 
        <p style={{
          margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.6,
          padding: "8px 12px", background: "#f8fafc", borderRadius: 8,
          borderLeft: comment.flagged ? "3px solid #fca5a5" : "3px solid #e2e8f0",
        }}>
          {comment.content}
        </p>
      </div>
 
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <IconBtn icon="✏" label="Modifier"  variant="ghost"  onClick={onEdit}   />
        <IconBtn icon="🗑" label="Supprimer" variant="danger" onClick={onDelete} />
      </div>
    </div>
  );
}