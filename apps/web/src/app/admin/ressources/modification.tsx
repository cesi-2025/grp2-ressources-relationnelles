"use client";

import { useState } from "react";
import {
  overlayStyle, modalStyle, inputStyle,
  labelStyle, primaryBtn, secondaryBtn,
} from "@/style/ressourceStyle";

interface ResourceFormData {
  id?: number;
  title: string;
  description: string;
}

interface ResourceFormModalProps {
  initial: ResourceFormData;
  categories: string[];
  relationTypes: string[];
  resourceTypes: string[];
  onClose: () => void;
  onSave: (data: ResourceFormData) => void;
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
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
              value={form.description} placeholder="Description de la ressource..."
              onChange={(e) => set("description", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select style={{ ...inputStyle, appearance: "none" }}>
                <option value="">— Choisir —</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type de relation</label>
              <select style={{ ...inputStyle, appearance: "none" }}>
                <option value="">— Choisir —</option>
                {relationTypes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Type de ressource</label>
            <select style={{ ...inputStyle, appearance: "none" }}>
              <option value="">— Choisir —</option>
              {resourceTypes.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
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
