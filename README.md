# ⚡ E-Commerce (Laravel + React)

A full-stack e-commerce application combining a React + Tailwind CSS frontend with a Laravel PHP backend REST API — clean separation of concerns with a modern SPA architecture.

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## ✨ Features

- ⚡ Decoupled SPA architecture — React frontend, Laravel REST API backend
- 🔐 Token-based authentication (Laravel Sanctum)
- 🛍️ Product catalog, cart, and checkout
- 📦 Order management
- 🎨 Styled with Tailwind CSS for rapid, responsive UI development

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Laravel 10+, PHP 8.1+ |
| Auth | Laravel Sanctum (SPA tokens) |
| Database | MySQL |

## 🚀 Getting Started

**Backend (Laravel API):**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Frontend (React):**
```bash
cd frontend
cp .env.example .env   # Set VITE_API_URL=http://localhost:8000/api
npm install
npm run dev
```

## 👤 Author

**Abanoub George Samir** — [LinkedIn](https://www.linkedin.com/in/abanob-george-samir) · [GitHub](https://github.com/AbanobGeorgeSamir)