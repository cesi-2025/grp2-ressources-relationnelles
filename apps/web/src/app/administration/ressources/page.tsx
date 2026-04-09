'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { resources, categories, admin, relationTypes, resourceTypes, Resource, Category, RelationType, ResourceType } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ResourceForm from '@/components/format/ressourceForma';
import Toast, { ToastItem } from '@/components/toast/ressourceToast';
import s from '@/style/ressourceAdminStyle';
 
function StatusBadge({ status }: { status: Resource['status'] }) {
  const map: Record<string, { label: string; extra: React.CSSProperties }> = {
    validated: { label: 'Validée',    extra: s.badgeValidated },
    pending:   { label: 'En attente', extra: s.badgePending },
    suspended: { label: 'Suspendue',  extra: s.badgeSuspended },
  };
  const badge = map[status] ?? { label: status, extra: s.badgePending };
  return <span style={{ ...s.badge, ...badge.extra }}>{badge.label}</span>;
}
 
export default function AdminRessourcesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
 
  const [list, setList] = useState<Resource[]>([]);
  const [catList, setCatList] = useState<Category[]>([]);
  const [relTypeList, setRelTypeList] = useState<RelationType[]>([]);
  const [resTypeList, setResTypeList] = useState<ResourceType[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
 
  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
 
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
 
  const [toasts, setToasts] = useState<ToastItem[]>([]);
 
  // ── Auth guard ────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && (!user || !['admin', 'super_admin', 'moderateur'].includes(user.role))) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);
 
  // ── Toast helpers ─────────────────────────────────────
  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    setToasts((t) => [...t, { id: Date.now(), message, type }]);
  }, []);
 
  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
 
  // ── Fetch data ────────────────────────────────────────
  const fetchResources = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category_id = filterCategory;
      const res = await resources.list(params);
      setList(Array.isArray(res) ? res : (res as any).data ?? []);
    } catch {
      addToast('Erreur lors du chargement des ressources.', 'error');
    } finally {
      setPageLoading(false);
    }
  }, [filterStatus, filterCategory, addToast]);
 
  useEffect(() => {
    categories.list().then(setCatList).catch(console.error);
    resources.list().then((res: any) => {
      const list = Array.isArray(res) ? res : res.data ?? [];
      
      // Extrait les relation_types uniques
      const relTypes = list
        .map((r: any) => r.relation_type)
        .filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex(x => x.id === v.id) === i);
      
      const resTypes = list
        .map((r: any) => r.resource_type)
        .filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex(x => x.id === v.id) === i);
      
      setRelTypeList(relTypes);
      setResTypeList(resTypes);
  }).catch(console.error);
  }, []);
 
  useEffect(() => {
    if (user) fetchResources();
  }, [user, fetchResources]);
 
  // ── Actions ───────────────────────────────────────────
  async function handleSuspend(r: Resource) {
    try {
      await admin.suspendResource(r.id);
      addToast(`Ressource "${r.title}" suspendue.`, 'success');
      fetchResources();
    } catch {
      addToast('Erreur lors de la suspension.', 'error');
    }
  }

  async function handleReactivate(r: Resource) {
  try {
    await admin.reactivateResource(r.id);
    addToast(`Ressource "${r.title}" réactivée.`, 'success');
    fetchResources();
  } catch {
    addToast('Erreur lors de la réactivation.', 'error');
  }
}

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // DELETE n'est pas dans l'API admin — on suspend à la place
      await admin.suspendResource(deleteTarget.id);
      addToast(`Ressource "${deleteTarget.title}" supprimée.`, 'success');
      setDeleteTarget(null);
      fetchResources();
    } catch {
      addToast('Erreur lors de la suppression.', 'error');
    } finally {
      setDeleting(false);
    }
  }
 
  // ── Filtered list ─────────────────────────────────────
  const filtered = list.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterCategory && String(r.category_id) !== filterCategory) return false;
    return true;
  });
 
  if (authLoading || !user) return null;
 
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.headerTitle}>Gestion des ressources</h1>
        <button style={s.headerBack} onClick={() => router.push('/administration')}>
          ← Retour
        </button>
      </div>
 
      <div style={s.content}>
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.filters}>
            <select
              style={s.select}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="suspended">Suspendues</option>
            </select>
 
            <select
              style={s.select}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {catList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
 
          <button style={s.btnAdd} onClick={() => { setEditResource(null); setFormOpen(true); }}>
            + Ajouter une ressource
          </button>
        </div>
 
        {/* Table */}
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
              {pageLoading && (
                <tr>
                  <td colSpan={5} style={s.emptyRow}>Chargement…</td>
                </tr>
              )}
              {!pageLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={s.emptyRow}>Aucune ressource trouvée.</td>
                </tr>
              )}
              {filtered.map((r) => {
                const cat = catList.find((c) => c.id === r.category_id);
                return (
                  <tr key={r.id}>
                    <td style={s.td}>
                      <span style={{ fontWeight: 500 }}>{r.title}</span>
                    </td>
                    <td style={s.tdMuted}>{cat?.name ?? '—'}</td>
                    <td style={s.td}><StatusBadge status={r.status} /></td>
                    <td style={s.tdMuted}>
                      {new Date(r.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td style={s.td}>
                      <div style={s.actions}>
                        <button
                          style={s.btnEdit}
                          onClick={() => { setEditResource(r); setFormOpen(true); }}
                        >
                          Éditer
                        </button>
                        {r.status !== 'suspended' ? (
                          <button style={s.btnSuspend} onClick={() => handleSuspend(r)}>
                            Suspendre
                          </button>
                        ) : (
                          <button style={s.btnReactivate} onClick={() => handleReactivate(r)}>
                            Réactiver
                          </button>
                        )}
                        <button style={s.btnDelete} onClick={() => setDeleteTarget(r)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Modal formulaire */}
      {formOpen && (
        <ResourceForm
          resource={editResource}
          categoriesList={catList}
          relationTypes={relTypeList}
          resourceTypes={resTypeList}
          onClose={() => { setFormOpen(false); setEditResource(null); }}
          onSaved={(msg) => { addToast(msg, 'success'); fetchResources(); }}
          onError={(msg) => addToast(msg, 'error')}
        />
      )}
 
      {/* Modal confirmation suppression */}
      {deleteTarget && (
        <div style={s.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Confirmer la suppression</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong style={{ color: '#3A3A3A' }}>"{deleteTarget.title}"</strong> ?
              Cette action est irréversible.
            </p>
            <div style={s.modalActions}>
              <button style={s.btnCancel} onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button style={s.btnConfirmDelete} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Toasts */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}