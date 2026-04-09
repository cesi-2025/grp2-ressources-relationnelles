'use client';
 
import { useEffect } from 'react';
import s from '@/style/ressourceAdminStyle';
 
export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}
 
interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}
 
export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
      <div style={s.toastContainer}>
        {toasts.map((t) => (
          <ToastMessage key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}
 
function ToastMessage({ toast, onRemove }: { toast: ToastItem; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);
 
  return (
    <div style={{ ...s.toast, ...(toast.type === 'success' ? s.toastSuccess : s.toastError) }}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
      >
        ×
      </button>
    </div>
  );
}
 