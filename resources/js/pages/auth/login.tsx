import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="border-b border-pf-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-pf-text-2 dark:border-pf-border-dark dark:text-pf-text-2dark">
                                Accés
                            </div>
                            <div className="grid gap-5 p-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-pf-text-2 dark:text-pf-text-2dark">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correu@exemple.com"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-pf-text-2 dark:text-pf-text-2dark">Contrasenya</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-pf-primary decoration-pf-primary/30 hover:text-pf-primary-h dark:text-pf-primary-dark dark:decoration-pf-primary-dark/40 dark:hover:text-pf-primary"
                                            tabIndex={5}
                                        >
                                            Has oblidat la contrasenya?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contrasenya"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-pf-border data-checked:border-pf-primary data-checked:bg-pf-primary dark:border-pf-border-dark dark:data-checked:border-pf-primary-dark dark:data-checked:bg-pf-primary-dark"
                                />
                                <Label htmlFor="remember" className="text-pf-text-2 dark:text-pf-text-2dark">Recorda'm</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-10 w-full rounded-lg border border-pf-primary bg-pf-primary text-white hover:bg-pf-primary-h dark:border-pf-primary-dark dark:bg-pf-primary-dark dark:hover:bg-pf-primary"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Inicia sessió
                            </Button>
                        </div>
                        </div>

                        {canRegister && (
                            <div className="rounded-xl border border-pf-border bg-pf-surface px-4 py-3 text-center text-sm text-pf-text-3 shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-3dark">
                                No tens compte?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="text-pf-primary decoration-pf-primary/30 hover:text-pf-primary-h dark:text-pf-primary-dark dark:decoration-pf-primary-dark/40 dark:hover:text-pf-primary"
                                >
                                    Registra't
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="rounded-lg border border-green-300/50 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
