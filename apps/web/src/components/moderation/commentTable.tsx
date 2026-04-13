'use client';
 
import s from '@/style/admin/dashboardAdminStyle';
 
interface CommentItem {
  id: number;
  content: string;
  is_approved: boolean;
  created_at: string;
  user?: { name?: string };
}
 
interface CommentTableProps {
  comments: CommentItem[];
  loading: boolean;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
}
 
export default function CommentTable({ comments, loading, onApprove, onDelete }: CommentTableProps) {
  return (
    <div style={s.tableWrap}>
      <table style={s.table}>
        <thead style={s.thead}>
          <tr>
            <th style={s.th}>Contenu</th>
            <th style={s.th}>Auteur</th>
            <th style={s.th}>Statut</th>
            <th style={s.th}>Date</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan={5} style={s.emptyCell}>Chargement…</td></tr>}
          {!loading && comments.length === 0 && (
            <tr><td colSpan={5} style={s.emptyCell}>Aucun commentaire à modérer.</td></tr>
          )}
          {comments.map((c) => (
            <tr key={c.id}>
              <td style={{ ...s.td, maxWidth: 280 }}>
                <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.content}
                </p>
              </td>
              <td style={s.tdMuted}>{c.user?.name ?? '—'}</td>
              <td style={s.td}>
                <span style={{ ...s.badge, ...(c.is_approved ? s.badgeValidated : s.badgePending) }}>
                  {c.is_approved ? 'Approuvé' : 'En attente'}
                </span>
              </td>
              <td style={s.tdMuted}>
                {new Date(c.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
              <td style={s.td}>
                <div style={s.actions}>
                  {!c.is_approved && (
                    <button style={s.btnApprove} onClick={() => onApprove(c.id)}>
                      Approuver
                    </button>
                  )}
                  <button style={s.btnDelete} onClick={() => onDelete(c.id)}>
                    Supprimer
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