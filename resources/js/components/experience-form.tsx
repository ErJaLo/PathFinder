import { useForm } from '@inertiajs/react';
import { ImagePlus, X, Save, Send, MapPin, AlertTriangle } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Experience, ExperienceCategory, ExperienceCountry } from '@/types';

// Lazy load map to avoid SSR issues with Leaflet
const MapPicker = lazy(() => import('@/components/map-picker').then((m) => ({ default: m.MapPicker })));

type Props = {
    experience?: Experience;
    categories: ExperienceCategory[];
    countries: ExperienceCountry[];
};

type FormData = {
    title: string;
    content: string;
    experience_date: string;
    image: File | null;
    country_code: string;
    latitude: number | null;
    longitude: number | null;
    categories: number[];
    status: 'draft' | 'published';
};

function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();
    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

export function ExperienceForm({ experience, categories, countries }: Props) {
    const isEditing = !!experience;
    const today = new Date().toISOString().split('T')[0];

    const { data: formData, setData: setFormData, post, processing, errors, transform } = useForm<FormData>({
        title: experience?.title ?? '',
        content: experience?.content ?? '',
        experience_date: experience?.experience_date?.split('T')[0] ?? '',
        image: null,
        country_code: experience?.main_country?.code ?? '',
        latitude: experience?.latitude != null ? Number(experience.latitude) : null,
        longitude: experience?.longitude != null ? Number(experience.longitude) : null,
        categories: experience?.categories.map((c) => c.id) ?? [],
        status: (experience?.status as 'draft' | 'published') ?? 'published',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(experience?.image ?? null);

    const setField = (key: keyof FormData, value: unknown) => {
        setFormData(key as never, value as never);
    };

    const toggleCategory = (id: number) => {
        setFormData('categories',
            formData.categories.includes(id)
                ? formData.categories.filter((c) => c !== id)
                : [...formData.categories, id],
        );
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setField('image', file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const removeImage = () => {
        setField('image', null);
        setImagePreview(null);
    };

    const submitAs = (status: 'draft' | 'published') => {
        if (isEditing) {
            transform((d) => ({ ...d, status, _method: 'PUT' as const }));
            post(`/experiencies/${experience.id}`, { forceFormData: true });
        } else {
            transform((d) => ({ ...d, status }));
            post('/experiencies', { forceFormData: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitAs('published');
    };

    return (
        <>
            {Object.keys(errors).length > 0 && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    Per publicar, cal omplir els camps obligatoris (titol, contingut i categories).
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── Title ── */}
                <div className="space-y-2">
                    <Label htmlFor="title">
                        Titol <span className="text-pf-accent">*</span>
                    </Label>
                    <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder="Ex: Trekking al camp base de l'Annapurna"
                        className="h-10"
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
                        value={formData.content}
                        onChange={(e) => setField('content', e.target.value)}
                        placeholder="Explica la teva experiencia: que vas fer, que vas veure, consells per a altres viatgers..."
                        className="min-h-[180px]"
                    />
                    <InputError message={errors.content} />
                </div>

                {/* ── Image ── */}
                <div className="space-y-2">
                    <Label>Imatge destacada</Label>
                    {imagePreview ? (
                        <div className="relative overflow-hidden rounded-xl border border-pf-border dark:border-pf-border-dark">
                            <img src={imagePreview} alt="Preview" className="aspect-video w-full object-cover" />
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
                            <input id="image" type="file" accept="image/*" onChange={handleImage} className="hidden" />
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
                            const active = formData.categories.includes(cat.id);
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

                {/* ── Country + Date ── */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="country_code">Pais</Label>
                        <select
                            id="country_code"
                            value={formData.country_code}
                            onChange={(e) => setField('country_code', e.target.value)}
                            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-pf-text outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-pf-surface-dark dark:text-pf-text-dark [&>option]:bg-pf-surface [&>option]:text-pf-text dark:[&>option]:bg-pf-surface-dark dark:[&>option]:text-pf-text-dark"
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
                            value={formData.experience_date}
                            onChange={(e) => setField('experience_date', e.target.value)}
                            max={today}
                            className="h-10 text-pf-text dark:text-pf-text-dark [color-scheme:light] dark:[color-scheme:dark]"
                        />
                        <InputError message={errors.experience_date} />
                    </div>
                </div>

                {/* ── Map location ── */}
                <div className="space-y-2">
                    <Label>
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        Ubicacio al mapa
                    </Label>
                    <Suspense fallback={
                        <div className="flex h-[280px] items-center justify-center rounded-xl border border-pf-border bg-pf-surface-2 dark:border-pf-border-dark dark:bg-pf-surface-2dark">
                            <Spinner className="h-6 w-6" />
                        </div>
                    }>
                        <MapPicker
                            value={formData.latitude != null && formData.longitude != null
                                ? { lat: formData.latitude, lng: formData.longitude }
                                : null
                            }
                            onChange={(coords) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    latitude: coords?.lat ?? null,
                                    longitude: coords?.lng ?? null,
                                }));
                            }}
                        />
                    </Suspense>
                    <InputError message={errors.latitude} />
                    <InputError message={errors.longitude} />
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
                        onClick={() => submitAs('draft')}
                        className="gap-2 rounded-full"
                    >
                        <Save className="h-4 w-4" />
                        Guardar esborrany
                    </Button>
                </div>
            </form>
        </>
    );
}
