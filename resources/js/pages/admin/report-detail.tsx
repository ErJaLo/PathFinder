

import { Link, usePage, router } from "@inertiajs/react";
import { 
    AlertTriangle, ChevronLeft, Info, FileText, Clock, Component, 
    Check, X, UserX, Trash2, User, Flag, Eye, Edit3, MapPin 
} from "lucide-react";
import { route } from 'ziggy-js';
import AdminLayout from "@/layouts/admin-layout";
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
    return new Date(dateStr).toLocaleDateString('ca-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatDateTime = (dateStr?: string) => {
    if (!dateStr) {
return '-';
}

    return new Date(dateStr).toLocaleString('ca-ES', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    });
};

export default function ReportDetails() {
    const { report } = usePage().props as unknown as { report: ReportData };

    const r = report || {
        id: 4,
        reason: "FALTA DE RESPECTE O ASSETJAMENT",
        status: "dismissed",
        created_at: "2026-04-11T09:34:06.000000Z",
        user: { id: 1, name: "Señora del Vagón Bar", email: "vagonbar@viatges.cat" },
        post: {
            id: 1,
            title: "Est earum asperiores tempora placeat dicta sed suscipit.",
            content: "Non et sunt iste iste laudantium. Consequatur mollitia repellendus fuga. Nesciunt ea et officiis error doloribus sit ut optio. Et qui et aut ratione voluptates aut. Nobis nihil non dolorem temporibus. Voluptatem et rerum ea id. Aspernatur accusantium autem tempore sint sint. Magnam voluptas neque quod quis.",
            main_country: { code: "CH", name: "Suïssa" },
            latitude: 46.818,
            longitude: 8.227,
            experience_date: "2025-03-20",
            status: "published",
            user: { id: 2, name: "Retraso Confirmado García", email: "retraso@viatges.cat", posts_count: 3, reports_received_count: 0 }
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Abusos reportats', href: '/admin/reports' },
        { title: `Report #${r.id}`, href: `/admin/reports/${r.id}` }
    ];

    const handleResolve = () => router.put(route("admin.reports.accepted", { report: r.id }), {}, {
            onSuccess: () => {
                router.put(route("admin.reports.cancel-post", { report: r.id }));
            }
        });
    const handleDismiss = () => router.put(route("admin.reports.aprove-post", { report: r.id }), {}, {
        onSuccess: () => {
            router.put(route("admin.reports.active-post", { report: r.id }));
        }
    });
    const handleSuspend = () => router.patch(route("admin.users.toggleActive", { user: r.post.user.id }));
    const handleDeletePost = () => router.post(route("admin.report.delete", { report: r.id }));

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-8xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 text-pf-text-3 dark:text-pf-text-2dark mb-6">
                    <Link href="/admin/reports" className="flex items-center gap-1 hover:text-pf-primary transition">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold">Enrere</span>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl p-6 mb-6 flex items-start gap-5 shadow-sm">
                    <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 flex flex-shrink-0 items-center justify-center border border-red-100 dark:border-red-900/30">
                        <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 text-xs font-bold uppercase text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                                Gravetat alta
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-xs rounded-md border border-amber-200 dark:border-amber-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                {r.status === 'pending' ? 'Pendent' : r.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-pf-text dark:text-white">
                            {r.post?.title}
                        </h1>
                        <p className="text-sm text-pf-text-3 dark:text-pf-text-3dark font-medium">
                            Reportat el {formatDateTime(r.created_at)}
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Esquerra (2/3) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Detalls del report */}
                        <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-pf-border flex items-center gap-2 bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                <Info className="w-5 h-5 text-pf-text-2" />
                                <h2 className="font-bold text-pf-text dark:text-white">Detalls del report</h2>
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4 last:border-0 first:pt-0">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Reportat per</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-pf-avatar-mc text-pf-avatar-mctxt flex items-center justify-center font-extrabold text-xs">
                                            {r.user?.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">u/{r.user?.name}</span>
                                            <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs">{r.user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4 last:border-0">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Motiu</span>
                                    <div className="bg-pf-bg dark:bg-pf-bg-dark border border-pf-border dark:border-pf-border-dark p-4 rounded-lg text-sm text-pf-text-2 dark:text-pf-text-2dark italic">
                                        {r.reason}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4 last:border-0">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Estat</span>
                                    <div className="flex items-center">
                                        <span className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-sm rounded-full border border-amber-200 dark:border-amber-800">
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            {r.status === 'pending' ? 'Pendent' : r.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post Reportat */}
                        <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-pf-border flex items-center gap-2 bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                <FileText className="w-5 h-5 text-pf-text-2" />
                                <h2 className="font-bold text-pf-text dark:text-white">Post reportat</h2>
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4 first:pt-0">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Títol</span>
                                    <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">{r.post?.title}</span>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Contingut</span>
                                    <div className="bg-pf-bg dark:bg-pf-bg-dark border border-pf-border dark:border-pf-border-dark p-4 rounded-lg text-sm text-pf-text-2 dark:text-pf-text-2dark italic">
                                        {r.post?.content}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Autor</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 flex items-center justify-center font-extrabold text-xs">
                                            {r.post?.user?.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">u/{r.post?.user?.name}</span>
                                            <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs">{r.post?.user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Ubicació</span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-pf-text dark:text-pf-text-dark">
                                            <span className="text-red-500 select-none"></span> {r.post?.main_country?.name || 'Sense ubicació'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] border-b border-pf-border/50 py-4">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Data exp.</span>
                                    <span className="text-sm text-pf-text dark:text-pf-text-dark font-medium">{formatDate(r.post?.experience_date)}</span>
                                </div>

                                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] py-4 pb-0">
                                    <span className="text-pf-text-2 dark:text-pf-text-2dark font-semibold text-sm">Estat</span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm rounded-full border border-blue-200 dark:border-blue-800">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
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
                        <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-pf-border flex items-center gap-2">
                                <Clock className="w-4 h-4 text-pf-text-2" />
                                <h2 className="font-bold text-sm text-pf-text dark:text-white">Accions</h2>
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                <button onClick={handleResolve} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                    Acceptar report
                                </button>
                                <button onClick={handleDismiss} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark hover:bg-pf-bg dark:hover:bg-pf-bg-dark text-pf-text dark:text-white font-bold rounded-lg transition-colors shadow-sm">
                                    <X className="w-4 h-4" strokeWidth={3} />
                                    Descartar report
                                </button>
                                
                                <div className="h-px w-full bg-pf-border/60 dark:bg-pf-border-dark/60 my-2"></div>
                                
                                <button onClick={handleSuspend} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-bold rounded-lg transition-colors">
                                    <UserX className="w-4 h-4" />
                                    Suspendre autor
                                </button>
                                {/* <button onClick={handleDeletePost} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-bold rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar post
                                </button> */}
                            </div>
                        </div>

                        {/* Activitat de l'autor */}
                        <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-pf-border flex items-center gap-2 bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                <User className="w-4 h-4 text-pf-text-2" />
                                <h2 className="font-bold text-sm text-pf-text dark:text-white">Activitat de l'autor</h2>
                            </div>
                            <div className="flex divide-x divide-pf-border dark:divide-pf-border-dark">
                                <div className="flex-1 p-4 flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark">{r.post?.user?.posts_count || 0}</span>
                                    <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark font-semibold mt-1">Posts publicats</span>
                                </div>
                                <div className="flex-1 p-4 flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-red-600 dark:text-red-400">{r.post?.user?.reports_received_count || 0}</span>
                                    <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark font-semibold mt-1">Reports rebuts</span>
                                </div>
                            </div>
                        </div>

                        {/* Historial */}
                        <div className="bg-white dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-pf-border flex items-center gap-2 bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                <Clock className="w-4 h-4 text-pf-text-2" />
                                <h2 className="font-bold text-sm text-pf-text dark:text-white">Historial</h2>
                            </div>
                            <div className="p-6 relative">
                                {/* Linia de fons */}
                                <div className="absolute left-[39px] top-8 bottom-8 w-px bg-pf-border dark:bg-pf-border-dark -z-0"></div>

                                {/* Items */}
                                <div className="flex gap-4 relative z-10 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                        <Edit3 className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">Post publicat</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs my-0.5">u/{r.post?.user?.name}</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs">{formatDateTime(r.post?.created_at) || "Desconeguda"}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative z-10 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                                        <Flag className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">Report rebut</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs my-0.5">u/{r.user?.name} - {r.reason.toLowerCase()}</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs">{formatDateTime(r.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-pf-text dark:text-pf-text-dark text-sm">Última actualització</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs my-0.5">Automàtic</span>
                                        <span className="text-pf-text-3 dark:text-pf-text-3dark text-xs">{formatDateTime(r.updated_at || r.created_at)}</span>
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