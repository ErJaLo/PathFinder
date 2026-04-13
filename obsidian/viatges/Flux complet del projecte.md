# Flux complet del projecte — PathFinder

## Stack tecnologic

| Capa | Tecnologia |
|------|-----------|
| Backend | Laravel 12 + PHP 8.4 |
| Frontend | React 19 + TypeScript + Inertia.js 2 |
| Estils | Tailwind CSS 4 + shadcn/ui (40+ components) |
| Base de dades | SQLite |
| Autenticacio | Laravel Fortify (login, register, 2FA, email verification) |
| Mapes | Leaflet (vanilla JS, OpenStreetMap tiles) |
| Imatges | GD nativa (resize + WebP) |
| Build | Vite 7 amb Laravel Vite Plugin |

---

## Arquitectura general

```
Navegador (React SPA)
    ↕ Inertia.js (XHR, no API REST)
Servidor (Laravel)
    ↕ Eloquent ORM
Base de dades (SQLite)
```

Inertia.js fa de pont: el servidor retorna **props** amb `Inertia::render()`, el client renderitza components React. La navegacio es SPA sense recarrega gracies a `<Link>` d'Inertia.

---

## Model de dades

```
users (id, name, surname, email, password, role, img, active)
  ├── posts (id, user_id, title, content, experience_date, image, lat, lng, country_code, status)
  │     ├── post_category (post_id, category_id) → categories (id, name, description)
  │     ├── post_country (post_id, country_code) → countries (code, name, nationality, img)
  │     ├── ratings (id, user_id, post_id, value: -1/1)
  │     └── reports (id, user_id, post_id, reason, status)
  ├── user_country (user_id, country_code) → paisos visitats
  └── notifications (id, sender_id, receiver_id, message, read)
```

### Estats d'una experiencia (posts.status)
- `draft` — Esborrany, nomes visible per l'autor
- `published` — Publicada, visible per tothom
- `rejected` — Rebutjada per un moderador/admin

---

## Flux d'usuari

### 1. Visitant (no registrat)

```
/ (home) → veure experiencia destacada + 3 ultimes
/explorar → navegar experiencies publicades (filtrar, buscar, ordenar)
/experiencies/{id} → veure detall complet (sense votar ni reportar)
/login o /register → crear compte
```

### 2. Usuari registrat

#### Crear experiencia
```
Header → Boto "Crear" → /experiencies/crear
  ├── Omplir formulari (ExperienceForm):
  │     Titol, contingut, imatge (preview), categories (pills),
  │     pais (select), data, ubicacio (MapPicker — clic al mapa)
  ├── "Publicar" → validacio estricta (titol + contingut + categories obligatoris)
  │     → POST /experiencies → redirect /explorar
  └── "Guardar esborrany" → validacio relaxada (tot opcional)
        → POST /experiencies → redirect /experiencies/{id}/editar
```

#### Gestionar experiencies propies
```
Header → Dropdown → "Gestio d'experiencies" → /settings/experiences
  ├── Filtrar: Totes / Publicades / Esborranys
  ├── Buscar entre les propies
  ├── Accions per cada card:
  │     ├── Veure (si publicada) → /experiencies/{id}
  │     ├── Editar → /experiencies/{id}/editar (ExperienceForm pre-omplert)
  │     └── Eliminar → Modal confirmacio → DELETE /experiencies/{id}
  └── Paginacio
```

#### Editar experiencia
```
/experiencies/{id}/editar
  ├── Autoritzacio: nomes el propietari (abort 403 si no)
  ├── Formulari pre-omplert amb dades existents (inclos mapa amb marker)
  ├── "Publicar" → PUT amb status=published → redirect /settings/experiences
  └── "Guardar esborrany" → PUT amb status=draft → redirect /settings/experiences
```

#### Votar
```
/experiencies/{id} (detall)
  └── Sidebar → Card "Valoracio"
        ├── Boto 👍 → PUT /experiencies/{id}/rating {value: 1}
        ├── Boto 👎 → PUT /experiencies/{id}/rating {value: -1}
        └── Clic de nou → PUT {value: 0} → elimina el vot
        (Actualitzacio optimista: el comptador canvia immediatament)
```

#### Reportar
```
/experiencies/{id} (detall)
  └── Sidebar → Boto "Reportar abus"
        ├── Obre modal (ModalReport) amb camp de motiu
        └── POST /reports {post_id, reason}
            (Evita duplicats: 1 report per usuari per experiencia)
```

### 3. Moderador

Tot el que pot fer un usuari, mes:
```
/admin → Dashboard amb estadistiques
/admin/reports → Llistat de reports pendents
  ├── Veure detall del report
  ├── Accions: Mantenir post / Rebutjar post / Descartar report
  └── Rebutjar post → posts.status = 'rejected'
```

### 4. Administrador

Tot el que pot fer un moderador, mes:
```
/admin/category → CRUD de categories
  ├── Crear nova categoria
  ├── Editar nom/descripcio
  └── Eliminar categoria

/admin/users → Gestio d'usuaris
  ├── Llistar amb cerca i filtratge
  ├── Crear nou usuari (amb rol)
  ├── Editar usuari
  └── Toggle actiu/inactiu
```

---

## Flux d'imatges

```
Usuari puja imatge (input file)
  → Preview al navegador (URL.createObjectURL)
  → Submit formulari (multipart/form-data via Inertia forceFormData)
  → Servidor: ImageOptimizer processa:
      1. Carrega amb GD (JPEG/PNG/WebP/GIF)
      2. Resize si > 1600px d'ample
      3. Converteix a WebP (qualitat 80%)
      4. Guarda a storage/app/public/experiences/
  → Path guardat a posts.image (/storage/experiences/abc123.webp)
  → Symlink public/storage → storage/app/public
  → Frontend: <img src={experience.image} loading="lazy" />
```

---

## Flux de mapes (Leaflet)

### Creacio/Edicio (MapPicker)
```
Component munta → L.map() sobre un <div ref>
  → Tiles d'OpenStreetMap
  → Usuari clica al mapa → L.marker() + onChange(lat, lng)
  → Coordenades es guarden al form state
  → Submit → lat/lng es guarden a posts.latitude/longitude
  → Component desmunta → map.remove() (cleanup per SPA navigation)
```

### Visualitzacio (MapDisplay)
```
Show page carrega → lazy(() => import MapDisplay)
  → Si lat/lng existeixen → L.map() + L.marker()
  → scrollWheelZoom desactivat
  → Popup amb el titol de l'experiencia
  → wrapper amb isolation: isolate (z-index no interfereix amb modals)
```

---

## Flux d'autenticacio

```
/register → Formulari Fortify → crear usuari (role: user)
/login → Formulari Fortify → sessio + cookie
  → Si 2FA activat: /two-factor-challenge
/settings/security → Activar 2FA (QR + codis recuperacio)
/settings/profile → Editar nom, email, pais
/logout → POST → destruir sessio
```

### Middleware de proteccio
```
Rutes publiques: /, /explorar, /experiencies/{id}
Rutes auth: /experiencies/crear, /settings/*, /experiencies/{id}/editar
Rutes admin: /admin/* → middleware('role:moderator,admin')
```

---

## Flux de dades (Inertia shared props)

Cada peticio rep via `HandleInertiaRequests`:
```php
'auth' => ['user' => $request->user()],
'flash' => ['success' => session('success')],
'globalData' => [
    'totalReports' => ...,      // nomes admin/mod
    'totalCategories' => ...,
    'totalUsuaris' => ...,
    'totalExperiencies' => ...,
]
```

---

## Estructura de fitxers clau

```
app/
  Http/Controllers/
    HomeController.php          ← Home page
    ExperienciaController.php   ← CRUD experiencies + show + meves + rating
    UserController.php          ← Admin: gestio usuaris
    CategoryController.php      ← Admin: gestio categories
    ReportsController.php       ← Reports: crear + admin gestio
    PaisosController.php        ← Llistat de paisos
  Models/
    Post.php                    ← Experiencia (amb scopes, relacions)
    User.php, Category.php, Country.php, Rating.php, Report.php
  Services/
    ImageOptimizer.php          ← Resize + WebP amb GD
  Http/Middleware/
    CheckRole.php               ← Guard de rol per admin

resources/js/
  pages/
    home.tsx                    ← Pagina inicial
    explorar/index.tsx          ← Llistat d'experiencies
    experiencies/
      show.tsx                  ← Detall experiencia
      crear.tsx                 ← Formulari creacio (wrapper)
      editar.tsx                ← Formulari edicio (wrapper)
      meves.tsx                 ← Les meves experiencies (perfil)
    admin/
      index.tsx, users.tsx, category.tsx, reports.tsx, report-detail.tsx
    settings/
      profile.tsx, security.tsx, appearance.tsx
  components/
    experience-card.tsx         ← Card reutilitzable (vertical/horitzontal, sizes)
    experience-form.tsx         ← Formulari compartit crear/editar
    map-picker.tsx              ← Mapa interactiu per seleccionar ubicacio
    map-display.tsx             ← Mapa read-only per visualitzar
    main-header.tsx             ← Header public amb nav + dropdown
    user-Header.tsx             ← Header de perfil d'usuari
    modals/modal-report.tsx     ← Modal per reportar abus
  layouts/
    main-layout.tsx             ← Layout public (header + footer)
    admin-layout.tsx            ← Layout admin (sidebar)
```
