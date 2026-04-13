"use client";
 
import { useState } from "react";
import { ResourceItem } from "@/data/resources";
import { Comment, PENDING_RESOURCES, INITIAL_COMMENTS } from "@/data/moderation";
import { Badge } from "@/components/ui/moderation/uiModeration";
import PendingResourceCard from "@/components/moderation/carteResourcePendu";
import CommentRow          from "@/components/moderation/montreCommentaire";
import ConfirmModal        from "./confirmation";
import EditCommentModal    from "./modification";
 
type Tab = "resources" | "comments";
 
export default function ModerationPage() {
  const [tab, setTab] = useState<Tab>("resources");
 
  // Variable pour la gestion des ressource
  const [pending, setPending] = useState<ResourceItem[]>(PENDING_RESOURCES);
  const [rejected, setRejected] = useState<number[]>([]);
  const [resourceConfirm, setResourceConfirm] = useState<{ id: number; action: "approve" | "reject" } | null>(null);
 
  //  Variable pour la gestion des commantaires
  const [comments, setComments]       = useState<Comment[]>(INITIAL_COMMENTS);
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [editComment, setEditComment]     = useState<Comment | null>(null);
  const [deleteComment, setDeleteComment] = useState<Comment | null>(null);
 
  const flaggedCount    = comments.filter((c) => c.flagged).length;
  const visibleComments = filterFlagged ? comments.filter((c) => c.flagged) : comments;
 
  // Gestion des Commentaires
  function approveResource(id: number) {
    setPending((prev) => prev.filter((r) => r.id !== id));
    setResourceConfirm(null);
  }
 
  function rejectResource(id: number) {
    setRejected((prev) => [...prev, id]);
    setPending((prev) => prev.filter((r) => r.id !== id));
    setResourceConfirm(null);
  }
 
  // Prise en chage de la sauvegarde et suppression de commentaire
  function saveComment(id: number, content: string) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, content } : c)));
    setEditComment(null);
  }
 
  function deleteCommentById(id: number) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleteComment(null);
  }
 
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "var(--font-sans)" }}>
 
 
      {/* ── Contenu ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setTab("resources")}
            type="button"
            aria-pressed={tab === "resources"}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: tab === "resources" ? "2px solid #2563eb" : "2px solid #e2e8f0",
              background: tab === "resources" ? "#eff6ff" : "#fff",
              color: tab === "resources" ? "#1d4ed8" : "#334155",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ressources
          </button>
          <button
            onClick={() => setTab("comments")}
            type="button"
            aria-pressed={tab === "comments"}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: tab === "comments" ? "2px solid #2563eb" : "2px solid #e2e8f0",
              background: tab === "comments" ? "#eff6ff" : "#fff",
              color: tab === "comments" ? "#1d4ed8" : "#334155",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Commentaires
          </button>
        </div>
 
        {/* ── TAB : Ressources ──────────────────────────────────────────────── */}
        {tab === "resources" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                  Ressources en attente de validation
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                  Examinez chaque ressource avant publication.
                </p>
              </div>
              {rejected.length > 0 && (
                <Badge label={`${rejected.length} refusée(s) cette session`} color="red" />
              )}
            </div>
 
            {pending.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>File d&apos;attente vide</h3>
                <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Toutes les ressources ont été traitées.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                {pending.map((r) => (
                  <PendingResourceCard
                    key={r.id}
                    resource={r}
                    onApprove={() => setResourceConfirm({ id: r.id, action: "approve" })}
                    onReject={()  => setResourceConfirm({ id: r.id, action: "reject"  })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* ── TAB : Commentaires ────────────────────────────────────────────── */}
        {tab === "comments" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                  Modération des commentaires
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                  Modifiez ou supprimez les commentaires signalés ou inappropriés.
                </p>
              </div>
 
              <button
                onClick={() => setFilterFlagged((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 10,
                  border: filterFlagged ? "2px solid #fbbf24" : "2px solid #e2e8f0",
                  background: filterFlagged ? "#fffbeb" : "#fff",
                  color: filterFlagged ? "#b45309" : "#475569",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                ⚑ Signalés seulement
                {flaggedCount > 0 && (
                  <span style={{ background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 800, padding: "1px 7px", borderRadius: 20 }}>
                    {flaggedCount}
                  </span>
                )}
              </button>
            </div>
 
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                gap: 16, padding: "10px 20px",
                background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase" }}>Commentaire</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase" }}>Actions</span>
              </div>
 
              {visibleComments.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  Aucun commentaire à afficher.
                </div>
              ) : (
                visibleComments.map((c) => (
                  <CommentRow
                    key={c.id}
                    comment={c}
                    onEdit={()   => setEditComment(c)}
                    onDelete={() => setDeleteComment(c)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
 
      {/* ── Modales ───────────────────────────────────────────────────────────── */}
      {resourceConfirm && (() => {
        const r = pending.find((p) => p.id === resourceConfirm.id)!;
        return (
          <ConfirmModal
            title={`Confirmation pour ${r.title}` }
            message={
              resourceConfirm.action === "approve"
                ? `Approuver la ressource « ${r.title} » et la publier ?`
                : `Refuser et supprimer la ressource « ${r.title} » ?`
            }
            onClose={() => setResourceConfirm(null)}
            onConfirm={() =>
              resourceConfirm.action === "approve"
                ? approveResource(resourceConfirm.id)
                : rejectResource(resourceConfirm.id)
            }
          />
        );
      })()}
 
      {editComment && (
        <EditCommentModal
          comment={editComment}
          onClose={() => setEditComment(null)}
          onSave={(content) => saveComment(editComment.id, content)}
        />
      )}
 
      {deleteComment && (
        <ConfirmModal
          title={"Refuser"}
          message={`Supprimer le commentaire de « ${deleteComment.author} » ? Cette action est irréversible.`}
          onClose={() => setDeleteComment(null)}
          onConfirm={() => deleteCommentById(deleteComment.id)}
        />
      )}
    </div>
  );
}