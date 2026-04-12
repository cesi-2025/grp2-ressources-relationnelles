'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useRequireAdmin, useAuth } from '@/context/AuthContext';
import { moderator as moderationApi, admin, Resource } from '@/lib/api';
import ResourceTable from '@/components/moderation/ressourceTable';
import CommentTable from '@/components/moderation/commentTable';
import ConfirmModal from '@/components/moderation/confirmModal';
import ms from '@/style/admin/dashboardAdminStyle';
import mbs from '@/style/admin/moderatorButtonStyle';
 
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
  const  [table, setTable]  = useState("resource")
  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [resLoad, setResLoad] = useState(true);
  const [comLoad, setComLoad] = useState(true);
 
  const [confirmModal, setConfirmModal] = useState<{
    type: ConfirmType;
    id: number;
    label: string;
  } | null>(null);
  const [acting, setActing] = useState(false);
 
  const fetchResources = useCallback(async () => {
    setResLoad(true);
    try {
      const endpoint = isModerator
        ? moderationApi.listResources({ status: 'pending' })
        : admin.listResources({ status: 'pending' });
      const res: any = await endpoint;
      setResources(Array.isArray(res) ? res : res.data ?? []);
    } catch (e) { console.error(e); }
    finally { setResLoad(false); }
  }, [isModerator]);
 
  const fetchComments = useCallback(async () => {
    setComLoad(true);
    try {
      const res: any = await moderationApi.listComments();
      setComments(Array.isArray(res) ? res : res.data ?? []);
    } catch (e) { console.error(e); }
    finally { setComLoad(false); }
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
    <div style={ms.page}>
      <div style={ms.container}>
      <div style={ms.tabBar}>
          <button
            style={{ ...mbs.tab, ...(table === "resource" ? mbs.tabActive : {}) }}
            onClick={() => setTable("resource")}
          >
            Ressources {resources.length > 0 && `(${resources.length})`}
          </button>
          <button
            style={{ ...mbs.tab, ...(table === "comments" ? mbs.tabActive : {}) }}
            onClick={() => setTable("comments")}
          >
            Commentaires {comments.filter(c => !c.is_approved).length > 0 && `(${comments.filter(c => !c.is_approved).length})`}
          </button>
        </div>
        <h1 style={ms.pageTitle}>Modération</h1>
        <p style={ms.pageSubtitle}>Validez ou refusez les ressources et commentaires en attente.</p>
        {table === "resource"? 
          (
            <>
            <div style={ms.sectionHeader}>
              <h2 style={ms.sectionTitle}>Ressources en attente</h2>
              <span style={{ ...ms.badge, ...ms.badgePending }}>{resources.length}</span>
            </div>

            <ResourceTable
              resources={resources}
              loading={resLoad}
              onValidate={(id: any, title: any) => setConfirmModal({ type: 'validate', id, label: `Valider "${title}" ?` })}
              onRefuse={(id: any, title: any) => setConfirmModal({ type: 'refuse', id, label: `Refuser "${title}" ?` })}
            />
            </>
          )
          :
          (
            <>
              <div style={{ ...ms.sectionHeader, marginTop: 8 }}>
                <h2 style={ms.sectionTitle}>Commentaires à modérer</h2>
                <span style={{ ...ms.badge, ...ms.badgePending }}>
                  {comments.filter((c) => !c.is_approved).length}
                </span>
              </div>
              <CommentTable
                comments={comments}
                loading={comLoad}
                onApprove={(id) => setConfirmModal({ type: 'approve-comment', id, label: 'Approuver ce commentaire ?' })}
                onDelete={(id) => setConfirmModal({ type: 'delete-comment', id, label: 'Supprimer ce commentaire définitivement ?' })}
              />
            </>
          )
        }
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