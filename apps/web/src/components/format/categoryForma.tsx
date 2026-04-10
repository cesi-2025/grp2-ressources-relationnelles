'use client';
 
import { useState, useEffect } from 'react';
import { categories, Category } from '@/lib/api';
import s from '@/style/categoryAdminStyle';
 
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
      if (isEdit && category) {
        const updated = await categories.update(category.id, name.trim());
        onSaved(updated);
      } else {
        const created = await categories.create(name.trim());
        onSaved(created);
      }
      onClose();
    } catch {
      const msg = isEdit ? 'Erreur lors de la modification.' : 'Erreur lors de la création.';
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