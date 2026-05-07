# Technical Test PT Garuda Cyber Indonesia

---

## Tech Stack

| | Teknologi |
|---|---|
| Backend | Laravel 13, Laravel Sanctum, PostgresSQL |
| Frontend | Next.js 16 (App Router), DaisyUI, Zustand, TypeScript |

---

## Struktur Direktori

```
/
├── api/        # Laravel — REST API
└── frontend/   # Next.js — UI
```

---

## Instalasi & Menjalankan

### Backend (Laravel)

```bash
cd api

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate --seed

php artisan serve
```

API berjalan di: `http://localhost:8000`

---

### Frontend (Next.js)

```bash
cd frontend

npm install

cp .env.local.example .env.local

npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

## Demo Login

Setelah menjalankan `php artisan migrate --seed`, akun berikut tersedia:

| Field | Value |
|---|---|
| Email | `admin@garudacyber.id` |
| Password | `admin` |

> Seeder juga membuat 30 post acak untuk keperluan testing pagination.
