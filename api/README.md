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

### Ressources et catégories

#### `GET /api/resources`

Lister les ressources **publiques** et **publiées**.

**Query params disponibles** :

| Paramètre | Description |
|---|---|
| `category` | Filtrer par `category_id` |
| `relation_type` | Filtrer par `relation_type_id` |
| `resource_type` | Filtrer par `resource_type_id` |
| `sort=date` | Trier par date décroissante (défaut) |
| `sort=title` | Trier par titre croissant |

**Pagination** : `15` résultats par page.

**Exemple** :
```bash
curl "http://localhost:8000/api/resources?category=1&relation_type=1&resource_type=1&sort=date"
```

**Réponse** `200` :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "title": "Ma ressource",
      "content": "Contenu de la ressource",
      "status": "published",
      "is_public": true,
      "user": { "id": 1, "name": "John Doe" },
      "category": { "id": 1, "name": "Catégorie A" },
      "relation_type": { "id": 1, "name": "Familiale" },
      "resource_type": { "id": 1, "name": "Article" }
    }
  ],
  "per_page": 15,
  "total": 1
}
```

#### `GET /api/resources/{id}`

Détail d'une ressource **publique** et **publiée**.

**Réponse** `200` :
```json
{
  "id": 1,
  "title": "Ma ressource",
  "content": "Contenu de la ressource",
  "status": "published",
  "is_public": true,
  "user": { "id": 1, "name": "John Doe" },
  "category": { "id": 1, "name": "Catégorie A" },
  "relation_type": { "id": 1, "name": "Familiale" },
  "resource_type": { "id": 1, "name": "Article" }
}
```

**Erreur** `404` : ressource absente, privée, ou non publiée.

#### `GET /api/categories`

Lister toutes les catégories, triées par nom.

**Réponse** `200` :
```json
[
  { "id": 1, "name": "Catégorie A", "description": null },
  { "id": 2, "name": "Catégorie B", "description": "Description" }
]
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

#### `POST /api/resources`

Créer une ressource. Route réservée au **citizen** connecté. Le statut est toujours forcé à `pending`.

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "title": "Nouvelle ressource",
  "content": "Contenu assez long pour être valide.",
  "category_id": 1,
  "relation_type_id": 1,
  "resource_type_id": 1,
  "is_public": true
}
```

| Champ | Règles |
|---|---|
| `title` | requis, string, min:3, max:255 |
| `content` | requis, string, min:10 |
| `category_id` | requis, entier, existe dans `categories` |
| `relation_type_id` | requis, entier, existe dans `relation_types` |
| `resource_type_id` | requis, entier, existe dans `resource_types` |
| `is_public` | optionnel, booléen |

**Réponse** `201` :
```json
{
  "id": 12,
  "title": "Nouvelle ressource",
  "status": "pending",
  "is_public": true,
  "user_id": 3
}
```

**Erreur** `403` :
```json
{ "message": "Forbidden." }
```

#### `PUT /api/resources/{id}`

Modifier une ressource. Seul **l'auteur** peut l'éditer.

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "title": "Titre mis à jour",
  "content": "Contenu mis à jour assez long.",
  "category_id": 1,
  "relation_type_id": 1,
  "resource_type_id": 1,
  "is_public": false
}
```

**Réponse** `200` :
```json
{
  "id": 12,
  "title": "Titre mis à jour",
  "is_public": false
}
```

**Erreur** `403` :
```json
{ "message": "This action is unauthorized." }
```

### Interactions (commentaires, favoris, progression)

#### `GET /api/resources/{id}/comments`

Lister l'arbre de commentaires **approuvés** (parents + réponses approuvées) d'une ressource.

**Réponse** `200` :
```json
[
  {
    "id": 10,
    "content": "Commentaire parent",
    "replies": [
      { "id": 11, "content": "Réponse" }
    ]
  }
]
```

#### `POST /api/resources/{id}/comments`

Ajouter un commentaire (citizen connecté uniquement).

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{ "content": "Mon commentaire" }
```

**Réponse** `201` :
```json
{
  "id": 12,
  "content": "Mon commentaire",
  "resource_id": 1,
  "parent_id": null
}
```

#### `POST /api/comments/{id}/reply`

Répondre à un commentaire (citizen connecté uniquement).

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{ "content": "Ma réponse" }
```

**Réponse** `201` :
```json
{
  "id": 13,
  "content": "Ma réponse",
  "resource_id": 1,
  "parent_id": 12
}
```

#### `POST /api/resources/{id}/favorite`

Ajouter une ressource aux favoris de l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `201` (créé) ou `200` (déjà favori) :
```json
{
  "message": "Resource added to favorites.",
  "favorite": {
    "user_id": 3,
    "resource_id": 1
  }
}
```

#### `DELETE /api/resources/{id}/favorite`

Retirer une ressource des favoris de l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{ "message": "Resource removed from favorites." }
```

#### `POST /api/resources/{id}/exploit`

Marquer une ressource comme exploitée.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "message": "Progression status updated.",
  "progression": {
    "user_id": 3,
    "resource_id": 1,
    "status": "exploited"
  }
}
```

#### `POST /api/resources/{id}/set-aside`

Marquer une ressource comme mise de côté.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "message": "Progression status updated.",
  "progression": {
    "user_id": 3,
    "resource_id": 1,
    "status": "set_aside"
  }
}
```

#### `GET /api/progression`

Retourner le tableau de bord progression de l'utilisateur connecté.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "favorites": [],
  "exploited": [],
  "set_aside": []
}
```

### Administration, modération et super-admin

#### `GET /api/admin/statistics`

Tableau de bord statistiques (admin/super-admin uniquement).

**Headers** : `Authorization: Bearer <token>`

**Query params** :

| Paramètre | Valeurs |
|---|---|
| `period` | `day`, `week`, `month`, `all` (défaut) |
| `category` | `category_id` pour filtrer les stats |

**Réponse** `200` :
```json
{
  "filters": { "period": "all", "category": null },
  "statistics": {
    "consultations": 0,
    "recherches": 0,
    "exploitations": 3,
    "creations": 10,
    "favoris": 5,
    "commentaires": 8,
    "resources_pending": 4,
    "resources_published": 6
  }
}
```

#### `PUT /api/admin/resources/{id}/suspend`

Suspendre une ressource (admin/super-admin uniquement). Le statut passe à `archived`.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "message": "Resource suspended successfully.",
  "resource": { "id": 1, "status": "archived" }
}
```

#### `PUT /api/moderation/resources/{id}/validate`

Valider une ressource (moderator/admin/super-admin). Le statut passe à `published`.

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "message": "Resource validated successfully.",
  "resource": { "id": 1, "status": "published" }
}
```

#### `PUT /api/moderation/comments/{id}/approve`

Approuver un commentaire (moderator/admin/super-admin).

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{
  "message": "Comment approved successfully.",
  "comment": { "id": 1, "is_approved": true }
}
```

#### `DELETE /api/moderation/comments/{id}`

Supprimer un commentaire (moderator/admin/super-admin).

**Headers** : `Authorization: Bearer <token>`

**Réponse** `200` :
```json
{ "message": "Comment deleted successfully." }
```

#### `POST /api/super-admin/users`

Créer un compte privilégié (super-admin uniquement).

**Headers** : `Authorization: Bearer <token>`

**Body** :
```json
{
  "name": "Moderator User",
  "email": "moderator.user@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "role": "moderator",
  "is_active": true
}
```

`role` accepte uniquement : `moderator` ou `admin`.

**Réponse** `201` :
```json
{
  "message": "Privileged user created successfully.",
  "user": {
    "id": 20,
    "name": "Moderator User",
    "email": "moderator.user@example.com",
    "role": "moderator",
    "is_active": true
  }
}
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
