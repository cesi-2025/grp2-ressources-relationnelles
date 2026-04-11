"use client";
 
import Link from "next/link";
import { sidebarAdminS, tokens } from "@/style/admin/navAdminStyle";
import { useAuth } from "@/context/AuthContext";
import HomePicture from "@/style/picture/home.png"
import RessourcesPicture from "@/style/picture/options.png"
import StatsPicture from "@/style/picture/pie-chart.png"
import CategoriePicture from "@/style/picture/menu.png"
import UserPicture from "@/style/picture/team.png"
import ModerationPicture from "@/style/picture/moderator.png"
import Image from "next/image";

const SECTIONS = [
  {
    label: "Navigation",
    role:["admin", "moderator", "super_admin"],
    links: [ 
      { href: "/administration",            role:["admin", "moderator", "super_admin"],   label: "Accueil",      icon: HomePicture, badge: null },
      { href: "/administration/ressources", role:["admin", "moderator"],  label: "Ressources",   icon: RessourcesPicture, badge: null },
      { href: "/administration/stats",      role:["admin", "moderator", "super_admin"],  label: "Statistiques", icon: StatsPicture, badge: null },
      { href: "/administration/categorie",      role:["admin"],  label: "Categorie", icon: CategoriePicture, badge: null },
    ],
  },
  {
    label: "Gestion",
    role:["moderator", "super_admin"],
    links: [
      { href: "/administration/utilisateur", role:["super_admin"], label: "Utilisateurs", icon: UserPicture, badge: null },
      { href: "/administration/moderation",  role:["moderator"], label: "Modération",   icon: ModerationPicture, badge: null },
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
                          <span style={sidebarAdminS.iconWrap}><Image src={link.icon} alt="App Icon" width={25} height={25} /></span>
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