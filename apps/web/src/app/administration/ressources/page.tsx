'use client';
 
import { useEffect, useState, useCallback} from 'react';
import { useRouter } from 'next/navigation';
import { resources, categories, admin, Resource, Category, RelationType, ResourceType, moderator } from '@/lib/api';
import { useRequireAdmin } from '@/context/AuthContext';
import ResourceForm from '@/components/format/ressourceForma';
import Toast, { ToastItem } from '@/components/toast/ressourceToast';
import s from '@/style/admin/ressourceAdminStyle';
 
function StatusBadge({ status }: { status: Resource['status'] }) {
  const map: Record<string, { label: string; extra: React.CSSProperties }> = {
    validated: { label: 'validated',    extra: s.badgeValidated },
    pending:   { label: 'published', extra: s.badgePending },
    suspended: { label: 'suspended',  extra: s.badgeSuspended },
    archived: { label: 'archived',  extra: s.badgeSuspended },
  };
  const badge = map[status] ?? { label: status, extra: s.badgePending };
  return <span style={{ ...s.badge, ...badge.extra }}>{badge.label}</span>;
}
 
export default function AdminRessourcesPage() {
  const { user, loading: authLoading } = useRequireAdmin();
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
 
  // Protection accées
  useEffect(() => {
    if (!authLoading && (!user || !['admin', 'super_admin', 'moderator'].includes(user.role))) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);
 
  // Renvois des erreur écrit
  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    setToasts((t) => [...t, { id: Date.now(), message, type }]);
  }, []);
 
  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
 
  // recherche des ressources en base
  const fetchRes = useCallback(async () => {
    try {
      const params: Record<string, string> = {};

      if (filterStats) params.status = filterStats;
      if (filterC) params.category_id = filterC;
      const res = user?.role === 'moderator'  
              ? await moderator.listResources(params)
              : await admin.listResources(params);

      setList(Array.isArray(res) ? res : (res as any).data ?? []);
    } catch (err) {
      addToast(`Erreur lors du chargement ${err}.`, `error`);
    } finally {
      setPageLoading(false);
    }
  }, [filterStats, filterC, user?.role, addToast]);
 
  useEffect(() => {
    categories.list().then(setCatList).catch(console.error);
  
    // récupération des list des relation dans la base
    resources.list().then((res: any) => {
      const list = Array.isArray(res) ? res : res.data ?? [];
      
      // Récupérer les relation spécifique
      const relTypes = list
        .map((r: any) => r.relation_type)
        .filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex(x => x.id === v.id) === i);
      
      const resTypes = list
        .map((r: any) => r.resource_type)
        .filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex(x => x.id === v.id) === i);
      
      setRelTL(relTypes);
      setResTL(resTypes);
    }).catch(console.error);
  }, []);
 
  useEffect(() => {
    if (user) fetchRes();
  }, [user, fetchRes]);
 
  // Suspendre une ressource selon un changement
  async function handleSuspend(r: Resource) {
  try {
    await admin.suspendResource(r.id);
    const newStatus = r.status !== 'suspended' ? 'suspended' : 'validated';
    setList((prev) => prev.map((item) =>
      item.id === r.id ? { ...item, status: newStatus as Resource['status'] } : item
    ));
    addToast(newStatus === 'suspended' ? `Ressource suspendue.` : `Ressource réactivée.`, 'success');
  } catch (err){
    addToast(`Erreur durant la suspenstion d'une ressource ${err}.`, 'error');
  }
}


  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      // Suspendre la ressource
      await admin.suspendResource(deleteItem.id);
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
    await moderator.validateResource(r.id);
    setList((prev) => prev.map((item) =>
      item.id === r.id ? { ...item, status: 'validated' as const } : item
    ));
    addToast(`Ressource "${r.title}" validée.`, 'success');
  } catch (err) {
    addToast(`Erreur lors de la validation ${err}.`, 'error');
  }
}


  // Filtrage des élement de la base au site
  const filtered = list.filter((r) => {
    if (filterStats && r.status !== filterStats) return false;
    if (filterC && String(r.category_id) !== filterC) return false;
    return true;
  });
 
  if (authLoading || !user) return null;
 
  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>Gestion des ressources</h1>
        <button style={s.headerBack} onClick={() => router.push('/administration')}>
          ← Retour
        </button>
      </div>
 
      <div style={s.content}>
        <div style={s.toolbar}>
          <div style={s.filters}>
            <select
              style={s.select}
              value={filterStats}
              onChange={(e) => setFilterStats(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">published</option>
              <option value="validated">validated</option>
              <option value="suspended">suspended</option>
              <option value="archived">archived</option>
            </select>
 
            <select
              style={s.select}
              value={filterC}
              onChange={(e) => setFilterC(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {catList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {user.role !== "citoyen" && user.role !== "moderator" ? 
          (
            <button style={s.btnAdd} onClick={() => { setEditRes(null); setFormOpen(true); }}>
              + Ajouter une ressource
            </button>
          )
          :
          (
            ""
          )
          }
          
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
              {pageLoad && (
                <tr>
                  <td colSpan={5} style={s.emptyRow}>Chargement…</td>
                </tr>
              )}
              {!pageLoad && filtered.length === 0 && (
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
                        {user && user.role === "admin" ?
                        (
                          <button
                            style={s.btnEdit}
                            onClick={() => { setEditRes(r); setFormOpen(true); }}
                          >
                            Éditer
                          </button>
                        )
                        :
                        ("")
                        }
                        
                        {user && user.role === "moderator" ? (
                          r.status === 'pending' && (
                          <button style={s.btnValidate} onClick={() => handleValidate(r)}>
                            Valider
                          </button>
                          )
                        ):
                        ("")
                        }
                        
                        {user && user.role === "admin" ?
                          (
                          r.status !== 'suspended' ? (
                            <button style={s.btnSuspend} onClick={() => handleSuspend(r)}>
                              Suspendre
                            </button>
                          ) : (
                            <button style={s.btnReactivate} onClick={() => handleSuspend(r)}>
                              Réactiver
                            </button>
                          )
                        )
                        :
                        ("")
                        }
                        
                        {user && user.role === "admin" ?
                          (
                          <button style={s.btnDelete} onClick={() => setDeleteItem(r)}>
                            Supprimer
                          </button>
                        )
                        :
                        ("")
                        }
                        
                        
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