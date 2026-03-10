# (RE)Sources Relationnelles

Plateforme de ressources pour l'amélioration des relations entre citoyens.

**Projet CESI — Bloc 2 — Groupe 2**

---

## Stack technique

| Composant | Technologie |
|-----------|------------|
| API | Laravel (PHP) + PostgreSQL |
| Web | Next.js (App Router, TypeScript, Tailwind) |
| Mobile | React Native (Expo) |
| UI partagée | `@app/ui` (React Native Web + NativeWind) |

## Structure du monorepo

```
api/             → Laravel API (backend)
apps/web/        → Next.js (front-office + back-office)
apps/mobile/     → Expo (React Native)
packages/ui/     → Composants UI partagés (web + mobile)
packages/shared/ → Types, hooks, services API partagés
```

## Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/cesi-2025/grp2-ressources-relationnelles.git
cd grp2-ressources-relationnelles

# API
cd api && composer install && cp .env.example .env && php artisan migrate && php artisan serve

# Web
cd apps/web && pnpm install && pnpm dev

# Mobile
cd apps/mobile && pnpm install && pnpm start
```

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

## Équipe

| Nom | GitHub | Rôle | Périmètre |
|-----|--------|------|-----------|
| Chamil | `@musayevchamil` | Backend | API, BDD, Auth, Sécurité, RGPD |
| Jamal | `@jamal09102007` | Frontend web | Next.js, Charte graphique, RGAA |
| Romain | `@romain-condomitti` | Back-office | Admin, Auth frontend, Intégration |
| Leon | `@leonheu` | Mobile | React Native, Expo, Multi-écrans |

---

## Workflow Git

### Branches principales

| Branche | Rôle | Qui merge |
|---------|------|-----------|
| `main` | **Production** — Code stable, prêt à livrer | Merge de `develop` en fin de sprint |
| `develop` | **Intégration** — Toutes les features mergées ici | Chaque dev via PR |

### Cycle de travail

```
main ← develop ← feature/xxx
```

> **Règle d'or : on ne push JAMAIS directement sur `main` ni `develop`.**
> Tout passe par une Pull Request (PR).

### Créer une feature branch

Quand tu commences une nouvelle tâche (issue GitHub) :

```bash
# 1. Se mettre sur develop et récupérer les derniers changements
git checkout develop
git pull origin develop

# 2. Créer ta branche feature depuis develop
git checkout -b feature/nom-de-la-feature

# 3. Travailler, commiter régulièrement
git add .
git commit -m "feat: description courte du changement"

# 4. Pousser ta branche
git push origin feature/nom-de-la-feature

# 5. Ouvrir une Pull Request sur GitHub : feature/xxx → develop
```

### Nommage des branches

```
feature/api-setup          → Nouvelle fonctionnalité
fix/login-token-expired    → Correction de bug
hotfix/crash-production    → Fix urgent sur main
```

**Exemples concrets :**

| Dev | Issue | Branche |
|-----|-------|---------|
| Chamil | #2 Setup Laravel | `feature/api-setup` |
| Chamil | #3 Migrations BDD | `feature/db-migrations` |
| Jamal | #5 Setup Next.js | `feature/web-setup` |
| Romain | #7 Layout Back-office | `feature/backoffice-layout` |
| Leon | #9 Setup Expo | `feature/mobile-setup` |

### Conventions de commits

On utilise les **Conventional Commits** :

```
feat: ajouter endpoint CRUD ressources
fix: corriger le token expiré au login
style: ajuster les couleurs du header
refactor: extraire la logique auth dans un hook
docs: ajouter le chapitre architecture au document
test: ajouter tests unitaires auth
chore: configurer eslint + prettier
```

Format : `type: description courte en minuscules`

### Processus de Pull Request

1. **Créer la PR** : `feature/xxx` → `develop`
2. **Titre** : reprendre le nom de l'issue (ex: "Setup Laravel + structure MVC")
3. **Description** : lier l'issue avec `Closes #2`
4. **Review** : au moins 1 autre dev relit le code
5. **Merge** : une fois approuvée, merge en **Squash and merge**
6. **Supprimer** la branche feature après merge

### Fin de sprint

En fin de sprint (chaque dimanche) :

1. Vérifier que toutes les PRs du sprint sont mergées dans `develop`
2. Créer une PR `develop` → `main`
3. Tagger la release : `git tag v0.1.0`

### Résoudre les conflits

```bash
# Sur ta branche feature, récupérer les changements de develop
git checkout feature/ma-feature
git pull origin develop

# Résoudre les conflits dans les fichiers marqués
# Puis commiter la résolution
git add .
git commit -m "fix: résoudre conflits avec develop"
git push
```

### Résumé visuel

```
main         ●─────────────────────●─────────────────────● (releases)
              ↑                     ↑
develop      ●──●──●──●──●──●──●──●──●──●──●──●──●──●──● (intégration)
              ↑     ↑        ↑     ↑
feature/     ●──●──●  ●──●  ●──●  ●──●──●
             api-setup  web   auth  mobile
```

---

## Milestones

| Sprint | Nom | Deadline | Objectif |
|--------|-----|----------|----------|
| S1 | Fondations | 16 mars | Setup projets, auth, navigation |
| S2 | Fonctionnalités cœur | 23 mars | CRUD ressources, commentaires, favoris |
| S3 | Fonctionnalités avancées | 30 mars | Admin, stats, RGAA, progression |
| S4 | Tests, polish & soutenance | 6 avril | Tests, docs, corrections, slides |

---

## Liens utiles

- [Issues du projet](https://github.com/cesi-2025/grp2-ressources-relationnelles/issues)
- [Milestones](https://github.com/cesi-2025/grp2-ressources-relationnelles/milestones)
