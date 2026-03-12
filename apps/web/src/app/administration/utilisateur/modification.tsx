
import { useState } from "react";
import { UserItem, ROLES, STATUSES } from "@/data/user";
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
  item: UserItem;
  onClose: () => void;
  onSave: (updated: UserItem) => void;
}

export default function EditModal({ item, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<UserItem>({ ...item });

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
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>Rôle</label>
            <select
              style={{ ...inputStyle, appearance: "none" }}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Statut</label>
            <select
              style={{ ...inputStyle, appearance: "none" }}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Date d&apos;arrivée</label>
            <input
              style={inputStyle}
              type="date"
              value={form.joined}
              onChange={(e) => setForm({ ...form, joined: e.target.value })}
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