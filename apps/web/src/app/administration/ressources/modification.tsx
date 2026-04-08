"use client";
 
import { useEffect, useState } from "react";
import { ResourceItem } from "@/data/resources";
import {
  overlayStyle, modalStyle, inputStyle,
  labelStyle, primaryBtn, secondaryBtn,
} from "@/style/ressourceStyle";
 
import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ResourceFormModalProps {
  initial: Omit<ResourceItem, "id"> & { id?: number };
  categories: string[];
  relationTypes: string[];
  resourceTypes: string[];
  onClose: () => void;
  onSave: (data: Omit<ResourceItem, "id"> & { id?: number }) => void;
}
 
export default function ResourceFormModal({
  initial,
  categories,
  relationTypes,
  resourceTypes,
  onClose,
  onSave,
}: ResourceFormModalProps) {
  const isEdit = initial.id !== undefined;
  const [form, setForm] = useState({ ...initial });
  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role === "citoyen") router.replace("/dashboard");
  }, [user,loading,router])
 
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...modalStyle, maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
 
        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              {isEdit ? "Modification" : "Nouvelle ressource"}
            </p>
            <h2 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              {isEdit ? form.title || "Sans titre" : "Créer une ressource"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}
          >
            ✕
          </button>
        </div>
 
        {/* Champs — scrollable */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "65vh", overflowY: "auto", paddingRight: 4 }}>
 
          <div>
            <label style={labelStyle}>Titre</label>
            <input style={inputStyle} value={form.title} placeholder="Titre de la ressource"
              onChange={(e) => set("title", e.target.value)} />
          </div>
 
          <div>
            <label style={labelStyle}>Auteur</label>
            <input style={inputStyle} value={form.author} placeholder="Nom de l'auteur"
              onChange={(e) => set("author", e.target.value)} />
          </div>
 
          <div>
            <label style={labelStyle}>Extrait</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
              value={form.excerpt} placeholder="Courte description..."
              onChange={(e) => set("excerpt", e.target.value)} />
          </div>
 
          <div>
            <label style={labelStyle}>Contenu</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
              value={form.content} placeholder="Contenu complet de la ressource..."
              onChange={(e) => set("content", e.target.value)} />
          </div>
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select style={{ ...inputStyle, appearance: "none" }} value={form.category}
                onChange={(e) => set("category", e.target.value)}>
                <option value="">— Choisir —</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type de relation</label>
              <select style={{ ...inputStyle, appearance: "none" }} value={form.relationType}
                onChange={(e) => set("relationType", e.target.value)}>
                <option value="">— Choisir —</option>
                {relationTypes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Type de ressource</label>
              <select style={{ ...inputStyle, appearance: "none" }} value={form.resourceType}
                onChange={(e) => set("resourceType", e.target.value)}>
                <option value="">— Choisir —</option>
                {resourceTypes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date création</label>
              <input style={inputStyle} type="date" value={form.createdAt}
                onChange={(e) => set("createdAt", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Date màj</label>
              <input style={inputStyle} type="date" value={form.updatedAt}
                onChange={(e) => set("updatedAt", e.target.value)} />
            </div>
          </div>
        </div>
 
        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={secondaryBtn}>Annuler</button>
          <button
            onClick={() => onSave(form)}
            style={{ ...primaryBtn, opacity: !form.title.trim() ? 0.5 : 1 }}
            disabled={!form.title.trim()}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}