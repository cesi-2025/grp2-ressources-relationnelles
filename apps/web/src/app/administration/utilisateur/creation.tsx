
import { useState } from "react";
import { UserItem, ROLES, STATUSES } from "@/data/user";
import {
  overlayStyle, modalStyle, closeBtnStyle,
  primaryBtnStyle, secondaryBtnStyle, inputStyle, labelStyle,
} from "@/style/userStyle";

interface CreateModalProps {
  onClose: () => void;
  onCreate: (newUser: UserItem) => void;
  nextId: number;
}

const emptyForm = {
  nom: "",
  email: "",
  role: ROLES[0],
  status: STATUSES[0],
  joined: new Date().toISOString().split("T")[0],
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
    if (!form.email.trim()) newErrors.email = "L'email est requis";
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
              placeholder="Ex : Jean Dupont"
              value={form.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
            {errors.nom && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.nom}</p>}
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "#e2e8f0" }}
              type="email"
              placeholder="Ex : jean.dupont@corp.io"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.email}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select
                style={{ ...inputStyle, appearance: "none" }}
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Statut</label>
              <select
                style={{ ...inputStyle, appearance: "none" }}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Date de création</label>
            <input
              style={inputStyle}
              type="date"
              value={form.joined}
              onChange={(e) => set("joined", e.target.value)}
            />
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