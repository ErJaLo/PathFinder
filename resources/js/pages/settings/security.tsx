import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserHeader } from '@/components/user-Header';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import type { BreadcrumbItem } from '@/types';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security settings',
        href: edit(),
    },
];

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    const { auth } = usePage().props;
    

    return (
        <div className="min-h-screen bg-pf-bg text-pf-text dark:bg-pf-bg-dark dark:text-pf-text-dark">
            <UserHeader user={auth.user}/>
            
            <Head title="Security settings" />

            <main className="mx-auto mt-8 w-full max-w-4xl px-4 pb-12">
                <div className="space-y-8">
                    {/* Panel Update Password */}
                    <div className="overflow-hidden rounded-[10px] border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="flex items-center gap-2 bg-pf-primary-l/30 px-5 py-3 text-xs font-bold tracking-wider text-pf-primary-dark uppercase dark:bg-pf-primary-dark/20 dark:text-pf-primary-l">
                            <ShieldCheck className="h-4 w-4" />
                            Contrasenya
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="font-serif text-lg font-bold text-pf-text dark:text-pf-text-dark">Actualitzar contrasenya</h2>
                                <p className="text-[13px] text-pf-text-2 dark:text-pf-text-2dark">Assegura't de fer servir una contrasenya llarga i aleatòria per mantenir el teu compte segur.</p>
                            </div>

                            <Form
                                {...SecurityController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }

                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        <div className="space-y-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="current_password" className="text-xs font-bold uppercase tracking-wider text-pf-text-3 dark:text-pf-text-3dark">
                                                    Contrasenya actual
                                                </Label>
                                                <PasswordInput
                                                    id="current_password"
                                                    ref={currentPasswordInput}
                                                    name="current_password"
                                                    className="h-[38px] w-full border-pf-border bg-pf-surface-dark/5 focus:border-pf-primary focus:ring-0 dark:border-pf-border-dark dark:bg-pf-bg-dark/50"
                                                    autoComplete="current-password"
                                                    placeholder="Introduce la contrasenya actual"
                                                />
                                                <InputError message={errors.current_password} />
                                            </div>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-pf-text-3 dark:text-pf-text-3dark">
                                                        Nova contrasenya
                                                    </Label>
                                                    <PasswordInput
                                                        id="password"
                                                        ref={passwordInput}
                                                        name="password"
                                                        className="h-[38px] w-full border-pf-border bg-pf-surface-dark/5 focus:border-pf-primary focus:ring-0 dark:border-pf-border-dark dark:bg-pf-bg-dark/50"
                                                        autoComplete="new-password"
                                                        placeholder="Nova contrasenya"
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-pf-text-3 dark:text-pf-text-3dark">
                                                        Confirma la contrasenya
                                                    </Label>
                                                    <PasswordInput
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        className="h-[38px] w-full border-pf-border bg-pf-surface-dark/5 focus:border-pf-primary focus:ring-0 dark:border-pf-border-dark dark:bg-pf-bg-dark/50"
                                                        autoComplete="new-password"
                                                        placeholder="Repeteix la contrasenya"
                                                    />
                                                    <InputError message={errors.password_confirmation} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <Button
                                                disabled={processing}
                                                data-test="update-password-button"
                                                className="bg-pf-primary text-white hover:bg-pf-primary-dark"
                                            >
                                                Guardar canvis
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    S'han guardat els canvis.
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    {/* Panel 2FA */}
                    {canManageTwoFactor && (
                        <div className="overflow-hidden rounded-[10px] border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="flex items-center gap-2 bg-pf-accent-l/50 px-5 py-3 text-xs font-bold tracking-wider text-pf-accent-dark uppercase dark:bg-pf-accent-dark/20 dark:text-pf-accent-l">
                                <ShieldCheck className="h-4 w-4" />
                                Autenticació de doble factor (2FA)
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${twoFactorEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                        <h2 className="font-serif text-lg font-bold text-pf-text dark:text-pf-text-dark">
                                            {twoFactorEnabled ? 'Activat' : 'Desactivat'}
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-[13px] text-pf-text-2 dark:text-pf-text-2dark italic">
                                        Afegeix una capa extra de seguretat al teu compte fent servir l'autenticació de doble factor.
                                    </p>
                                </div>

                                <div className="rounded-lg border border-pf-border bg-pf-bg/50 p-5 dark:border-pf-border-dark dark:bg-pf-bg-dark/30">
                                    {twoFactorEnabled ? (
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </div>
                                                <p className="text-[13px] text-pf-text-2 dark:text-pf-text-2dark">
                                                    Hauràs d'introduir un codi de seguretat aleatori durant el login des d'una aplicació TOTP al teu telèfon mòbil.
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 border-t border-pf-border pt-6 dark:border-pf-border-dark">
                                                <Form {...disable.form()}>
                                                    {({ processing }) => (
                                                        <Button
                                                            variant="destructive"
                                                            type="submit"
                                                            disabled={processing}
                                                            className="bg-red-600 text-white hover:bg-red-700"
                                                        >
                                                            Desactivar 2FA
                                                        </Button>
                                                    )}
                                                </Form>

                                                <TwoFactorRecoveryCodes
                                                    recoveryCodesList={recoveryCodesList}
                                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                                    errors={errors}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-pf-primary-ldark/50 text-pf-primary-dark dark:bg-pf-primary-dark/20 dark:text-pf-primary-l">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                                <p className="text-[13px] text-pf-text-2 dark:text-pf-text-2dark leading-relaxed">
                                                    Quan activis l'autenticació de doble factor, se't demanarà un codi segur durant l'inici de sessió. Pots obtenir aquest codi des de qualsevol aplicació compatible amb TOTP (com Google Authenticator o Authy).
                                                </p>
                                            </div>

                                            <div className="border-t border-pf-border pt-6 dark:border-pf-border-dark">
                                                {hasSetupData ? (
                                                    <Button
                                                        onClick={() => setShowSetupModal(true)}
                                                        className="bg-pf-primary text-white hover:bg-pf-primary-dark flex items-center gap-2"
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                        Continuar configuració
                                                    </Button>
                                                ) : (
                                                    <Form
                                                        {...enable.form()}
                                                        onSuccess={() => setShowSetupModal(true)}
                                                    >
                                                        {({ processing }) => (
                                                            <Button
                                                                type="submit"
                                                                disabled={processing}
                                                                className="bg-pf-primary text-white hover:bg-pf-primary-dark flex items-center gap-2"
                                                            >
                                                                <ShieldCheck className="h-4 w-4" />
                                                                Activar 2FA
                                                            </Button>
                                                        )}
                                                    </Form>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <TwoFactorSetupModal
                                isOpen={showSetupModal}
                                onClose={() => setShowSetupModal(false)}
                                requiresConfirmation={requiresConfirmation}
                                twoFactorEnabled={twoFactorEnabled}
                                qrCodeSvg={qrCodeSvg}
                                manualSetupKey={manualSetupKey}
                                clearSetupData={clearSetupData}
                                fetchSetupData={fetchSetupData}
                                errors={errors}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
