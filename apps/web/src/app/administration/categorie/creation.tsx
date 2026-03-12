
import { useState } from "react";
import { CategorieItems } from "@/data/categorie";
import {
  overlayStyle, modalStyle, closeBtnStyle,
  primaryBtnStyle, secondaryBtnStyle, inputStyle, labelStyle,
} from "@/style/userStyle";

interface CreateModalProps {
  onClose: () => void;
  onCreate: (newUser: CategorieItems) => void;
  nextId: number;
}

const emptyForm = {
  nom: "",
  description: "",
};

export default function CreateModal({ onClose, onCreate, nextId }: CreateModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  const set = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<typeof emptyForm> = {};
    if (!form.nom.trim())  newErrors.nom  = "Le nom est requis";
    return newErrors;
  };

  const handleCreate = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onCreate({ id: nextId, ...form });
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#10b981", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Nouvel utilisateur
            </p>
            <h2 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              Créer un utilisateur
            </h2>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* Champs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nom</label>
            <input
              style={{ ...inputStyle, borderColor: errors.nom ? "#ef4444" : "#e2e8f0" }}
              placeholder="Ex : Relaxation"
              value={form.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
            <label style={labelStyle}>Nom</label>
            <input
              style={{ ...inputStyle, borderColor: errors.nom ? "#ef4444" : "#e2e8f0" }}
              placeholder="Ex : Contenut ayant pour but de calmer les émotions des citoyen"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
            {errors.nom && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.nom}</p>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={secondaryBtnStyle}>Annuler</button>
          <button onClick={handleCreate} style={{ ...primaryBtnStyle, background: "#10b981" }}>
            ＋ Créer
          </button>
        </div>
      </div>
    </div>
  );
}