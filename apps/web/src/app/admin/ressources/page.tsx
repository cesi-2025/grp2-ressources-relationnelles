'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, getResources, getCategories, Resource, Category } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ResourceForm from '@/components/format/ressourceForma';
import Toast, { ToastItem } from '@/components/toast/ressourceToast';
import s from '@/style/admin/ressourceAdminStyle';
 
// Types locaux (RelationType / ResourceType non présents dans api.ts original)
interface RelationType { id: number; name: string; }
interface ResourceType { id: number; name: string; }
 
// ✅ Labels alignés avec les vraies valeurs Laravel :
// published, pending, archived (ResourceStatus enum)
function StatusBadge({ status }: { status: Resource['status'] }) {
  const map: Record<string, { label: string; extra: React.CSSProperties }> = {
    published: { label: 'Publié',     extra: s.badgeValidated },
    pending:   { label: 'En attente', extra: s.badgePending },
    suspended: { label: 'Suspendu',   extra: s.badgeSuspended },
    archived:  { label: 'Archivé',    extra: s.badgeSuspended },
  };
  const badge = map[status] ?? { label: status, extra: s.badgePending };
  return <span style={{ ...s.badge, ...badge.extra }}>{badge.label}</span>;
}
 
export default function AdminRessourcesPage() {
  const { user } = useAuth();
  const router = useRouter();
 
  const [list, setList] = useState<Resource[]>([]);
  const [catList, setCatList] = useState<Category[]>([]);
  const [relTL, setRelTL] = useState<RelationType[]>([]);
  const [resTL, setResTL] = useState<ResourceType[]>([]);
  const [filterStats, setFilterStats] = useState('');
  const [filterC, setFilterC] = useState('');
  const [pageLoad, setPageLoading] = useState(true);
 
  const [formOpen, setFormOpen] = useState(false);
  const [editRes, setEditRes] = useState<Resource | null>(null);
  const [deleteItem, setDeleteItem] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
 
  useEffect(() => {
    if (!user){
      if(['admin', 'super_admin', 'moderator'].includes(user.role)) {
        router.replace('/auth/connexion');
      }
    }else if(user){
      if(['admin', 'super_admin', 'moderator'].includes(user.role)) {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);
 
  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    setToasts((t) => [...t, { id: Date.now(), message, type }]);
  }, []);
 
  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
 
  const fetchRes = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (filterStats) params.status = filterStats;
      if (filterC) params.category_id = filterC;
      const query = Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";
 
      let resList: Resource[] = [];
      if (user?.role === 'moderator') {
        // ✅ Modérateur : route GET /moderation/resources (existe)
        const res: any = await api(`/moderation/resources${query}`);
        resList = Array.isArray(res) ? res : res.data ?? [];
      } else {
        // ✅ Admin/Super Admin : route GET /admin/resources (existe)
        const res: any = await api(`/admin/resources${query}`);
        resList = Array.isArray(res) ? res : res.data ?? [];
      }
      setList(resList);
    } catch (err) {
      addToast(`Erreur lors du chargement ${err}.`, 'error');
      try {
        const res = await getResources();
        setList(res.data ?? []);
      } catch { /* silencieux */ }
    } finally {
      setPageLoading(false);
    }
  }, [filterStats, filterC, user?.role, addToast]);
 
  useEffect(() => {
    getCategories().then(setCatList).catch(console.error);
 
    getResources().then((res) => {
      const list = res.data ?? [];
      const relTypes = list
        .map((r: any) => r.relation_type).filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === v.id) === i);
      const resTypes = list
        .map((r: any) => r.resource_type).filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === v.id) === i);
      setRelTL(relTypes);
      setResTL(resTypes);
    }).catch(console.error);
  }, []);
 
  useEffect(() => {
    if (user) fetchRes();
  }, [user, fetchRes]);
 
  async function handleSuspend(r: Resource) {
    try {
      // ✅ Route correcte : PUT /admin/resources/{resource}/suspend
      await api(`/admin/resources/${r.id}/suspend`, { method: 'PUT' });
      const newStatus: Resource['status'] = r.status !== 'archived' ? 'archived' : 'published';
      setList((prev) => prev.map((item) =>
        item.id === r.id ? { ...item, status: newStatus } : item
      ));
      addToast(newStatus === 'archived' ? 'Ressource archivée.' : 'Ressource réactivée.', 'success');
    } catch (err) {
      addToast(`Erreur durant l'archivage ${err}.`, 'error');
    }
  }
 
  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await api(`/admin/resources/${deleteItem.id}/suspend`, { method: 'PUT' });
      addToast(`Ressource "${deleteItem.title}" supprimée.`, 'success');
      setDeleteItem(null);
      fetchRes();
    } catch (err) {
      addToast(`Erreur lors de la suppression ${err}.`, 'error');
    } finally {
      setDeleting(false);
    }
  }
 
  async function handleValidate(r: Resource) {
    try {
      // ✅ Route correcte : PUT /moderation/resources/{resource}/validate
      await api(`/moderation/resources/${r.id}/validate`, { method: 'PUT' });
      setList((prev) => prev.map((item) =>
        item.id === r.id ? { ...item, status: 'published' as const } : item
      ));
      addToast(`Ressource "${r.title}" validée.`, 'success');
    } catch (err) {
      addToast(`Erreur lors de la validation ${err}.`, 'error');
    }
  }
 
  const filtered = list.filter((r) => {
    if (filterStats && r.status !== filterStats) return false;
    if (filterC && String(r.category_id) !== filterC) return false;
    return true;
  });
 
  if (!user) return null;
 
  return (
    <div style={s.page}>
 
      <div style={s.content}>
        <div style={s.toolbar}>
          <div style={s.filters}>
            <select style={s.select} value={filterStats} onChange={(e) => setFilterStats(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="published">Publié</option>
              <option value="suspended">Suspendu</option>
              <option value="archived">Archivé</option>
            </select>
 
            <select style={s.select} value={filterC} onChange={(e) => setFilterC(e.target.value)}>
              <option value="">Toutes les catégories</option>
              {catList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
 
          {user.role !== 'citizen' && user.role !== 'moderator' && (
            <button style={s.btnAdd} onClick={() => { setEditRes(null); setFormOpen(true); }}>
              + Ajouter une ressource
            </button>
          )}
        </div>
 
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Titre</th>
                <th style={s.th}>Catégorie</th>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoad && <tr><td colSpan={5} style={s.emptyRow}>Chargement…</td></tr>}
              {!pageLoad && filtered.length === 0 && <tr><td colSpan={5} style={s.emptyRow}>Aucune ressource trouvée.</td></tr>}
              {filtered.map((r) => {
                const cat = catList.find((c) => c.id === r.category_id);
                return (
                  <tr key={r.id}>
                    <td style={s.td}><span style={{ fontWeight: 500 }}>{r.title}</span></td>
                    <td style={s.tdMuted}>{cat?.name ?? '—'}</td>
                    <td style={s.td}><StatusBadge status={r.status} /></td>
                    <td style={s.tdMuted}>
                      {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={s.td}>
                      <div style={s.actions}>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <button style={s.btnEdit} onClick={() => { setEditRes(r); setFormOpen(true); }}>
                            Éditer
                          </button>
                        )}
                        {user.role === 'moderator' && r.status === 'pending' && (
                          <button style={s.btnValidate} onClick={() => handleValidate(r)}>
                            Valider
                          </button>
                        )}
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          r.status !== 'archived' ? (
                            <button style={s.btnSuspend} onClick={() => handleSuspend(r)}>Archiver</button>
                          ) : (
                            <button style={s.btnReactivate} onClick={() => handleSuspend(r)}>Réactiver</button>
                          )
                        )}
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <button style={s.btnDelete} onClick={() => setDeleteItem(r)}>Supprimer</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
 
      {formOpen && (
        <ResourceForm
          resource={editRes}
          categoriesList={catList}
          relationTypes={relTL}
          resourceTypes={resTL}
          onClose={() => { setFormOpen(false); setEditRes(null); }}
          onSaved={(msg) => { addToast(msg, 'success'); fetchRes(); }}
          onError={(msg) => addToast(msg, 'error')}
        />
      )}
 
      {deleteItem && (
        <div style={s.modalOverlay} onClick={() => setDeleteItem(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Confirmer la suppression</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong style={{ color: '#3A3A3A' }}>"{deleteItem.title}"</strong> ?
              Cette action est irréversible.
            </p>
            <div style={s.modalActions}>
              <button style={s.btnCancel} onClick={() => setDeleteItem(null)}>Annuler</button>
              <button style={s.btnConfirmDelete} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}