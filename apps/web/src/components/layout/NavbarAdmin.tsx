"use client";
 
import Link from "next/link";
import { useState } from "react";
import { navbarAdminS, responsiveCss } from "@/style/admin/navAdminStyle";
import { useAuth } from "@/context/AuthContext";

const data_admin_tab = {
  "admin": "Administration",
  "moderator": "Modération",
  "super_admin": "Super Administrateur"
}

 
export default function NavbarAdmin() {
  const {logout} = useAuth()
  const { user, loading, isAuthenticated} = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  if(loading) return null;
  return (
    <>
      <nav style={navbarAdminS.nav}>
        <div style={navbarAdminS.inner}>
 
          <Link href="/admin" style={navbarAdminS.logoWrap}>
            <div style={navbarAdminS.logoIcon}>MA</div>
            <div>
              <span style={navbarAdminS.logoText}>Harmonie</span>
              <span style={navbarAdminS.logoAccent}>Espace relationnel</span>
            </div>
          </Link>
 
          <span style={navbarAdminS.adminBadge}>{user?.role in data_admin_tab? data_admin_tab[user?.role] : ""}</span>
 
          <div style={navbarAdminS.spacer} />
 
          {isAuthenticated ? (
            <div style={navbarAdminS.authWrap} className="navbar-admin-auth">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {user?.email}
                  </div>
                </div>
                <div style={{ width: 1, height: 32, background: '#e2e5ea' }} />

                <button
                  type="button"
                  onClick={() => { if (confirm('Voulez-vous vraiment vous déconnecter ?')) logout(); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 13,
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontFamily: "'Open Sans', sans-serif",
                    whiteSpace: 'nowrap',
                  }}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ):
          (
            <div style={navbarAdminS.authWrap} className="navbar-admin-auth">
              <Link href="/auth/connexion" style={navbarAdminS.btnOutline} className="btn-admin-outline">
                Connexion
              </Link>
              <Link href="/auth/inscription" style={navbarAdminS.btnPrimary} className="btn-admin-primary">
                Inscription
              </Link>
            </div>
          )}
          
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
 
        {isMenuOpen && (
          <div style={navbarAdminS.mobileMenu}>
            <div style={navbarAdminS.mobileAuthRow}>
              <Link href="/auth/connexion" style={navbarAdminS.btnOutline} className="btn-admin-outline">
                Connexion
              </Link>
              <Link href="/auth/inscription" style={navbarAdminS.btnPrimary} className="btn-admin-primary">
                Inscription
              </Link>
            </div>
          </div>
        )}
      </nav>
 
      <style>{responsiveCss}</style>
    </>
  );
}