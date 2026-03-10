# (RE)Sources Relationnelles

Plateforme de ressources pour l'amélioration des relations entre citoyens.

Projet CESI — Bloc 2 — Groupe 2

## Stack technique

| Composant | Technologie |
|-----------|------------|
| API | Laravel (PHP) + PostgreSQL |
| Web | Next.js (App Router, TypeScript, Tailwind) |
| Mobile | React Native (Expo) |
| UI partagée | `@app/ui` (React Native Web + NativeWind) |

## Structure du monorepo

```
api/            → Laravel API
apps/web/       → Next.js (front-office + back-office)
apps/mobile/    → Expo (React Native)
packages/ui/    → Composants UI partagés
packages/shared/→ Types, hooks, services API partagés
```

## Démarrage rapide

```bash
# API
cd api && composer install && cp .env.example .env && php artisan serve

# Web
cd apps/web && pnpm install && pnpm dev

# Mobile
cd apps/mobile && pnpm install && pnpm start
```

## Équipe

- **Chamil** — Backend (API, BDD, Auth, Sécurité)
- **Jamal** — Frontend web (Next.js, RGAA)
- **Romain** — Back-office + Intégration Auth
- **Leon** — Mobile (React Native / Expo)
