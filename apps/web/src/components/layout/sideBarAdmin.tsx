"use client";
 
import Link from "next/link";
import { sidebarAdminS, tokens } from "@/style/navAdminStyle";
 
const SECTIONS = [
  {
    label: "Navigation",
    links: [
      { href: "/administration",             label: "Accueil",      icon: "🏠", badge: null },
      { href: "/administration/ressources",  label: "Ressources",   icon: "📚", badge: null },
      { href: "/administration/stats",       label: "Statistiques", icon: "📊", badge: null },
    ],
  },
  {
    label: "Gestion",
    links: [
      { href: "/administration/utilisateur", label: "Utilisateurs", icon: "👥", badge: { text: "12", color: tokens.colors.vertVitalite } },
      { href: "/administration/moderation",  label: "Modération",   icon: "🛡️", badge: { text: "3",  color: tokens.colors.jauneRelation } },
    ],
  },
];
 
export default function SidebarAdmin() {
  return (
    <aside style={sidebarAdminS.aside}>
 
      {/* ── En-tête sidebar ────────────────────────────────────────────────── */}
      <div style={sidebarAdminS.header}>
        <div style={sidebarAdminS.headerTitle}>Espace Admin</div>
        <div style={sidebarAdminS.headerSub}>Mode administration</div>
      </div>
 
      {/* ── Sections ───────────────────────────────────────────────────────── */}
      {SECTIONS.map((section, si) => (
        <div key={si} style={sidebarAdminS.section}>
 
          <div style={sidebarAdminS.sectionLabel}>{section.label}</div>
 
          {section.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={sidebarAdminS.link()}
              className="sidebar-admin-link"
            >
              <span style={sidebarAdminS.iconWrap}>{link.icon}</span>
              <span style={{
                fontFamily: tokens.fonts.body,
                fontSize:   14,
                fontWeight: 700,
              }}>
                {link.label}
              </span>
              {link.badge && (
                <span style={sidebarAdminS.badge(link.badge.color)}>
                  {link.badge.text}
                </span>
              )}
            </Link>
          ))}
 
          {si < SECTIONS.length - 1 && <div style={sidebarAdminS.divider} />}
        </div>
      ))}
 
      {/* ── Citation inspirante ─────────────────────────────────────────────── */}
      <div style={sidebarAdminS.footer}>
        <div style={sidebarAdminS.quoteBox}>
          <p style={sidebarAdminS.quoteText}>
            « Mieux comprendre les autres, c&apos;est déjà mieux vivre ensemble. »
          </p>
        </div>
      </div>
    </aside>
  );
}