import React from 'react';
 
const s: Record<string, React.CSSProperties> = {
  page: { padding: '40px 24px', minHeight: '100vh', background: '#F6F7F9', fontFamily: "'Open Sans', sans-serif" },
  container: { maxWidth: 800, margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { margin: 0, fontSize: 26, fontWeight: 700, color: '#0f172a', fontFamily: "'Poppins', sans-serif" },
  pageSubtitle: { margin: '4px 0 0', color: '#64748b', fontSize: 14 },
  toolbar: { display: 'flex', gap: 12, alignItems: 'center' },
  searchInput: { height: 38, padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', fontFamily: "'Open Sans', sans-serif" },
  btnCreate: { background: '#9FD8A3', color: '#1a5c1e', border: 'none', padding: '9px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' as const },
  tableWrap: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14 },
  thead: { background: '#f1f5f9' },
  th: { padding: '12px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' as const, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' as const },
  td: { padding: '14px 16px', color: '#0f172a', verticalAlign: 'middle' as const },
  emptyCell: { padding: 48, textAlign: 'center' as const, color: '#94a3b8', fontSize: 14 },
  actions: { display: 'flex', gap: 8 },
  btnEdit: { background: '#eef2ff', color: '#6366f1', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnDelete: { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  modalOverlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#fff', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 420 },
  modalTitle: { margin: '0 0 20px', fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: { width: '100%', height: 40, padding: '0 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' as const, outline: 'none', fontFamily: "'Open Sans', sans-serif" },
  actionsRow: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  btnCancel: { padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: "'Open Sans', sans-serif" },
  btnSave: { padding: '8px 20px', background: '#5BA4CF', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: "'Poppins', sans-serif" },
  btnDanger: { padding: '8px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: "'Poppins', sans-serif" },
  errorText: { color: '#dc2626', fontSize: 13, marginTop: 0, marginBottom: 8 },
};
 
export default s;