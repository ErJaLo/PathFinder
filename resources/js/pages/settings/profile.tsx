
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserHeader } from '@/components/user-Header';
import { send } from '@/routes/verification';

function countryFlag(code: string): string {
    if (!code || code.length !== 2) {
return '';
}

    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();

    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}



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

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState(typeof auth.user.country_code === 'string' ? auth.user.country_code : '');

    useEffect(() => {
        fetch(route("llocs"))
            .then(res => res.json())
            .then(data => setCountries(data));
    }, []);

    function resetFormulari(){
        const form = document.querySelector('form');
        setCountry(typeof auth.user.country_code === 'string' ? auth.user.country_code : '');

        if (form) {
            (form.elements.namedItem('name') as HTMLInputElement).value = auth.user.name;
            (form.elements.namedItem('surname') as HTMLInputElement).value = typeof auth.user.surname === 'string' ? auth.user.surname : '';
            (form.elements.namedItem('email') as HTMLInputElement).value = auth.user.email;
        }
    }

    return (
        <div className="min-h-screen bg-pf-bg-2 text-pf-text dark:bg-pf-bg-dark dark:text-pf-text-dark">
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
                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="name" className="text-xs font-semibold tracking-wide text-pf-text-2 dark:text-pf-text-2dark uppercase">Nom</Label>
                                        <Input
                                            id="name"
                                            className="h-[38px] border-pf-border bg-pf-bg px-3 text-[13px] outline-none transition-all focus:border-pf-primary focus:bg-pf-surface dark:border-pf-border-dark dark:bg-pf-bg-dark dark:focus:border-pf-primary-dark dark:focus:bg-pf-surface-dark"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="El teu nom"
                                        />
                                        <InputError className="mt-1" message={errors.name} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="surname" className="text-xs font-semibold tracking-wide text-pf-text-2 dark:text-pf-text-2dark uppercase">Cognoms</Label>
                                        <Input
                                            id="surname"
                                            className="h-[38px] border-pf-border bg-pf-bg px-3 text-[13px] outline-none transition-all focus:border-pf-primary focus:bg-pf-surface dark:border-pf-border-dark dark:bg-pf-bg-dark dark:focus:border-pf-primary-dark dark:focus:bg-pf-surface-dark"
                                            defaultValue={typeof auth.user.surname === 'string' ? auth.user.surname : ''}
                                            name="surname"
                                            autoComplete="family-name"
                                            placeholder="Els teus cognoms"
                                        />
                                        <InputError className="mt-1" message={errors.surname} />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="email" className="text-xs font-semibold tracking-wide text-pf-text-2 dark:text-pf-text-2dark uppercase">Correu electrònic</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-[38px] border-pf-border bg-pf-bg px-3 text-[13px] outline-none transition-all focus:border-pf-primary focus:bg-pf-surface dark:border-pf-border-dark dark:bg-pf-bg-dark dark:focus:border-pf-primary-dark dark:focus:bg-pf-surface-dark"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Correu electrònic"
                                        />
                                        <InputError className="mt-1" message={errors.email} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="country_code" className="text-xs font-semibold tracking-wide text-pf-text-2 dark:text-pf-text-2dark uppercase">País d'origen</Label>
                                        <select
                                            id="country_code"
                                            name="country_code"
                                            value={country}
                                            onChange={e => setCountry(e.target.value)}
                                            className="h-[38px] w-full rounded-md border border-pf-border bg-pf-bg px-3 text-[13px] text-pf-text outline-none transition-all focus:border-pf-primary focus:bg-pf-surface dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-dark dark:focus:border-pf-primary-dark dark:focus:bg-pf-surface-dark"
                                        >
                                            <option value="">Selecciona un país…</option>
                                            {Array.isArray(countries) && countries.map((c: any) => (
                                                <option key={c.code} value={c.code}>
                                                    {countryFlag(c.code)} {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-1" message={errors.country_code} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-md bg-pf-amber-l p-3 dark:bg-pf-amber-ldark">
                                        <p className="text-sm text-pf-amber dark:text-pf-amber-dark">
                                            El teu correu electrònic no està verificat.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-medium underline decoration-pf-amber/30 underline-offset-4 transition-colors hover:decoration-pf-amber"
                                            >
                                                Torna a enviar el correu de verificació.
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                                                S'ha enviat un nou enllaç de verificació.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Accions del Formulari */}
                                <div className="flex items-center gap-3 border-t border-pf-border pt-6 dark:border-pf-border-dark">
                                    <Button 
                                        disabled={processing} 
                                        type="submit" 
                                        className="h-[38px] bg-pf-primary px-6 text-[13px] font-medium text-white transition-all hover:bg-pf-primary-h active:scale-[0.98] dark:bg-pf-primary-dark dark:hover:bg-pf-primary-hdark"
                                    >
                                        <svg className="mr-2 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Guardar canvis
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-[38px] border-pf-border bg-transparent px-5 text-[13px] font-medium text-pf-text-2 transition-all hover:border-pf-border-2 hover:bg-pf-surface-2 dark:border-pf-border-dark dark:text-pf-text-2dark dark:hover:bg-pf-surface-2dark"
                                        onClick={() => resetFormulari()}
                                    >
                                        Descartar
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Desat correctament</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
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
