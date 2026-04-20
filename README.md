# PathFinder

Plataforma comunitària per compartir experiències de viatge. Els usuaris poden publicar rutes, allotjaments, fotografies i recomanacions; votar experiències d'altres; reportar contingut inadequat; i navegar amb filtres per país, categoria i text.

---

## Stack tecnològic

| Capa | Tecnologia |
|------|-----------|
| Backend | Laravel 12 (PHP 8.4) |
| Frontend | React 19 + TypeScript + Inertia.js 2 |
| Estils | Tailwind CSS 4 + shadcn/ui |
| Base de dades | SQLite (per defecte) |
| Autenticació | Laravel Fortify (login, register, 2FA, email verification) |
| Mapes | Leaflet + OpenStreetMap |
| Imatges | Cloudinary (CDN) amb fallback a GD local (WebP) |
| Build | Vite 7 |

---

## Requisits previs

- **PHP 8.4+** amb extensions: `mbstring`, `openssl`, `pdo`, `sqlite`, `gd`
- **Composer 2.x**
- **Node.js 20+** i **npm**
- (Opcional) Un compte a [Cloudinary](https://cloudinary.com) per servir imatges via CDN

---

## Instal·lació

### 1. Clonar el repositori

```bash
git clone https://github.com/ErJaLo/PathFinder
cd PathFinder
```

### 2. Variables d'entorn

```bash
cp .env.example .env
```

Obre `.env` i ajusta els valors segons calgui. Els més importants:

```env
APP_NAME=PathFinder
APP_URL=http://localhost:8000

# Base de dades (SQLite per defecte)
DB_CONNECTION=sqlite

# Cloudinary (opcional - si es buit, s'usen imatges locals)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=pathfinder
```

> **Nota Cloudinary**: si no el configures, el servei `ImageOptimizer` fa fallback automàtic a optimització local amb GD (resize + WebP). Veure [docs/cloudinary-setup.md](docs/cloudinary-setup.md).

### 3. Instal·lar dependències

```bash
# Backend
composer install

# Frontend
npm install
```

### 4. Preparar l'aplicació

```bash
# Generar la clau d'aplicació
php artisan key:generate

# Crear el fitxer SQLite (si no existeix)
touch database/database.sqlite

# Executar migracions i poblar amb dades de prova (usuaris, categories, experiències, ratings, reports)
php artisan migrate:fresh --seed

# Crear el symlink per a les imatges locals
php artisan storage:link
```

### 5. Engegar el servidor

```bash
# Mode desenvolupament (backend + Vite en paral·lel)
composer run dev
```

Obre [http://localhost:8000](http://localhost:8000).

---

## Usuaris de prova (seeders)

| Rol | Email | Contrasenya |
|-----|-------|-------------|
| Admin | `admin@viatges.cat` | `admin1234` |
| Moderator | `mod@viatges.cat` | `mod12345` |
| User | `user@viatges.cat` | `user1234` |
| User | `retraso@viatges.cat` | `password` |
| User | (9 més) | `password` |

---

## Entorns

### Desenvolupament
- `composer run dev` engega: Laravel server, queue worker, logs i Vite en mode HMR.
- SQLite local a `database/database.sqlite`.
- Imatges locals amb fallback a Cloudinary si configurat.

### Preproducció / Producció
```bash
# Compilar assets
npm run build

# Optimitzar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Servir amb un servidor web (Nginx/Apache + PHP-FPM)
```

Variables recomanades per producció:
```env
APP_ENV=production
APP_DEBUG=false
CACHE_STORE=redis       # o database
SESSION_DRIVER=redis    # o database
```

---

## Estructura del projecte

```
app/
  Http/Controllers/       # HomeController, ExperienciaController, etc.
  Models/                 # Post, User, Category, Country, Rating, Report
  Services/ImageOptimizer.php  # Cloudinary + fallback local
  Http/Middleware/
    CheckRole.php         # Guard per rutes admin/moderator

resources/js/
  pages/                  # Inertia pages (home, explorar, experiencies/*, admin/*, settings/*)
  components/             # ExperienceCard, ExperienceForm, MapPicker, MapDisplay, etc.
  layouts/                # MainLayout, AdminLayout, AuthLayout
  types/                  # TypeScript types

routes/
  web.php                 # Rutes principals (públiques, auth, admin)
  settings.php            # Rutes del perfil d'usuari

database/
  migrations/             # Schema
  seeders/                # Dades de prova

docs/                     # Documentació addicional
obsidian/viatges/         # Planning i flux del projecte
```

---

## Funcionalitats

### Vista pública (sense login)
- Pàgina inicial amb experiència destacada + 3 últimes.
- Llistat `/explorar` amb filtres (categoria, país), buscador amb debounce i ordenació (popular, nou, data, puntuació).
- Vista de detall de cada experiència amb mapa Leaflet.

### Usuari registrat
- Crear experiències amb títol, contingut, imatge, categories, data, ubicació al mapa.
- Guardar com a esborrany o publicar directament.
- Editar i eliminar les pròpies experiències (`/settings/experiences`).
- Votar experiències (+1/-1).
- Reportar abusos amb motiu.
- Modificar perfil i contrasenya (`/settings/profile`, `/settings/security`).
- Activar autenticació de dos factors (2FA).

### Moderador
- Accés a `/admin/reports` per revisar reports i acceptar/descartar posts.

### Admin
- Tot el del moderador +
- Gestió d'usuaris (`/admin/users`): crear, editar, activar/desactivar.
- Gestió de categories (`/admin/category`): CRUD complet.

---

## Rutes principals

### Públiques
| Mètode | URI | Descripció |
|--------|-----|-----------|
| GET | `/` | Pàgina inicial |
| GET | `/explorar` | Llistat d'experiències |
| GET | `/experiencies/{id}` | Detall d'una experiència |
| GET | `/politica-privacitat` | Política de privacitat |
| GET | `/politica-cookies` | Política de cookies |

### Autenticades
| Mètode | URI | Descripció |
|--------|-----|-----------|
| GET | `/experiencies/crear` | Formulari de creació |
| POST | `/experiencies` | Crear experiència |
| GET | `/experiencies/{id}/editar` | Formulari d'edició |
| PUT | `/experiencies/{id}` | Actualitzar |
| DELETE | `/experiencies/{id}` | Eliminar |
| PUT | `/experiencies/{id}/rating` | Votar |
| POST | `/reports` | Reportar abús |
| GET | `/settings/experiences` | Les meves experiències |
| GET/PATCH | `/settings/profile` | Perfil |
| GET/PUT | `/settings/security` | Seguretat (password, 2FA) |

### Admin (role: moderator/admin)
| Mètode | URI | Descripció |
|--------|-----|-----------|
| GET | `/admin` | Dashboard admin |
| GET/PUT | `/admin/users` | Gestió d'usuaris |
| PATCH | `/admin/users/{id}/toggle-active` | Activar/desactivar usuari |
| GET/POST/PUT/DELETE | `/admin/category` | Gestió de categories |
| GET | `/admin/reports` | Llistat de reports |
| PUT | `/admin/reports/{id}/*` | Accions sobre reports |

---

## Model de dades

```
users ──┬── posts ──┬── ratings
        │           ├── reports
        │           ├── post_category ─── categories
        │           └── post_country ─── countries
        │
        ├── ratings
        ├── reports
        ├── user_country ─── countries
        └── notifications (sender/receiver)
```

---

## Tests

```bash
# PHPUnit
php artisan test

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Documentació addicional

- [docs/cloudinary-setup.md](docs/cloudinary-setup.md) — Guia de configuració de Cloudinary
- [obsidian/viatges/Planning del projecte.md](obsidian/viatges/Planning%20del%20projecte.md) — Planning per branches
- [obsidian/viatges/Flux complet del projecte.md](obsidian/viatges/Flux%20complet%20del%20projecte.md) — Flux funcional
- [SEGURETAT.txt](SEGURETAT.txt) — Aspectes de seguretat no implementats

---

## Integrants

Nicolas Miszczak, Jan Lopez, Roger Muntané

Projecte desenvolupat com a treball de M6, M7 y M9 del cicle formatiu DAW.

---

## Llicència

Projecte acadèmic. Logotip i contingut propis del projecte PathFinder.
