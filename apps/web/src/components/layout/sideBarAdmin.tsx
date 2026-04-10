"use client";
 
import Link from "next/link";
import { sidebarAdminS, tokens } from "@/style/navAdminStyle";
import { useAuth } from "@/context/AuthContext";
 
const SECTIONS = [
  {
    label: "Navigation",
    role:["admin", "moderateur", "super_admin"],
    links: [ 
      { href: "/administration",            role:["admin", "moderateur", "super_admin"],   label: "Accueil",      icon: "🏠", badge: null },
      { href: "/administration/ressources", role:["admin", "moderateur", "super_admin"],  label: "Ressources",   icon: "📚", badge: null },
      { href: "/administration/stats",      role:["admin", "moderateur", "super_admin"],  label: "Statistiques", icon: "📊", badge: null },
      { href: "/administration/stats",      role:["admin"],  label: "Statistiques", icon: "📊", badge: null },
    ],
  },
  {
    label: "Gestion",
    role:["moderateur", "super_admin"],
    links: [
      { href: "/administration/utilisateur", role:["super_admin"], label: "Utilisateurs", icon: "👥", badge: { text: "12", color: tokens.colors.vertVitalite } },
      { href: "/administration/moderation",  role:["moderateur"], label: "Modération",   icon: "🛡️", badge: { text: "3",  color: tokens.colors.jauneRelation } },
    ],
  },
];
 
export default function SidebarAdmin() {
  const {user} = useAuth()

  return (
    <aside style={sidebarAdminS.aside}>
 
      {/* ── En-tête sidebar ────────────────────────────────────────────────── */}
      <div style={sidebarAdminS.header}>
        <div style={sidebarAdminS.headerTitle}>Espace Admin</div>
        <div style={sidebarAdminS.headerSub}>Mode administration</div>
      </div>
 
      {/* ── Sections ───────────────────────────────────────────────────────── */}
      {SECTIONS.map((section, si) => (
        section.role.includes(user?.role) ? (
          <div key={si} style={sidebarAdminS.section}>
                  
                    <div style={sidebarAdminS.sectionLabel}>{section.label}</div>
                    
                    {section.links.map((link) => (
                      link.role.includes(user?.role) ?(
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
                      )
                      :
                      (
                        ""
                      )
                    ))}
            {si < SECTIONS.length - 1 && <div style={sidebarAdminS.divider} />}
          </div>
        )
        :
        ("")
        
 
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