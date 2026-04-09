# Guia: "Les meves experiencies" — CRUD complet

## Resum

Pagina `/experiencies/meves` on l'usuari pot veure, editar i eliminar les seves experiencies. Inclou borradors i filtres per estat.

---

## 1. Backend: Rutes

A `routes/web.php`, dins del grup `auth + verified`:

```php
Route::get('/experiencies/meves', [ExperienciaController::class, 'meves'])->name('experiencies.meves');
Route::get('/experiencies/{post}/editar', [ExperienciaController::class, 'edit'])->name('experiencies.edit');
Route::patch('/experiencies/{post}', [ExperienciaController::class, 'update'])->name('experiencies.update');
Route::delete('/experiencies/{post}', [ExperienciaController::class, 'destroy'])->name('experiencies.destroy');
```

> **IMPORTANT**: Aquestes rutes han d'anar ABANS de la ruta `{post}` wildcard, igual que `/experiencies/crear`.

---

## 2. Backend: Controller — nous metodes

A `ExperienciaController.php`, afegir 4 metodes:

### `meves(Request $request)`

- Agafa els posts de l'usuari autenticat: `Post::where('user_id', auth()->id())`
- **No** filtrar per `published` — aqui volem tots els estats (draft, published, rejected)
- Accepta un query param `?status=draft|published` per filtrar
- Carrega relacions: `categories`, `mainCountry`, rating counts
- Ordena per `created_at` desc
- Pagina (10-12 per pagina)
- Retorna Inertia::render amb les experiencies + el filtre actiu

```php
public function meves(Request $request)
{
    $query = Post::where('user_id', $request->user()->id)
        ->with(['categories:id,name', 'mainCountry:code,name'])
        ->withCount([
            'ratings as ratings_up_count' => fn ($q) => $q->where('value', 1),
            'ratings as ratings_down_count' => fn ($q) => $q->where('value', -1),
        ]);

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    $experiences = $query->latest()->paginate(12)->withQueryString();

    return Inertia::render('experiencies/meves', [
        'experiences' => $experiences,
        'currentStatus' => $request->input('status', ''),
    ]);
}
```

### `edit(Post $post)`

- **Autoritzacio**: Comprova que `$post->user_id === auth()->id()`, si no `abort(403)`
- Carrega categories i paisos (igual que `create()`)
- Carrega les categories actuals del post: `$post->load('categories:id,name')`
- Retorna la pagina de formulari amb les dades pre-carregades

```php
public function edit(Post $post)
{
    if ($post->user_id !== auth()->id()) {
        abort(403);
    }

    $post->load('categories:id,name');
    $categories = Category::orderBy('name')->get(['id', 'name']);
    $countries = Country::orderBy('name')->get(['code', 'name']);

    return Inertia::render('experiencies/editar', [
        'experience' => $post,
        'categories' => $categories,
        'countries' => $countries,
    ]);
}
```

### `update(Request $request, Post $post)`

- **Autoritzacio**: Igual que edit, `abort(403)` si no es propietari
- Mateixa validacio que `store()` pero amb `'image' => 'nullable|image|max:2048'` (pot no canviar-la)
- Si puja nova imatge: eliminar l'antiga amb `Storage::disk('public')->delete()` i guardar la nova
- Si no puja imatge: mantenir l'existent
- Actualitzar camps i sync categories
- Redirigir a `/experiencies/meves`

```php
public function update(Request $request, Post $post)
{
    if ($post->user_id !== auth()->id()) {
        abort(403);
    }

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'experience_date' => 'nullable|date',
        'image' => 'nullable|image|max:2048',
        'location' => 'nullable|string|max:255',
        'country_code' => 'nullable|string|exists:countries,code',
        'categories' => 'required|array|min:1',
        'categories.*' => 'exists:categories,id',
        'status' => 'required|in:draft,published',
    ]);

    if ($request->hasFile('image')) {
        // Eliminar imatge antiga
        if ($post->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $post->image));
        }
        $validated['image'] = '/storage/' . $request->file('image')->store('experiences', 'public');
    } else {
        unset($validated['image']); // Mantenir l'existent
    }

    unset($validated['categories']);
    $post->update($validated);
    $post->categories()->sync($request->categories);

    return redirect()->route('experiencies.meves')->with('success', 'Experiencia actualitzada!');
}
```

### `destroy(Post $post)`

- **Autoritzacio**: abort(403) si no es propietari
- Eliminar imatge del storage si existeix
- Eliminar el post
- Redirigir a `/experiencies/meves`

```php
public function destroy(Post $post)
{
    if ($post->user_id !== auth()->id()) {
        abort(403);
    }

    if ($post->image) {
        Storage::disk('public')->delete(str_replace('/storage/', '', $post->image));
    }

    $post->delete();

    return redirect()->route('experiencies.meves')->with('success', 'Experiencia eliminada.');
}
```

---

## 3. Frontend: Pagina "Les meves experiencies"

Crear `resources/js/pages/experiencies/meves.tsx`

### Estructura

```
MainLayout
  └─ Titol "Les meves experiencies"
  └─ Tabs/pills de filtre: Totes | Publicades | Esborranys
  └─ Grid/Llista de cards propies
  └─ Paginacio
```

### Props

```typescript
type Props = {
    experiences: PaginatedData<Experience>;  // Reutilitza el tipus d'explorar
    currentStatus: string;
};
```

### Filtres per estat

Tres pills, igual que els filtres de sort a explorar:

```tsx
const statusFilters = [
    { key: '', label: 'Totes' },
    { key: 'published', label: 'Publicades' },
    { key: 'draft', label: 'Esborranys' },
];
```

Quan cliques una pill, navega amb `router.get('/experiencies/meves', { status: key })`.

### Cards personalitzades

Cada card hauria de mostrar:
- Imatge / placeholder
- Titol
- Estat amb badge de color (`published` = verd, `draft` = groc/ambar)
- Data de creacio
- Botons d'accio: **Editar** (Link a `/experiencies/{id}/editar`) i **Eliminar** (obre modal)

Pots reutilitzar `ExperienceCard` o fer un component nou `MyExperienceCard` que afegeixi els botons.

> **Tip**: Si reutilitzes ExperienceCard, afegeix un prop `showActions?: boolean` que mostri els botons.

### Modal d'eliminacio

Utilitza el `Dialog` component que ja existeix a `components/ui/dialog.tsx`:

```tsx
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose,
} from '@/components/ui/dialog';
```

```tsx
<Dialog>
    <DialogTrigger asChild>
        <Button variant="outline" size="sm">Eliminar</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Eliminar experiencia</DialogTitle>
            <DialogDescription>
                Segur que vols eliminar "{experience.title}"? Aquesta accio no es pot desfer.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel·lar</Button>
            </DialogClose>
            <Button
                variant="destructive"
                onClick={() => router.delete(`/experiencies/${experience.id}`)}
            >
                Eliminar
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

---

## 4. Frontend: Pagina d'edicio

Crear `resources/js/pages/experiencies/editar.tsx`

### Estrategia: reutilitzar el formulari de crear

La manera mes neta es extreure el formulari en un component compartit:

**Opcio A (recomanada)**: Crea `components/experience-form.tsx`
- Rep props: `experience?` (opcional, si existeix es mode edicio), `categories`, `countries`
- Dins fa `useForm` inicialitzat amb les dades de l'experiencia o buits
- El `onSubmit` fa `post('/experiencies')` si es nou o `post('/experiencies/{id}', { _method: 'PATCH' })` si es edicio

> **Nota Inertia**: Per fer PATCH amb fitxer (multipart), Inertia necessita enviar com a POST amb `_method: 'PATCH'`. Utilitza:
> ```typescript
> router.post(`/experiencies/${experience.id}`, {
>     ...data,
>     _method: 'PATCH',
>     forceFormData: true,
> });
> ```

**Opcio B (mes rapida)**: Copia `crear.tsx` a `editar.tsx` i:
- Afegeix prop `experience` amb les dades
- Inicialitza `useForm` amb `experience.title`, `experience.content`, etc.
- Les categories inicials: `experience.categories.map(c => c.id)`
- La imatge: mostra preview de l'existent (`experience.image`) si no se'n puja una nova
- Canvia el submit a `router.post(`/experiencies/${experience.id}`, { _method: 'PATCH', forceFormData: true })`
- Canvia el titol a "Editar experiencia"

---

## 5. Navegacio

Afegir link a "Les meves experiencies" al header:

A `main-header.tsx`, dins del `DropdownMenuContent` de l'usuari (on hi ha "Configuracio"):

```tsx
<DropdownMenuItem asChild>
    <Link href="/experiencies/meves" className="cursor-pointer">
        Les meves experiencies
    </Link>
</DropdownMenuItem>
```

---

## 6. Ordre d'implementacio suggerit

1. **Rutes** a `web.php` (5 min)
2. **Controller**: metode `meves()` (10 min)
3. **Pagina `meves.tsx`** amb llista + filtres + badge d'estat (30 min)
4. **Modal d'eliminacio** amb Dialog (15 min)
5. **Controller**: metodes `edit()`, `update()`, `destroy()` (15 min)
6. **Pagina `editar.tsx`** reutilitzant el formulari (20 min)
7. **Link al header** (5 min)
8. **Testejar**: crear, editar, eliminar, filtrar per estat (10 min)

---

## 7. Coses a tenir en compte

- **Autoritzacio**: Sempre comprova `$post->user_id === auth()->id()`. Mes endavant podries usar Policies de Laravel, pero per ara un `abort(403)` directe funciona.
- **Imatges**: Quan elimines un post o canvies la imatge, elimina l'antiga del storage.
- **PATCH amb fitxers**: Inertia no suporta PATCH natiu amb FormData. Usa `router.post()` amb `_method: 'PATCH'`.
- **Flash messages**: El controller retorna `->with('success', '...')`. Pots mostrar-les amb un toast o alert temporal a la pagina.
- **Estat `rejected`**: De moment no es gestiona (sera per admin panel). No el mostris com a opcio al formulari.
