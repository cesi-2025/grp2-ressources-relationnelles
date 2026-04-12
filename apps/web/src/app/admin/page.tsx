"use client"
 
import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api, getCategories, getResources, Category} from "@/lib/api"
import { RelationType } from "@/data/admin/RelationType"
import { ResourceType } from "@/data/admin/RessourceType"
import s from "@/style/admin/dashboardAdminStyle";
import { STAT_CARDS } from "@/data/admin/admonStats"
 
export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
 
  const [stats, setStats] = useState<any | null>(null);
  const [catList, setCatList] = useState<Category[]>([]);
  const [relTL, setRelTL] = useState<RelationType[]>([]);
  const [resTL, setResTypeList] = useState<ResourceType[]>([]);
  const [statsLoading, setStatsLoad] = useState(true);
 
  const [filterP, setFilterP] = useState('all');
  const [filterC, setFilterC] = useState('');
  const [filterRelT, setFilterRelT] = useState('');
  const [filterResT, setFilterResT] = useState('');
 
  // ✅ FIX — isAdmin extrait pour corriger le bug opérateur virgule dans l'useEffect
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
 
  const fetchStats = useCallback(async () => {
    if (!user) return;
    setStatsLoad(true);
    try {
      // ✅ Remplace admin.statistics() / moderator.statistics() inexistants
      // → appel direct via api() vers /admin/statistics avec les filtres
      const params: Record<string, string> = { period: filterP };
      if (filterC) params.category = filterC;
      if (filterRelT) params.relation_type = filterRelT;
      if (filterResT) params.resource_type = filterResT;
      const query = "?" + new URLSearchParams(params).toString();
      const res: any = await api(`/admin/statistics${query}`);
      setStats(res.statistics ?? res);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoad(false);
    }
  }, [user, filterP, filterC, filterRelT, filterResT]);
 
  useEffect(() => {
    // ✅ Remplace categories.list() → getCategories() (existe dans api.ts)
    getCategories().then(setCatList).catch(console.error);
 
    if (!user) return;
 
    // ✅ Remplace admin.listResources() / moderator.listResources() inexistants
    // → getResources() (existe dans api.ts), retourne les ressources publiques publiées
    // ✅ FIX — condition corrigée : isAdmin au lieu de l'opérateur virgule bugué
    getResources().then((res) => {
      const list = res.data ?? [];
      const relTypes = list
        .map((r: any) => r.relation_type).filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === v.id) === i);
      const resTypes = list
        .map((r: any) => r.resource_type).filter(Boolean)
        .filter((v: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === v.id) === i);
      setRelTL(relTypes);
      setResTypeList(resTypes);
    }).catch(console.error);
  }, [user, isAdmin]);
 
  useEffect(() => {
    if (user) fetchStats();
  }, [user, fetchStats]);
 
  if (loading || !user) return null;
 
  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.pageTitle}>Tableau de bord</h1>
        <p style={s.pageSubtitle}>Vue d&apos;ensemble de l&apos;activité de la plateforme.</p>
 
        <div style={s.filtersBar}>
          <select value={filterP} onChange={(e) => setFilterP(e.target.value)} style={s.filterSelect}>
            <option value="all">Toute la période</option>
            <option value="day">Aujourd&apos;hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <select value={filterC} onChange={(e) => setFilterC(e.target.value)} style={s.filterSelect}>
            <option value="">Toutes les catégories</option>
            {catList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterRelT} onChange={(e) => setFilterRelT(e.target.value)} style={s.filterSelect}>
            <option value="">Tous les types de relation</option>
            {relTL.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={filterResT} onChange={(e) => setFilterResT(e.target.value)} style={s.filterSelect}>
            <option value="">Tous les types de ressource</option>
            {resTL.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={fetchStats} style={{ ...s.filterSelect, background: '#5BA4CF', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Actualiser
          </button>
        </div>
 
        {statsLoading ? (
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>Chargement des statistiques…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
            {STAT_CARDS.map(({ key, label, style }) => (
              <div key={key} style={style}>
                <div style={s.statLabel}>{label}</div>
                <div style={s.statValue}>{stats ? (stats as any)[key] ?? 0 : '—'}</div>
              </div>
            ))}
          </div>
        )}
 
        {!statsLoading && stats && (
          <>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Visualisation</h2>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
                {STAT_CARDS.map(({ key, label, style }) => {
                  const val = (stats as any)[key] ?? 0;
                  const max = Math.max(...STAT_CARDS.map(({ key: k }) => (stats as any)[k] ?? 0), 1);
                  const pct = Math.round((val / max) * 100);
                  const color = (style as any).borderLeftColor ?? '#5BA4CF';
                  return (
                    <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>{val}</span>
                      <div style={{ width: '100%', height: `${Math.max(pct, 4)}%`, background: color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', minHeight: 4 }} />
                      <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.3 }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
 
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Récapitulatif</h2>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>Indicateur</th>
                <th style={s.th}>Valeur</th>
                <th style={s.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {STAT_CARDS.map(({ key, label }) => (
                <tr key={key}>
                  <td style={{ ...s.td, fontWeight: 500 }}>{label}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...s.badgeValidated }}>{stats ? (stats as any)[key] ?? 0 : '—'}</span>
                  </td>
                  <td style={s.tdMuted}>
                    {key === 'creations' && 'Total des ressources créées'}
                    {key === 'resources_published' && 'Ressources validées et visibles publiquement'}
                    {key === 'resources_pending' && 'Ressources en attente de modération'}
                    {key === 'commentaires' && 'Total des commentaires postés'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {/* ✅ FIX — pending_ressources → resources_pending (clé exacte de AdminController) */}
        {stats && stats.resources_pending > 0 && (
          <div style={{ background: '#fef9e0', border: '1px solid #F5E497', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#7a6200', fontFamily: "'Poppins', sans-serif", fontSize: 14 }}>
                {stats.resources_pending} ressource{stats.resources_pending > 1 ? 's' : ''} en attente
              </p>
              <p style={{ margin: '2px 0 0', color: '#9a7a00', fontSize: 13 }}>Des ressources nécessitent votre validation.</p>
            </div>
            <a href="/admin/moderation" style={{ background: '#7a6200', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}>
              Voir la modération →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}