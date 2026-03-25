
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserHeader } from '@/components/user-Header';
import { send } from '@/routes/verification';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-pf-bg text-pf-text dark:bg-pf-bg-dark dark:text-pf-text-dark">
            <Head title="El meu perfil" />
            <UserHeader user={auth.user} />
            <main className="mx-auto w-full max-w-2xl px-4 py-8">
                <section className="space-y-6">
                    <Heading
                        variant="small"
                        title="Dades personals"
                        description="Actualitza el teu nom i correu electrònic."
                    />
                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nom complet"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correu electrònic</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Correu electrònic"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>
                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            El teu correu electrònic no està verificat.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Fes clic aquí per tornar a enviar el correu de verificació.
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                S'ha enviat un nou enllaç de verificació al teu correu electrònic.
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} data-test="update-profile-button">
                                        Desa
                                    </Button>
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">Desat</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
                <div className="mt-12">
                    <DeleteUser />
                </div>
            </main>
        </div>
    );
}
