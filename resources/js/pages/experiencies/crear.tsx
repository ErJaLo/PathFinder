import { Head, useForm, router } from '@inertiajs/react';
import { ImagePlus, X, Save, Send } from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import MainLayout from '@/layouts/main-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ExperienceCategory, ExperienceCountry } from '@/types';

type Props = {
    categories: ExperienceCategory[];
    countries: ExperienceCountry[];
};

function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();
    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

export default function CrearExperiencia({ categories, countries }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        content: string;
        experience_date: string;
        image: File | null;
        country_code: string;
        latitude: string;
        longitude: string;
        categories: number[];
        status: 'draft' | 'published';
    }>({
        title: '',
        content: '',
        experience_date: '',
        image: null,
        country_code: '',
        latitude: '',
        longitude: '',
        categories: [],
        status: 'published',
    });

    const toggleCategory = (id: number) => {
        setData(
            'categories',
            data.categories.includes(id) ? data.categories.filter((c) => c !== id) : [...data.categories, id],
        );
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/experiencies', {
            forceFormData: true,
        });
    };

    const saveDraft = () => {
        data.status = 'draft';
        post('/experiencies', {
            forceFormData: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Crear experiencia — PathFinder" />

            <div className="mx-auto w-full max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pf-text dark:text-pf-text-dark">
                        Crear experiencia
                    </h1>
                    <p className="mt-1 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Comparteix la teva aventura amb la comunitat de viatgers
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* ── Title ── */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Titol <span className="text-pf-accent">*</span>
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Ex: Trekking al camp base de l'Annapurna"
                            className="h-10"
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* ── Content ── */}
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            Contingut <span className="text-pf-accent">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Explica la teva experiencia: que vas fer, que vas veure, consells per a altres viatgers..."
                            className="min-h-[180px]"
                            required
                        />
                        <InputError message={errors.content} />
                    </div>

                    {/* ── Image ── */}
                    <div className="space-y-2">
                        <Label>Imatge destacada</Label>
                        {imagePreview ? (
                            <div className="relative overflow-hidden rounded-xl border border-pf-border dark:border-pf-border-dark">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="aspect-video w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="image"
                                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pf-border py-10 transition-colors hover:border-pf-primary hover:bg-pf-primary-l/30 dark:border-pf-border-dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark/30"
                            >
                                <ImagePlus className="h-8 w-8 text-pf-text-3 dark:text-pf-text-3dark" />
                                <span className="text-sm text-pf-text-3 dark:text-pf-text-3dark">
                                    Clica per pujar una imatge
                                </span>
                                <span className="text-[11px] text-pf-text-3/60 dark:text-pf-text-3dark/60">
                                    JPG, PNG o WebP — max 2MB
                                </span>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <InputError message={errors.image} />
                    </div>

                    {/* ── Categories ── */}
                    <div className="space-y-2">
                        <Label>
                            Categories <span className="text-pf-accent">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const active = data.categories.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                            active
                                                ? 'border-transparent bg-pf-primary text-white'
                                                : 'border-pf-border bg-pf-surface-2 text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                        <InputError message={errors.categories} />
                    </div>

                    {/* ── Country + Date row ── */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="country_code">Pais</Label>
                            <select
                                id="country_code"
                                value={data.country_code}
                                onChange={(e) => setData('country_code', e.target.value)}
                                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                            >
                                <option value="">Selecciona un pais...</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {countryFlag(c.code)} {c.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.country_code} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience_date">Data de l&apos;experiencia</Label>
                            <Input
                                id="experience_date"
                                type="date"
                                value={data.experience_date}
                                onChange={(e) => setData('experience_date', e.target.value)}
                                className="h-10"
                            />
                            <InputError message={errors.experience_date} />
                        </div>
                    </div>

                    {/* ── Coordinates (optional) ── */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitud</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                placeholder="Ex: 28.5973"
                                className="h-10"
                            />
                            <InputError message={errors.latitude} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitud</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                placeholder="Ex: 83.9311"
                                className="h-10"
                            />
                            <InputError message={errors.longitude} />
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-3 border-t border-pf-border pt-6 dark:border-pf-border-dark">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 rounded-full bg-pf-accent px-6 text-white shadow-[0_4px_16px_rgba(232,125,44,0.35)] hover:bg-pf-accent-h dark:bg-pf-accent-dark"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                            Publicar
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={saveDraft}
                            className="gap-2 rounded-full"
                        >
                            <Save className="h-4 w-4" />
                            Guardar esborrany
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
