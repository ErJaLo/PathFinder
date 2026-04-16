import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import Summary from '@/components/admin/summary';
import ModalUserEdit from '@/components/modals/modal-user-edit';
import ModalUserToggleStatus from '@/components/modals/modal-user-toggle-status';
import { DataPagination } from '@/components/ui/data-pagination';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administració', href: '/admin' },
    { title: 'Usuaris', href: '/admin/users' },
];

function getAvatarColors(name: string): { bg: string; fg: string } {
    const palette = [
        { bg: '#dbeafe', fg: '#1e40af' },
        { bg: '#dcfce7', fg: '#166534' },
        { bg: '#fef9c3', fg: '#854d0e' },
        { bg: '#fce7f3', fg: '#9d174d' },
        { bg: '#ede9fe', fg: '#5b21b6' },
        { bg: '#ffedd5', fg: '#9a3412' },
    ];
    const idx = name.charCodeAt(0) % palette.length;

    return palette[idx];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? '')
        .join('');
}

const STATUS_LABEL: Record<string, string> = {
    active: 'Actiu',
    inactive: 'Inactiu',
};

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-pf-accent-l text-pf-accent-h dark:bg-pf-accent-ldark dark:text-pf-accent-dark',
    inactive:
        'bg-pf-amber-l text-pf-amber-dark dark:bg-pf-amber-ldark dark:text-pf-amber-dark',
};

const DOT_STYLES: Record<string, string> = {
    active: 'bg-pf-accent dark:bg-pf-accent-dark',
    inactive: 'bg-pf-amber dark:bg-pf-amber-dark',
};

interface User {
    id: number;
    name: string;
    surname?: string | null;
    email: string;
    created_at: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    posts?: number;
}

export default function AdminUsers() {
    const {
        users: initialUsers,
        total,
        perPage,
        page,
        search: prevSearch = '',
        status: prevStatus = '',
    } = usePage().props as unknown as {
        users: User[];
        total: number;
        perPage: number;
        page: number;
        search?: string;
        status?: string;
    };
    const [search, setSearch] = useState(prevSearch);
    const [statusFilter, setStatusFilter] = useState(prevStatus);
    const [confirmUser, setConfirmUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const formPage = useForm({ page, perPage });

    function goToPage(p: number) {
        formPage.transform(() => ({ page: p, perPage }));
        formPage.get(route('admin.users.index'), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    const formSearch = useForm({ search: '', status: '' });

    function handleSearch() {
        formSearch.transform(() => ({
            page: 1,
            perPage,
            search,
            status: statusFilter,
        }));
        formSearch.get(route('admin.users.index'), {
            preserveScroll: true,
        });
    }

    /**
     * Using ziggy, we can define interlan routes, with that and the useForm, we can use all the
     * form  petitions
     *   get: (url: string, options?: UseFormSubmitOptions) => void;
     *   patch: (url: string, options?: UseFormSubmitOptions) => void;
     *   post: (url: string, options?: UseFormSubmitOptions) => void;
     *   put: (url: string, options?: UseFormSubmitOptions) => void;
     *   delete: (url: string, options?: UseFormSubmitOptions) => void;
     */
    const form = useForm();
    function handleDeactivate(id: number) {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? {
                          ...u,
                          status: u.status === 'active' ? 'inactive' : 'active',
                      }
                    : u,
            ),
        );
        setConfirmUser(null);
        form.patch(route('admin.users.toggleActive', { user: id }));
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Administració — PathFinder" />
            <Summary />

            <ModalUserToggleStatus
                open={confirmUser !== null}
                user={confirmUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setConfirmUser(null);
                    }
                }}
                onConfirm={handleDeactivate}
            />

            <ModalUserEdit
                open={editUser !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditUser(null);
                    }
                }}
                user={editUser}
            />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-pf-primary dark:text-pf-primary-dark">
                        Usuaris
                    </h1>
                    <p className="text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Gestiona els usuaris de la plataforma
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface dark:border-pf-border-dark dark:bg-pf-surface-dark">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
                        <span className="flex items-center gap-2 text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                            <svg
                                className="h-4 w-4 text-pf-primary dark:text-pf-primary-dark"
                                fill="none"
                                viewBox="0 0 16 16"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <circle cx="6" cy="5" r="3" />
                                <path d="M1 14c0-3.3 2.2-6 5-6s5 2.7 5 6" />
                            </svg>
                            Gestió d'usuaris
                        </span>

                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center">
                                <svg
                                    className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-pf-text-3 dark:text-pf-text-3dark"
                                    fill="none"
                                    viewBox="0 0 16 16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="6.5" cy="6.5" r="4" />
                                    <path
                                        d="M10 10l3 3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cerca per nom o email…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-8 w-56 rounded-lg border border-pf-border bg-pf-bg-2 pr-3 pl-8 text-sm text-pf-text placeholder:text-pf-text-3 focus:ring-2 focus:ring-pf-primary focus:outline-none dark:border-pf-border-dark dark:bg-pf-bg-2dark dark:text-pf-text-dark placeholder:dark:text-pf-text-3dark focus:dark:ring-pf-primary-dark"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="h-8 rounded-lg border border-pf-border bg-pf-bg-2 px-3 text-sm text-pf-text focus:ring-2 focus:ring-pf-primary focus:outline-none dark:border-pf-border-dark dark:bg-pf-bg-2dark dark:text-pf-text-dark focus:dark:ring-pf-primary-dark"
                            >
                                <option value="">Tots els estats</option>
                                <option value="active">Actius</option>
                                <option value="inactive">Inactius</option>
                                {/* <option value="deleted">Donats de baixa</option> */}
                            </select>
                            {/* Botón buscar */}
                            <button
                                onClick={handleSearch}
                                className="h-8 rounded-lg bg-pf-primary px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                Cerca
                            </button>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-pf-border bg-pf-surface-2 text-left text-xs font-semibold tracking-wide text-pf-text-3 uppercase dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-3dark">
                                <th className="px-4 py-3">Usuari</th>
                                <th className="px-4 py-3">Rol</th>
                                <th className="px-4 py-3">Experiències</th>
                                <th className="px-4 py-3">Registre</th>
                                <th className="px-4 py-3">Estat</th>
                                <th className="px-4 py-3">Accions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pf-border dark:divide-pf-border-dark">
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center text-pf-text-3 dark:text-pf-text-3dark"
                                    >
                                        No s'han trobat usuaris
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const isInactive = user.status === 'inactive';
                                    const { bg, fg } = getAvatarColors(
                                        user.name,
                                    );
                                    const initials = getInitials(user.name);

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors hover:bg-pf-bg-2 dark:hover:bg-pf-bg-2dark ${isInactive ? 'opacity-70' : ''}`}
                                        >
                                            {/* User cell */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pf-border text-xs font-bold dark:border-pf-border-dark"
                                                        style={{
                                                            background: bg,
                                                            color: fg,
                                                        }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-pf-text dark:text-pf-text-dark">
                                                            u/{user.name}
                                                        </div>
                                                        <div className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                                                        user.role === 'admin'
                                                            ? 'bg-pf-primary-l text-pf-primary-h dark:bg-pf-primary-ldark dark:text-pf-primary-hdark'
                                                            : 'bg-pf-surface-2 text-pf-text-3 dark:bg-pf-surface-2dark dark:text-pf-text-3dark'
                                                    }`}
                                                >
                                                    {user.role === 'admin'
                                                        ? 'Admin'
                                                        : 'Usuari'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-pf-text-3 dark:text-pf-text-3dark">
                                                {user.posts ?? '—'}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 text-pf-text-3 dark:text-pf-text-3dark">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString('ca-ES')}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[user.status]}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[user.status]}`}
                                                    />
                                                    {STATUS_LABEL[user.status]}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        title="Editar usuari"
                                                        onClick={() =>
                                                            setEditUser(user)
                                                        }
                                                        className="rounded-lg p-1.5 text-pf-text-3 transition-colors hover:bg-pf-bg-2 hover:text-pf-primary dark:text-pf-text-3dark dark:hover:bg-pf-bg-2dark dark:hover:text-pf-primary-dark"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            <path
                                                                d="M8.7 1.8a1.2 1.2 0 011.7 1.7L4.6 9.3 2 10l.7-2.6 6-5.6z"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* <button
                                                        disabled={false}
                                                        title="Veure experiències"
                                                        className="rounded-lg p-1.5 text-pf-text-3 transition-colors hover:bg-pf-bg-2 hover:text-pf-text disabled:cursor-not-allowed disabled:opacity-40 dark:text-pf-text-3dark dark:hover:bg-pf-bg-2dark dark:hover:text-pf-text-dark"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            <circle
                                                                cx="6"
                                                                cy="6"
                                                                r="4"
                                                            />
                                                            <path
                                                                d="M9 9l2 2"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button> */}

                                                    <button
                                                        disabled={user.role === 'admin'}
                                                        title={
                                                            user.status === 'active'
                                                                ? 'Deshabilitar'
                                                                : 'Habilitar'
                                                        }
                                                        onClick={() =>
                                                            setConfirmUser(user)
                                                        }
                                                        className="rounded-lg p-1.5 text-pf-text-3 transition-colors hover:bg-pf-bg-2 hover:text-pf-accent-h disabled:cursor-not-allowed disabled:opacity-40 dark:text-pf-text-3dark dark:hover:bg-pf-bg-2dark dark:hover:text-pf-accent-dark"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            {user.status === 'active' ? (
                                                                <path
                                                                    d="M2 6h8"
                                                                    strokeLinecap="round"
                                                                />
                                                            ) : (
                                                                <path
                                                                    d="M2.5 6.2L4.8 8.5 9.5 3.8"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            )}
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    <DataPagination
                        total={total}
                        perPage={perPage}
                        currentPage={page}
                        onPageChange={goToPage}
                    />
                </div>

                {/* Footer count */}
                <p className="text-right text-xs text-pf-text-3 dark:text-pf-text-3dark">
                    {users.length} usuari{users.length !== 1 ? 's' : ''}
                </p>
            </div>
        </AdminLayout>
    );
}
