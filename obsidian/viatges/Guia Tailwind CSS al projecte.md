# Guia Tailwind CSS al projecte PathFinder

## Configuració actual

El projecte utilitza **Tailwind CSS 4.0** amb la nova aproximació **CSS-first** (sense fitxer `tailwind.config.js`). Tot es configura directament al CSS.

### Stack
| Eina | Versió | Funció |
|------|--------|--------|
| Tailwind CSS | 4.0 | Framework d'utilitats CSS |
| @tailwindcss/vite | 4.1 | Integració amb Vite (substitueix PostCSS) |
| shadcn/ui | — | Components pre-construïts amb Tailwind |
| tw-animate-css | — | Animacions CSS |
| CVA (class-variance-authority) | — | Variants de components |
| tailwind-merge | — | Merge intel·ligent de classes |
| clsx | — | Concatenació condicional de classes |

---

## Fitxers clau

### 1. CSS principal: `resources/css/app.css`

Aquest fitxer és la **configuració central** de Tailwind 4. No hi ha `tailwind.config.js`.

```css
@import 'tailwindcss';          /* Importa Tailwind */
@import 'tw-animate-css';       /* Animacions */
@import "shadcn/tailwind.css";  /* Components shadcn */
@import "@fontsource-variable/inter"; /* Font */

/* Escaneig de fitxers Laravel Blade */
@source "../views";
@source "../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php";

/* Dark mode personalitzat */
@custom-variant dark (&:is(.dark *));
```

### 2. Tema personalitzat: `@theme` dins `app.css`

Tailwind 4 utilitza `@theme` per definir variables CSS en lloc d'un fitxer JS:

```css
@theme {
    --radius: 0.625rem;          /* Border radius base */
    --background: oklch(1 0 0);  /* Fons blanc */
    --foreground: oklch(0.145 0.024 285.938); /* Text fosc */
    --primary: oklch(0.205 0.042 285.938);    /* Color principal */
    --secondary: oklch(0.97 0.006 285.938);   /* Color secundari */
    --accent: oklch(0.97 0.006 285.938);      /* Accent */
    --destructive: oklch(0.577 0.245 27.325); /* Color d'error/perill */
    /* ... més variables ... */
}
```

Aquestes variables es fan servir com a classes Tailwind:
- `bg-background` → fons principal
- `text-foreground` → color de text principal
- `bg-primary` → color principal
- `text-destructive` → color d'error

### 3. Vite config: `vite.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({ input: ['resources/css/app.css', 'resources/js/app.tsx'] }),
        react(),
        tailwindcss(),  // Plugin de Tailwind per a Vite
    ],
});
```

> **Important:** No cal PostCSS. El plugin `@tailwindcss/vite` ho gestiona tot.

---

## Com utilitzar Tailwind als [components](https://ui.shadcn.com/docs/components)

### Classes bàsiques

```tsx
// Layout
<div className="flex min-h-screen w-full flex-col">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Espaiat
<div className="p-4 m-2 space-y-4">
<div className="px-6 py-3 mt-8 mb-4">

// Text
<h1 className="text-2xl font-bold tracking-tight">
<p className="text-sm text-muted-foreground">

// Colors (usar variables del tema, NO colors hardcoded)
<div className="bg-background text-foreground">       ✅ Correcte
<div className="bg-card text-card-foreground">         ✅ Correcte
<div className="bg-white text-black">                  ❌ No usar
```

### Responsive design

Tailwind usa **mobile-first**. Les classes sense prefix s'apliquen a mòbil, i els prefixes afegeixen breakpoints:

```tsx
// 1 columna en mòbil, 2 en tablet, 3 en desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Text petit en mòbil, gran en desktop
<h1 className="text-xl md:text-2xl lg:text-4xl">

// Ocultar en mòbil, mostrar en desktop
<nav className="hidden md:flex">

// Padding adaptatiu
<div className="p-4 md:p-6 lg:p-8">
```

| Prefix | Breakpoint | Descripció |
|--------|-----------|------------|
| (cap) | 0px+ | Mòbil |
| `sm:` | 640px+ | Mòbil gran |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop |
| `xl:` | 1280px+ | Desktop gran |
| `2xl:` | 1536px+ | Pantalla ampla |

### Dark mode

El projecte utilitza dark mode amb classe `.dark` al `<html>`:

```tsx
// Text adaptatiu
<p className="text-foreground">  ✅ Canvia automàticament amb el tema

// Si cal forçar un estil diferent en dark:
<div className="bg-card dark:bg-card/80">
<span className="text-gray-700 dark:text-gray-300">
```

### Hover, focus i estats

```tsx
// Hover
<button className="bg-primary hover:bg-primary/90">

// Focus (accessibilitat)
<input className="border focus:ring-2 focus:ring-primary focus:outline-none">

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed">

// Active
<a className="text-muted-foreground active:text-foreground">

// Group hover (pare → fill)
<div className="group">
    <span className="group-hover:text-primary">Es mostra al fer hover al pare</span>
</div>
```

---

## Funció `cn()` — Merge de classes

El projecte té una utilitat a `resources/js/lib/utils.ts` que combina `clsx` + `tailwind-merge`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

### Com fer-la servir

```tsx
import { cn } from '@/lib/utils';

// Classes condicionals
<div className={cn(
    "rounded-lg border p-4",           // Classes base
    isActive && "bg-primary text-white", // Condicional
    className                            // Props externes
)}>

// Merge intel·ligent (tailwind-merge evita conflictes)
cn("px-4 py-2", "px-6")  // → "px-6 py-2" (px-4 es substitueix per px-6)
cn("text-sm", "text-lg")  // → "text-lg" (l'últim guanya)
```

---

## Components shadcn/ui

El projecte té **25 components** de shadcn instal·lats a `resources/js/components/ui/`. Són components pre-estilitzats amb Tailwind que es poden personalitzar.

### Components disponibles

| Component | Ús |
|-----------|-----|
| `Button` | Botons amb variants (default, destructive, outline, ghost, link) |
| `Card` | Contenidor amb capçalera, contingut i peu |
| `Input` | Camp de text |
| `Select` | Selector desplegable |
| `Dialog` | Modal/diàleg |
| `Sheet` | Panell lateral (útil per a menú mòbil) |
| `Badge` | Etiquetes petites |
| `Dropdown` | Menú desplegable |
| `Skeleton` | Placeholder de càrrega |
| `Tooltip` | Informació al fer hover |
| `Sidebar` | Barra lateral de navegació |
| `Toggle` | Botó toggle |
| ... | I més |

### Exemple d'ús

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ExperienciaCard({ exp }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{exp.titol}</CardTitle>
                <Badge variant="secondary">{exp.categoria}</Badge>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{exp.text}</p>
                <Button variant="outline" size="sm">Veure més</Button>
            </CardContent>
        </Card>
    );
}
```

### Variants del Button

```tsx
<Button variant="default">Principal</Button>       {/* bg-primary */}
<Button variant="secondary">Secundari</Button>     {/* bg-secondary */}
<Button variant="destructive">Eliminar</Button>     {/* bg-destructive (vermell) */}
<Button variant="outline">Contorn</Button>          {/* border + transparent */}
<Button variant="ghost">Fantasma</Button>            {/* transparent, hover bg */}
<Button variant="link">Enllaç</Button>               {/* com un link */}
```

---

## CVA (Class Variance Authority)

Els components shadcn usen CVA per definir variants. Si crees un component propi amb variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const estatBadgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", // Base
    {
        variants: {
            estat: {
                esborrany: "bg-muted text-muted-foreground",
                publicada: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                rebutjada: "bg-destructive/10 text-destructive",
            },
        },
        defaultVariants: {
            estat: "esborrany",
        },
    }
);

interface EstatBadgeProps extends VariantProps<typeof estatBadgeVariants> {
    className?: string;
}

export function EstatBadge({ estat, className }: EstatBadgeProps) {
    return <span className={cn(estatBadgeVariants({ estat }), className)} />;
}

// Ús:
<EstatBadge estat="publicada" />
<EstatBadge estat="rebutjada" />
```

---

## Bones pràctiques al projecte

### ✅ Fer
```tsx
// Usar variables del tema
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-card text-card-foreground"
className="border-border"

// Usar cn() per combinar classes
className={cn("base-classes", condition && "conditional-classes")}

// Mobile-first responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Usar components shadcn quan existeixin
import { Button } from '@/components/ui/button';
```

### ❌ No fer
```tsx
// Colors hardcoded (no s'adapten a dark mode)
className="bg-white text-black"
className="bg-gray-100"
className="border-gray-300"

// Estils inline (perden les utilitats de Tailwind)
style={{ backgroundColor: 'white', padding: '16px' }}

// Classes de Tailwind com a strings concatenats
className={"p-4" + (isActive ? " bg-blue-500" : "")}  // Usar cn() en lloc d'això

// Instal·lar tailwind.config.js (Tailwind 4 no ho necessita)
```

---

## Afegir nous components shadcn

Per instal·lar un component shadcn nou:

```bash
npx shadcn@latest add [nom-component]

# Exemples:
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add alert-dialog
```

El component s'instal·larà a `resources/js/components/ui/` i estarà llest per importar.

---

## Referència ràpida de classes útils

### Espaiat
| Classe | Resultat |
|--------|---------|
| `p-4` | padding 1rem |
| `px-6 py-3` | padding horitzontal 1.5rem, vertical 0.75rem |
| `m-auto` | margin auto (centrar) |
| `space-y-4` | gap vertical entre fills |
| `gap-4` | gap en grid/flex |

### Flexbox
| Classe | Resultat |
|--------|---------|
| `flex` | display flex |
| `flex-col` | direcció columna |
| `items-center` | align-items center |
| `justify-between` | justify-content space-between |
| `flex-1` | flex-grow 1 |

### Grid
| Classe | Resultat |
|--------|---------|
| `grid` | display grid |
| `grid-cols-3` | 3 columnes |
| `col-span-2` | ocupa 2 columnes |

### Tipografia
| Classe | Resultat |
|--------|---------|
| `text-sm` | 0.875rem |
| `text-lg` | 1.125rem |
| `text-2xl` | 1.5rem |
| `font-bold` | pes 700 |
| `font-semibold` | pes 600 |
| `tracking-tight` | letter-spacing reduït |
| `leading-relaxed` | line-height ampli |
| `truncate` | talla text amb ... |

### Borders i ombres
| Classe | Resultat |
|--------|---------|
| `rounded-lg` | border-radius gran |
| `rounded-full` | totalment rodó |
| `border` | border 1px |
| `border-border` | color del tema |
| `shadow-sm` | ombra petita |
| `ring-2 ring-primary` | outline d'accessibilitat |

### Transicions
| Classe | Resultat |
|--------|---------|
| `transition-all` | transició suau de tot |
| `transition-colors` | transició només de colors |
| `duration-200` | 200ms |
| `ease-in-out` | corba d'animació |
| `hover:scale-105` | zoom suau al hover |
