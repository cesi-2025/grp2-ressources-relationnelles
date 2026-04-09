'use client';
 
import { useState, useEffect } from 'react';
import { Resource, Category, resources } from '@/lib/api';
import s from '@/style/ressourceAdminStyle';
 
interface RelationType { id: number; name: string; }
interface ResourceType { id: number; name: string; }
 
interface ResourceFormProps {
  resource?: Resource | null;
  categoriesList: Category[];
  relationTypes: RelationType[];
  resourceTypes: ResourceType[];
  onClose: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}
 
export default function ResourceForm({
  resource,
  categoriesList,
  relationTypes,
  resourceTypes,
  onClose,
  onSaved,
  onError,
}: ResourceFormProps) {
  const isEdit = !!resource;
 
  const [form, setForm] = useState({
    title: '',
    content: '',
    category_id: '',
    relation_type_id: '',
    resource_type_id: '',
    is_public: true,
  });
  const [saving, setSaving] = useState(false);
 
  useEffect(() => {
    if (resource) {
      setForm({
        title: resource.title,
        content: resource.content,
        category_id: String(resource.category_id),
        relation_type_id: String((resource as any).relation_type_id ?? ''),
        resource_type_id: String((resource as any).resource_type_id ?? ''),
        is_public: (resource as any).is_public ?? true,
      });
    }
  }, [resource]);
 
  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title: form.title,
        content: form.content,
        category_id: Number(form.category_id),
        relation_type_id: Number(form.relation_type_id),
        resource_type_id: Number(form.resource_type_id),
        is_public: form.is_public,
      };
      if (isEdit && resource) {
        await resources.update(resource.id, data);
        onSaved('Ressource mise à jour avec succès.');
      } else {
        await resources.create(data);
        onSaved('Ressource créée avec succès.');
      }
      onClose();
    } catch {
      onError('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={s.modalTitle}>{isEdit ? 'Modifier la ressource' : 'Nouvelle ressource'}</h2>
 
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Titre</label>
            <input style={s.input} value={form.title} onChange={set('title')} required minLength={3} maxLength={255} />
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Contenu</label>
            <textarea style={{ ...s.textarea, minHeight: 120 }} value={form.content} onChange={set('content')} required minLength={10} />
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Catégorie</label>
            <select style={s.formSelect} value={form.category_id} onChange={set('category_id')} required>
              <option value="">Sélectionner...</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Type de relation</label>
            <select style={s.formSelect} value={form.relation_type_id} onChange={set('relation_type_id')} required>
              <option value="">Sélectionner...</option>
              {relationTypes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Type de ressource</label>
            <select style={s.formSelect} value={form.resource_type_id} onChange={set('resource_type_id')} required>
              <option value="">Sélectionner...</option>
              {resourceTypes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
 
          <div style={{ ...s.field, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="is_public"
              checked={form.is_public}
              onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.checked }))}
            />
            <label htmlFor="is_public" style={{ ...s.label, margin: 0, textTransform: 'none', letterSpacing: 0 }}>
              Ressource publique
            </label>
          </div>
 
          <div style={s.modalActions}>
            <button type="button" style={s.btnCancel} onClick={onClose}>Annuler</button>
            <button type="submit" style={s.btnSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}