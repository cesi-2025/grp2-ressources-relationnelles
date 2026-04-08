"use client";
 
import {  useEffect,useState } from "react";
import { Comment } from "@/data/moderation";


import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface EditCommentModalProps {
  comment: Comment;
  onClose: () => void;
  onSave: (content: string) => void;
}
 
export default function EditCommentModal({ comment, onClose, onSave }: EditCommentModalProps) {
  const [value, setValue] = useState(comment.content);
  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role === "citoyen") router.replace("/dashboard");
  }, [user,loading,router])
 
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 16, padding: 32,
          width: "100%", maxWidth: 520,
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase" }}>
              Modifier le commentaire
            </p>
            <h3 style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
              {comment.author}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, color: "#64748b" }}
          >
            ✕
          </button>
        </div>
 
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 14px", borderRadius: 10,
            border: "2px solid #e2e8f0", fontSize: 14,
            resize: "vertical", minHeight: 120,
            fontFamily: "inherit", color: "#0f172a",
            outline: "none", background: "#f8fafc",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
        />
 
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#f1f5f9", color: "#475569", border: "none", padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(value)}
            style={{ flex: 1, background: "#1e293b", color: "#fff", border: "none", padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
 