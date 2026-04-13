'use client';
 
import { Resource } from '@/lib/api';
import s from '@/style/admin/dashboardAdminStyle';
 
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; style: React.CSSProperties }> = {
    pending:   { label: 'En attente', style: s.badgePending },
    validated: { label: 'Validée',    style: s.badgeValidated },
    suspended: { label: 'Suspendue',  style: s.badgeSuspended },
  };
  const b = map[status] ?? { label: status, style: s.badgePending };
  return <span style={{ ...s.badge, ...b.style }}>{b.label}</span>;
}
 
interface ResourceTableProps {
  resources: Resource[];
  loading: boolean;
  onValidate: (id: number, title: string) => void;
  onRefuse: (id: number, title: string) => void;
}
 
export default function ResourceTable({ resources, loading, onValidate, onRefuse }: ResourceTableProps) {
  return (
    <div style={s.tableWrap}>
      <table style={s.table}>
        <thead style={s.thead}>
          <tr>
            <th style={s.th}>Titre</th>
            <th style={s.th}>Statut</th>
            <th style={s.th}>Date</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={4} style={s.emptyCell}>Chargement…</td></tr>}
          {!loading && resources.length === 0 && (
            <tr><td colSpan={4} style={s.emptyCell}>Aucune ressource en attente.</td></tr>
          )}
          {resources.map((r) => (
            <tr key={r.id}>
              <td style={{ ...s.td, fontWeight: 500 }}>{r.title}</td>
              <td style={s.td}><StatusBadge status={r.status} /></td>
              <td style={s.tdMuted}>
                {new Date(r.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
              <td style={s.td}>
                <div style={s.actions}>
                  <button style={s.btnValidate} onClick={() => onValidate(r.id, r.title)}>
                    Valider
                  </button>
                  <button style={s.btnRefuse} onClick={() => onRefuse(r.id, r.title)}>
                    Refuser
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}