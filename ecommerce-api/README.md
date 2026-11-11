# E-Commerce API

Laravel 13 REST API for the [E-Commerce: Laravel + React](../README.md) project. Authentication uses Laravel Sanctum, and admin routes are protected by an `admin` middleware.

See the [main README](../README.md) for the full feature list, endpoint overview and setup instructions.

## Quick start

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

## Data model

| Table | Purpose |
| --- | --- |
| `users` | Customers and administrators (`is_admin` flag) |
| `categories` | Product categories with unique slugs |
| `products` | Name, slug, description, price, stock, image, featured flag, category |
| `orders` | Customer details, total, status, payment method and receipt image |
| `order_items` | Products, quantities and prices captured at purchase time |
| `personal_access_tokens` | Sanctum API tokens |
