"use client";
 
import { useRequireAdmin } from "@/context/AuthContext";
import { overlayStyle, modalStyle, primaryBtn, secondaryBtn } from "@/style/ressourceStyle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 
interface ResourceDeleteModalProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}
 
export default function ResourceDeleteModal({ title, onClose, onConfirm }: ResourceDeleteModalProps) {
  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role === "citoyen") router.replace("/dashboard");
  }, [user,loading,router])
  
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{ ...modalStyle, maxWidth: 400, textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "#fee2e2",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, margin: "0 auto 16px",
        }}>
          🗑️
        </div>
 
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          Supprimer la ressource
        </h2>
        <p style={{ margin: "0 0 6px", color: "#64748b", fontSize: 14 }}>
          Voulez-vous vraiment supprimer :
        </p>
        <p style={{ margin: "0 0 24px", color: "#ef4444", fontWeight: 600, fontSize: 14 }}>
          «&nbsp;{title}&nbsp;»
        </p>
        <p style={{ margin: "0 0 24px", color: "#94a3b8", fontSize: 12 }}>
          Cette action est irréversible.
        </p>
 
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={secondaryBtn}>Annuler</button>
          <button onClick={onConfirm} style={{ ...primaryBtn, background: "#ef4444" }}>
          </button>
        </div>
      </div>
    </div>
  );
}