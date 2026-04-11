'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useRequireAdmin, useAuth } from '@/context/AuthContext';
import { moderator as moderationApi, admin, Resource } from '@/lib/api';
import ResourceTable from '@/components/moderation/ressourceTable';
import CommentTable from '@/components/moderation/commentTable';
import ConfirmModal from '@/components/moderation/confirmModal';
import s from '@/style/admin/dashboardAdminStyle';
 
type ConfirmType = 'validate' | 'refuse' | 'approve-comment' | 'delete-comment';
 
interface CommentItem {
  id: number;
  content: string;
  is_approved: boolean;
  created_at: string;
  user?: { name?: string };
}
 
export default function ModerationPage() {
  const { user, loading } = useRequireAdmin();
  const { isModerator } = useAuth();
 
  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [comLoading, setComLoading] = useState(true);
 
  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmType;
    id: number;
    label: string;
  } | null>(null);
  const [acting, setActing] = useState(false);
 
  const fetchResources = useCallback(async () => {
    setResLoading(true);
    try {
      const endpoint = isModerator
        ? moderationApi.listResources({ status: 'pending' })
        : admin.listResources({ status: 'pending' });
      const res: any = await endpoint;
      setResources(Array.isArray(res) ? res : res.data ?? []);
    } catch (e) { console.error(e); }
    finally { setResLoading(false); }
  }, [isModerator]);
 
  const fetchComments = useCallback(async () => {
    setComLoading(true);
    try {
      const res: any = await moderationApi.listComments();
      setComments(Array.isArray(res) ? res : res.data ?? []);
    } catch (e) { console.error(e); }
    finally { setComLoading(false); }
  }, []);
 
  useEffect(() => {
    if (user) { fetchResources(); fetchComments(); }
  }, [user, fetchResources, fetchComments]);
 
  async function handleConfirm() {
    if (!confirmModal) return;
    setActing(true);
    try {
      const { type, id } = confirmModal;
      if (type === 'validate') {
        await moderationApi.validateResource(id);
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else if (type === 'refuse') {
        await admin.suspendResource(id);
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else if (type === 'approve-comment') {
        await moderationApi.approveComment(id);
        setComments((prev) => prev.map((c) => c.id === id ? { ...c, is_approved: true } : c));
      } else if (type === 'delete-comment') {
        await moderationApi.deleteComment(id);
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
      setConfirmModal(null);
    } catch (e) { console.error(e); }
    finally { setActing(false); }
  }
 
  if (loading || !user) return null;
 
  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.pageTitle}>Modération</h1>
        <p style={s.pageSubtitle}>Validez ou refusez les ressources et commentaires en attente.</p>
 
        {/* Ressources en attente */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Ressources en attente</h2>
          <span style={{ ...s.badge, ...s.badgePending }}>{resources.length}</span>
        </div>
        <ResourceTable
          resources={resources}
          loading={resLoading}
          onValidate={(id: any, title: any) => setConfirmModal({ type: 'validate', id, label: `Valider "${title}" ?` })}
          onRefuse={(id: any, title: any) => setConfirmModal({ type: 'refuse', id, label: `Refuser "${title}" ?` })}
        />
 
        {/* Commentaires à modérer */}
        <div style={{ ...s.sectionHeader, marginTop: 8 }}>
          <h2 style={s.sectionTitle}>Commentaires à modérer</h2>
          <span style={{ ...s.badge, ...s.badgePending }}>
            {comments.filter((c) => !c.is_approved).length}
          </span>
        </div>
        <CommentTable
          comments={comments}
          loading={comLoading}
          onApprove={(id) => setConfirmModal({ type: 'approve-comment', id, label: 'Approuver ce commentaire ?' })}
          onDelete={(id) => setConfirmModal({ type: 'delete-comment', id, label: 'Supprimer ce commentaire définitivement ?' })}
        />
      </div>
 
      {confirmModal && (
        <ConfirmModal
          label={confirmModal.label}
          type={confirmModal.type}
          acting={acting}
          onConfirm={handleConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}