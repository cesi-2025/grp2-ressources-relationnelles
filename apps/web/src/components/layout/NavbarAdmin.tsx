"use client";
 
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { navbarAdminS, responsiveCss } from "@/style/navAdminStyle";
import { useAuth } from "@/contexts/AuthContext";
 
export default function NavbarAdmin() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
 
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
 
  return (
    <>
      <nav style={navbarAdminS.nav}>
        <div style={navbarAdminS.inner}>
 
          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/administration" style={navbarAdminS.logoWrap}>
            <div style={navbarAdminS.logoIcon}>MA</div>
            <div>
              <span style={navbarAdminS.logoText}>Harmonie</span>
              <span style={navbarAdminS.logoAccent}>Espace relationnel</span>
            </div>
          </Link>
 
          {/* ── Badge Administration ──────────────────────────────────────── */}
          <span style={navbarAdminS.adminBadge}>Administration</span>
 
          <div style={navbarAdminS.spacer} />
 
          {/* ── Auth ─────────────────────────────────────────────────────── */}
          <div style={navbarAdminS.authWrap} className="navbar-admin-auth">
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {user.role}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      style={{
                        ...navbarAdminS.btnOutline,
                        opacity: isLoggingOut ? 0.6 : 1,
                        cursor: isLoggingOut ? "not-allowed" : "pointer",
                      }}
                      className="btn-admin-outline"
                    >
                      {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/auth/connexion" style={navbarAdminS.btnOutline} className="btn-admin-outline">
                      Connexion
                    </Link>
                    <Link href="/auth/inscription" style={navbarAdminS.btnPrimary} className="btn-admin-primary">
                      Inscription
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
 
          {/* ── Burger mobile ─────────────────────────────────────────────── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            style={navbarAdminS.burger(isMenuOpen)}
            className="navbar-admin-burger"
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#5BA4CF" strokeWidth={2.5}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
 
        {/* ── Mobile menu ───────────────────────────────────────────────────── */}
        {isMenuOpen && (
          <div style={navbarAdminS.mobileMenu}>
            <div style={navbarAdminS.mobileAuthRow}>
              {!loading && (
                <>
                  {isAuthenticated && user ? (
                    <>
                      <div style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {user.role}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        style={{
                          ...navbarAdminS.btnOutline,
                          opacity: isLoggingOut ? 0.6 : 1,
                          cursor: isLoggingOut ? "not-allowed" : "pointer",
                          width: "100%",
                        }}
                        className="btn-admin-outline"
                      >
                        {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/connexion" style={navbarAdminS.btnOutline} className="btn-admin-outline">
                        Connexion
                      </Link>
                      <Link href="/auth/inscription" style={navbarAdminS.btnPrimary} className="btn-admin-primary">
                        Inscription
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
 
      <style>{responsiveCss}</style>
    </>
  );
}