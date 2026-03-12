"use client";
 
import Link from "next/link";
import { useState } from "react";
import { navbarAdminS, responsiveCss } from "@/style/navAdminStyle";
 
export default function NavbarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
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
            <Link href="/auth/connexion" style={navbarAdminS.btnOutline} className="btn-admin-outline">
              Connexion
            </Link>
            <Link href="/auth/inscription" style={navbarAdminS.btnPrimary} className="btn-admin-primary">
              Inscription
            </Link>
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