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

<<<<<<< HEAD
## Environnement Docker (équipe)

Pour éviter les différences de machines entre membres de l'équipe, le backend peut être lancé en conteneurs.

### Services disponibles

- `db` : PostgreSQL 16
- `api` : Laravel (PHP 8.4 + Composer)
- `db_admin` : Adminer (interface web d'administration BDD)

### Lancer l'environnement backend

```bash
cp .env.example .env
docker compose up -d --build db api db_admin
docker compose logs -f api
```

### Accéder à l'admin BDD

- URL : `http://localhost:8080`
- System : `PostgreSQL`
- Server : `db`
- Username : `postgres`
- Password : `postgres`
- Database : `ressources_relationnelles`

### Arrêter l'environnement

```bash
docker compose down
```

### Réinitialiser complètement la base

```bash
docker compose down -v
```

### Commandes Laravel dans le conteneur

```bash
docker compose exec api php artisan migrate
docker compose exec api php artisan test
docker compose exec api php artisan route:list
```

### Travail en parallèle dans le monorepo

- Le backend peut tourner en Docker (`api` + `db`) pour Chamil.
- Le web et le mobile restent lancés localement par chaque dev (`pnpm dev`, `pnpm start`) tant que leurs apps sont en cours de setup.
- Les packages `packages/ui` et `packages/shared` restent partagés via le monorepo, sans changer le workflow Git.

---

=======
>>>>>>> main
## Équipe

- **Chamil** — Backend (API, BDD, Auth, Sécurité)
- **Jamal** — Frontend web (Next.js, RGAA)
- **Romain** — Back-office + Intégration Auth
- **Leon** — Mobile (React Native / Expo)
