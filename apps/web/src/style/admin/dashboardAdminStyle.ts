import { CSSProperties } from 'react';
 
const s: Record<string, CSSProperties> = {
  page: { padding: '40px 24px', minHeight: '100vh', background: '#F6F7F9', fontFamily: "'Open Sans', sans-serif" },
  container: { maxWidth: 1100, margin: '0 auto' },
  pageTitle: { margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#0f172a', fontFamily: "'Poppins', sans-serif" },
  pageSubtitle: { margin: '0 0 28px', color: '#64748b', fontSize: 14 },
 
  // Filtres
  filtersBar: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28, alignItems: 'center' },
  filterSelect: { height: 38, padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
 
  // Stats grid
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 },
  statsGridWide: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 32 },
  statCard: { background: '#fff', borderRadius: 10, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: '4px solid #5BA4CF' },
  statCardGreen: { borderLeftColor: '#9FD8A3' },
  statCardYellow: { borderLeftColor: '#F5E497' },
  statCardPurple: { borderLeftColor: '#AFA9EC' },
  statCardCoral: { borderLeftColor: '#F0997B' },
  statCardGray: { borderLeftColor: '#B4B2A9' },
  statLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: "'Open Sans', sans-serif" },
  statValue: { fontSize: 32, fontWeight: 700, color: '#0f172a', fontFamily: "'Poppins', sans-serif", lineHeight: 1 },
  statSub: { fontSize: 12, color: '#64748b', marginTop: 4, fontFamily: "'Open Sans', sans-serif" },
 
  // Section
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, color: '#0f172a', fontFamily: "'Poppins', sans-serif" },
 
  // Table
  tableWrap: { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: 32 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#f1f5f9' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' },
  td: { padding: '14px 16px', color: '#0f172a', verticalAlign: 'middle', borderBottom: '1px solid #f1f5f9' },
  tdMuted: { padding: '14px 16px', color: '#64748b', fontSize: 13, verticalAlign: 'middle', borderBottom: '1px solid #f1f5f9' },
  emptyCell: { padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  actions: { display: 'flex', gap: 8 },
 
  // Badges
  badge: { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600, whiteSpace: 'nowrap' },
  badgePending: { background: '#fef9e0', color: '#7a6200' },
  badgeValidated: { background: '#dcf5e0', color: '#1a5c1e' },
  badgeSuspended: { background: '#fde8e8', color: '#8b1a1a' },
 
  // Buttons
  btnValidate: { background: '#dcf5e0', color: '#1a5c1e', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
  btnRefuse: { background: '#fde8e8', color: '#8b1a1a', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
  btnApprove: { background: '#dcf5e0', color: '#1a5c1e', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
  btnDelete: { background: '#fde8e8', color: '#8b1a1a', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" },
 
  // Modal
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { background: '#fff', borderRadius: 12, padding: '28px 32px', width: '100%', maxWidth: 420 },
  modalTitle: { margin: '0 0 12px', fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' },
  actionsRow: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  btnCancel: { padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: "'Open Sans', sans-serif" },
  btnDanger: { padding: '8px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: "'Poppins', sans-serif" },
  btnSave: { padding: '8px 20px', background: '#5BA4CF', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: "'Poppins', sans-serif" },
  errorText: { color: '#dc2626', fontSize: 13, marginTop: 0, marginBottom: 8 },
};
 
export default s;