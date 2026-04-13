import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    AlertCircle,
    Calendar,
    MapPin,
    Globe,
    Tag,
    CheckCircle,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import ModalReport from '@/components/modals/modal-report';
import { lazy, Suspense } from 'react';
import MainLayout from '@/layouts/main-layout';
import type { Experience, ExperienceAuthorDetail } from '@/types';

const MapDisplay = lazy(() => import('@/components/map-display').then((m) => ({ default: m.MapDisplay })));

type Props = {
    experience: Experience;
    author: ExperienceAuthorDetail;
};

function countryFlag(code: string): string {
    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();
    return String.fromCodePoint(
        upper.charCodeAt(0) + base,
        upper.charCodeAt(1) + base,
    );
}

function formatNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    
    return String(n);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getInitials(name: string): string {
    return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const heroGradient =
    'linear-gradient(135deg, #1A5FA8 0%, #0C4880 40%, #0a3060 100%)';

export default function ShowExperiencia({ experience, author }: Props) {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [voteState, setVoteState] = useState({
        up: experience.ratings_up_count,
        down: experience.ratings_down_count,
        userVote: (experience.user_rating_value ?? 0) as -1 | 0 | 1,
    });

    const voteForm = useForm({ value: 0 as -1 | 0 | 1 });

    const score = voteState.up - voteState.down;

    const applyVote = (up: number, down: number, from: -1 | 0 | 1, to: -1 | 0 | 1) => {
        let nextUp = up;
        let nextDown = down;

        if (from === 1) {
            nextUp -= 1;
        }

        if (from === -1) {
            nextDown -= 1;
        }

        if (to === 1) {
            nextUp += 1;
        }

        if (to === -1) {
            nextDown += 1;
        }

        return { up: nextUp, down: nextDown };
    };

    const submitVote = (target: -1 | 1) => {
        if (isVoting) {
            return;
        }

        const previousVote = voteState.userVote;
        const nextVote: -1 | 0 | 1 = previousVote === target ? 0 : target;
        const optimistic = applyVote(
            voteState.up,
            voteState.down,
            previousVote,
            nextVote,
        );

        setVoteState({ ...optimistic, userVote: nextVote });
        setIsVoting(true);

        voteForm.transform(() => ({ value: nextVote }));
        voteForm.put(
            route('experiencies.rating', experience.id),
            {
                preserveScroll: true,
                onError: () => {
                    setVoteState((current) => ({
                        ...current,
                        up: voteState.up,
                        down: voteState.down,
                        userVote: previousVote,
                    }));
                },
                onFinish: () => {
                    setIsVoting(false);
                },
            },
        );
    };

    return (
        <MainLayout>
            <Head title={`${experience.title} — PathFinder`} />
            {/* ══════ HERO ══════ */}
            <section
                className="relative -mx-6 -mt-8 overflow-hidden"
                style={{ height: 420 }}
            >
                {experience.image ? (
                    <img
                        src={experience.image}
                        alt={experience.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-[160px] opacity-60"
                        style={{ background: heroGradient }}
                    >
                        🏔
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Content over hero */}
                <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-8">
                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        {experience.categories.map((cat) => (
                            <span
                                key={cat.id}
                                className="rounded-full border border-white/20 bg-white/15 px-3 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                            >
                                {cat.name}
                            </span>
                        ))}
                        {experience.main_country && (
                            <span className="rounded-full bg-pf-accent px-3 py-0.5 text-[11px] font-medium text-white">
                                {countryFlag(experience.main_country.code)}{' '}
                                {experience.main_country.name}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-500/20 px-2.5 py-0.5 text-[11px] font-medium text-green-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                            Publicada
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="animate-fade-up mb-3 max-w-3xl text-[clamp(24px,4vw,42px)] leading-[1.2] font-bold tracking-tight text-white">
                        {experience.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-white/75">
                        <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 opacity-80" />
                            {author.name}
                        </span>
                        {experience.experience_date && (
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 opacity-80" />
                                {formatDate(experience.experience_date)}
                            </span>
                        )}
                        {experience.main_country && (
                            <span className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5 opacity-80" />
                                {countryFlag(experience.main_country.code)}{' '}
                                {experience.main_country.name}
                            </span>
                        )}
                    </div>
                </div>
            </section>
            {/* ══════ BACK BUTTON ══════ */}
            <div className="mt-6 mb-4">
                <Link
                    href="/explorar"
                    className="inline-flex items-center gap-1.5 rounded-full border border-pf-border px-3.5 py-1.5 text-[13px] font-medium text-pf-text-3 transition-all hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Tornar
                </Link>
            </div>
            {/* ══════ MAIN LAYOUT ══════ */}
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_300px]">
                {/* ── MAIN COLUMN ── */}
                <div>
                    {/* Map */}
                    {experience.latitude != null && experience.longitude != null && (
                        <div className="mb-6">
                            <Suspense fallback={
                                <div className="flex h-[220px] items-center justify-center rounded-xl border border-pf-border bg-pf-surface-2 dark:border-pf-border-dark dark:bg-pf-surface-2dark">
                                    <span className="text-sm text-pf-text-3 dark:text-pf-text-3dark">Carregant mapa...</span>
                                </div>
                            }>
                                <MapDisplay
                                    lat={Number(experience.latitude)}
                                    lng={Number(experience.longitude)}
                                    label={experience.title}
                                />
                            </Suspense>
                        </div>
                    )}

                    {/* Content */}
                    <article className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="prose-pf px-6 py-7 text-[15px] leading-[1.8] text-pf-text-2 sm:px-8 dark:text-pf-text-2dark">
                            {experience.content
                                .split('\n')
                                .map((paragraph, i) => {
                                    const trimmed = paragraph.trim();
                                    if (!trimmed) return null;
                                    return (
                                        <p key={i} className="mb-4 last:mb-0">
                                            {trimmed}
                                        </p>
                                    );
                                })}
                        </div>
                    </article>
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="sticky top-20 flex flex-col gap-4 max-lg:static">
                    {/* Author card */}
                    <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="border-b border-pf-border px-4 py-3 text-[11px] font-semibold tracking-wider text-pf-text-2 uppercase dark:border-pf-border-dark dark:text-pf-text-2dark">
                            Autor
                        </div>
                        <div className="p-4">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pf-accent-l text-lg font-bold text-pf-accent-h dark:bg-pf-accent-ldark dark:text-pf-accent-dark">
                                    {getInitials(author.name)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-pf-text dark:text-pf-text-dark">
                                        {author.name}
                                    </div>
                                    <div className="text-[12px] text-pf-text-3 dark:text-pf-text-3dark">
                                        Membre des de{' '}
                                        {new Date(
                                            author.created_at,
                                        ).getFullYear()}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg bg-pf-surface-2 p-2.5 text-center dark:bg-pf-surface-2dark">
                                    <div className="text-base font-bold text-pf-primary dark:text-pf-primary-dark">
                                        {author.posts_count}
                                    </div>
                                    <div className="text-[10px] text-pf-text-3 dark:text-pf-text-3dark">
                                        Experiencies
                                    </div>
                                </div>
                                <div className="rounded-lg bg-pf-surface-2 p-2.5 text-center dark:bg-pf-surface-2dark">
                                    <div className="text-base font-bold text-pf-primary dark:text-pf-primary-dark">
                                        {formatNum(author.score)}
                                    </div>
                                    <div className="text-[10px] text-pf-text-3 dark:text-pf-text-3dark">
                                        Punts
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Valoracio card */}
                    <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="border-b border-pf-border px-4 py-3 text-[11px] font-semibold tracking-wider text-pf-text-2 uppercase dark:border-pf-border-dark dark:text-pf-text-2dark">
                            Valoracio
                        </div>
                        <div className="p-4">
                            <div className="mb-3 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => submitVote(1)}
                                    disabled={isVoting}
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                        voteState.userVote === 1
                                            ? 'border-pf-primary bg-pf-primary-l text-pf-primary dark:border-pf-primary-dark dark:bg-pf-primary-ldark dark:text-pf-primary-dark'
                                            : 'border-pf-border text-pf-text-3 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark'
                                    }`}
                                >
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    {formatNum(voteState.up)}
                                </button>
                                <span className="text-xl font-bold text-pf-accent dark:text-pf-accent-dark">
                                    {score >= 0 ? '+' : ''}
                                    {formatNum(score)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => submitVote(-1)}
                                    disabled={isVoting}
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                        voteState.userVote === -1
                                            ? 'border-pf-accent bg-pf-accent-l text-pf-accent-h dark:border-pf-accent-dark dark:bg-pf-accent-ldark dark:text-pf-accent-dark'
                                            : 'border-pf-border text-pf-text-3 hover:border-pf-accent hover:text-pf-accent dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-accent-dark dark:hover:text-pf-accent-dark'
                                    }`}
                                >
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                    {formatNum(voteState.down)}
                                </button>
                            </div>
                            <div className="border-t border-pf-border pt-3 dark:border-pf-border-dark">
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-full border border-pf-border py-1.5 text-xs font-medium text-pf-text-3 transition-colors hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-3dark dark:hover:border-pf-primary-dark dark:hover:text-pf-primary-dark"
                                >
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Reportar abus
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details card */}
                    <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="border-b border-pf-border px-4 py-3 text-[11px] font-semibold tracking-wider text-pf-text-2 uppercase dark:border-pf-border-dark dark:text-pf-text-2dark">
                            Detalls
                        </div>
                        <div className="flex flex-col gap-3 p-4 text-[13px]">
                            {/* Publication date */}
                            <div className="flex items-start justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Publicacio
                                </span>
                                <span className="font-medium text-pf-text dark:text-pf-text-dark">
                                    {formatDate(experience.created_at)}
                                </span>
                            </div>

                            {/* Experience date */}
                            {experience.experience_date && (
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Data viatge
                                    </span>
                                    <span className="font-medium text-pf-text dark:text-pf-text-dark">
                                        {formatDate(experience.experience_date)}
                                    </span>
                                </div>
                            )}

                            {/* Country */}
                            {experience.main_country && (
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                        <Globe className="h-3.5 w-3.5" />
                                        Pais
                                    </span>
                                    <span className="font-medium text-pf-text dark:text-pf-text-dark">
                                        {countryFlag(
                                            experience.main_country.code,
                                        )}{' '}
                                        {experience.main_country.name}
                                    </span>
                                </div>
                            )}

                            {/* Score */}
                            <div className="flex items-start justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    Puntuacio
                                </span>
                                <span className="font-bold text-pf-accent dark:text-pf-accent-dark">
                                    {score >= 0 ? '+' : ''}
                                    {formatNum(score)}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-start justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Estat
                                </span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    ● Publicada
                                </span>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-col gap-2">
                                <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                    <Tag className="h-3.5 w-3.5" />
                                    Categories
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {experience.categories.map((cat) => (
                                        <span
                                            key={cat.id}
                                            className="rounded-full bg-pf-tag-bg px-2.5 py-0.5 text-[11px] font-medium text-pf-tag-text dark:bg-pf-tag-bgdark dark:text-pf-tag-textdark"
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Coordinates placeholder */}
                            <div className="flex items-start justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark">
                                    <MapPin className="h-3.5 w-3.5" />
                                    Coordenades
                                </span>
                                <span className="text-[11px] font-medium text-pf-text dark:text-pf-text-dark">
                                    {experience.latitude != null && experience.longitude != null
                                        ? `${Number(experience.latitude).toFixed(4)}°, ${Number(experience.longitude).toFixed(4)}°`
                                        : <span className="italic text-pf-text-3 dark:text-pf-text-3dark">No disponible</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            <ModalReport
                open={isReportModalOpen}
                onOpenChange={setIsReportModalOpen}
                postId={experience.id}
            />{' '}
        </MainLayout>
    );
}
