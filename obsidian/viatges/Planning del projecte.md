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

## 1. `feature/project-setup` ⚠️ PARCIALMENT COMPLETAT

**Prioritat:** Molt Alta — Base del projecte
**Dependències:** Cap

### Descripció
Configuració inicial del projecte: Laravel + Inertia + React 19. Estructura de carpetes, configuració de BBDD, seeds, Tailwind, i autenticació.

### Estat actual — Ja fet
- [x] **Backend:** Inicialitzar projecte Laravel 12 amb Inertia 2.
- [x] **Backend:** Configurar connexió a la base de dades (SQLite configurat).
- [x] **Backend:** Configurar autenticació amb Fortify (login, register, 2FA, email verification).
- [x] **Frontend:** Instal·lar React 19.2 + Inertia React adapter + TypeScript.
- [x] **Frontend:** Configurar Tailwind 4 + shadcn components.
- [x] **Frontend:** Configurar alias `@/` per a imports.
- [x] **Frontend:** Pàgines d'auth creades (login, register, forgot-password, verify-email, 2FA).
- [x] **Frontend:** Pàgines de settings creades (profile, security, appearance).

### Tasques pendents
- [x] **Backend:** Crear migracions de negoci: `experiencies`, `categories`, `votes`, `reports`.
- [x] **Backend:** Afegir camp `role` a la taula `users` (`enum: user, moderator, admin`, default: `user`).
- [x] **Backend:** Crear models Eloquent: `Experiencia`, `Category`, `Vote`, `Report`.
- [x] **Backend:** Crear seeders amb dades de prova (usuaris dels 3 rols, categories, experiències).
- [x] **Backend:** Middleware de rol (`CheckRole`) per protegir rutes d'administració.
- [ ] **Frontend:** Crear `MainLayout.tsx` (header, nav, footer amb copyright) — layout persistent per a la vista d'usuari.
- [x] **Frontend:** Crear `AdminLayout.tsx` — layout per a la vista d'administració (sidebar/tabs).
- [ ] **Docs:** Diagrama relacional de la base de dades (PDF).
- [ ] **Docs:** Esbós de l'estructura del lloc (PDF).
- [ ] **Docs:** README.md amb integrants, objectiu i resum.

---

## 2. `feature/home-page` 🆕 PENDENT

**Prioritat:** Molt Alta — Primera pàgina visible
**Dependències:** `feature/project-setup`

### Descripció
Pàgina d'inici pública (vista d'usuari) amb logotip, text de benvinguda, animació hover en imatge, llistat d'últimes experiències (títols) i àrea de login/registre.

### Tasques
- [ ] **Backend:** `HomeController` — obtenir últimes experiències publicades.
- [ ] **Backend:** Ruta `GET /` → `HomeController@index`.
- [ ] **Frontend:** Pàgina `Home.tsx` amb logotip, títol, imatge amb animació hover, text de benvinguda.
- [ ] **Frontend:** Llistat de títols d'últimes experiències (usuari no registrat).
- [ ] **Frontend:** Àrea d'inici de sessió i registre (links o formularis inline).
- [ ] **Frontend:** Disseny responsive.

---

## 3. `feature/experiences-list` 🆕 PENDENT

**Prioritat:** Alta — Core de l'aplicació
**Dependències:** `feature/project-setup` (auth ja està fet)

### Descripció
Llistat d'experiències complet per a usuaris registrats (vista d'usuari). Substitueix "Últimes entrades" després del login. Inclou fitxa resum, selector de categoria, cercador, ordenació per data o puntuació, i visualització completa.

### Tasques
- [ ] **Backend:** `ExperienciaController@index` — llistat amb filtres (categoria, cerca, ordre).
- [ ] **Backend:** `ExperienciaController@show` — detall complet d'una experiència.
- [ ] **Backend:** Query scopes per filtrar per categoria, cercar per títol/text, ordenar per data/puntuació.
- [ ] **Frontend:** Pàgina de llistat d'experiències amb fitxa resum (card).
- [ ] **Frontend:** Selector de categoria (dropdown o pills).
- [ ] **Frontend:** Buscador d'experiències (input amb debounce).
- [ ] **Frontend:** Ordenació per data o puntuació (selector).
- [ ] **Frontend:** Pàgina de detall d'una experiència (títol, data, text, imatge, mapa, categories, votacions).
- [ ] **Frontend:** Navegació SPA sense recàrrega (Inertia `<Link>`).

---

## 4. `feature/create-experience` 🆕 PENDENT

**Prioritat:** Alta — Generació de contingut
**Dependències:** `feature/project-setup`

### Descripció
Creació d'experiències per part d'usuaris registrats. Formulari amb títol, text, imatge destacada, coordenades (mapa), categories i estat (esborrany/publicada).

### Tasques
- [ ] **Backend:** `ExperienciaController@store` — crear experiència amb validació.
- [ ] **Backend:** Gestió d'imatges (upload, emmagatzematge, optimització).
- [ ] **Backend:** Validació de camps obligatoris (títol, text, categoria, imatge).
- [ ] **Backend:** Suport per a estats: esborrany, publicada.
- [ ] **Frontend:** Formulari de creació amb camps: títol, text (editor ric opcional), imatge, categories, coordenades.
- [ ] **Frontend:** Integració de mapa (Google Maps o Leaflet/OpenStreetMap) per seleccionar coordenades.
- [ ] **Frontend:** Validació client dels camps.
- [ ] **Frontend:** Preview de la imatge abans de pujar.
- [ ] **Frontend:** Opció de guardar com a esborrany o publicar directament.

---

## 5. `feature/voting` 🆕 PENDENT

**Prioritat:** Alta — Interacció entre usuaris
**Dependències:** `feature/experiences-list`

### Descripció
Sistema de votació +1 / -1 per a experiències. Un usuari registrat pot votar una experiència una vegada.

### Tasques
- [ ] **Backend:** Model `Vote` amb relació `user_id` + `experiencia_id` + `value` (+1/-1).
- [ ] **Backend:** Endpoint `POST /experiencies/{id}/vote` — crear o actualitzar vot.
- [ ] **Backend:** Constraint UNIQUE per evitar duplicats (un vot per usuari per experiència).
- [ ] **Backend:** Comptador de valoracions positives i negatives a l'experiència.
- [ ] **Frontend:** Botons de +1 / -1 a la card i al detall de l'experiència.
- [ ] **Frontend:** Estat visual del vot de l'usuari actual (destacat si ja ha votat).
- [ ] **Frontend:** Actualització optimista del comptador.

---

## 6. `feature/user-profile` 🆕 PENDENT

**Prioritat:** Mitjana-Alta
**Dependències:** `feature/create-experience`

### Descripció
Secció d'usuari registrat (vista d'usuari, mateixa pàgina): modificació de dades personals, edició i eliminació de les pròpies experiències.

### Tasques
- [ ] **Backend:** `ExperienciaController@update` — editar experiència pròpia.
- [ ] **Backend:** `ExperienciaController@destroy` — eliminar experiència pròpia.
- [ ] **Backend:** Autorització: només el propietari pot editar/eliminar les seves experiències.
- [ ] **Frontend:** Llistat d'experiències pròpies amb accions d'editar/eliminar.
- [ ] **Frontend:** Confirmació abans d'eliminar.

> **Nota:** La modificació de dades personals (nom, email, contrasenya) ja existeix a `/settings/profile` i `/settings/security` via Fortify.

---

## 7. `feature/report-abuse` 🆕 PENDENT

**Prioritat:** Mitjana
**Dependències:** `feature/experiences-list`

### Descripció
Sistema de reportar abusos (vista d'usuari). Els usuaris poden reportar experiències que considerin inadequades. Les experiències reportades es marquen per a revisió a la vista d'administració.

### Tasques
- [ ] **Backend:** Model `Report` amb `user_id`, `experiencia_id`, `motiu`, `estat` (pendent, revisat, descartat).
- [ ] **Backend:** Endpoint `POST /experiencies/{id}/report` — crear report.
- [ ] **Backend:** Evitar reports duplicats del mateix usuari a la mateixa experiència.
- [ ] **Frontend:** Botó/link "Reportar abús" a la vista completa de l'experiència (només per a usuaris registrats, no visible a la portada pública).
- [ ] **Frontend:** Modal amb camp de motiu del report.
- [ ] **Frontend:** Confirmació visual un cop enviat.

---

## 8. `feature/admin-panel` 🆕 PENDENT

**Prioritat:** Mitjana
**Dependències:** `feature/project-setup` (rols), `feature/report-abuse`

### Descripció
Vista d'administració amb accés diferenciat per rol. Pot funcionar amb recàrrega de pàgina (no cal SPA).

### Permisos per rol

| Secció | `moderator` | `admin` |
|--------|:-----------:|:-------:|
| Reports (experiències reportades) | ✅ | ✅ |
| Gestió de categories | ❌ | ✅ |
| Gestió d'usuaris | ❌ | ✅ |

### Tasques
- [ ] **Backend:** Middleware `CheckRole` — accepta una llista de rols permesos.
- [ ] **Backend:** Rutes d'admin protegides amb `middleware('role:moderator,admin')`.
- [ ] **Backend:** Rutes de categories i usuaris protegides amb `middleware('role:admin')`.
- [ ] **Backend:** `AdminReportController` — llistat de reports, accions mantenir/rebutjar experiència.
- [ ] **Backend:** `AdminCategoryController` — CRUD de categories.
- [ ] **Backend:** `AdminUserController` — llistat d'usuaris, baixa d'usuari (soft delete o desactivació).
- [ ] **Frontend:** `AdminLayout.tsx` amb sidebar/tabs condicionals segons el rol de l'usuari.
- [ ] **Frontend:** Pàgina `/admin` amb guard de rol (`moderator` o `admin`).
- [ ] **Frontend:** Tab "Reports": llistat d'experiències reportades amb accions mantenir/rebutjar (visible per `moderator` i `admin`).
- [ ] **Frontend:** Tab "Categories": llistat, crear, editar, eliminar (només visible per `admin`).
- [ ] **Frontend:** Tab "Usuaris": llistat amb acció de baixa (només visible per `admin`).
- [ ] **Frontend:** Navegació: link a `/admin` visible al header/menú només si l'usuari és `moderator` o `admin`.

---

## 9. `feature/rich-experiences` 🆕 PENDENT

**Prioritat:** Mitjana — Millora de contingut
**Dependències:** `feature/create-experience`

### Descripció
Millorar la creació d'experiències amb editor ric (markdown/HTML), múltiples imatges, i integració avançada de mapa.

### Tasques
- [ ] **Backend:** Suport per a text en markdown o HTML (sanititzat).
- [ ] **Backend:** Múltiples imatges per experiència (galeria).
- [ ] **Backend:** Optimització d'imatges (format, qualitat, mida segons pantalla).
- [ ] **Frontend:** Editor ric de text (TipTap, React-Quill, o similar).
- [ ] **Frontend:** Upload múltiple d'imatges amb preview.
- [ ] **Frontend:** Lazy loading d'imatges.
- [ ] **Frontend:** Imatges servides des de CDN (Cloudinary).
- [ ] **Frontend:** Mapa interactiu amb Google Maps o OpenStreetMap + Leaflet.

---

## 10. `feature/home-improvements` 🆕 PENDENT

**Prioritat:** Baixa-Mitjana — Millora de la pàgina d'inici
**Dependències:** `feature/experiences-list`

### Descripció
Millores opcionals de la pàgina d'inici: mostrar cards d'experiència en lloc de només títols, afegir filtres i cercador a la portada.

### Tasques
- [ ] **Frontend:** Substituir llistat de títols per cards d'experiència (ExperienciaCard).
- [ ] **Frontend:** Cards mostren info de l'experiència però sense link de reportar i sense poder votar.
- [ ] **Frontend:** Afegir filtres de categoria i cercador a la pàgina d'inici.

---

## 11. `feature/responsive-design` 🆕 PENDENT

**Prioritat:** Mitjana — Requisit tècnic
**Dependències:** Cap (es pot fer en paral·lel)

### Descripció
Assegurar disseny adaptatiu (responsive) a totes les pantalles. Compatibilitat amb Firefox i Chrome. Estètica coherent.

### Tasques
- [ ] **Frontend:** Revisar i ajustar breakpoints per a mòbil, tablet i escriptori.
- [ ] **Frontend:** Testejar en Firefox i Chrome (últimes versions estables).
- [ ] **Frontend:** Peu de pàgina amb copyright i informació legal.
- [ ] **Frontend:** Menú de navegació responsiu (hamburguesa en mòbil).
- [ ] **Frontend:** Qualitat Tailwind: organització, variables.

---

## 12. `feature/deployment` 🆕 PENDENT

**Prioritat:** Mitjana — Publicació
**Dependències:** Totes les anteriors (o les que estiguin llestes)

### Descripció
Configuració d'entorns de desenvolupament, preproducció i producció. Documentació d'instal·lació.

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
 ├── feature/project-setup              (merge 1 — completar base: models, migracions, rols, layouts)
 ├── feature/home-page                  (merge 2 — primera pàgina visible)
 ├── feature/experiences-list           (merge 3 — core de l'app)
 ├── feature/create-experience          (merge 4 — generació de contingut)
 ├── feature/voting                     (merge 5 — interacció)
 ├── feature/user-profile               (merge 6 — gestió personal)
 ├── feature/report-abuse               (merge 7 — moderació bàsica)
 ├── feature/admin-panel                (merge 8 — vista d'administració amb rols)
 ├── feature/rich-experiences           (merge 9 — millora de contingut)
 ├── feature/home-improvements          (merge 10 — millora pàgina inici)
 ├── feature/responsive-design          (merge 11 — en paral·lel)
 └── feature/deployment                 (merge 12 — publicació final)
```

---

## Planificació temporal

| Setmana | Dates | Hores | Objectiu |
|---------|-------|-------|----------|
| 1 | 16/03 – 20/03 | 8h | Completar setup (models, rols, migracions) + Home page + Llistat experiències |
| 2 | 23/03 – 27/03 | 8h | Creació experiències + Votació + Perfil + Reports |
| 3 | 07/04 – 10/04 | 5h | Admin panel (moderator/admin) + Millores + Responsive + Deploy |

**Presentació:** Data a confirmar — 10 min (3 demo + 5 presentació + 2 preguntes).
