import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ThumbsUp } from 'lucide-react';
import MainLayout from '@/layouts/main-layout';
import { ExperienceCard } from '@/components/experience-card';
import type { Experience } from '@/types';

type Props = {
    featured: Experience | null;
    experiences: Experience[];
    canRegister: boolean;
};

const heroGradient = 'linear-gradient(135deg, #1A5FA8 0%, #0C4880 40%, #E87D2C 100%)';

export default function Home({ featured, experiences, canRegister }: Props) {
    return (
        <MainLayout>
            <Head title="PathFinder — Experiències de viatges" />

            {/* ══════ HERO ══════ */}
            <section className="relative mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-8">
                {/* Decorative circle */}
                <div className="pointer-events-none absolute -right-20 -top-28 -z-10 hidden h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-pf-primary-l to-transparent opacity-60 lg:block dark:from-pf-primary-ldark" />

                {/* Text side */}
                <div className="animate-fade-up text-center lg:text-left">
                    {/* Eyebrow */}
                    <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-pf-accent-l bg-pf-accent-l px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-pf-accent dark:border-pf-accent-ldark dark:bg-pf-accent-ldark dark:text-pf-accent-dark">
                        ✦ Comunitat de viatgers reals
                    </span>

                    <h1 className="mb-5 text-[clamp(34px,4vw,54px)] font-bold leading-[1.15] tracking-tight text-pf-text dark:text-pf-text-dark">
                        Descobreix el món a través d&apos;
                        <em className="text-pf-primary not-italic dark:text-pf-primary-dark">experiències</em> autèntiques
                    </h1>

                    <p className="mx-auto mb-8 max-w-md text-[15px] font-light leading-relaxed text-pf-text-2 lg:mx-0 dark:text-pf-text-2dark">
                        Comparteix rutes, allotjaments, fotografies i recomanacions de viatge.
                        Sense filtres, sense agències. Només persones reals explicant les seves aventures.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <Link
                            href="/explorar"
                            className="rounded-full bg-pf-accent px-7 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(232,125,44,0.35)] transition-all hover:-translate-y-0.5 hover:bg-pf-accent-h hover:shadow-[0_6px_24px_rgba(232,125,44,0.4)] active:scale-[0.97] dark:bg-pf-accent-dark"
                        >
                            Explorar experiències
                        </Link>
                        {canRegister && (
                            <Link
                                href="/register"
                                className="rounded-full border-[1.5px] border-pf-border-2 px-6 py-[11px] text-sm font-medium text-pf-text-2 transition-all hover:border-pf-primary hover:bg-pf-primary-l hover:text-pf-primary dark:border-pf-border-2dark dark:text-pf-text-2dark dark:hover:border-pf-primary-dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark"
                            >
                                Registrar-se
                            </Link>
                        )}
                    </div>
                </div>

                {/* Featured experience image */}
                <div className="animate-fade-up-delay-1 relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
                    <div className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                        {featured?.image ? (
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                            />
                        ) : (
                            <div
                                className="flex aspect-[4/3] w-full items-center justify-center text-7xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                                style={{ background: heroGradient }}
                            >
                                🏔
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Caption */}
                        <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                            {featured ? (
                                <>
                                    <strong className="block text-lg font-semibold">{featured.title}</strong>
                                    <span className="mt-1 flex items-center gap-3 text-xs opacity-75">
                                        <span>
                                            {featured.main_country?.name}
                                            {featured.categories[0] && ` · ${featured.categories[0].name}`}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {featured.ratings_up_count}
                                        </span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <strong className="block text-[17px] font-semibold">Trekking al Nepal</strong>
                                    <span className="text-xs opacity-75">Annapurna Base Camp</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Featured badge */}
                    <div className="animate-fade-up-delay-3 absolute -right-3 -top-3 flex items-center gap-2 rounded-xl border border-pf-border bg-pf-surface px-3.5 py-2.5 text-xs font-medium text-pf-text-2 shadow-sm max-lg:right-3 max-lg:top-3 dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-2dark">
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)] animate-pulse-glow" />
                        Experiència destacada
                    </div>
                </div>
            </section>

            {/* ══════ ÚLTIMES EXPERIÈNCIES ══════ */}
            {experiences.length > 0 && (
                <section className="mt-12 max-w-6xl lg:mt-16">
                    {/* Section header */}
                    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-pf-primary dark:text-pf-primary-dark">
                                Publicades recentment
                            </p>
                            <h2 className="text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight text-pf-text dark:text-pf-text-dark">
                                Últimes experiències
                            </h2>
                        </div>
                        <Link
                            href="/explorar"
                            className="flex flex-shrink-0 items-center gap-1 border-b border-transparent pb-0.5 text-[13px] font-medium text-pf-primary transition-colors hover:border-pf-primary dark:text-pf-primary-dark dark:hover:border-pf-primary-dark"
                        >
                            Veure totes
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Cards grid — 3 columns, larger cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {experiences.slice(0, 3).map((exp, i) => (
                            <ExperienceCard
                                key={exp.id}
                                experience={exp}
                                size="lg"
                                className={
                                    i === 0
                                        ? 'animate-fade-up-delay-1'
                                        : i === 1
                                          ? 'animate-fade-up-delay-2'
                                          : 'animate-fade-up-delay-3'
                                }
                            />
                        ))}
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
