# API Laravel — (RE)Sources Relationnelles

Backend Laravel du projet CESI Bloc 2.

## Prérequis

Aucune installation PHP locale requise — tout tourne dans Docker.

## Lancement

Depuis la **racine du monorepo** :

```bash
cp .env.example .env   # une seule fois
docker compose up -d
```

L'API est disponible sur **http://localhost:8000**.

## Identifiants base de données

| Champ | Valeur |
|---|---|
| Hôte | `localhost` (depuis la machine) / `db` (depuis le conteneur) |
| Port | `5432` |
| Base | `ressources_relationnelles` |
| Utilisateur | `postgres` |
| Mot de passe | `postgres` |

Adminer (interface web BDD) : http://localhost:8080

## Tests

```bash
docker exec rr_api php artisan test
```

---

## Endpoints API

Base URL : `http://localhost:8000/api`

Toutes les routes API retournent du **JSON**. Les erreurs d'authentification retournent `{"message": "Unauthenticated."}` avec un code `401`.

### Authentification

L'API utilise **Laravel Sanctum** (Bearer token). Après login/register, inclure le token dans le header :

```
Authorization: Bearer <token>
```

### Routes publiques

#### `GET /api/ping`

Health check.

**Réponse** `200` :
```json
{ "status": "ok" }
```

#### `POST /api/register`

Créer un compte citoyen.

**Body** :
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

| Champ | Règles |
|---|---|
| `name` | requis, string, min:2, max:255 |
| `email` | requis, string, email RFC, max:255, unique |
| `password` | requis, confirmé, 8+ caractères |

**Réponse** `201` :
```json
{
  "token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  }
}
```

**Erreur** `422` :
```json
{
  "message": "The email field must be a valid email address.",
  "errors": { "email": ["The email field must be a valid email address."] }
}
```

#### `POST /api/login`

Se connecter et obtenir un token.

**Body** :
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Réponse** `200` :
```json
{
  "token": "2|xyz789...",
  "token_type": "Bearer",
  "user": { "id": 1, "email": "john@example.com" }
}
```

**Erreur** `401` :
```json
{ "message": "Invalid credentials." }
```

**Erreur** `403` (compte désactivé) :
```json
{ "message": "User account is disabled." }
```

### Routes authentifiées (Bearer token requis)

#### `POST /api/logout`

Révoquer le token courant.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{ "message": "Logged out successfully." }
```

#### `GET /api/user`

Récupérer l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen",
  "is_active": true,
  "created_at": "2026-03-11T10:00:00.000000Z",
  "updated_at": "2026-03-11T10:00:00.000000Z"
}
```

#### `GET /api/admin/ping`

Health check réservé aux admins.

**Headers** : `Authorization: Bearer <token>` (rôle `admin` ou `super_admin` requis)

**Réponse** `200` :
```json
{ "status": "admin-ok" }
```

**Erreur** `403` :
```json
{ "message": "Forbidden." }
```

---

## Rôles utilisateurs

| Rôle | Valeur |
|---|---|
| Citoyen | `citizen` |
| Modérateur | `moderator` |
| Administrateur | `admin` |
| Super-administrateur | `super_admin` |

## Seeders de test

Après `docker compose up -d`, les seeders créent ces comptes (mot de passe : `password123`) :

| Email | Rôle |
|---|---|
| `superadmin@rr.fr` | super_admin |
| `admin@rr.fr` | admin |
| `moderator@rr.fr` | moderator |
| `citizen1@rr.fr` | citizen |
| `citizen2@rr.fr` | citizen |

> **Note** : les seeders ne sont exécutés que manuellement via `docker exec rr_api php artisan db:seed`.

---

## Exemple d'utilisation (frontend)

```typescript
const API_URL = 'http://localhost:8000/api';

// Login
const res = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'citizen1@rr.fr', password: 'password123' }),
});
const { token } = await res.json();

// Requête authentifiée
const user = await fetch(`${API_URL}/user`, {
  headers: { Authorization: `Bearer ${token}` },
}).then(r => r.json());
```
