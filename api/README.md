# API Laravel — (RE)Sources Relationnelles

Backend Laravel du projet CESI Bloc 2.

## Prérequis

- PHP 8.2+
- Composer 2+
- PostgreSQL 14+

## Installation

```bash
cd api
composer install
cp .env.example .env
```

## Configuration

Mettre à jour la connexion PostgreSQL dans `.env` :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ressources_relationnelles
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Configurer les origines front autorisées (web + mobile) :

```env
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:19006,http://127.0.0.1:19006,http://localhost:8081,http://127.0.0.1:8081,exp://127.0.0.1:19000,exp://localhost:19000"
```

## Initialisation

```bash
php artisan key:generate
php artisan migrate
```

## Lancement local

```bash
php artisan serve
```

API disponible sur `http://127.0.0.1:8000`.
