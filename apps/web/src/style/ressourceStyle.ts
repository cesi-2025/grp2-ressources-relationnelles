import React from "react";
 
export const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};
 
export const modalStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 20, padding: 32,
  width: "100%", maxWidth: 520,
  boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
};
 
export const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 8,
  border: "1px solid #e2e8f0", fontSize: 14,
  outline: "none", background: "#f8fafc", color: "#0f172a",
};
 
export const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#64748b", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: 0.5,
};
 
export const primaryBtn: React.CSSProperties = {
  flex: 1, background: "#6366f1", color: "#fff",
  border: "none", padding: "11px 0", borderRadius: 10,
  fontSize: 14, fontWeight: 600, cursor: "pointer",
};
 
export const secondaryBtn: React.CSSProperties = {
  flex: 1, background: "#f1f5f9", color: "#475569",
  border: "none", padding: "11px 0", borderRadius: 10,
  fontSize: 14, fontWeight: 600, cursor: "pointer",
};