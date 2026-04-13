'use client';
 
import { useState } from 'react';
// ✅ Remplace createUser.createPrivilegedUser() inexistant → api() direct
// ✅ Remplace ApiError → ApiRequestError (nom exact dans api.ts)
import { api, ApiRequestError } from '@/lib/api';
import s from '@/style/admin/userAdminStyle';
 
// Interface locale — CreateUser n'est pas exporté par api.ts original
interface CreateUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
 
interface CreateUserFormProps {
  onClose: () => void;
  onCreated: () => void;
}
 
export default function CreateUserForm({ onClose, onCreated }: CreateUserFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'moderator',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [saving, setSaving] = useState(false);
 
  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
 
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Les mots de passe ne correspondent pas.' });
      return;
    }
 
    setSaving(true);
    try {
      // ✅ Remplace createUser.createPrivilegedUser() → api() POST /super-admin/users
      await api<CreateUser>('/super-admin/users', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
        },
      });
      onCreated();
      onClose();
    } catch (err) {
      // ✅ instanceof ApiRequestError (nom correct dans api.ts)
      if (err instanceof ApiRequestError && err.errors) {
        const flat: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => (flat[k] = v[0]));
        setErrors(flat);
      } else {
        setGlobalError(err instanceof ApiRequestError ? err.message : 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2 style={s.modalTitle}>Créer un utilisateur privilégié</h2>
 
        <div style={s.infoBox}>
          Seuls les rôles <strong>Modérateur</strong> et <strong>Admin</strong> peuvent être créés ici.
          Les citoyens s&apos;inscrivent via le formulaire d&apos;inscription.
        </div>
 
        {globalError && <p style={s.errorText}>{globalError}</p>}
 
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Nom complet</label>
            <input
              value={form.name}
              onChange={set('name')}
              required
              minLength={2}
              maxLength={255}
              style={s.input}
              autoFocus
              placeholder="Jean Dupont"
            />
            {errors.name && <p style={s.errorText}>{errors.name}</p>}
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Adresse e-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              style={s.input}
              placeholder="jean.dupont@example.com"
            />
            {errors.email && <p style={s.errorText}>{errors.email}</p>}
          </div>
 
          <div style={s.field}>
            <label style={s.label}>Rôle</label>
            <select value={form.role} onChange={set('role')} style={s.select} required>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
              <option value="super_admin">Super Administrateur</option>
            </select>
            {errors.role && <p style={s.errorText}>{errors.role}</p>}
          </div>
 
          <div style={s.fieldRow}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                style={s.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.password && <p style={s.errorText}>{errors.password}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Confirmer</label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={set('password_confirmation')}
                required
                style={s.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.password_confirmation && <p style={s.errorText}>{errors.password_confirmation}</p>}
            </div>
          </div>
 
          <div style={s.actionsRow}>
            <button type="button" onClick={onClose} style={s.btnCancel}>Annuler</button>
            <button type="submit" disabled={saving} style={s.btnSave}>
              {saving ? 'Création…' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}