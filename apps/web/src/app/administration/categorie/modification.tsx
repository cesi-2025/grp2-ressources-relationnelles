
import { useState } from "react";
import { CategorieItems } from "@/data/categorie";
import {
  overlayStyle,
  modalStyle,
  closeBtnStyle,
  primaryBtnStyle,
  secondaryBtnStyle,
  inputStyle,
  labelStyle,
} from "@/style/userStyle";

interface EditModalProps {
  item: CategorieItems;
  onClose: () => void;
  onSave: (updated: CategorieItems) => void;
}

export default function EditModal({ item, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<CategorieItems>({ ...item });

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Modification
            </p>
            <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              {item.nom}
            </h2>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* Champs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Nom complet</label>
            <input
              style={inputStyle}
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Nom complet</label>
            <input
              style={inputStyle}
              value={form.description}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={secondaryBtnStyle}>Annuler</button>
          <button onClick={() => onSave(form)} style={primaryBtnStyle}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}