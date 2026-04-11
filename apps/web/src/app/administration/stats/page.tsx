"use client"
import { USERS } from "@/data/user";
import StatCard from "@/components/tableauDeBord/carteStats";
import BarChart from "@/components/tableauDeBord/barChart";
import DonutChart from "@/components/tableauDeBord/DonutChart";
import DisconnectedTable from "@/components/tableauDeBord/tableDeconecter";
import AdminPanel from "@/components/tableauDeBord/panelAdmin";
import { useRequireAdmin } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
  const totalUsers        = USERS.length;
  const activeUsers       = USERS.filter((u) => u.status === "Actif").length;
  const newThisMonth      = 18;
  const disconnectedUsers = USERS.filter((u) => u.status === "Désactivé" );

  const {user, loading}= useRequireAdmin()
  const router = useRouter()

  useEffect(() => {
    if (loading || user && user.role === "citoyen") router.replace("/dashboard");
  }, [user,loading,router])
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 48 }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
        padding: "32px 40px 40px",
        marginBottom: 32,
      }}>
        <p style={{ margin: "0 0 4px", fontSize: 11, color: "#a5b4fc", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
          Tableau de bord
        </p>
        <h1 style={{ margin: "0 0 28px", fontSize: 26, fontWeight: 800, color: "#fff" }}>
          Administration des utilisateurs
        </h1>

        <div style={{ display: "flex", gap: 16 }}>
          <StatCard label="Total inscrits"      value={totalUsers}               sub="depuis le lancement"          color="#6366f1" icon="👥" />
          <StatCard label="Utilisateurs actifs" value={activeUsers}              sub={`sur ${totalUsers} inscrits`}  color="#10b981" icon="✅" />
          <StatCard label="Nouveaux ce mois"    value={newThisMonth}             sub="en décembre 2026"             color="#f59e0b" icon="🆕" />
          <StatCard label="Désactivé / Archivés" value={disconnectedUsers.length} sub="à surveiller"                 color="#ef4444" icon="⚠️" />
        </div>
      </div>

      <div style={{ padding: "0 40px" }}>

        {/* ── LIGNE 1 : Graphiques ─────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 20, marginBottom: 20 }}>

          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Inscriptions</p>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Utilisateurs inscrits par mois</h2>
            <BarChart />
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Répartition</p>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Catégories de ressources</h2>
            <DonutChart />
          </div>
        </div>

        {/* ── LIGNE 2 : Tableau + Administration ───────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <DisconnectedTable users={disconnectedUsers} />
          <AdminPanel />
        </div>

      </div>
    </div>
  );
}