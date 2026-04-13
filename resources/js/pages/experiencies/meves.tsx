import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { Search, PenLine, Trash2, Eye, Plus } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { UserHeader } from '@/components/user-Header';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import type { Experience } from '@/types';

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
};

type Filters = {
    search: string;
    status: string;
};

type Props = {
    experiences: PaginatedData<Experience>;
    filters: Filters;
};

const statusFilters = [
    { key: '', label: 'Totes' },
    { key: 'published', label: 'Publicades' },
    { key: 'draft', label: 'Esborranys' },
];

const statusBadge: Record<string, { label: string; cls: string }> = {
    published: { label: 'Publicada', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    draft: { label: 'Esborrany', cls: 'bg-pf-amber-l text-pf-amber dark:bg-pf-amber-ldark dark:text-pf-amber-dark' },
    rejected: { label: 'Rebutjada', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const cardGradients = [
    'linear-gradient(135deg, #C0D8EE 0%, #8AB4D4 100%)',
    'linear-gradient(135deg, #D8E8F5 0%, #A8C8E8 100%)',
    'linear-gradient(135deg, #F0E4C8 0%, #D8C898 100%)',
    'linear-gradient(135deg, #C8E0D0 0%, #98C8A8 100%)',
];

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'ara mateix';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `fa ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `fa ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `fa ${days}d`;
    const months = Math.floor(days / 30);
    return `fa ${months} mes${months > 1 ? 'os' : ''}`;
}

export default function MevesExperiencies({ experiences, filters }: Props) {
    const [searchValue, setSearchValue] = useState(filters.search);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const navigate = useCallback(
        (params: Partial<Filters> & { page?: number }) => {
            const merged = {
                search: params.search ?? filters.search,
                status: params.status ?? filters.status,
                page: params.page ?? 1,
            };
            const query: Record<string, string | number> = {};
            if (merged.search) query.search = merged.search;
            if (merged.status) query.status = merged.status;
            if (merged.page > 1) query.page = merged.page;
            router.get('/settings/experiences', query, { preserveState: true, preserveScroll: true });
        },
        [filters],
    );

    const handleSearch = useCallback(
        (value: string) => {
            setSearchValue(value);
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                navigate({ search: value, page: 1 });
            }, 400);
        },
        [navigate],
    );

    return (
        <div className="min-h-screen bg-pf-bg text-pf-text dark:bg-pf-bg-dark dark:text-pf-text-dark">
            <Head title="Les meves experiencies — PathFinder" />
            <UserHeader user={usePage<{ auth: Auth }>().props.auth.user} />

            <main className="mx-auto w-full max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pf-text dark:text-pf-text-dark">
                            Les meves experiencies
                        </h1>
                        <p className="mt-1 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                            {experiences.total} experienci{experiences.total === 1 ? 'a' : 'es'} en total
                        </p>
                    </div>
                    <Link
                        href="/experiencies/crear"
                        className="flex items-center gap-1.5 rounded-full bg-pf-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pf-accent-h active:scale-[0.97] dark:bg-pf-accent-dark"
                    >
                        <Plus className="h-4 w-4" />
                        Crear nova
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="mb-5 space-y-2.5">
                    {/* Search */}
                    <div className="flex items-center gap-2 rounded-full border border-pf-border bg-pf-surface px-3.5 transition-colors focus-within:border-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <Search className="h-3.5 w-3.5 flex-shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Busca entre les teves experiencies..."
                            className="h-9 w-full bg-transparent text-[13px] text-pf-text outline-none placeholder:text-pf-text-3 dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark"
                        />
                    </div>

                    {/* Status filters */}
                    <div className="flex gap-1">
                        {statusFilters.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => navigate({ status: key })}
                                className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                                    filters.status === key
                                        ? 'border-transparent bg-pf-primary text-white'
                                        : 'border-pf-border bg-transparent text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {experiences.data.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {experiences.data.map((exp) => {
                            const badge = statusBadge[exp.status] ?? statusBadge.draft;
                            const gradient = cardGradients[exp.id % cardGradients.length];

                            return (
                                <div
                                    key={exp.id}
                                    className="flex items-center gap-4 overflow-hidden rounded-xl border border-pf-border bg-pf-surface p-3 shadow-sm transition-all hover:border-pf-border-2 dark:border-pf-border-dark dark:bg-pf-surface-dark dark:hover:border-pf-border-2dark"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-[72px] w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                                        {exp.image ? (
                                            <img src={exp.image} alt={exp.title} loading="lazy" className="h-full w-full object-cover" />
                                        ) : (
                                            <div
                                                className="flex h-full w-full items-center justify-center text-2xl"
                                                style={{ background: gradient }}
                                            >
                                                🌍
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="truncate text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                                                {exp.title}
                                            </h3>
                                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-pf-text-3 dark:text-pf-text-3dark">
                                            <span>{timeAgo(exp.created_at)}</span>
                                            {exp.main_country && (
                                                <>
                                                    <span className="opacity-40">·</span>
                                                    <span>{exp.main_country.name}</span>
                                                </>
                                            )}
                                            {exp.categories[0] && (
                                                <>
                                                    <span className="opacity-40">·</span>
                                                    <span>{exp.categories[0].name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-shrink-0 items-center gap-1.5">
                                        {exp.status === 'published' && (
                                            <Link
                                                href={`/experiencies/${exp.id}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark"
                                                title="Veure"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/experiencies/${exp.id}/editar`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark"
                                            title="Editar"
                                        >
                                            <PenLine className="h-3.5 w-3.5" />
                                        </Link>
                                        <DeleteDialog experienceId={exp.id} experienceTitle={exp.title} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-pf-text-3 dark:text-pf-text-3dark">
                        <div className="mb-3 text-[40px]">📝</div>
                        <p className="text-sm">
                            {filters.search || filters.status
                                ? "No s'han trobat experiencies amb aquests filtres."
                                : "Encara no has creat cap experiencia."}
                        </p>
                        {filters.search || filters.status ? (
                            <button
                                onClick={() => {
                                    setSearchValue('');
                                    navigate({ search: '', status: '' });
                                }}
                                className="mt-3 text-sm font-medium text-pf-primary hover:underline dark:text-pf-primary-dark"
                            >
                                Netejar filtres
                            </button>
                        ) : (
                            <Link
                                href="/experiencies/crear"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-pf-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-pf-accent-h dark:bg-pf-accent-dark"
                            >
                                <Plus className="h-4 w-4" />
                                Crear la primera
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {experiences.last_page > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-1.5">
                        {Array.from({ length: experiences.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => navigate({ page })}
                                className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-all ${
                                    page === experiences.current_page
                                        ? 'border-transparent bg-pf-primary text-white'
                                        : 'border-pf-border text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-2dark'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

/* ── Delete confirmation dialog ── */
function DeleteDialog({ experienceId, experienceTitle }: { experienceId: number; experienceTitle: string }) {
    const [open, setOpen] = useState(false);
    const form = useForm();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    title="Eliminar"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar experiencia</DialogTitle>
                    <DialogDescription>
                        Segur que vols eliminar &quot;{experienceTitle}&quot;? Aquesta accio no es pot desfer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel·lar</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            form.delete(`/experiencies/${experienceId}`, {
                                onSuccess: () => setOpen(false),
                            });
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
