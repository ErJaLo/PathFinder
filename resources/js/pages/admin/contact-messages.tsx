import { useForm, usePage, router, Link } from '@inertiajs/react';
import { AlertCircle, Search, Check, Eye, Mail, Clock3 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import Summary from '@/components/admin/summary';
import { DataPagination } from '@/components/ui/data-pagination';
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

type PageProps = {
    messages: ContactMessage[];
    total: number;
    perPage: number;
    page: number;
    search?: string;
    status?: string;
    type?: string;
    globalData?: {
        totalContactMessagesPending?: number;
    };
};

const TYPE_LABELS: Record<ContactMessage['type'], string> = {
    suggestion: 'Suggeriment',
    technical_issue: 'Problema tècnic',
    account: 'Compte',
    other: 'Altre',
};

const STATUS_LABELS: Record<ContactMessage['status'], string> = {
    pending: 'Pendent',
    in_review: 'En revisió',
    resolved: 'Resolt',
};

export default function ContactMessagesPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Formularis de contacte', href: '/admin/contacts' },
    ];

    const {
        messages = [],
        total = 0,
        perPage = 10,
        page = 1,
        search: prevSearch = '',
        status: prevStatus = '',
        type: prevType = '',
        globalData,
    } = usePage<PageProps>().props;

    const [search, setSearch] = useState(prevSearch);
    const [type, setType] = useState(prevType);
    const currentStatus = prevStatus;

    const formPage = useForm({ page, perPage });
    const formStatus = useForm({});

    function goToPage(targetPage: number) {
        formPage.transform(() => ({
            page: targetPage,
            perPage,
            search,
            type: type || undefined,
            status: currentStatus || undefined,
        }));

        formPage.get(route('admin.contacts.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function filterByStatus(nextStatus: string) {
        router.get(
            route('admin.contacts.index'),
            {
                page: 1,
                perPage,
                search,
                type: type || undefined,
                status: nextStatus === 'Tots' ? undefined : nextStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function handleSearch() {
        router.get(
            route('admin.contacts.index'),
            {
                page: 1,
                perPage,
                search,
                type: type || undefined,
                status: currentStatus || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function markInReview(item: ContactMessage) {
        formStatus.put(route('admin.contacts.in-review', { contactMessage: item.id }));
    }

    function markResolved(item: ContactMessage) {
        formStatus.put(route('admin.contacts.resolve', { contactMessage: item.id }));
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Summary />

            <div className="mx-2 mt-6 overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark sm:mx-4">
                <div className="flex items-center justify-between border-b border-pf-border bg-white p-4 dark:border-pf-border-dark dark:bg-pf-surface-dark">
                    <div className="flex items-center gap-3 text-pf-text dark:text-pf-text-dark">
                        <Mail className="h-5 w-5 text-pf-primary dark:text-pf-primary-dark" />
                        <h2 className="text-lg font-bold">Formularis de contacte</h2>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/30 dark:text-amber-300">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                        {globalData?.totalContactMessagesPending ?? 0} pendents
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-b border-pf-border bg-white px-5 py-4 dark:border-pf-border-dark dark:bg-pf-surface-dark xl:flex-row">
                    <div className="flex w-full rounded-md border border-pf-border bg-pf-bg p-1 dark:border-pf-border-dark dark:bg-pf-bg-dark xl:w-auto">
                        <button onClick={() => filterByStatus('')} className={`flex-1 rounded px-4 py-1.5 text-sm transition-colors xl:flex-none ${currentStatus === '' ? 'border border-gray-200 bg-white font-bold text-pf-text shadow-sm dark:border-gray-700 dark:bg-pf-surface-dark dark:text-white' : 'border border-transparent font-medium text-pf-text-2 hover:text-pf-text dark:text-pf-text-2dark dark:hover:text-white'}`}>Tots</button>
                        <button onClick={() => filterByStatus('pending')} className={`flex-1 rounded px-4 py-1.5 text-sm transition-colors xl:flex-none ${currentStatus === 'pending' ? 'border border-gray-200 bg-white font-bold text-pf-text shadow-sm dark:border-gray-700 dark:bg-pf-surface-dark dark:text-white' : 'border border-transparent font-medium text-pf-text-2 hover:text-pf-text dark:text-pf-text-2dark dark:hover:text-white'}`}>Pendents</button>
                        <button onClick={() => filterByStatus('in_review')} className={`flex-1 rounded px-4 py-1.5 text-sm transition-colors xl:flex-none ${currentStatus === 'in_review' ? 'border border-gray-200 bg-white font-bold text-pf-text shadow-sm dark:border-gray-700 dark:bg-pf-surface-dark dark:text-white' : 'border border-transparent font-medium text-pf-text-2 hover:text-pf-text dark:text-pf-text-2dark dark:hover:text-white'}`}>En revisió</button>
                        <button onClick={() => filterByStatus('resolved')} className={`flex-1 rounded px-4 py-1.5 text-sm transition-colors xl:flex-none ${currentStatus === 'resolved' ? 'border border-gray-200 bg-white font-bold text-pf-text shadow-sm dark:border-gray-700 dark:bg-pf-surface-dark dark:text-white' : 'border border-transparent font-medium text-pf-text-2 hover:text-pf-text dark:text-pf-text-2dark dark:hover:text-white'}`}>Resolts</button>
                    </div>

                    <div className="flex w-full flex-1 gap-3 xl:max-w-md">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="h-8 rounded-md border border-pf-border bg-pf-bg px-2 text-xs text-pf-text focus:outline-none focus:ring-2 focus:ring-pf-primary dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-white"
                        >
                            <option value="">Tots els tipus</option>
                            <option value="suggestion">Suggeriment</option>
                            <option value="technical_issue">Problema tècnic</option>
                            <option value="account">Compte</option>
                            <option value="other">Altre</option>
                        </select>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Cerca per assumpte, missatge, usuari o email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full rounded-md border border-pf-border bg-pf-bg py-1.5 pl-9 pr-4 text-sm text-pf-text focus:outline-none focus:ring-2 focus:ring-pf-primary dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-white"
                            />
                        </div>
                        <button onClick={handleSearch} className="h-8 rounded-lg bg-pf-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
                            Cerca
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-pf-border bg-white dark:divide-pf-border-dark dark:bg-pf-surface-dark">
                    {messages.map((item) => (
                        <div key={item.id} className="flex flex-col gap-5 p-5 transition-colors hover:bg-pf-bg dark:hover:bg-pf-bg-dark/50 md:flex-row">
                            <div className="shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/20">
                                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="rounded border border-blue-200 bg-blue-50/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-800/50 dark:bg-transparent dark:text-blue-400">
                                        {TYPE_LABELS[item.type]}
                                    </span>
                                </div>
                                <h3 className="mb-1 truncate text-base font-bold text-pf-text dark:text-white">{item.subject}</h3>
                                <p className="mb-3 line-clamp-2 text-sm text-pf-text-2 dark:text-pf-text-2dark">{item.message}</p>

                                <div className="flex items-center gap-3 text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                    <span>
                                        <span className="font-semibold text-pf-text dark:text-gray-300">u/{item.user?.name || item.user_id}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{item.user?.email || '-'}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex shrink-0 flex-col items-end justify-between md:mt-0">
                                <div className="mb-4 flex items-center gap-3 text-xs text-pf-text-3 dark:text-gray-500 md:mb-0">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    <span className="font-medium">{item.created_at ? new Date(item.created_at).toLocaleString('ca-ES') : '-'}</span>
                                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${item.status === 'resolved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400' : item.status === 'in_review' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-400' : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                                        {STATUS_LABELS[item.status]}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={route('admin.contacts.detail', { contactMessage: item.id })} className="flex items-center gap-1.5 rounded-md border border-pf-border px-3 py-1.5 text-xs font-bold text-pf-text shadow-sm transition-colors hover:bg-pf-bg dark:border-pf-border-dark dark:text-gray-300 dark:hover:bg-pf-bg-dark">
                                        <Eye className="h-3.5 w-3.5" /> Detalls
                                    </Link>
                                    <button
                                        onClick={() => markInReview(item)}
                                        disabled={item.status === 'resolved'}
                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-white text-blue-600 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900/50 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-900/30"
                                    >
                                        <Eye className="h-4 w-4" strokeWidth={2.6} />
                                    </button>
                                    <button
                                        onClick={() => markResolved(item)}
                                        disabled={item.status === 'resolved'}
                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 bg-white text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/50 dark:bg-transparent dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                    >
                                        <Check className="h-4 w-4" strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 border-t border-pf-border p-8 text-center text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark">
                            <Check className="h-10 w-10 text-emerald-500" />
                            <p className="text-sm font-medium">No hi ha formularis de contacte per mostrar.</p>
                        </div>
                    ) : (
                        <div className="border-t border-pf-border bg-white px-6 py-4 dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <DataPagination total={total} perPage={perPage} currentPage={page} onPageChange={goToPage} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
