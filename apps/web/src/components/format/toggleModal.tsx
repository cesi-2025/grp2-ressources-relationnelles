'use client';
 
import { SuperAdmin } from '@/lib/api';
import s from '@/style/userAdminStyle';
 
interface ToggleModalProps {
  user: SuperAdmin;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string;
}
 
export default function ToggleModal({ user, onClose, onConfirm, loading, error }: ToggleModalProps) {
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={s.modalTitle}>
          {user.is_active ? 'Désactiver le compte' : 'Réactiver le compte'}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>
          {user.is_active ? (
            <>Désactiver le compte de <strong style={{ color: '#0f172a' }}>{user.name}</strong> ? L&apos;utilisateur ne pourra plus se connecter.</>
          ) : (
            <>Réactiver le compte de <strong style={{ color: '#0f172a' }}>{user.name}</strong> ? L&apos;utilisateur pourra à nouveau se connecter.</>
          )}
        </p>
        {error && <p style={s.errorText}>{error}</p>}
        <div style={s.actionsRow}>
          <button onClick={onClose} style={s.btnCancel}>Annuler</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={user.is_active ? s.btnDanger : s.btnSave}
          >
            {loading ? 'Mise à jour…' : user.is_active ? 'Désactiver' : 'Réactiver'}
          </button>
        </div>
      </div>
    </div>
  );
}