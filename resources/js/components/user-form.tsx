import { Transition } from '@headlessui/react';
import { Form, Link, usePage, useForm } from '@inertiajs/react';

import React, { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { send } from '@/routes/verification';


function countryFlag(code: string): string {
    if (!code || code.length !== 2) {
        return '';
    }

    const base = 0x1f1e6 - 65;
    const upper = code.toUpperCase();

    return String.fromCodePoint(upper.charCodeAt(0) + base, upper.charCodeAt(1) + base);
}

export function UserForm({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage().props as any;
    const [countries, setCountries] = useState<any[]>([]);
    const [country, setCountry] = useState(typeof auth.user.country_code === 'string' ? auth.user.country_code : '');

    const llocsForm = useForm();

    useEffect(() => {
        llocsForm.get(route("llocs"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setCountries(page.props.countries || []);
            }
        });
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
                                required
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
    );
}
