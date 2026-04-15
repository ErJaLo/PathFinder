import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                            <div className="border-b border-pf-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-pf-text-2 dark:border-pf-border-dark dark:text-pf-text-2dark">
                                Registre
                            </div>
                            <div className="grid gap-5 p-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-pf-text-2 dark:text-pf-text-2dark">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nom complet"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-pf-text-2 dark:text-pf-text-2dark">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correu@exemple.com"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-pf-text-2 dark:text-pf-text-2dark">Contrasenya</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contrasenya"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-pf-text-2 dark:text-pf-text-2dark">
                                    Confirma la contrasenya
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirma la contrasenya"
                                    className="h-10 rounded-lg border-pf-border bg-pf-surface-2 text-pf-text placeholder:text-pf-text-3 focus-visible:border-pf-primary focus-visible:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-surface-2dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus-visible:border-pf-primary-dark dark:focus-visible:ring-pf-primary-dark/20"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-10 w-full rounded-lg border border-pf-primary bg-pf-primary text-white hover:bg-pf-primary-h dark:border-pf-primary-dark dark:bg-pf-primary-dark dark:hover:bg-pf-primary"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crea el compte
                            </Button>
                        </div>
                        </div>

                        <div className="rounded-xl border border-pf-border bg-pf-surface px-4 py-3 text-center text-sm text-pf-text-3 shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark dark:text-pf-text-3dark">
                            Ja tens compte?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-pf-primary decoration-pf-primary/30 hover:text-pf-primary-h dark:text-pf-primary-dark dark:decoration-pf-primary-dark/40 dark:hover:text-pf-primary"
                            >
                                Inicia sessió
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
