import { Link, usePage, useForm } from '@inertiajs/react';
import { Compass, User, Menu, X, PenLine, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { route } from 'ziggy-js';
import { UserDropdown } from '@/components/user-dropdown';
import { useTheme } from '@/context/ThemeContext';
import { useInitials } from '@/hooks/use-initials';
import { home, login, register } from '@/routes';
import type { Auth } from '@/types';

const navItems = [
    { title: 'Explorar', href: '/explorar', icon: Compass },
    // { title: 'Mapes', href: '/mapes', icon: Map },
];

export function MainHeader() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;
    const getInitials = useInitials();
    const logoutForm = useForm();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b border-pf-border bg-pf-surface/90 backdrop-blur-sm dark:border-pf-border-dark dark:bg-pf-surface-dark/90">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href={home()} className="shrink-0">
                    <img
                        src="/img/Logo_petit(1).jpg"
                        alt="PathFinder"
                        className="h-9 w-24 rounded-lg object-cover md:h-10 md:w-25"
                    />
                </Link>


                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary transition-colors dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </div>



                {/* Desktop user icon */}
                <div className="hidden md:flex items-center gap-2">
                    {user && (
                        <Link
                            href="/experiencies/crear"
                            className="flex items-center gap-1.5 rounded-full bg-pf-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-pf-accent-h hover:shadow-md active:scale-[0.97] dark:bg-pf-accent-dark"
                        >
                            <PenLine className="h-3.5 w-3.5" />
                            Crear
                        </Link>
                    )}
                    {user ? (
                        <UserDropdown
                            user={user}
                            initials={
                                user.img || user.avatar ? (
                                    <img
                                        src={user.img ? `/storage/${user.img}` : user.avatar}
                                        alt={user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    getInitials(user.name)
                                )
                            }
                        />
                    ) : (
                        <Link href={login()} className="flex h-12 w-12 items-center justify-center rounded-full text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary transition-colors dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark">
                            <User className="w-6 h-6" />
                        </Link>
                    )}
                    <button
                        className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-pf-primary-l hover:bg-pf-primary/10 border border-pf-border transition dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20 dark:border-pf-border-dark"
                        onClick={toggleTheme}
                        title="Cambiar tema"
                    >
                        {theme === 'dark'
                            ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
                            : <HiOutlineMoon className="w-6 h-6 text-pf-primary" />}
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-pf-border text-pf-text transition-colors hover:bg-pf-primary-l md:hidden dark:border-pf-border-dark dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                    onClick={() => {
                        setMobileOpen((prev) => !prev);
                        setMobileUserMenuOpen(false);
                    }}
                    aria-expanded={mobileOpen}
                    aria-label="Menú"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                        onClick={() => {
                            setMobileOpen(false);
                            setMobileUserMenuOpen(false);
                        }}
                    />
                    <div className="fixed inset-x-2 top-2 z-50 max-h-[88vh] overflow-y-auto rounded-xl border border-pf-border bg-pf-surface shadow-lg md:hidden dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        <div className="flex items-center justify-between border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
                            <Link href={home()} className="shrink-0" onClick={() => setMobileOpen(false)}>
                                <img
                                    src="/img/Logo_petit(1).jpg"
                                    alt="PathFinder"
                                    className="h-9 w-24 rounded-lg object-cover"
                                />
                            </Link>
                            <button
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-pf-border text-pf-text transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                aria-label="Tancar menú"
                                onClick={() => {
                                    setMobileOpen(false);
                                    setMobileUserMenuOpen(false);
                                }}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 p-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    href="/experiencies/crear"
                                    className="flex items-center gap-2 rounded-lg bg-pf-accent px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pf-accent-h dark:bg-pf-accent-dark"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <PenLine className="h-4 w-4" />
                                    Crear experiencia
                                </Link>
                            )}

                            {user ? (
                                <>
                                    <div className="mt-2 flex items-center gap-2 border-t border-pf-border pt-3 dark:border-pf-border-dark">
                                        <button
                                            type="button"
                                            onClick={() => setMobileUserMenuOpen((prev) => !prev)}
                                            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-pf-border px-3 py-2 text-left transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:hover:bg-pf-primary-ldark"
                                        >
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-pf-surface-2 dark:bg-pf-surface-2dark">
                                                {user.img || user.avatar ? (
                                                    <img
                                                        src={user.img ? `/storage/${user.img}` : user.avatar}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                                                        {getInitials(user.name)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                                    {user.email}
                                                </p>
                                            </div>
                                            {mobileUserMenuOpen ? (
                                                <ChevronUp className="h-4 w-4 shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                                            )}
                                        </button>

                                        <button
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pf-border bg-pf-primary-l transition hover:bg-pf-primary/10 dark:border-pf-border-dark dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20"
                                            onClick={toggleTheme}
                                            title="Cambiar tema"
                                        >
                                            {theme === 'dark'
                                                ? <HiOutlineSun className="h-6 w-6 text-pf-primary-dark" />
                                                : <HiOutlineMoon className="h-6 w-6 text-pf-primary" />}
                                        </button>
                                    </div>

                                    {mobileUserMenuOpen && (
                                        <div className="mt-2 flex flex-col gap-1 rounded-xl border border-pf-border p-2 dark:border-pf-border-dark">
                                            <Link
                                                href="/settings/experiences"
                                                className="rounded-lg px-3 py-2 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    setMobileUserMenuOpen(false);
                                                }}
                                            >
                                                Gestió d'experiències
                                            </Link>
                                            <Link
                                                href="/settings/profile"
                                                className="rounded-lg px-3 py-2 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    setMobileUserMenuOpen(false);
                                                }}
                                            >
                                                Perfil d'usuari
                                            </Link>
                                            <Link
                                                href="/settings/security"
                                                className="rounded-lg px-3 py-2 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    setMobileUserMenuOpen(false);
                                                }}
                                            >
                                                Seguretat
                                            </Link>
                                            {(user.role === 'admin' || user.role === 'moderator') && (
                                                <Link
                                                    href="/admin"
                                                    className="rounded-lg px-3 py-2 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                                    onClick={() => {
                                                        setMobileOpen(false);
                                                        setMobileUserMenuOpen(false);
                                                    }}
                                                >
                                                    Administrar web
                                                </Link>
                                            )}
                                            <button
                                                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                                                onClick={() => {
                                                    logoutForm.post(route('logout'));
                                                    setMobileOpen(false);
                                                    setMobileUserMenuOpen(false);
                                                }}
                                            >
                                                Tancar sessió
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        className="ml-2 mt-2 self-start rounded-full border border-pf-border bg-pf-primary-l p-3 transition hover:bg-pf-primary/10 dark:border-pf-border-dark dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20"
                                        onClick={toggleTheme}
                                        title="Cambiar tema"
                                    >
                                        {theme === 'dark'
                                            ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
                                            : <HiOutlineMoon className="w-6 h-6 text-pf-primary" />}
                                    </button>
                                    <div className="mt-2 flex gap-2 border-t border-pf-border pt-3 dark:border-pf-border-dark">
                                        <Link
                                            href={login()}
                                            className="flex-1 rounded-full border border-pf-border px-4 py-2 text-center text-sm font-medium text-pf-text-2 transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:text-pf-text-2dark"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Iniciar sessió
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="flex-1 rounded-full bg-pf-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-pf-primary-h dark:bg-pf-primary-dark dark:hover:bg-pf-primary-hdark"
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            Registrar-se
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
