import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    LayoutGrid,
    List,
    ThumbsUp,
    Flame,
    Sparkles,
    Calendar,
    Trophy,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import MainLayout from '@/layouts/main-layout';
import { ExperienceCard } from '@/components/experience-card';
import type { Experience, ExperienceCategory } from '@/types';

/* ── Types ── */
type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type TrendingCountry = {
    code: string;
    name: string;
    posts_count: number;
};

type TopUser = {
    id: number;
    name: string;
    img: string | null;
    posts_count: number;
};

type Filters = {
    search: string;
    category: string;
    country: string;
    sort: string;
};

type CountryOption = {
    code: string;
    name: string;
};

type Props = {
    experiences: PaginatedData<Experience>;
    categories: ExperienceCategory[];
    countries: CountryOption[];
    trendingCountries: TrendingCountry[];
    topUsers: TopUser[];
    filters: Filters;
};

/* ── Helpers ── */
function getInitials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const sortOptions = [
    { key: 'popular', label: 'Popular', icon: Flame },
    { key: 'new', label: 'Nou', icon: Sparkles },
    { key: 'date', label: 'Data', icon: Calendar },
    { key: 'score', label: 'Puntuacio', icon: Trophy },
] as const;

/** Convert a 2-letter country code to its flag emoji */
function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65; // 'A' = 65
    const upper = code.toUpperCase();
    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

const countryIcons: Record<string, string> = {
    JP: '🏯', MA: '🕌', PE: '🦙', ID: '🌋', IS: '🧊',
    TH: '🛶', NP: '🏔', MX: '🌮', VN: '🏍', GR: '🏛',
    ZA: '🦁', NA: '🦒', ET: '🏜', DE: '🏰',
};

const avatarColors = [
    { bg: 'bg-pf-primary-l dark:bg-pf-primary-ldark', text: 'text-pf-primary dark:text-pf-primary-dark' },
    { bg: 'bg-pf-accent-l dark:bg-pf-accent-ldark', text: 'text-pf-accent-h dark:text-pf-accent-dark' },
    { bg: 'bg-pf-amber-l dark:bg-pf-amber-ldark', text: 'text-pf-amber dark:text-pf-amber-dark' },
    { bg: 'bg-pf-avatar-mc', text: 'text-pf-avatar-mctxt' },
];

/* ══════════════════════════════ */
export default function ExplorarIndex({ experiences, categories, countries, trendingCountries, topUsers, filters }: Props) {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchValue, setSearchValue] = useState(filters.search);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const navigate = useCallback(
        (params: Partial<Filters> & { page?: number }) => {
            const merged = {
                search: params.search ?? filters.search,
                category: params.category ?? filters.category,
                country: params.country ?? filters.country,
                sort: params.sort ?? filters.sort,
                page: params.page ?? 1,
            };

            // Remove empty params
            const query: Record<string, string | number> = {};
            if (merged.search) query.search = merged.search;
            if (merged.category) query.category = merged.category;
            if (merged.country) query.country = merged.country;
            if (merged.sort && merged.sort !== 'new') query.sort = merged.sort;
            if (merged.page > 1) query.page = merged.page;

            router.get('/explorar', query, { preserveState: true, preserveScroll: true });
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
        <MainLayout>
            <Head title="Explorar experiencies — PathFinder" />

            {/* ══════ COUNTRY TAGS STRIP ══════ */}
            <div className="-m-7 mb-6 overflow-x-auto border-b border-pf-border bg-pf-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-pf-border-dark dark:bg-pf-surface-dark">
                <div className="flex min-w-full items-center gap-2 px-6 py-2.5" style={{ width: 'max-content' }}>
                    <span className="mr-1 whitespace-nowrap text-[11px] text-pf-text-3 dark:text-pf-text-3dark">
                        Paisos →
                    </span>
                    <button
                        onClick={() => navigate({ country: '' })}
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                            !filters.country
                                ? 'border-transparent bg-pf-primary text-white'
                                : 'border-pf-border bg-pf-surface-2 text-pf-text-2 hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark'
                        }`}
                    >
                        Tots
                    </button>
                    {countries.map((c) => (
                        <button
                            key={c.code}
                            onClick={() => navigate({ country: c.code })}
                            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                                filters.country === c.code
                                    ? 'border-transparent bg-pf-primary text-white'
                                    : 'border-pf-border bg-pf-surface-2 text-pf-text-2 hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark'
                            }`}
                        >
                            <span>{countryFlag(c.code)}</span>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══════ MAIN LAYOUT: FEED + SIDEBAR ══════ */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
                {/* ── FEED ── */}
                <div>
                    {/* Toolbar */}
                    <div className="mb-5 space-y-2.5">
                        {/* Row 1: Search + Category dropdown */}
                        <div className="flex gap-2.5 max-sm:flex-col">
                            <div className="flex flex-1 items-center gap-2 rounded-full border border-pf-border bg-pf-surface px-3.5 transition-colors focus-within:border-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-dark">
                                <Search className="h-3.5 w-3.5 flex-shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Busca experiencies..."
                                    className="h-9 w-full bg-transparent text-[13px] text-pf-text outline-none placeholder:text-pf-text-3 dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark"
                                />
                            </div>
                            <select
                                value={filters.category}
                                onChange={(e) => navigate({ category: e.target.value })}
                                className="h-9 cursor-pointer rounded-md border border-pf-border bg-pf-surface px-3 text-[13px] text-pf-text-2 outline-none transition-colors focus:border-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-2dark max-sm:w-full"
                            >
                                <option value="">Totes les categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Row 2: Sort tabs + View toggle */}
                        <div className="flex items-center justify-between gap-2.5">
                            <div className="flex gap-1 overflow-x-auto scrollbar-none">
                                {sortOptions.map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => navigate({ sort: key })}
                                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                                            filters.sort === key
                                                ? 'border-transparent bg-pf-primary text-white'
                                                : 'border-pf-border bg-transparent text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                        }`}
                                    >
                                        <Icon className="h-3 w-3" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-shrink-0 gap-1">
                                <button
                                    onClick={() => setView('grid')}
                                    title="Grid"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                        view === 'grid'
                                            ? 'border-transparent bg-pf-primary text-white'
                                            : 'border-pf-border text-pf-text-3 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                    }`}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    title="Llista"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                                        view === 'list'
                                            ? 'border-transparent bg-pf-primary text-white'
                                            : 'border-pf-border text-pf-text-3 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                    }`}
                                >
                                    <List className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts */}
                    {experiences.data.length > 0 ? (
                        <>
                            <div
                                className={
                                    view === 'grid'
                                        ? 'columns-1 gap-3.5 sm:columns-2'
                                        : 'flex flex-col gap-2.5'
                                }
                            >
                                {experiences.data.map((exp) => (
                                    <div key={exp.id} className={view === 'grid' ? 'mb-3.5 break-inside-avoid' : ''}>
                                        <ExperienceCard
                                            experience={exp}
                                            layout={view === 'list' ? 'horizontal' : 'vertical'}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {experiences.last_page > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-1.5">
                                    <button
                                        onClick={() => experiences.current_page > 1 && navigate({ page: experiences.current_page - 1 })}
                                        disabled={experiences.current_page <= 1}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary disabled:opacity-40 disabled:hover:border-pf-border disabled:hover:text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

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

                                    <button
                                        onClick={() => experiences.current_page < experiences.last_page && navigate({ page: experiences.current_page + 1 })}
                                        disabled={experiences.current_page >= experiences.last_page}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary disabled:opacity-40 disabled:hover:border-pf-border disabled:hover:text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12 text-center text-pf-text-3 dark:text-pf-text-3dark">
                            <div className="mb-3 text-[40px]">🔍</div>
                            <p className="text-sm">No s&apos;han trobat experiencies amb aquests filtres.</p>
                            <button
                                onClick={() => {
                                    setSearchValue('');
                                    navigate({ search: '', category: '', country: '', sort: 'new' });
                                }}
                                className="mt-3 text-sm font-medium text-pf-primary hover:underline dark:text-pf-primary-dark"
                            >
                                Netejar filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="sticky top-20 hidden flex-col gap-4 lg:flex">
                    {/* Trending countries */}
                    {trendingCountries.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center justify-between border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
                                <span className="text-xs font-medium uppercase tracking-wider text-pf-text-2 dark:text-pf-text-2dark">
                                    Destinacions populars
                                </span>
                            </div>
                            <div className="py-1.5">
                                {trendingCountries.map((country, i) => (
                                    <button
                                        key={country.code}
                                        onClick={() => navigate({ country: country.code })}
                                        className={`flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-pf-bg-2 dark:hover:bg-pf-bg-2dark ${
                                            i === 0 ? 'border-l-[3px] border-l-pf-accent pl-[13px]' : ''
                                        } ${filters.country === country.code ? 'bg-pf-primary-l dark:bg-pf-primary-ldark' : ''}`}
                                    >
                                        <span className="text-[11px] text-pf-text-3 dark:text-pf-text-3dark" style={{ width: 16, textAlign: 'center' }}>
                                            {i + 1}
                                        </span>
                                        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg bg-pf-surface-2 text-xl dark:bg-pf-surface-2dark">
                                            {countryIcons[country.code] ?? countryFlag(country.code)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="truncate text-[13px] font-medium text-pf-text dark:text-pf-text-dark">
                                                {country.name}
                                            </div>
                                            <div className="text-[11px] text-pf-text-3 dark:text-pf-text-3dark">
                                                {country.posts_count} experiencies
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top users */}
                    {topUsers.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center justify-between border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
                                <span className="text-xs font-medium uppercase tracking-wider text-pf-text-2 dark:text-pf-text-2dark">
                                    Viatgers del mes
                                </span>
                            </div>
                            <div className="py-1.5">
                                {topUsers.map((user, i) => {
                                    const color = avatarColors[i % avatarColors.length];
                                    const medal = i === 0 ? '🥇 Top' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

                                    return (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-2.5 px-4 py-2 transition-colors hover:bg-pf-bg-2 dark:hover:bg-pf-bg-2dark"
                                        >
                                            <div
                                                className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${color.bg} ${color.text}`}
                                            >
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="truncate text-[13px] font-medium text-pf-text dark:text-pf-text-dark">
                                                    {user.name}
                                                </div>
                                                <div className="text-[11px] text-pf-text-3 dark:text-pf-text-3dark">
                                                    {user.posts_count} experiencies
                                                </div>
                                            </div>
                                            {medal && (
                                                <span className="rounded-full bg-pf-amber-l px-2 py-0.5 text-[10px] font-medium text-pf-amber dark:bg-pf-amber-ldark dark:text-pf-amber-dark">
                                                    {medal}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </MainLayout>
    );
}
