# Explicació tècnica: Flux Laravel + Inertia + React

## Resum

L'aplicació PathFinder utilitza **Laravel** com a backend, **React 19** com a frontend i **Inertia.js** com a pont entre ambdós. Inertia elimina la necessitat d'una API REST tradicional: el controlador de Laravel renderitza directament components de React i els hi passa dades com a Props.

---

## Flux de dades complet

```
[Usuari] → [URL /] → [Ruta web.php] → [HomeController] → [Eloquent BD]
                                              ↓
                                    Inertia::render('Home', ['llista' => $experiencies])
                                              ↓
                                    [JSON injectat automàticament]
                                              ↓
                                    [Home.jsx rep { llista } com a Prop]
                                              ↓
                                    [map() → ExperienciaCard per cada element]
                                              ↓
                                    [Tot dins de MainLayout (persistent, sense recàrrega)]
```

---

## 1. El Controlador

El controlador demana les dades a la base de dades i decideix quina pàgina de React s'ha de carregar.

**Fitxer:** `app/Http/Controllers/HomeController.php`

```php
public function index() {
    // 1. Obtenim les dades de la BD (Eloquent)
    $experiencies = Experiencia::latest()->take(5)->get();

    // 2. Renderitzem la pàgina de React i li passem les dades com a array
    // 'Home' fa referència a resources/js/pages/Home.jsx
    return Inertia::render('Home', [
        'llista' => $experiencies
    ]);
}
```

**Punts clau:**
- `Inertia::render('Home', [...])` busca el fitxer `resources/js/Pages/Home.jsx`.
- L'array associatiu (`'llista' => $experiencies`) es converteix automàticament en Props de React.
- Eloquent retorna una col·lecció que Inertia serialitza a JSON de forma transparent.

---

## 2. La Ruta

Vinculem una adreça URL amb el mètode del controlador.

**Fitxer:** `routes/web.php`

```php
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
```

**Punts clau:**
- Quan l'usuari entra a l'arrel (`/`), Laravel executa `HomeController@index`.
- `->name('home')` permet referenciar la ruta per nom (útil per a `route('home')` en Blade o `route('home')` amb Ziggy a React).

---

## 3. La Vista amb React

L'arquitectura es divideix en **tres nivells** per separar responsabilitats:

### 3.1. El Layout (persistent)

La part de la web que **no canvia** al navegar. No es torna a carregar.

**Fitxer:** `resources/js/Layouts/MainLayout.jsx`

```jsx
export default function MainLayout({ children }) {
    return (
        <div>
            <nav><h1>Viatges.cat</h1></nav>
            <main>
                {children} {/* Aquí s'injectarà la pàgina Home */}
            </main>
        </div>
    );
}
```

**Punts clau:**
- `{children}` és on Inertia injecta la pàgina actual.
- El layout es manté muntat entre navegacions (no es re-renderitza), cosa que dona una experiència SPA.

### 3.2. El Component (reutilitzable)

Una peça petita de la vista que es pot repetir i reutilitzar.

**Fitxer:** `resources/js/Components/ExperienciaCard.jsx`

```jsx
export default function ExperienciaCard({ exp }) {
    return (
        <div className="card">
            <h3>{exp.titol}</h3>
        </div>
    );
}
```

**Punts clau:**
- Rep dades via Props (`exp`).
- És independent de la pàgina — es pot usar a Home, a un llistat, a una cerca, etc.

### 3.3. La Pàgina (rep dades del controlador)

Rep les dades del controlador Laravel i les distribueix als components.

**Fitxer:** `resources/js/Pages/Home.jsx`

```jsx
import MainLayout from '@/Layouts/MainLayout';
import ExperienciaCard from '@/Components/ExperienciaCard';

export default function Home({ llista }) { // 'llista' ve del controlador
    return (
        <section>
            <h2>Últimes Experiències</h2>
            {llista.map(item => (
                <ExperienciaCard key={item.id} exp={item} />
            ))}
        </section>
    );
}

// Layout persistent (funcionalitat d'Inertia)
Home.layout = page => <MainLayout children={page} />;
```

**Punts clau:**
- `{ llista }` als Props ve directament de `'llista' => $experiencies` del controlador.
- `Home.layout = page => <MainLayout>` diu a Inertia que faci servir el layout de forma **persistent** (sense re-muntar-lo al navegar).
- `.map()` recorre la llista i crea un `ExperienciaCard` per a cada experiència.

---

## 4. Com funciona Inertia per dins

### Primera càrrega (navegador buit)
1. Laravel renderitza un HTML complet amb un `<div id="app" data-page="{...}">`.
2. El JSON de la pàgina (nom del component + props) s'inclou dins l'atribut `data-page`.
3. React es munta i renderitza el component corresponent.

### Navegacions posteriors (SPA)
1. Inertia intercepta els clics a `<Link>` (component d'Inertia).
2. Fa una petició XHR al servidor (no una recàrrega completa).
3. Laravel retorna **només el JSON** (nom del component + props noves).
4. Inertia swapeja el component de React sense recarregar la pàgina.
5. El Layout es manté muntat → experiència SPA real.

---

## 5. Estructura de fitxers

```
app/
├── Http/Controllers/
│   └── HomeController.php          ← Controlador
├── Models/
│   └── Experiencia.php             ← Model Eloquent
routes/
│   └── web.php                     ← Rutes
resources/js/
├── Layouts/
│   └── MainLayout.jsx              ← Layout persistent
├── Components/
│   └── ExperienciaCard.jsx         ← Component reutilitzable
├── Pages/
│   └── Home.jsx                    ← Pàgina (rep props del controller)
└── app.jsx                         ← Punt d'entrada d'Inertia/React
```

---

## 6. Resum del moviment de dades

| Pas | Què passa | On |
|-----|-----------|-----|
| 1 | Laravel obté `$experiencies` de la BD | `HomeController.php` |
| 2 | Inertia transforma les dades en JSON | Automàtic |
| 3 | React rep `llista` com a Prop | `Home.jsx` |
| 4 | React recorre `llista` amb `.map()` | `Home.jsx` |
| 5 | Cada element es renderitza com un Component | `ExperienciaCard.jsx` |
| 6 | Tot es mostra dins el Layout persistent | `MainLayout.jsx` |
