# Plan de Branches — Viatges

Cada secció correspon a una branca de git independent. Les branques amb dependències s'han de mergear en ordre. El backlog ja està prioritzat pel Product Owner.

## Arquitectura de rols i vistes

### 3 Rols
| Rol | Descripció |
|-----|-----------|
| `user` | Usuari registrat. Pot crear, editar, votar i reportar experiències. |
| `moderator` | Accés a la **vista d'administració** però només a la secció de **reports** (revisar i rebutjar experiències reportades). |
| `admin` | Accés complet a la **vista d'administració**: reports + gestió de categories + gestió d'usuaris. |

### 2 Vistes
| Vista | Qui hi accedeix | Comportament |
|-------|----------------|-------------|
| **Vista d'usuari** | Tothom (públic + `user` + `moderator` + `admin`) | SPA sense recàrrega. Portada, experiències, perfil. |
| **Vista d'administració** | `moderator` i `admin` | Pot funcionar amb recàrrega. Panell amb tabs segons el rol. |

---

## 1. `feature/project-setup` ✅ COMPLETAT

**Prioritat:** Molt Alta — Base del projecte
**Dependències:** Cap

### Tasques
- [x] **Backend:** Inicialitzar projecte Laravel 12 amb Inertia 2.
- [x] **Backend:** Configurar connexió a la base de dades (SQLite configurat).
- [x] **Backend:** Configurar autenticació amb Fortify (login, register, 2FA, email verification).
- [x] **Backend:** Crear migracions de negoci: `posts`, `categories`, `ratings`, `reports`, `notifications`.
- [x] **Backend:** Afegir camp `role` a la taula `users` (`enum: user, moderator, admin`, default: `user`).
- [x] **Backend:** Crear models Eloquent: `Post`, `Category`, `Rating`, `Report`, `Notification`, `Country`.
- [x] **Backend:** Crear seeders amb dades de prova (usuaris dels 3 rols, categories, experiències, ratings, reports).
- [x] **Backend:** Middleware de rol (`CheckRole`) per protegir rutes d'administració.
- [x] **Frontend:** Instal·lar React 19.2 + Inertia React adapter + TypeScript.
- [x] **Frontend:** Configurar Tailwind 4 + shadcn components (40+ components).
- [x] **Frontend:** Configurar alias `@/` per a imports.
- [x] **Frontend:** Pàgines d'auth creades (login, register, forgot-password, verify-email, 2FA).
- [x] **Frontend:** Pàgines de settings creades (profile, security, appearance).
- [x] **Frontend:** Crear `MainLayout.tsx` (header amb nav responsiu, footer amb copyright).
- [x] **Frontend:** Crear `AdminLayout.tsx` — layout per a la vista d'administració (sidebar/tabs).
- [ ] **Docs:** Diagrama relacional de la base de dades (Obsidian md).
- [ ] **Docs:** README.md amb integrants, objectiu i resum.

---

## 2. `feature/home-page` ✅ COMPLETAT

**Prioritat:** Molt Alta — Primera pàgina visible
**Dependències:** `feature/project-setup`

### Tasques
- [x] **Backend:** `HomeController@index` — obtenir últimes experiències publicades + featured.
- [x] **Backend:** Ruta `GET /` → `HomeController@index`.
- [x] **Frontend:** Pàgina `Home.tsx` amb logotip, títol, hero amb experiència destacada, text de benvinguda.
- [x] **Frontend:** Llistat de les 3 últimes experiències amb `ExperienceCard` (size `lg`).
- [x] **Frontend:** Àrea d'inici de sessió i registre (CTAs, s'oculta "Registrar-se" si ja has iniciat sessió).
- [x] **Frontend:** Disseny responsive amb animacions fade-up.
- [x] **Frontend:** Experiència destacada amb link a la seva pàgina de detall.

---

## 3. `feature/experiences-list` ✅ COMPLETAT

**Prioritat:** Alta — Core de l'aplicació
**Dependències:** `feature/project-setup`

### Tasques
- [x] **Backend:** `ExperienciaController@index` — llistat amb filtres (categoria, país, cerca, ordre).
- [x] **Backend:** `ExperienciaController@show` — detall complet amb stats de l'autor.
- [x] **Backend:** Query scopes: `published()`, `byCategory()`, `search()`.
- [x] **Frontend:** Pàgina `/explorar` amb cards (grid/llista), sidebar (countries trending, top users).
- [x] **Frontend:** Barra de països amb marquee animat.
- [x] **Frontend:** Panel de filtres: categories + països.
- [x] **Frontend:** Buscador amb debounce.
- [x] **Frontend:** Ordenació: Popular, Nou, Data, Puntuació.
- [x] **Frontend:** Vista grid (masonry) i llista (horitzontal).
- [x] **Frontend:** Paginació.
- [x] **Frontend:** Pàgina de detall (`show.tsx`): hero amb imatge, contingut, mapa Leaflet, sidebar autor + valoració + detalls.
- [x] **Frontend:** Navegació SPA sense recàrrega (Inertia `<Link>` a cards).

---

## 4. `feature/create-experience` ✅ COMPLETAT

**Prioritat:** Alta — Generació de contingut
**Dependències:** `feature/project-setup`

### Tasques
- [x] **Backend:** `ExperienciaController@store` — crear experiència amb validació condicional (draft vs published).
- [x] **Backend:** Gestió d'imatges: upload, emmagatzematge, optimització (WebP, resize max 1600px) via `ImageOptimizer`.
- [x] **Backend:** Validació de camps obligatoris per a publicació (títol, contingut, categories).
- [x] **Backend:** Suport per a estats: esborrany (validació relaxada), publicada (validació estricta).
- [x] **Frontend:** Component compartit `ExperienceForm` reutilitzat per crear i editar.
- [x] **Frontend:** Camps: títol, contingut, imatge amb preview, categories (pills multi-selecció), país, data, mapa interactiu (Leaflet).
- [x] **Frontend:** `MapPicker` — selecció de coordenades clicant al mapa (OpenStreetMap + Leaflet vanilla).
- [x] **Frontend:** Validació client: banner d'error quan falten camps obligatoris per publicar.
- [x] **Frontend:** Preview de la imatge abans de pujar.
- [x] **Frontend:** Opció de guardar com a esborrany o publicar directament.
- [x] **Frontend:** Lazy loading del mapa per evitar problemes SSR.
- [x] **Frontend:** Botó "Crear" al header (visible només si logat).

---

## 5. `feature/voting` ✅ COMPLETAT

**Prioritat:** Alta — Interacció entre usuaris
**Dependències:** `feature/experiences-list`

### Tasques
- [x] **Backend:** Model `Rating` amb relació `user_id` + `post_id` + `value` (+1/-1).
- [x] **Backend:** Endpoint `PUT /experiencies/{id}/rating` — crear, actualitzar o eliminar vot.
- [x] **Backend:** Constraint: un vot per usuari per experiència (updateOrCreate).
- [x] **Backend:** Comptador de valoracions positives i negatives a l'experiència (withCount).
- [x] **Frontend:** Botons de +1 / -1 a la pàgina de detall de l'experiència.
- [x] **Frontend:** Estat visual del vot de l'usuari actual (destacat si ja ha votat).
- [x] **Frontend:** Actualització optimista del comptador.

---

## 6. `feature/user-profile` ✅ COMPLETAT

**Prioritat:** Mitjana-Alta
**Dependències:** `feature/create-experience`

### Tasques
- [x] **Backend:** `ExperienciaController@update` — editar experiència pròpia (validació condicional draft/published).
- [x] **Backend:** `ExperienciaController@destroy` — eliminar experiència pròpia (+ eliminar imatge del storage).
- [x] **Backend:** `ExperienciaController@meves` — llistat filtrable per estat i cerca.
- [x] **Backend:** Autorització: `abort(403)` si no és propietari.
- [x] **Frontend:** Pàgina `/settings/experiences` integrada al layout de perfil (`UserHeader`).
- [x] **Frontend:** Llistat d'experiències pròpies amb filtres: Totes / Publicades / Esborranys.
- [x] **Frontend:** Cards amb badges d'estat (verd/ambar), botons: Veure, Editar, Eliminar.
- [x] **Frontend:** Modal de confirmació abans d'eliminar (shadcn Dialog).
- [x] **Frontend:** Link "Gestió d'experiencies" al dropdown del header.

> **Nota:** La modificació de dades personals (nom, email, contrasenya) ja existeix a `/settings/profile` i `/settings/security` via Fortify.

---

## 7. `feature/report-abuse` ✅ COMPLETAT

**Prioritat:** Mitjana
**Dependències:** `feature/experiences-list`

### Tasques
- [x] **Backend:** Model `Report` amb `user_id`, `post_id`, `reason`, `status` (pending, accepted, dismissed).
- [x] **Backend:** Endpoint `POST /reports` — crear report amb motiu.
- [x] **Backend:** Evitar reports duplicats del mateix usuari a la mateixa experiència.
- [x] **Frontend:** Botó "Reportar abús" a la vista completa de l'experiència (només per a usuaris registrats).
- [x] **Frontend:** Modal (`ModalReport`) amb camp de motiu del report.
- [x] **Frontend:** Confirmació visual un cop enviat.

---

## 8. `feature/admin-panel` ✅ COMPLETAT

**Prioritat:** Mitjana
**Dependències:** `feature/project-setup` (rols), `feature/report-abuse`

### Permisos per rol

| Secció | `moderator` | `admin` |
|--------|:-----------:|:-------:|
| Reports (experiències reportades) | ✅ | ✅ |
| Gestió de categories | ❌ | ✅ |
| Gestió d'usuaris | ❌ | ✅ |

### Tasques
- [x] **Backend:** Middleware `CheckRole` — accepta una llista de rols permesos.
- [x] **Backend:** Rutes d'admin protegides amb `middleware('role:moderator,admin')`.
- [x] **Backend:** `ReportsController` — llistat, detall, acceptar, descartar, eliminar report; canviar estat del post (rejected/published).
- [x] **Backend:** `CategoryController` — CRUD de categories.
- [x] **Backend:** `UserController` — llistat d'usuaris, crear, editar, toggle active.
- [x] **Backend:** Stats globals compartides via middleware (totalReports, totalCategories, totalUsuaris, totalExperiencies).
- [x] **Frontend:** `AdminLayout.tsx` amb sidebar condicional segons rol.
- [x] **Frontend:** Pàgina `/admin` amb dashboard summary.
- [x] **Frontend:** Pàgina Reports: llistat amb filtres, detall, accions mantenir/rebutjar.
- [x] **Frontend:** Pàgina Categories: llistat, crear, editar, eliminar.
- [x] **Frontend:** Pàgina Usuaris: llistat amb cerca, crear, editar, toggle active.
- [x] **Frontend:** Link a `/admin` visible al header si l'usuari és `moderator` o `admin`.

---

## 9. `feature/rich-experiences` ⚠️ PARCIALMENT COMPLETAT

**Prioritat:** Mitjana — Millora de contingut
**Dependències:** `feature/create-experience`

### Tasques
- [ ] **Backend:** Suport per a text en markdown o HTML (sanititzat).
- [ ] **Backend:** Múltiples imatges per experiència (galeria).
- [x] **Backend:** Optimització d'imatges: `ImageOptimizer` servei — resize (max 1600px), conversió a WebP (qualitat 80%), GD nativa.
- [ ] **Frontend:** Editor ric de text (TipTap, React-Quill, o similar).
- [ ] **Frontend:** Upload múltiple d'imatges amb preview.
- [x] **Frontend:** Lazy loading d'imatges (`loading="lazy"` a cards i llistes).
- [x] **Frontend:** Imatges servides des de CDN (Cloudinary) — amb fallback a local si no esta configurat.
- [x] **Frontend:** Mapa interactiu amb OpenStreetMap + Leaflet vanilla.
  - `MapPicker` — selecció de coordenades al formulari (clic al mapa).
  - `MapDisplay` — visualització read-only a la pàgina de detall.
  - Cleanup correcte amb Inertia SPA navigation.
  - `isolation: isolate` per evitar z-index conflicts amb modals.
- [ ] **Frontend:** Lightbox per veure imatges a pantalla completa.

---

## 10. `feature/home-improvements` ✅ COMPLETAT

**Prioritat:** Baixa-Mitjana — Millora de la pàgina d'inici
**Dependències:** `feature/experiences-list`

### Tasques
- [x] **Frontend:** Cards d'experiència (`ExperienceCard` amb size `lg`) a la pàgina d'inici.
- [x] **Frontend:** Cards mostren info de l'experiència sense link de reportar i sense poder votar.
- [x] **Frontend:** Experiència destacada (featured) al hero amb link.

---

## 11. `feature/responsive-design` ⚠️ PARCIALMENT COMPLETAT

**Prioritat:** Mitjana — Requisit tècnic
**Dependències:** Cap (es pot fer en paral·lel)

### Tasques
- [x] **Frontend:** Menú de navegació responsiu (hamburguesa en mòbil) — `MainHeader` i `UserHeader`.
- [x] **Frontend:** Peu de pàgina amb copyright i links legals (`MainFooter`): Inici, Explorar, Contacte, Politica de privacitat, Termes i condicions, Politica de cookies.
- [x] **Frontend:** Pagina Politica de privacitat (`/politica-privacitat`) amb 10 seccions legals.
- [x] **Frontend:** Pagina Politica de cookies (`/politica-cookies`) amb detall de cookies, taula i tercers.
- [ ] **Frontend:** Revisar i ajustar breakpoints per a mòbil, tablet i escriptori (test exhaustiu).
- [ ] **Frontend:** Testejar en Firefox i Chrome (últimes versions estables).
- [ ] **Frontend:** Qualitat Tailwind: organització, variables.

---

## 12. `feature/deployment` 🆕 PENDENT

**Prioritat:** Mitjana — Publicació
**Dependències:** Totes les anteriors (o les que estiguin llestes)

### Tasques
- [ ] **DevOps:** Entorn de desenvolupament documentat (`.env.example`, `docker-compose` opcional).
- [ ] **DevOps:** Entorn de preproducció configurat.
- [ ] **DevOps:** Entorn de producció configurat.
- [ ] **Docs:** Instruccions d'instal·lació al README.
- [ ] **Docs:** SEGURETAT.txt si hi ha aspectes no implementats.
- [ ] **Docs:** Fitxer SQL de creació de la base de dades.
- [ ] **Docs:** Fitxer SQL amb dades de prova.

---

## Ordre de merge suggerit

```
develop
 ├── feature/project-setup              ✅ (merge 1)
 ├── feature/home-page                  ✅ (merge 2)
 ├── feature/experiences-list           ✅ (merge 3)
 ├── feature/create-experience          ✅ (merge 4)
 ├── feature/voting                     ✅ (merge 5)
 ├── feature/user-profile               ✅ (merge 6)
 ├── feature/report-abuse               ✅ (merge 7)
 ├── feature/admin-panel                ✅ (merge 8)
 ├── feature/rich-experiences           ⚠️ (merge 9 — parcial)
 ├── feature/home-improvements          ✅ (merge 10)
 ├── feature/responsive-design          ⚠️ (merge 11 — parcial)
 └── feature/deployment                 🆕 (merge 12 — pendent)
```
