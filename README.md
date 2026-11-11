# E-Commerce: Laravel + React

Decoupled e-commerce application: a **Laravel 13 REST API** with Sanctum authentication and transactional checkout, and a **React 19 single-page app** for the storefront and admin panel.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)

<!-- Add screenshots here, for example: ![Storefront](docs/storefront.png) -->

## Features

**Storefront**
- Product catalog with category filtering and paginated results (12 per page)
- Product detail pages
- Shopping cart persisted in the browser
- Registration, login and logout with Laravel Sanctum tokens
- Checkout with validated shipping details, Cash on Delivery and a required payment-receipt image
- Order history and order detail pages

**Admin panel** (admin users only)
- Dashboard overview
- Add, edit and delete products with stock and image upload
- Create, edit and delete categories
- View orders

**Backend design**
- RESTful API with Eloquent models, migrations, factories and seeders
- Checkout runs inside a database transaction and locks product rows (`lockForUpdate`) so stock cannot be oversold. It validates stock, decrements it, and deletes the uploaded receipt if the order fails.
- Route groups protected by `auth:sanctum` and an `admin` middleware that returns `403` for non-admin users
- API resources shape product responses

## Tech Stack

| Layer | Technologies |
| --- | --- |
| API | PHP 8.3, Laravel 13, Laravel Sanctum, Eloquent ORM |
| Database | SQLite by default; MySQL or other drivers through `.env` |
| Frontend | React 19, Vite, React Router 7, Axios, Tailwind CSS 4, React Hot Toast, Lucide icons |
| State | React Context (auth and cart) with custom hooks |

## Project Structure

```text
ecommerce-api/   Laravel REST API (controllers, models, migrations, seeders)
ecommerce/       React + Vite frontend (pages, components, context, hooks)
```

## API Overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/register`, `/api/login` | Public | Authentication |
| POST | `/api/logout` | User | Revoke session |
| GET | `/api/user` | User | Current user |
| GET | `/api/products`, `/api/products/{id}` | Public | List (paginated) and view products |
| GET | `/api/categories` | Public | List categories |
| POST | `/api/checkout` | User | Place an order |
| GET | `/api/orders` | User | Order history |
| POST, PUT, DELETE | `/api/products`, `/api/products/{id}` | Admin | Manage products |
| POST, PUT, DELETE | `/api/categories`, `/api/categories/{id}` | Admin | Manage categories |

## Getting Started

**Requirements:** PHP 8.3+, Composer, Node.js and npm.

### 1. Run the API

```bash
cd ecommerce-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

The default database is SQLite. To use MySQL, set `DB_CONNECTION=mysql` and the `DB_*` values in `.env` before migrating.

### 2. Run the frontend

```bash
cd ecommerce
cp .env.example .env
npm install
npm run dev
```

| Variable | Example | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` | Base URL of the Laravel API |
| `VITE_APP_URL` | `http://localhost:5173` | Public URL of the frontend, used for CSRF requests |
| `VITE_APP_NAME` | `Ecommerce STORE` | Application name shown in the UI |
| `VITE_API_TIMEOUT` | `10000` | Request timeout in milliseconds |

### 3. Create an admin user

Register an account in the app, then mark it as admin:

```bash
cd ecommerce-api
php artisan tinker
>>> App\Models\User::where('email', 'you@example.com')->update(['is_admin' => true]);
```

## Scripts

```bash
# frontend
npm run dev        # development server
npm run build      # production build
npm run lint       # ESLint

# API
php artisan test   # PHPUnit
```

## Author

**Abanoub George Samir** · Junior Full-Stack Developer · [Portfolio](https://devabanobgeorge.vercel.app) · [LinkedIn](https://www.linkedin.com/in/abanob-george-samir) · [GitHub](https://github.com/AbanobGeorgeSamir)
