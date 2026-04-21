import { Head, router } from '@inertiajs/react';
import {
    Search,
    LayoutGrid,
    List,
    Flame,
    Sparkles,
    Calendar,
    Trophy,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import MainLayout from '@/layouts/main-layout';
import { ExperienceCard } from '@/components/experience-card';
import type { Experience, ExperienceCategory } from '@/types';

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
    img?: string | null;
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

function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();
    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

const avatarColors = [
    { bg: 'bg-pf-primary-l dark:bg-pf-primary-ldark', text: 'text-pf-primary dark:text-pf-primary-dark' },
    { bg: 'bg-pf-accent-l dark:bg-pf-accent-ldark', text: 'text-pf-accent-h dark:text-pf-accent-dark' },
    { bg: 'bg-pf-amber-l dark:bg-pf-amber-ldark', text: 'text-pf-amber dark:text-pf-amber-dark' },
    { bg: 'bg-pf-avatar-mc', text: 'text-pf-avatar-mctxt' },
];

const pillBase = 'whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition-all';
const pillActive = 'border-transparent bg-pf-primary text-white';
const pillInactive =
    'border-pf-border bg-pf-surface-2 text-pf-text-2 hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark';

export default function ExplorarIndex({ experiences, categories, countries, trendingCountries, topUsers, filters }: Props) {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchValue, setSearchValue] = useState(filters.search);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const activeFilterCount = (filters.category ? 1 : 0) + (filters.country ? 1 : 0);

    const navigate = useCallback(
        (params: Partial<Filters> & { page?: number }) => {
            const merged = {
                search: params.search ?? filters.search,
                category: params.category ?? filters.category,
                country: params.country ?? filters.country,
                sort: params.sort ?? filters.sort,
                page: params.page ?? 1,
            };

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

            {/* Country tags strip */}
            <div className="group/marquee -m-7 mb-6 flex items-center border-b border-pf-border dark:border-pf-border-dark">
                {/* Fixed "Tots" button */}
                <div className="flex-shrink-0 border-r border-pf-border py-2.5 pr-3 dark:border-pf-border-dark">
                    <button
                        onClick={() => navigate({ country: '' })}
                        className={`flex items-center gap-1.5 ${pillBase} ${!filters.country ? pillActive : pillInactive}`}
                    >
                        Tots
                    </button>
                </div>

                {/* Scrolling countries */}
                <div className="overflow-hidden">
                    <div className="flex animate-[marquee_40s_linear_infinite] items-center gap-2 py-2.5 group-hover/marquee:[animation-play-state:paused]" style={{ width: 'max-content' }}>
                        {[0, 1].map((copy) => (
                            <div key={copy} className="flex items-center gap-2 px-1">
                                {countries.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => navigate({ country: c.code })}
                                        className={`flex items-center gap-1.5 ${pillBase} ${filters.country === c.code ? pillActive : pillInactive}`}
                                    >
                                        <span>{countryFlag(c.code)}</span>
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
                {/* Feed */}
                <div>
                    {/* Toolbar */}
                    <div className="mb-0 space-y-2.5">
                        {/* Row 1: Search + Filters button */}
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
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className={`flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-all max-sm:justify-center ${
                                    filtersOpen || activeFilterCount > 0
                                        ? 'border-pf-primary bg-pf-primary-l text-pf-primary dark:border-pf-primary-dark dark:bg-pf-primary-ldark dark:text-pf-primary-dark'
                                        : 'border-pf-border text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                }`}
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Filtres
                                {activeFilterCount > 0 && (
                                    <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-pf-primary px-1 text-[10px] font-bold text-white dark:bg-pf-primary-dark">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Expandable filter panel */}
                        {filtersOpen && (
                            <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface dark:border-pf-border-dark dark:bg-pf-surface-dark">
                                {/* Categories */}
                                <div className="border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-pf-text-3 dark:text-pf-text-3dark">
                                            Categories
                                        </span>
                                        {filters.category && (
                                            <button
                                                onClick={() => navigate({ category: '' })}
                                                className="text-[11px] text-pf-primary hover:underline dark:text-pf-primary-dark"
                                            >
                                                Netejar
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => navigate({ category: '' })}
                                            className={`${pillBase} ${!filters.category ? pillActive : pillInactive}`}
                                        >
                                            Totes
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => navigate({ category: String(cat.id) })}
                                                className={`${pillBase} ${filters.category === String(cat.id) ? pillActive : pillInactive}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Countries (inside panel) */}
                                <div className="px-4 py-3">
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-pf-text-3 dark:text-pf-text-3dark">
                                            Paisos
                                        </span>
                                        {filters.country && (
                                            <button
                                                onClick={() => navigate({ country: '' })}
                                                className="text-[11px] text-pf-primary hover:underline dark:text-pf-primary-dark"
                                            >
                                                Netejar
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => navigate({ country: '' })}
                                            className={`${pillBase} ${!filters.country ? pillActive : pillInactive}`}
                                        >
                                            Tots
                                        </button>
                                        {countries.map((c) => (
                                            <button
                                                key={c.code}
                                                onClick={() => navigate({ country: c.code })}
                                                className={`flex items-center gap-1.5 ${pillBase} ${filters.country === c.code ? pillActive : pillInactive}`}
                                            >
                                                <span>{countryFlag(c.code)}</span>
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear all */}
                                {activeFilterCount > 0 && (
                                    <div className="border-t border-pf-border px-4 py-2.5 dark:border-pf-border-dark">
                                        <button
                                            onClick={() => navigate({ category: '', country: '' })}
                                            className="flex items-center gap-1.5 text-xs font-medium text-pf-accent hover:underline dark:text-pf-accent-dark"
                                        >
                                            <X className="h-3 w-3" />
                                            Netejar tots els filtres
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Active filter badges (when panel is closed) */}
                        {!filtersOpen && activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] text-pf-text-3 dark:text-pf-text-3dark">Filtres actius:</span>
                                {filters.category && (
                                    <span className="flex items-center gap-1 rounded-full bg-pf-primary-l px-2.5 py-0.5 text-[11px] font-medium text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark">
                                        {categories.find((c) => String(c.id) === filters.category)?.name}
                                        <button onClick={() => navigate({ category: '' })} className="hover:text-pf-accent">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.country && (
                                    <span className="flex items-center gap-1 rounded-full bg-pf-primary-l px-2.5 py-0.5 text-[11px] font-medium text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark">
                                        {countryFlag(filters.country)} {countries.find((c) => c.code === filters.country)?.name}
                                        <button onClick={() => navigate({ country: '' })} className="hover:text-pf-accent">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Row 2: Sort tabs + View toggle */}
                        <div className="flex items-center justify-between gap-2.5">
                            <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    {/* Pagination */}
                            {experiences.last_page > 1 && (
                                <div className="mb-3 flex items-center justify-center gap-1.5">
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

                    {/* Posts */}
                    {experiences.data.length > 0 ? (
                        <>
                            <div
                                className={
                                    view === 'grid'
                                        ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2'
                                        : 'flex flex-col gap-2.5'
                                }
                            >
                                {experiences.data.map((exp) => (
                                    <div key={exp.id}>
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
                                    setFiltersOpen(false);
                                    navigate({ search: '', category: '', country: '', sort: 'new' });
                                }}
                                className="mt-3 text-sm font-medium text-pf-primary hover:underline dark:text-pf-primary-dark"
                            >
                                Netejar filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
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
                                        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                            {country.img ? (
                                                <img src={country.img} alt={country.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xl">{countryFlag(country.code)}</span>
                                            )}
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
