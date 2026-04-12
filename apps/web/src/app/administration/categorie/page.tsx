'use client';
 
import { useEffect, useState, useCallback } from 'react';
// ✅ Remplace categories.list() / categories.delete() inexistants
// → getCategories() (existe) + api() direct pour create/update/delete
import { api, getCategories, Category } from '@/lib/api';
import { useRequireStrictAdmin } from '@/contexts/AuthContext';
import CategoryForm from '@/components/format/categoryForma';
import s from '@/style/admin/categoryAdminStyle';
 
export default function CategoriesPage() {
  const { user, loading } = useRequireStrictAdmin();
  const [list, setList] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
 
  const fetchCategories = useCallback(async () => {
    try {
      // ✅ Remplace categories.list() → getCategories() (existe dans api.ts)
      const res = await getCategories();
      setList(res);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err}.`);
    } finally {
      setPageLoading(false);
    }
  }, []);
 
  useEffect(() => {
    if (user) fetchCategories();
  }, [user, fetchCategories]);
 
  function handleSaved(cat: Category) {
    setList((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      return exists ? prev.map((c) => c.id === cat.id ? cat : c) : [...prev, cat];
    });
  }
 
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    try {
      // ✅ Remplace categories.delete() inexistant → api() direct vers /categories/{id}
      await api(`/categories/${deleteTarget.id}`, { method: 'DELETE' });
      setList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(`Erreur lors de la suppression. ${err}`);
    } finally {
      setDeleting(false);
    }
  }
 
  const filtered = list.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
 
  if (loading || !user) return null;
 
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Catégories</h1>
            <p style={s.pageSubtitle}>{filtered.length} catégorie{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div style={s.toolbar}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={s.searchInput}
            />
            <button
              onClick={() => { setEditTarget(null); setFormOpen(true); }}
              style={s.btnCreate}
            >
              + Créer
            </button>
          </div>
        </div>
 
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Nom</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading && <tr><td colSpan={2} style={s.emptyCell}>Chargement…</td></tr>}
              {!pageLoading && filtered.length === 0 && <tr><td colSpan={2} style={s.emptyCell}>Aucune catégorie trouvée.</td></tr>}
              {filtered.map((cat, i) => (
                <tr key={cat.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ ...s.td, fontWeight: 500 }}>{cat.name}</td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button
                        onClick={() => { setEditTarget(cat); setFormOpen(true); }}
                        style={s.btnEdit}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(cat); setError(''); }}
                        style={s.btnDelete}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {formOpen && (
        <CategoryForm
          category={editTarget}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSaved={handleSaved}
          onError={setError}
        />
      )}
 
      {deleteTarget && (
        <div style={s.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Confirmer la suppression</h2>
            <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>
              Supprimer <strong style={{ color: '#0f172a' }}> "{deleteTarget.name}" </strong> ? Cette action est irréversible.
            </p>
            {error && <p style={s.errorText}>{error}</p>}
            <div style={s.actionsRow}>
              <button onClick={() => setDeleteTarget(null)} style={s.btnCancel}>Annuler</button>
              <button onClick={handleDelete} disabled={deleting} style={s.btnDanger}>
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}