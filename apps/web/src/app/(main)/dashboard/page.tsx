'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useRequireAuth } from '@/context/AuthContext';
import { auth, favorites, progression, Resource } from '@/lib/api';
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
  const { user, loading, isAuthenticated } = useRequireAuth();
 
  const [favoriteList, setFavoriteList] = useState<Resource[]>([]);
  const [exploitedList, setExploitedList] = useState<Resource[]>([]);
  const [asideList, setAsideList] = useState<Resource[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
 
  const fetchAll = useCallback(async () => {
    try {
      const [progRes, favRes] = await Promise.all([
        progression.list(),
        favorites,
      ]);

      const favList = Array.isArray(favRes) ? favRes : (favRes as any).data ?? [];
      setFavoriteList(favList);  // ← ajoute

      const progList: any[] = Array.isArray(progRes) ? progRes : (progRes as any).data ?? [];
      setExploitedList(progList.filter((r) => r.progression_status === 'exploited' || r.pivot?.status === 'exploited'));
      setAsideList(progList.filter((r) => r.progression_status === 'set_aside' || r.pivot?.status === 'set_aside'));
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  }, []);;
 
  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);
 
  async function handleRemoveFavorite(resourceId: number) {
    try {
      await favorites.remove(resourceId);
      setFavoriteList((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (e) { console.error(e); }
  }
 
  async function handleUnexploit(resourceId: number) {
    try {
      await progression.setAside(resourceId);
      const item = exploitedList.find((r) => r.id === resourceId);
      if (item) {
        setExploitedList((prev) => prev.filter((r) => r.id !== resourceId));
        setAsideList((prev) => [...prev, item]);
      }
    } catch (e) { console.error(e); }
  }
 
  async function handleCancelAside(resourceId: number) {
    try {
      await progression.exploit(resourceId);
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
      isAuthenticated ? 
      (
        <div style={{ background: '#F6F7F9', minHeight: '100vh' }}>
          {/* Navbar */}
          <nav style={s.navbar}>
            <span style={s.navBrand}>Ressources+</span>
            <div style={s.navRight}>
              <div style={s.avatar}>{getInitials(user.name)}</div>
              <span style={s.navUserName}>{user.name}</span>
            </div>
          </nav>
    
          <main style={s.page}>
    
            {/* Greeting */}
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
    
           { /* Section Favoris */}
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
    
           { /* Section Mises de côté */}
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
    
            {/* Citation */}
            <blockquote style={s.quote}>
              Mieux comprendre les autres, c&apos;est déjà mieux vivre ensemble.
            </blockquote>
    
          </main>
        </div>
      )
      :
      (
        ""
      )
      
  );
}