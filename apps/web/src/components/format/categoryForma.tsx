'use client';
 
import { useState, useEffect } from 'react';
// ✅ Remplace categories.update() / categories.create() inexistants → api() direct
import { api, Category } from '@/lib/api';
import s from '@/style/admin/categoryAdminStyle';
 
interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSaved: (cat: Category) => void;
  onError: (msg: string) => void;
}
 
export default function CategoryForm({ category, onClose, onSaved, onError }: CategoryFormProps) {
  const isEdit = !!category;
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    setName(category?.name ?? '');
    setError('');
  }, [category]);
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let result: Category;
      if (isEdit && category) {
        // ✅ Remplace categories.update() → api() PUT /categories/{id}
        result = await api<Category>(`/admin/categories/${category.id}`, {
          method: 'PUT',
          body: { name: name.trim() },
        });
      } else {
        // ✅ Remplace categories.create() → api() POST /categories
        result = await api<Category>('/admin/categories', {
          method: 'POST',
          body: { name: name.trim() },
        });
      }
      onSaved(result);
      onClose();
    } catch (err) {
      const msg = isEdit
        ? `Erreur lors de la modification de ${category?.name}: ${err}.`
        : 'Erreur lors de la création.';
      setError(msg);
      onError(msg);
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={s.modalTitle}>
          {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={255}
              style={s.input}
              autoFocus
            />
          </div>
          {error && <p style={s.errorText}>{error}</p>}
          <div style={s.actionsRow}>
            <button type="button" onClick={onClose} style={s.btnCancel}>Annuler</button>
            <button type="submit" disabled={saving} style={s.btnSave}>
              {saving ? (isEdit ? 'Enregistrement…' : 'Création…') : (isEdit ? 'Enregistrer' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}