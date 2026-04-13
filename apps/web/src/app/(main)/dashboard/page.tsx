'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getProgression,
  removeFavorite,
  markExploited,
  markSetAside,
  Resource,
} from '@/lib/api';
import s from '@/style/dashboardStyle';
import ResourceCard from '@/components/layout/RessourceCard';
 
function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}
 
function EmptyState({ label }: { label: string }) {
  return (
    <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic', padding: '16px 0' }}>
      {label}
    </p>
  );
}
 
export default function DashboardPage() {
  const { user, loading } = useAuth();
 
  const [favoriteList, setFavoriteList] = useState<Resource[]>([]);
  const [exploitedList, setExploitedList] = useState<Resource[]>([]);
  const [asideList, setAsideList] = useState<Resource[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
 
  const fetchAll = useCallback(async () => {
    try {
      // ✅ getProgression() → GET /progression
      // ProgressionController.index() retourne :
      // { favorites: [...], exploited: [...], set_aside: [...] }
      // Chaque entrée de favorites/exploited/set_aside contient un objet
      // { ..., resource: { id, title, content, ... } }
      const res: any = await getProgression();
 
      // Extraction des ressources depuis res.favorites
      const favRaw: any[] = Array.isArray(res.favorites) ? res.favorites : [];
      setFavoriteList(favRaw.map((f) => f.resource).filter(Boolean));
 
      // Extraction depuis res.exploited — on injecte progression_status pour les filtres
      const exploitedRaw: any[] = Array.isArray(res.exploited)
        ? res.exploited
        : Object.values(res.exploited ?? {});
      setExploitedList(
        exploitedRaw
          .map((p) => p.resource ? { ...p.resource, progression_status: 'exploited' } : null)
          .filter(Boolean) as Resource[]
      );
 
      // Extraction depuis res.set_aside
      const asideRaw: any[] = Array.isArray(res.set_aside)
        ? res.set_aside
        : Object.values(res.set_aside ?? {});
      setAsideList(
        asideRaw
          .map((p) => p.resource ? { ...p.resource, progression_status: 'set_aside' } : null)
          .filter(Boolean) as Resource[]
      );
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  }, []);
 
  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);
 
  async function handleRemoveFavorite(resourceId: number) {
    try {
      // ✅ removeFavorite() existe dans api.ts → DELETE /resources/{id}/favorite
      await removeFavorite(resourceId);
      setFavoriteList((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (e) { console.error(e); }
  }
 
  async function handleUnexploit(resourceId: number) {
    try {
      // ✅ markSetAside() existe dans api.ts → POST /resources/{id}/set-aside
      await markSetAside(resourceId);
      const item = exploitedList.find((r) => r.id === resourceId);
      if (item) {
        setExploitedList((prev) => prev.filter((r) => r.id !== resourceId));
        setAsideList((prev) => [...prev, item]);
      }
    } catch (e) { console.error(e); }
  }
 
  async function handleCancelAside(resourceId: number) {
    try {
      // ✅ markExploited() existe dans api.ts → POST /resources/{id}/exploit
      await markExploited(resourceId);
      const item = asideList.find((r) => r.id === resourceId);
      if (item) {
        setAsideList((prev) => prev.filter((r) => r.id !== resourceId));
        setExploitedList((prev) => [...prev, item]);
      }
    } catch (e) { console.error(e); }
  }
 
  if (loading || !user) return <div style={s.loadingScreen}>Chargement…</div>;
 
  const btnRemoveFavorite: React.CSSProperties = {
    fontSize: '0.75rem', color: '#8b1a1a', background: '#fde8e8',
    border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
  };
  const btnUnexploit: React.CSSProperties = {
    fontSize: '0.75rem', color: '#7a6200', background: '#fef9e0',
    border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
  };
  const btnCancelAside: React.CSSProperties = {
    fontSize: '0.75rem', color: '#1a5c1e', background: '#dcf5e0',
    border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
  };
 
  return (

      <main style={s.page}>
 
        <h1 style={s.greeting}>Bonjour, {user.name}</h1>
        <p style={s.greetingSub}>Voici un aperçu de votre activité sur la plateforme.</p>
 
        {/* Compteurs visuels */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Favoris</div>
            <div style={s.statValue}>{favoriteList.length}</div>
          </div>
          <div style={{ ...s.statCard, ...s.statCardAccent }}>
            <div style={s.statLabel}>Exploitées</div>
            <div style={s.statValue}>{exploitedList.length}</div>
          </div>
          <div style={{ ...s.statCard, ...s.statCardYellow }}>
            <div style={s.statLabel}>Mises de côté</div>
            <div style={s.statValue}>{asideList.length}</div>
          </div>
        </div>
 
        {/* Section Favoris */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Mes favoris</h2>
          <span style={{ ...s.badge, ...s.badgeValidated }}>{favoriteList.length}</span>
        </div>
        <div style={s.resourceList}>
          {dataLoading ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Chargement…</p>
          ) : favoriteList.length === 0 ? (
            <EmptyState label="Aucune ressource en favori pour le moment." />
          ) : (
            favoriteList.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                actionLabel="Retirer"
                actionStyle={btnRemoveFavorite}
                onAction={handleRemoveFavorite}
              />
            ))
          )}
        </div>
 
        {/* Section Ressources exploitées */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Ressources exploitées</h2>
          <span style={{ ...s.badge, ...s.badgeValidated }}>{exploitedList.length}</span>
        </div>
        <div style={s.resourceList}>
          {dataLoading ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Chargement…</p>
          ) : exploitedList.length === 0 ? (
            <EmptyState label="Aucune ressource exploitée pour le moment." />
          ) : (
            exploitedList.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                actionLabel="Marquer non exploitée"
                actionStyle={btnUnexploit}
                onAction={handleUnexploit}
              />
            ))
          )}
        </div>
 
        {/* Section Mises de côté */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Mises de côté</h2>
          <span style={{ ...s.badge, ...s.badgePending }}>{asideList.length}</span>
        </div>
        <div style={s.resourceList}>
          {dataLoading ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Chargement…</p>
          ) : asideList.length === 0 ? (
            <EmptyState label="Aucune ressource mise de côté pour le moment." />
          ) : (
            asideList.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                actionLabel="Annuler"
                actionStyle={btnCancelAside}
                onAction={handleCancelAside}
              />
            ))
          )}
        </div>
 
        <blockquote style={s.quote}>
          Mieux comprendre les autres, c&apos;est déjà mieux vivre ensemble.
        </blockquote>
 
      </main>
  );
}