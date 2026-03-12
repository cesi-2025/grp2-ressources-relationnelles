import { UserItem } from "@/data/user";
import { overlayStyle, modalStyle, primaryBtnStyle, secondaryBtnStyle } from "@/style/userStyle";

interface DeleteModalProps {
  item: UserItem;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ item, onClose, onConfirm }: DeleteModalProps) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{ ...modalStyle, maxWidth: 380, textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            margin: "0 auto 16px",
          }}
        >
          🗑️
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          Supprimer l&apos;élément
        </h2>

        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
          Voulez-vous vraiment supprimer{" "}
          <strong style={{ color: "#ef4444" }}>{item.nom}</strong> ?
          Cette action est irréversible.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={secondaryBtnStyle}>Annuler</button>
          <button onClick={onConfirm} style={{ ...primaryBtnStyle, background: "#ef4444" }}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}