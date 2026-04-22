import { Link, usePage, useForm } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import {
    AlertTriangle,
    ChevronLeft,
    Info,
    FileText,
    Clock,
    Component,
    Check,
    X,
    UserX,
    Trash2,
    User,
    Flag,
    Eye,
    Edit3,
    MapPin,
} from 'lucide-react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

// Definim les interfícies basades en les relacions recomanades
interface UserData {
    id: number;
    name: string;
    email: string;
    posts_count?: number;
    reports_received_count?: number;
}

interface CountryData {
    code: string;
    name: string;
}

interface PostData {
    id: number;
    title: string;
    content: string;
    latitude?: number;
    longitude?: number;
    experience_date?: string;
    status: string;
    created_at?: string;
    main_country?: CountryData;
    user: UserData;
}

interface ReportData {
    id: number;
    reason: string;
    status: string;
    created_at: string;
    updated_at?: string;
    user: UserData;
    post: PostData;
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) {
        return '-';
    }

    // Mantenim format AAAA-MM-DD o DD/MM/AAAA depenent de l'any, farem servir el local
    return new Date(dateStr).toLocaleDateString('ca-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const formatDateTime = (dateStr?: string) => {
    if (!dateStr) {
        return '-';
    }

    return new Date(dateStr).toLocaleString('ca-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

const REPORT_STATUS_LABELS: Record<ReportData['status'], string> = {
    pending: 'Pendent',
    accepted: 'Acceptat',
    dismissed: 'Descartat',
};

const REPORT_STATUS_BADGE_STYLES: Record<
    ReportData['status'],
    { badge: string; dot: string }
> = {
    pending: {
        badge: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        dot: 'bg-amber-500',
    },
    accepted: {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400',
        dot: 'bg-emerald-500',
    },
    dismissed: {
        badge: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800/30 dark:bg-gray-900/20 dark:text-gray-400',
        dot: 'bg-gray-500',
    },
};

export default function ReportDetails() {
    const { report } = usePage().props as unknown as { report: ReportData };

    const r = report || {
        id: 0,
        reason: 'Aquest és un motiu de report (placeholder).',
        status: 'pending',
        created_at: '2026-04-22T10:00:00.000000Z',
        user: {
            id: 1,
            name: 'Usuari Exemple',
            email: 'usuari.exemple@viatges.cat',
        },
        post: {
            id: 1,
            title: 'Títol d\'experiència (placeholder)',
            content:
                'Aquest és un contingut de mostra per visualitzar el disseny quan encara no hi ha dades reals.',
            main_country: { code: 'ES', name: 'Espanya' },
            latitude: 41.3851,
            longitude: 2.1734,
            experience_date: '2026-04-20',
            status: 'published',
            user: {
                id: 2,
                name: 'Autor Placeholder',
                email: 'autor.placeholder@viatges.cat',
                posts_count: 3,
                reports_received_count: 0,
            },
        },
    };

    const form = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Abusos reportats', href: '/admin/reports' },
        { title: `Report #${r.id}`, href: `/admin/reports/${r.id}` },
    ];

    const handleResolve = () =>
        form.put(route('admin.reports.accepted', { report: r.id }), {
            onSuccess: () => {
                form.put(route('admin.reports.cancel-post', { report: r.id }));
            },
        });
    const handleDismiss = () =>
        form.put(route('admin.reports.aprove-post', { report: r.id }), {
            onSuccess: () => {
                form.put(route('admin.reports.active-post', { report: r.id }));
            },
        });
    const handleSuspend = () =>
        form.patch(route('admin.users.toggleActive', { user: r.post.user.id }));
    const handleDeletePost = () =>
        form.post(route('admin.report.delete', { report: r.id }));

    const postContent = r.post?.content ?? '';
    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(postContent);
    const htmlPostContent = hasHtmlTags
        ? postContent
        : `<p>${escapeHtml(postContent).replaceAll('\n', '<br />')}</p>`;
    const safePostContent = DOMPurify.sanitize(htmlPostContent, {
        USE_PROFILES: { html: true },
    });
    const statusBadgeStyle =
        REPORT_STATUS_BADGE_STYLES[r.status] ?? REPORT_STATUS_BADGE_STYLES.pending;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-8xl mx-auto w-full px-4 py-8">
                <div className="mb-6 flex items-center gap-2 text-pf-text-3 dark:text-pf-text-2dark">
                    <Link
                        href="/admin/reports"
                        className="flex items-center gap-1 transition hover:text-pf-primary"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-sm font-semibold">Enrere</span>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="mb-6 flex items-start gap-5 rounded-xl border border-pf-border bg-white p-6 shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20">
                        <AlertTriangle
                            className="h-7 w-7 text-red-500"
                            strokeWidth={2.5}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-extrabold text-pf-text dark:text-white">
                            {r.post?.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-pf-text-3 dark:text-pf-text-3dark">
                                Reportat el {formatDateTime(r.created_at)}
                            </p>
                            <span className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${statusBadgeStyle.badge}`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${statusBadgeStyle.dot}`}></div>
                                {REPORT_STATUS_LABELS[r.status] ?? r.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Columna Esquerra (2/3) */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/* Detalls del report */}
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border bg-pf-surface-2 px-5 py-4 dark:bg-pf-surface-2dark">
                                <Info className="h-5 w-5 text-pf-text-2" />
                                <h2 className="font-bold text-pf-text dark:text-white">
                                    Detalls del report
                                </h2>
                            </div>
                            <div className="flex flex-col p-5">
                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 first:pt-0 last:border-0 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Reportat per
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-avatar-mc text-xs font-extrabold text-pf-avatar-mctxt">
                                            {r.user?.name
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                                u/{r.user?.name}
                                            </span>
                                            <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                                {r.user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 last:border-0 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Motiu
                                    </span>
                                    <div className="rounded-lg border border-pf-border bg-pf-bg p-4 text-sm text-pf-text-2 italic dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-2dark">
                                        {r.reason}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 last:border-0 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Estat
                                    </span>
                                    <div className="flex items-center">
                                        <span className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${statusBadgeStyle.badge}`}>
                                            <div className={`h-2 w-2 rounded-full ${statusBadgeStyle.dot}`}></div>
                                            {REPORT_STATUS_LABELS[r.status] ?? r.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post Reportat */}
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border bg-pf-surface-2 px-5 py-4 dark:bg-pf-surface-2dark">
                                <FileText className="h-5 w-5 text-pf-text-2" />
                                <h2 className="font-bold text-pf-text dark:text-white">
                                    Post reportat
                                </h2>
                            </div>
                            <div className="flex flex-col p-5">
                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 first:pt-0 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Títol
                                    </span>
                                    <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                        {r.post?.title}
                                    </span>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Contingut
                                    </span>
                                    <div
                                        className="rich-content rounded-lg border border-pf-border bg-pf-bg p-4 text-sm text-pf-text-2 dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-2dark"
                                        dangerouslySetInnerHTML={{ __html: safePostContent }}
                                    />
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Autor
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-xs font-extrabold text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            {r.post?.user?.name
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                                u/{r.post?.user?.name}
                                            </span>
                                            <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                                {r.post?.user?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Ubicació
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                            <span className="text-red-500 select-none"></span>{' '}
                                            {r.post?.main_country?.name ||
                                                'Sense ubicació'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] border-b border-pf-border/50 py-4 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Data exp.
                                    </span>
                                    <span className="text-sm font-medium text-pf-text dark:text-pf-text-dark">
                                        {formatDate(r.post?.experience_date)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] py-4 pb-0 md:grid-cols-[160px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">
                                        Estat
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            {r.post?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Dreta (1/3) */}
                    <div className="flex flex-col gap-6">
                        {/* Accions */}
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border px-5 py-4">
                                <Clock className="h-4 w-4 text-pf-text-2" />
                                <h2 className="text-sm font-bold text-pf-text dark:text-white">
                                    Accions
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 p-5">
                                <button
                                    onClick={handleResolve}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700"
                                >
                                    <Check
                                        className="h-4 w-4"
                                        strokeWidth={3}
                                    />
                                    Acceptar report
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-pf-border bg-white px-4 py-2.5 font-bold text-pf-text shadow-sm transition-colors hover:bg-pf-bg dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-white dark:hover:bg-pf-bg-dark"
                                >
                                    <X className="h-4 w-4" strokeWidth={3} />
                                    Descartar report
                                </button>

                                <div className="my-2 h-px w-full bg-pf-border/60 dark:bg-pf-border-dark/60"></div>

                                <button
                                    onClick={handleSuspend}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 font-bold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                                >
                                    <UserX className="h-4 w-4" />
                                    Suspendre autor
                                </button>
                                {/* <button onClick={handleDeletePost} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-bold rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar post
                                </button> */}
                            </div>
                        </div>

                        {/* Activitat de l'autor */}
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border bg-pf-surface-2 px-5 py-4 dark:bg-pf-surface-2dark">
                                <User className="h-4 w-4 text-pf-text-2" />
                                <h2 className="text-sm font-bold text-pf-text dark:text-white">
                                    Activitat de l'autor
                                </h2>
                            </div>
                            <div className="flex divide-x divide-pf-border dark:divide-pf-border-dark">
                                <div className="flex flex-1 flex-col items-center p-4 text-center">
                                    <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark">
                                        {r.post?.user?.posts_count || 0}
                                    </span>
                                    <span className="mt-1 text-xs font-semibold text-pf-text-3 dark:text-pf-text-3dark">
                                        Posts publicats
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center p-4 text-center">
                                    <span className="text-3xl font-black text-red-600 dark:text-red-400">
                                        {r.post?.user?.reports_received_count ||
                                            0}
                                    </span>
                                    <span className="mt-1 text-xs font-semibold text-pf-text-3 dark:text-pf-text-3dark">
                                        Reports rebuts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Historial */}
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border bg-pf-surface-2 px-5 py-4 dark:bg-pf-surface-2dark">
                                <Clock className="h-4 w-4 text-pf-text-2" />
                                <h2 className="text-sm font-bold text-pf-text dark:text-white">
                                    Historial
                                </h2>
                            </div>
                            <div className="relative p-6">
                                {/* Linia de fons */}
                                <div className="absolute top-8 bottom-8 left-[39px] -z-0 w-px bg-pf-border dark:bg-pf-border-dark"></div>

                                {/* Items */}
                                <div className="relative z-10 mb-6 flex gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        <Edit3 className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                            Post publicat
                                        </span>
                                        <span className="my-0.5 text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            u/{r.post?.user?.name}
                                        </span>
                                        <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            {formatDateTime(
                                                r.post?.created_at,
                                            ) || 'Desconeguda'}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10 mb-6 flex gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                                        <Flag className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                            Report rebut
                                        </span>
                                        <span className="my-0.5 text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            u/{r.user?.name} -{' '}
                                            {r.reason.toLowerCase()}
                                        </span>
                                        <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            {formatDateTime(r.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Eye className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                            Última actualització
                                        </span>
                                        <span className="my-0.5 text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            Automàtic
                                        </span>
                                        <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                            {formatDateTime(
                                                r.updated_at || r.created_at,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
