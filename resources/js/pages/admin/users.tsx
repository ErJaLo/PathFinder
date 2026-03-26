import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Summary from '@/components/admin/summary';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
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
    deleted: 'Baixa',
};

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-pf-accent-l text-pf-accent-h',
    inactive: 'bg-pf-amber-l text-pf-amber-dark',
    deleted: 'bg-pf-border-2 text-pf-border-dark line-through opacity-60',
};

const DOT_STYLES: Record<string, string> = {
    active: 'bg-pf-accent',
    inactive: 'bg-pf-amber',
    deleted: 'bg-pf-border-dark',
};

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive' | 'deleted';
    posts?: number;
}

function ConfirmModal({
    user,
    onCancel,
    onConfirm,
}: {
    user: User;
    onCancel: () => void;
    onConfirm: (id: number) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-pf-border bg-pf-surface p-6 shadow-2xl">
                <h2 className="mb-1 text-lg font-semibold text-pf-text">Donar de baixa</h2>
                <p className="mb-6 text-sm text-pf-text-3">
                    Segur que vols donar de baixa a{' '}
                    <span className="font-medium text-pf-text">{user.name}</span>? Aquesta acció
                    no es pot desfer.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-pf-border px-4 py-2 text-sm font-medium text-pf-text hover:bg-pf-bg-2"
                    >
                        Cancel·lar
                    </button>
                    <button
                        onClick={() => onConfirm(user.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Confirmar baixa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    const { users: initialUsers } = usePage().props as { users: User[] };
    console.log('Initial users:', initialUsers); // Debug log to check the data structure
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [confirmUser, setConfirmUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const { theme, toggleTheme } = useTheme();


    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
                (!statusFilter || u.status === statusFilter),
        );
    }, [users, search, statusFilter]);

    function handleDeactivate(id: number) {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: 'deleted' as const } : u)),
        );
        setConfirmUser(null);
        // aquiii!!! router.patch(`/admin/users/${id}/deactivate`)
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Administració — PathFinder" />
            <Summary />

            {confirmUser && (
                <ConfirmModal
                    user={confirmUser}
                    onCancel={() => setConfirmUser(null)}
                    onConfirm={handleDeactivate}
                />
            )}

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Page title */}
                <div>
                    <h1 className="text-2xl font-bold dark:text-pf-primary">Usuaris</h1>
                    <p className="text-sm dark:text-pf-text-3">
                        Gestiona els usuaris de la plataforma
                    </p>
                </div>

                {/* Panel */}
                <div className="overflow-hidden rounded-xl border dark:border-pf-border dark:bg-pf-surface">

                    {/* ── Panel header ── */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pf-border px-4 py-3">
                        {/* Title */}
                        <span className="flex items-center gap-2 text-sm font-semibold text-pf-text">
                            <svg
                                className="h-4 w-4 dark:text-pf-primary"
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

                        {/* Toolbar */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative flex items-center">
                                <svg
                                    className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 dark:text-pf-text-3"
                                    fill="none"
                                    viewBox="0 0 16 16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="6.5" cy="6.5" r="4" />
                                    <path d="M10 10l3 3" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cerca per nom o email…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-8 w-56 rounded-lg border dark:border-pf-border dark:bg-pf-bg-2 pl-8 pr-3 text-sm dark:text-pf-text dark:placeholder:text-pf-text-3 focus:outline-none focus:ring-2 focus:dark:ring-pf-primary"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-8 rounded-lg border dark:border-pf-border dark:bg-pf-bg-2 px-3 text-sm dark:text-pf-text focus:outline-none focus:ring-2 focus:dark:ring-pf-primary"
                            >
                                <option value="">Tots els estats</option>
                                <option value="active">Actius</option>
                                <option value="inactive">Inactius</option>
                                <option value="deleted">Donats de baixa</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b dark:border-pf-border dark:bg-pf-surface-2 text-left text-xs font-semibold uppercase tracking-wide dark:text-pf-text-3">
                                <th className="px-4 py-3">Usuari</th>
                                <th className="px-4 py-3">Rol</th>
                                <th className="px-4 py-3">Experiències</th>
                                <th className="px-4 py-3">Registre</th>
                                <th className="px-4 py-3">Estat</th>
                                <th className="px-4 py-3">Accions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-pf-border">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center dark:text-pf-text-3"
                                    >
                                        No s'han trobat usuaris
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => {
                                    const isDeleted = user.status === 'deleted';
                                    const { bg, fg } = getAvatarColors(user.name);
                                    const initials = getInitials(user.name);

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors dark:hover:bg-pf-bg-2 ${isDeleted ? 'opacity-50' : ''}`}
                                        >
                                            {/* User cell */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border dark:border-pf-border text-xs font-bold"
                                                        style={{ background: bg, color: fg }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium dark:text-pf-text">
                                                            u/{user.name}
                                                        </div>
                                                        <div className="text-xs dark:text-pf-text-3">
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
                                                            ? 'dark:bg-pf-primary-l dark:text-pf-primary-h'
                                                            : 'dark:bg-pf-surface-2 dark:text-pf-text-3'
                                                    }`}
                                                >
                                                    {user.role === 'admin' ? 'Admin' : 'Usuari'}
                                                </span>
                                            </td>

                                            {/* Experiències */}
                                            <td className="px-4 py-3 dark:text-pf-text-3">
                                                {user.posts ?? '—'}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 dark:text-pf-text-3">
                                                {new Date(user.created_at).toLocaleDateString(
                                                    'ca-ES',
                                                )}
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

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        disabled={isDeleted}
                                                        title="Veure experiències"
                                                        className="rounded-lg p-1.5 dark:text-pf-text-3 transition-colors dark:hover:bg-pf-bg-2 hover:dark:text-pf-text disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            <circle cx="6" cy="6" r="4" />
                                                            <path
                                                                d="M9 9l2 2"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        disabled={isDeleted || user.role === 'admin'}
                                                        title="Donar de baixa"
                                                        onClick={() => setConfirmUser(user)}
                                                        className="rounded-lg p-1.5 dark:text-pf-text-3 transition-colors hover:dark:bg-pf-bg-2 hover:dark:text-pf-accent-h disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 12 12"
                                                            stroke="currentColor"
                                                            strokeWidth="1.5"
                                                        >
                                                            <path
                                                                d="M2 3h8M4 3V2h4v1M5 5v4M7 5v4"
                                                                strokeLinecap="round"
                                                            />
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
                </div>

                {/* Footer count */}
                <p className="text-right text-xs dark:text-pf-text-3">
                    {filtered.length} usuari{filtered.length !== 1 ? 's' : ''}
                </p>
            </div>
        </AdminLayout>
    );
}