
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import DeleteUser from '@/components/delete-user';
import { UserForm } from '@/components/user-form';
import { UserHeader } from '@/components/user-Header';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage().props;

    const initials = auth.user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();

    const data_creacio_usuari = new Date(auth.user.created_at).toLocaleDateString('ca-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-pf-bg text-pf-text dark:bg-pf-bg-dark dark:text-pf-text-dark">
            <Head title="El meu perfil" />
            <UserHeader user={auth.user} />
        
        
        <main className="mx-auto mt-8 w-full max-w-4xl px-4 pb-12">
            {/* Panel Principal */}
            <div className="overflow-hidden rounded-[10px] border border-pf-border bg-pf-surface shadow-[0_1px_4px_rgba(13,31,53,0.07),0_4px_16px_rgba(13,31,53,0.05)] dark:border-pf-border-dark dark:bg-pf-surface-dark">
                
                {/* Header del Panell */}
                <div className="flex items-center justify-between border-b border-pf-border px-5 py-4 dark:border-pf-border-dark">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                        <svg className="h-4 w-4 text-pf-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informació del perfil
                    </h2>
                </div>

                {/* Bloc d'Avatar */}
                <div className="flex items-center gap-5 border-b border-pf-border p-6 dark:border-pf-border-dark">
                    <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-pf-accent-l font-serif text-2xl font-bold text-pf-accent-h dark:bg-pf-accent-ldark dark:text-pf-accent-dark">
                        {initials}
                        <button className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-pf-surface bg-pf-primary text-white shadow-sm transition-colors hover:bg-pf-primary-h dark:border-pf-surface-dark">
                            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <div className="font-serif text-lg font-bold text-pf-text dark:text-pf-text-dark">{auth.user.name} {typeof auth.user.surname === 'string' ? auth.user.surname : ''}</div>
                        <div className="mt-0.5 text-xs text-pf-text-3 dark:text-pf-text-3dark">Membre des del {data_creacio_usuari}</div>
                    </div>
                </div>

                {/* Cos del Panell - Formulari */}
                <div className="p-6">
                    <UserForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </div>
            </div>

            {/* Zona de Perill */}
            <div className="mt-8 overflow-hidden rounded-[10px] border border-red-100 bg-pf-surface shadow-sm dark:border-red-900/30 dark:bg-pf-surface-dark">
                <div className="flex items-center gap-2 bg-red-50/50 px-5 py-3 text-xs font-bold tracking-wider text-red-600 uppercase dark:bg-red-900/10 dark:text-red-400">
                    <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Zona de perill
                </div>
                <div className="p-6">
                    <DeleteUser />
                </div>
            </div>
        </main>
        </div>
    );
}
