# 🎤 FICHE ORAL — (RE)Sources Relationnelles

---

## 1. CHOIX NEXT.JS (Frontend)

**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4**

- **SSR / SEO** → ressources publiques indexables Google
- **Server Components** par défaut → moins de JS, mieux sur mobile
- **File-based routing** → un dossier = une route, simple à maintenir
- **TypeScript strict** natif → bugs évités à la compilation
- **Écosystème mature** : next/image, next/font, Tailwind intégré

**Écartés** : Angular (lourd), Vue/Nuxt (écosystème plus petit), CRA (déprécié)

---

## 2. ARCHITECTURE & CONVENTIONS

```
apps/web/src/
├── app/              → Routes (App Router)
│   ├── (main)/      → public + citoyen
│   └── admin/       → admin/modération
├── components/ui/    → Button, Card, Badge, Input
├── components/layout/→ Navbar, Footer, Sidebar
├── contexts/         → AuthContext (état global)
├── lib/              → api.ts, cookies.ts
└── data/             → types TS + appels données
```

**Conventions** : alias `@/`, PascalCase composants, camelCase fonctions, naming FR métier, TS strict, interfaces pour props

**Évolutions** : React Query, Playwright E2E, Storybook, PWA, i18n

---

## 3. MVC — Le frontend = VIEW

- **View (frontend)** : components/ + app/ → affichage pur
- **Controller (Laravel)** : logique métier, validation, rôles
- **Model (Laravel)** : base de données, Eloquent

**Sous-MVC interne frontend** :
- View = components
- Controller = AuthContext + hooks + handlers
- Model = lib/api.ts + data/

➡️ *« Aucune logique métier côté front, tout transite par l'API REST »*

---

## 4. TESTS

**Frontend (Vitest + RTL)** — 7 fichiers :
- UI : Button, Badge, Card, Input
- Lib : api.ts, cookies.ts
- Data : admonStats.ts

**Backend (PHPUnit)** :
- Feature : Auth, Resource, Admin, Interaction, Moderation
- Unit : Enums (rôles/statuts), SanitizesInput

➡️ *« Pyramide : unitaires rapides + intégration API complète »*

---

## 5. RGAA (Accessibilité)

1. **Skip link** « Aller au contenu principal » (critère 12.7)
2. **Sémantique** : `<main>`, `<nav>`, hiérarchie h1→h3 (9.1)
3. **ARIA** : `aria-label`, `aria-expanded`, `aria-controls`, `aria-hidden` (7.1, 1.1)
4. **Focus visible** 3px sur interactifs (10.7)
5. **Alt text** via next/image
6. **Contrastes** respectés (4.5:1)
7. **Navigation clavier** : vrais `<button>` / `<a>`

**Améliorations** : axe DevTools, NVDA, aria-describedby sur erreurs

---

## 6. PARCOURS CITOYEN

### ✅ PEUT (non connecté)
`/`, `/ressources`, `/ressources/[id]`, `/aide`, `/presentation`, `/auth/*`

### ✅ PEUT (connecté rôle citoyen)
- Créer ressource → passe en modération
- Éditer ses ressources
- Favori / Exploitée / Mettre de côté
- Commenter
- Tableau de bord perso `/dashboard`

### ❌ NE PEUT PAS
- `/admin/*` (bouton caché Navbar)
- Modérer, supprimer, gérer catégories/utilisateurs
- Voir stats globales
- Créer comptes privilégiés

### Sécurité
- Frontend : Navbar conditionnelle via `user.role`
- Backend : middleware Laravel `role:admin|super_admin`
➡️ *« La sécurité réelle est côté Laravel, le front cache juste pour l'UX »*

---

## 🎯 PHRASES À PLACER

- *« Architecture séparée front/back en REST → évolutive vers mobile »*
- *« Next.js App Router : techno pérenne poussée par la communauté »*
- *« Pyramide de tests : unitaires front + intégration Laravel »*
- *« RGAA niveau A : clavier, skip link, ARIA, sémantique, contrastes »*
- *« Parcours citoyen progressif : consulter → s'inscrire → contribuer → progresser »*

---

## 🔑 CHIFFRES & FAITS À RETENIR

- **4 rôles** : citoyen, modérateur, admin, super_admin
- **Next.js 16.1.6** + **React 19.2.3** + **TypeScript 5**
- **7 tests Vitest** frontend + **10 tests PHPUnit** backend
- **Tailwind CSS v4** (utility-first)
- **REST API** avec auth Bearer token (Laravel Sanctum)
- **Email hashé SHA-256** au login (confidentialité)
