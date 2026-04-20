import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, ChevronLeft, User, Clock3, MessageSquare, CircleCheck, Eye } from 'lucide-react';
import { route } from 'ziggy-js';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface UserData {
    id: number;
    name: string;
    email: string;
}

interface ContactMessage {
    id: number;
    user_id: number;
    type: 'suggestion' | 'technical_issue' | 'account' | 'other';
    subject: string;
    message: string;
    status: 'pending' | 'in_review' | 'resolved';
    created_at?: string;
    updated_at?: string;
    user?: UserData;
}

const TYPE_LABELS: Record<ContactMessage['type'], string> = {
    suggestion: 'Suggeriment',
    technical_issue: 'Problema tècnic',
    account: 'Gestió del compte',
    other: 'Altre',
};

const STATUS_LABELS: Record<ContactMessage['status'], string> = {
    pending: 'Pendent',
    in_review: 'En revisió',
    resolved: 'Resolt',
};

export default function ContactMessageDetailPage() {
    const { message } = usePage().props as unknown as { message: ContactMessage };
    const form = useForm({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Formularis de contacte', href: '/admin/contacts' },
        { title: `Missatge #${message.id}`, href: `/admin/contacts/${message.id}` },
    ];

    function markInReview() {
        form.put(route('admin.contacts.in-review', { contactMessage: message.id }));
    }

    function markResolved() {
        form.put(route('admin.contacts.resolve', { contactMessage: message.id }));
    }

    const statusClasses =
        message.status === 'resolved'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            : message.status === 'in_review'
              ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400';

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex items-center gap-2 text-pf-text-3 dark:text-pf-text-2dark">
                    <Link href="/admin/contacts" className="flex items-center gap-1 transition hover:text-pf-primary">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-sm font-semibold">Enrere</span>
                    </Link>
                </div>

                <div className="mb-6 flex items-start gap-5 rounded-xl border border-pf-border bg-white p-6 shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/20">
                        <Mail className="h-7 w-7 text-blue-500" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-bold uppercase text-blue-700 dark:border-blue-800 dark:text-blue-400">
                                {TYPE_LABELS[message.type]}
                            </span>
                            <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${statusClasses}`}>
                                {STATUS_LABELS[message.status]}
                            </span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-pf-text dark:text-white">{message.subject}</h1>
                        <p className="text-sm font-medium text-pf-text-3 dark:text-pf-text-3dark">
                            Rebuda el {message.created_at ? new Date(message.created_at).toLocaleString('ca-ES') : '-'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border bg-pf-surface-2 px-5 py-4 dark:bg-pf-surface-2dark">
                                <MessageSquare className="h-5 w-5 text-pf-text-2" />
                                <h2 className="font-bold text-pf-text dark:text-white">Missatge</h2>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-[130px_1fr] border-b border-pf-border/50 py-4 first:pt-0 md:grid-cols-[170px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">Tipus</span>
                                    <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">{TYPE_LABELS[message.type]}</span>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] border-b border-pf-border/50 py-4 md:grid-cols-[170px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">Assumpte</span>
                                    <span className="text-sm font-bold text-pf-text dark:text-pf-text-dark">{message.subject}</span>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] py-4 pb-0 md:grid-cols-[170px_1fr]">
                                    <span className="text-sm font-semibold text-pf-text-2 dark:text-pf-text-2dark">Contingut</span>
                                    <div className="rounded-lg border border-pf-border bg-pf-bg p-4 text-sm italic text-pf-text-2 dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-2dark">
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border px-5 py-4 dark:border-pf-border-dark">
                                <User className="h-4 w-4 text-pf-text-2" />
                                <h2 className="text-sm font-bold text-pf-text dark:text-white">Usuari</h2>
                            </div>
                            <div className="space-y-4 p-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-pf-text-3 dark:text-pf-text-3dark">Nom</p>
                                    <p className="text-sm font-bold text-pf-text dark:text-pf-text-dark">u/{message.user?.name || message.user_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-pf-text-3 dark:text-pf-text-3dark">Email</p>
                                    <p className="text-sm text-pf-text dark:text-pf-text-dark">{message.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-pf-text-3 dark:text-pf-text-3dark">Última actualització</p>
                                    <p className="text-sm text-pf-text dark:text-pf-text-dark">
                                        {message.updated_at ? new Date(message.updated_at).toLocaleString('ca-ES') : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-pf-border bg-white shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 border-b border-pf-border px-5 py-4 dark:border-pf-border-dark">
                                <Clock3 className="h-4 w-4 text-pf-text-2" />
                                <h2 className="text-sm font-bold text-pf-text dark:text-white">Accions</h2>
                            </div>
                            <div className="flex flex-col gap-3 p-5">
                                <button
                                    onClick={markInReview}
                                    disabled={message.status === 'resolved'}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                >
                                    <Eye className="h-4 w-4" />
                                    Marcar en revisió
                                </button>
                                <button
                                    onClick={markResolved}
                                    disabled={message.status === 'resolved'}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CircleCheck className="h-4 w-4" />
                                    Marcar com resolt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
