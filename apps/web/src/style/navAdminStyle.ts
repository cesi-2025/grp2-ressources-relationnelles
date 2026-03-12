import type { CSSProperties } from "react";
 
// ── Design Tokens ─────────────────────────────────────────────────────────────
export const tokens = {
  colors: {
    bleuHarmonie:  "#5BA4CF",
    vertVitalite:  "#9FD8A3",
    jauneRelation: "#F5E497",
    grisNeutre:    "#F6F7F9",
    grisTexte:     "#3A3A3A",
    white:         "#FFFFFF",
    bleuLight:     "#EAF4FB",
    bleuDark:      "#3D7FAB",
    bleuMid:       "#4A90C0",
    borderColor:   "#E2E8EF",
    shadowColor:   "rgba(91,164,207,0.12)",
  },
  fonts: {
    title: "'Poppins', sans-serif",
    body:  "'Open Sans', sans-serif",
    quote: "'Lora', serif",
  },
  transition: "all 0.2s ease",
  radius: { sm: 6, md: 10, lg: 14 },
} as const;
 
// ── NavbarAdmin ───────────────────────────────────────────────────────────────
export const navbarAdminS = {
  nav: {
    position:     "sticky",
    top:          0,
    zIndex:       100,
    background:   tokens.colors.white,
    borderBottom: `2px solid ${tokens.colors.bleuHarmonie}`,
    boxShadow:    `0 2px 16px ${tokens.colors.shadowColor}`,
    fontFamily:   tokens.fonts.body,
  } satisfies CSSProperties,
 
  inner: {
    maxWidth:   1440,
    margin:     "0 auto",
    padding:    "0 32px",
    display:    "flex",
    alignItems: "center",
    height:     64,
    gap:        24,
  } satisfies CSSProperties,
 
  logoWrap: {
    display:        "flex",
    alignItems:     "center",
    gap:            10,
    textDecoration: "none",
    flexShrink:     0,
  } satisfies CSSProperties,
 
  logoIcon: {
    width:          40,
    height:         40,
    borderRadius:   tokens.radius.md,
    background:     `linear-gradient(135deg, ${tokens.colors.bleuHarmonie}, ${tokens.colors.bleuDark})`,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       15,
    fontWeight:     800,
    color:          "#fff",
    letterSpacing:  -0.5,
    flexShrink:     0,
    fontFamily:     tokens.fonts.title,
  } satisfies CSSProperties,
 
  logoText: {
    fontFamily:    tokens.fonts.title,
    fontWeight:    700,
    fontSize:      15,
    color:         tokens.colors.grisTexte,
    letterSpacing: 0.3,
    lineHeight:    1.2,
    display:       "block",
  } satisfies CSSProperties,
 
  logoAccent: {
    color:         tokens.colors.bleuHarmonie,
    display:       "block",
    fontSize:      10,
    fontWeight:    600,
    fontFamily:    tokens.fonts.body,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    marginTop:     1,
  } satisfies CSSProperties,
 
  adminBadge: {
    fontFamily:    tokens.fonts.title,
    fontWeight:    700,
    fontSize:      10,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
    color:         tokens.colors.bleuDark,
    background:    tokens.colors.bleuLight,
    border:        `1px solid ${tokens.colors.bleuHarmonie}`,
    borderRadius:  tokens.radius.sm,
    padding:       "3px 10px",
    flexShrink:    0,
  } satisfies CSSProperties,
 
  spacer: { flex: 1 } satisfies CSSProperties,
 
  navLinks: {
    display:    "flex",
    alignItems: "center",
    gap:        2,
  } satisfies CSSProperties,
 
  // active=true → style actif permanent
  link: (): CSSProperties => ({
    fontFamily:     tokens.fonts.title,
    fontWeight:     700,
    fontSize:       12,
    letterSpacing:  1,
    textTransform:  "uppercase",
    color:          tokens.colors.bleuHarmonie,
    textDecoration: "none",
    padding:        "8px 14px",
    borderRadius:   tokens.radius.sm,
    background:     tokens.colors.bleuLight,
    borderBottom:   `2px solid ${tokens.colors.bleuHarmonie}`,
    transition:     tokens.transition,
    whiteSpace:     "nowrap",
  }),
 
  authWrap: {
    display:    "flex",
    alignItems: "center",
    gap:        10,
    flexShrink: 0,
  } satisfies CSSProperties,
 
  btnOutline: {
    fontFamily:     tokens.fonts.title,
    fontWeight:     700,
    fontSize:       12,
    letterSpacing:  0.8,
    textTransform:  "uppercase" as const,
    color:          tokens.colors.bleuHarmonie,
    background:     "transparent",
    border:         `2px solid ${tokens.colors.bleuHarmonie}`,
    borderRadius:   tokens.radius.sm,
    padding:        "7px 18px",
    cursor:         "pointer",
    transition:     tokens.transition,
    textDecoration: "none",
    display:        "inline-block",
  } satisfies CSSProperties,
 
  btnPrimary: {
    fontFamily:     tokens.fonts.title,
    fontWeight:     700,
    fontSize:       12,
    letterSpacing:  0.8,
    textTransform:  "uppercase" as const,
    color:          "#fff",
    background:     tokens.colors.bleuHarmonie,
    border:         `2px solid ${tokens.colors.bleuHarmonie}`,
    borderRadius:   tokens.radius.sm,
    padding:        "7px 18px",
    cursor:         "pointer",
    transition:     tokens.transition,
    textDecoration: "none",
    display:        "inline-block",
  } satisfies CSSProperties,
 
  burger: (open: boolean): CSSProperties => ({
    display:      "none",
    padding:      8,
    borderRadius: tokens.radius.sm,
    background:   open ? tokens.colors.bleuLight : "transparent",
    border:       `1px solid ${tokens.colors.borderColor}`,
    cursor:       "pointer",
    transition:   tokens.transition,
    flexShrink:   0,
  }),
 
  mobileMenu: {
    borderTop:     "1px solid #E2E8EF",
    background:    tokens.colors.white,
    padding:       "12px 32px 20px",
    display:       "flex",
    flexDirection: "column",
    gap:           4,
  } satisfies CSSProperties,
 
  mobileAuthRow: {
    display:    "flex",
    gap:        10,
    paddingTop: 12,
    borderTop:  `1px solid ${tokens.colors.borderColor}`,
    marginTop:  8,
  } satisfies CSSProperties,
};
 
// ── SidebarAdmin ──────────────────────────────────────────────────────────────
export const sidebarAdminS = {
  aside: {
    width:         260,
    minHeight:     "100vh",
    background:    tokens.colors.white,
    borderRight:   `2px solid ${tokens.colors.borderColor}`,
    display:       "flex",
    flexDirection: "column",
    paddingTop:    24,
    paddingBottom: 32,
    flexShrink:    0,
    overflowY:     "auto",
  } satisfies CSSProperties,
 
  header: {
    padding:      "0 24px 16px",
    borderBottom: `1px solid ${tokens.colors.borderColor}`,
    marginBottom: 8,
  } satisfies CSSProperties,
 
  headerTitle: {
    fontFamily:    tokens.fonts.title,
    fontWeight:    700,
    fontSize:      11,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color:         tokens.colors.bleuHarmonie,
  } satisfies CSSProperties,
 
  headerSub: {
    fontFamily: tokens.fonts.body,
    fontSize:   12,
    color:      "#94a3b8",
    marginTop:  2,
  } satisfies CSSProperties,
 
  section: {
    marginBottom: 4,
  } satisfies CSSProperties,
 
  sectionLabel: {
    fontFamily:    tokens.fonts.title,
    fontWeight:    700,
    fontSize:      9,
    letterSpacing: 2.5,
    textTransform: "uppercase" as const,
    color:         tokens.colors.bleuMid,
    padding:       "10px 24px 4px",
  } satisfies CSSProperties,
 
  // active=true → style actif permanent
  link: (): CSSProperties => ({
    display:        "flex",
    alignItems:     "center",
    gap:            12,
    padding:        "10px 24px",
    fontFamily:     tokens.fonts.body,
    fontWeight:     700,
    fontSize:       14,
    color:          tokens.colors.bleuHarmonie,
    textDecoration: "none",
    background:     tokens.colors.bleuLight,
    borderLeft:     `3px solid ${tokens.colors.bleuHarmonie}`,
    borderRadius:   `0 ${tokens.radius.sm}px ${tokens.radius.sm}px 0`,
    transition:     tokens.transition,
    cursor:         "pointer",
  }),
 
  iconWrap: {
    width:          32,
    height:         32,
    borderRadius:   tokens.radius.sm,
    background:     tokens.colors.bleuHarmonie,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    fontSize:       15,
  } satisfies CSSProperties,
 
  divider: {
    height:     1,
    background: tokens.colors.borderColor,
    margin:     "8px 24px",
  } satisfies CSSProperties,
 
  badge: (color: string): CSSProperties => ({
    marginLeft:    "auto",
    background:    color,
    color:         tokens.colors.grisTexte,
    fontSize:      10,
    fontWeight:    700,
    fontFamily:    tokens.fonts.title,
    padding:       "2px 8px",
    borderRadius:  999,
    letterSpacing: 0.5,
  }),
 
  footer: {
    marginTop:  "auto",
    padding:    "16px 24px 0",
    borderTop:  `1px solid ${tokens.colors.borderColor}`,
  } satisfies CSSProperties,
 
  quoteBox: {
    background:   tokens.colors.bleuLight,
    borderLeft:   `3px solid ${tokens.colors.bleuHarmonie}`,
    borderRadius: `0 ${tokens.radius.md}px ${tokens.radius.md}px 0`,
    padding:      "12px 14px",
  } satisfies CSSProperties,
 
  quoteText: {
    fontFamily: tokens.fonts.quote,
    fontStyle:  "italic",
    fontSize:   12,
    color:      tokens.colors.bleuDark,
    lineHeight: 1.6,
    margin:     0,
  } satisfies CSSProperties,
};
 
// ── Responsive CSS ────────────────────────────────────────────────────────────
export const responsiveCss = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Open+Sans:wght@400;600;700&family=Lora:ital@0;1&display=swap');
 
  .nav-admin-link:hover  { background: ${tokens.colors.bleuLight} !important; color: ${tokens.colors.bleuDark} !important; }
  .btn-admin-outline:hover { background: ${tokens.colors.bleuLight} !important; }
  .btn-admin-primary:hover { background: ${tokens.colors.bleuDark} !important; border-color: ${tokens.colors.bleuDark} !important; }
  .sidebar-admin-link:hover { background: ${tokens.colors.bleuLight} !important; color: ${tokens.colors.bleuDark} !important; }
 
  .navbar-admin-links { display: flex !important; }
  .navbar-admin-auth  { display: flex !important; }
  .navbar-admin-burger { display: none !important; }
 
  @media (max-width: 900px) {
    .navbar-admin-links { display: none  !important; }
    .navbar-admin-auth  { display: none  !important; }
    .navbar-admin-burger { display: block !important; }
  }
`;