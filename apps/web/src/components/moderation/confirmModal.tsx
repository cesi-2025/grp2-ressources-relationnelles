'use client';
 
import s from '@/style/admin/dashboardAdminStyle';
 
interface ConfirmModalProps {
  label: string;
  type: 'validate' | 'refuse' | 'approve-comment' | 'delete-comment';
  acting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
 
export default function ConfirmModal({ label, type, acting, onConfirm, onClose }: ConfirmModalProps) {
  const isPositive = type === 'validate' || type === 'approve-comment';
 
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={s.modalTitle}>Confirmer l&apos;action</h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>{label}</p>
        <div style={s.actionsRow}>
          <button onClick={onClose} style={s.btnCancel}>Annuler</button>
          <button
            onClick={onConfirm}
            disabled={acting}
            style={isPositive ? s.btnSave : s.btnDanger}
          >
            {acting ? 'En cours…' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}