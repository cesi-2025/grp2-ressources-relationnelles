'use client';
 
import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/context/AuthContext';
import { resources, progression, Resource } from '@/lib/api';
import s from '@/style/dashboardStyle';
import { useRouter } from 'next/navigation';
 
 
function StatusBadge({ status }: { status: Resource['status'] }) {
  const map = {
    validated: { label: 'Validée',    extra: s.badgeValidated },
    pending:   { label: 'En attente', extra: s.badgePending },
    suspended: { label: 'Suspendue',  extra: s.badgeSuspended },
  };
  const { label, extra } = map[status];
  return <span style={{ ...s.badge, ...extra }}>{label}</span>;
}
 
export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const router = useRouter()
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [progressionList, setProgressionList] = useState<Resource[]>([]);
 
  useEffect(() => {
    if (loading || user && user.role !== "citoyen") router.replace("/administration");
  }, [user,loading,router])

  useEffect(() => {
    if (loading || !user) return;
    resources.list().then((res: any) => setMyResources(Array.isArray(res) ? res : res.data ?? [])).catch(console.error);
    progression.list().then((res: any) => setProgressionList(Array.isArray(res) ? res : res.data ?? [])).catch(console.error)
  }, [user, loading]);
 
 
  return (
    <>
      <main style={s.page}>
        <h1 style={s.greeting}>Bonjour, {user.name}</h1>
        <p style={s.greetingSub}>Voici un aperçu de votre activité sur la plateforme.</p>
 
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Ressources publiées</div>
            <div style={s.statValue}>{myResources.length}</div>
          </div>
          <div style={{ ...s.statCard, ...s.statCardAccent }}>
            <div style={s.statLabel}>En progression</div>
            <div style={s.statValue}>{progressionList.length}</div>
          </div>
          <div style={{ ...s.statCard, ...s.statCardYellow }}>
            <div style={s.statLabel}>Validées</div>
            <div style={s.statValue}>
              {myResources.length != 0 ? (myResources.filter((r) => r.status === 'validated').length):([])}
              {}
            </div>
          </div>
        </div>
 
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Mes ressources</h2>
          <button style={s.btnNew}>+ Nouvelle ressource</button>
        </div>
 
        <div style={s.resourceList}>
          {myResources.map((r) => (
            <div key={r.id} style={s.resourceCard}>
              <div>
                <p style={s.resourceTitle}>{r.title}</p>
                <p style={s.resourceMeta}>
                  {new Date(r.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div style={s.resourceActions}>
                <StatusBadge status={r.status} />
                <button style={s.btnEdit}>Modifier</button>
              </div>
            </div>
          ))}
        </div>
 
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Ma progression</h2>
        </div>
 
        <div style={s.progressGrid}>
          {progressionList.map((r) => (
            <div key={r.id} style={s.progressCard}>
              <p style={s.progressTitle}>{r.title}</p>
              <p style={s.progressCat}>En cours</p>
              <div style={s.progressBarBg}>
                <div style={{ ...s.progressBarFill, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
 
        <blockquote style={s.quote}>
          Mieux comprendre les autres, c&apos;est déjà mieux vivre ensemble.
        </blockquote>
      </main>
    </>
  );
}