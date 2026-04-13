'use client';
 
import { useEffect, useState, useCallback } from 'react';
<<<<<<< HEAD
=======
// ✅ FIX — api.ts exporte ApiRequestError (pas ApiError)
// ✅ Plus d'import de createUser inexistant — on utilise api() directement
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
import { api, ApiRequestError } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import s from '@/style/admin/userAdminStyle';
import { useRouter } from 'next/navigation';
 
<<<<<<< HEAD
// Interface de création d'utilisateur
=======
// Interface locale (était dans api.ts corrigé, on la définit ici)
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
interface CreateUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
 
const ROLE_LABELS: Record<string, string> = {
  citizen:     'Citoyen',
  moderator:   'Modérateur',
  admin:       'Admin',
  super_admin: 'Super Admin',
};
 
const ROLE_BADGE: Record<string, React.CSSProperties> = {
  citizen:     { background: '#e0f0ff', color: '#1a56a0' },
  moderator:   { background: '#faeeda', color: '#854f0b' },
  admin:       { background: '#f0e8fe', color: '#534ab7' },
  super_admin: { background: '#fde8e8', color: '#8b1a1a' },
};
 
function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
 
export default function UtilisateursPage() {
  const { user, loading } = useAuth();
  const [list, setList] = useState<CreateUser[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
 
  const router = useRouter();

  const [toggleTarget, setToggleTarget] = useState<CreateUser | null>(null);
  const [toggling, setToggling] = useState(false);
 
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'moderator' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
 
  const fetchUsers = useCallback(async () => {
    try {
<<<<<<< HEAD
=======
      // ✅ Remplace createUser.list() inexistant → api() direct vers /super-admin/users
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
      const params: Record<string, string> = {};
      if (filterRole) params.role = filterRole;
      const query = Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";
      const res = await api<CreateUser[]>(`/super-admin/users${query}`);
      setList(Array.isArray(res) ? res : (res as any).data ?? []);
    } catch (err) {
      setError(`Erreur lors du chargement des rôles ${err}.`);
    } finally {
      setPageLoading(false);
    }
  }, [filterRole]);
 
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
    if (user) fetchUsers();
  }, [user, router, fetchUsers]);
 
  async function handleToggle() {
    if (!toggleTarget) return;
    setToggling(true);
    setError('');
    try {
<<<<<<< HEAD
=======
      // ✅ Remplace createUser.toggleActive() inexistant → api() direct
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
      const res = await api<{ user: CreateUser }>(`/super-admin/users/${toggleTarget.id}/toggle`, { method: 'PUT' });
      setList((prev) => prev.map((u) => u.id === res.user.id ? res.user : u));
      setToggleTarget(null);
    } catch (err) {
      setError(`Erreur lors de l'activation de l'utilisateur ${err}`);
    } finally {
      setToggling(false);
    }
  }
 
  function setField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }
 
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});
    setGlobalError('');
    if (form.password !== form.password_confirmation) {
      setFormErrors({ password_confirmation: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setSaving(true);
    try {
<<<<<<< HEAD
=======
      // ✅ Remplace createUser.createPrivilegedUser() → api() direct vers /super-admin/users
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
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
      setFormOpen(false);
      setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'moderator' });
      fetchUsers();
    } catch (err) {
<<<<<<< HEAD
=======
      // ✅ FIX — instanceof ApiRequestError (nom correct dans api.ts)
>>>>>>> 3110a0653e9150372b5b15a403fede59fd94b139
      if (err instanceof ApiRequestError && err.errors) {
        const flat: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => (flat[k] = v[0]));
        setFormErrors(flat);
      } else {
        setGlobalError(err instanceof ApiRequestError ? err.message : 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  }
 
  const filtered = list.filter((u) => {
    if (filterRole && u.role !== filterRole) return false;
    if (search && !u.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
 
  if (loading || !user) return null;
 
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Utilisateurs</h1>
            <p style={s.pageSubtitle}>{filtered.length} compte{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div style={s.toolbar}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." style={s.searchInput} />
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={s.filterSelect}>
              <option value="">Tous les rôles</option>
              <option value="citizen">Citoyen</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button
              onClick={() => { setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'moderator' }); setFormErrors({}); setGlobalError(''); setFormOpen(true); }}
              style={s.btnCreate}
            >
              + Créer un compte
            </button>
          </div>
        </div>
 
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Nom</th>
                <th style={s.th}>Rôle</th>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Inscription</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading && <tr><td colSpan={5} style={s.emptyCell}>Chargement…</td></tr>}
              {!pageLoading && filtered.length === 0 && <tr><td colSpan={5} style={s.emptyCell}>Aucun utilisateur trouvé.</td></tr>}
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.is_active ? '#5BA4CF' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                        {u.name ? getInitials(u.name) : '??'}
                      </div>
                      <span style={{ fontWeight: 500, color: u.is_active ? '#0f172a' : '#94a3b8' }}>
                        {u.name ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(ROLE_BADGE[u.role] ?? {}) }}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.is_active ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
                      <span style={{ ...s.badge, ...(u.is_active ? s.badgeActive : s.badgeInactive) }}>
                        {u.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  <td style={s.tdMuted}>
                    {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={s.td}>
                    {u.role === 'citizen' ? (
                      <button onClick={() => { setToggleTarget(u); setError(''); }} style={u.is_active ? s.btnDeactivate : s.btnActivate}>
                        {u.is_active ? 'Désactiver' : 'Réactiver'}
                      </button>
                    ) : (
                      <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {toggleTarget && (
        <div style={s.modalOverlay} onClick={() => setToggleTarget(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{toggleTarget.is_active ? 'Désactiver le compte' : 'Réactiver le compte'}</h2>
            <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>
              {toggleTarget.is_active
                ? <>Désactiver <strong style={{ color: '#0f172a' }}>{toggleTarget.name}</strong> ? L&apos;utilisateur ne pourra plus se connecter.</>
                : <>Réactiver <strong style={{ color: '#0f172a' }}>{toggleTarget.name}</strong> ? L&apos;utilisateur pourra à nouveau se connecter.</>
              }
            </p>
            {error && <p style={s.errorText}>{error}</p>}
            <div style={s.actionsRow}>
              <button onClick={() => setToggleTarget(null)} style={s.btnCancel}>Annuler</button>
              <button onClick={handleToggle} disabled={toggling} style={toggleTarget.is_active ? s.btnDanger : s.btnSave}>
                {toggling ? 'Mise à jour…' : toggleTarget.is_active ? 'Désactiver' : 'Réactiver'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {formOpen && (
        <div style={s.modalOverlay} onClick={() => setFormOpen(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Créer un compte privilégié</h2>
            <div style={{ background: '#e0f0ff', border: '1px solid #b5d4f4', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1a56a0', lineHeight: 1.6 }}>
              Seuls les rôles <strong>Modérateur</strong> et <strong>Admin</strong> peuvent être créés ici.
            </div>
            {globalError && <p style={s.errorText}>{globalError}</p>}
            <form onSubmit={handleCreate}>
              <div style={s.field}>
                <label style={s.label}>Nom complet</label>
                <input value={form.name} onChange={setField('name')} required minLength={2} style={s.input} autoFocus placeholder="Jean Dupont" />
                {formErrors.name && <p style={s.errorText}>{formErrors.name}</p>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Adresse e-mail</label>
                <input type="email" value={form.email} onChange={setField('email')} required style={s.input} placeholder="jean@example.com" />
                {formErrors.email && <p style={s.errorText}>{formErrors.email}</p>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Rôle</label>
                <select value={form.role} onChange={setField('role')} style={{ ...s.input, cursor: 'pointer' }} required>
                    <option value="citizen">Citoyen</option>
                    <option value="moderator">Modérateur</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                </select>
                {formErrors.role && <p style={s.errorText}>{formErrors.role}</p>}
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Mot de passe</label>
                  <input type="password" value={form.password} onChange={setField('password')} required style={s.input} placeholder="••••••••" autoComplete="new-password" />
                  {formErrors.password && <p style={s.errorText}>{formErrors.password}</p>}
                </div>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Confirmer</label>
                  <input type="password" value={form.password_confirmation} onChange={setField('password_confirmation')} required style={s.input} placeholder="••••••••" autoComplete="new-password" />
                  {formErrors.password_confirmation && <p style={s.errorText}>{formErrors.password_confirmation}</p>}
                </div>
              </div>
              <div style={s.actionsRow}>
                <button type="button" onClick={() => setFormOpen(false)} style={s.btnCancel}>Annuler</button>
                <button type="submit" disabled={saving} style={s.btnSave}>{saving ? 'Création…' : 'Créer le compte'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}