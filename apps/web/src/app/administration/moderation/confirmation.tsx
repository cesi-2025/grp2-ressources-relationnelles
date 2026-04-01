"use client";
 
interface ConfirmModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}
 
export default function ConfirmModal({ title, message, onClose, onConfirm }: ConfirmModalProps) {
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
          width: "100%", maxWidth: 400, textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#fef2f2",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, margin: "0 auto 16px",
        }}>
          🗑️
        </div>
        <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#f1f5f9", color: "#475569", border: "none", padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, background: "#a8dda4", color: "#000000", border: "none", padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Approuver
          </button>
        </div>
      </div>
    </div>
  );
}