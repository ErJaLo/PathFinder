import { Link, usePage } from '@inertiajs/react';
import { Map, Compass, User, Menu, X, PenLine } from 'lucide-react';
import { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useInitials } from '@/hooks/use-initials';
import { home, login, register } from '@/routes';
import type { Auth } from '@/types';

const navItems = [
    { title: 'Explorar', href: '/explorar', icon: Compass },
    { title: 'Mapes', href: '/mapes', icon: Map },
];

export function MainHeader() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth?.user;
    const getInitials = useInitials();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b border-pf-border bg-pf-surface/90 backdrop-blur-sm dark:border-pf-border-dark dark:bg-pf-surface-dark/90">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link href={home()} className="flex-shrink-0">
                    <img
                        src="/img/Logo_petit.png"
                        alt="PathFinder"
                        className="h-10 w-10 rounded-lg object-cover"
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-pf-primary-l hover:text-pf-primary dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.img ?? user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-pf-primary-l text-xs font-semibold text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/experiences" className="cursor-pointer">
                                            Experiencies
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile" className="cursor-pointer">
                                            Configuració
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/logout" method="post" as="button" className="w-full cursor-pointer">
                                        Tancar sessió
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href={login()} className="flex h-12 w-12 items-center justify-center rounded-full text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary transition-colors dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark">
                            <User className="w-6 h-6" />
                        </Link>
                    )}
                    <button
                        className="ml-4 p-3 rounded-full bg-pf-primary-l hover:bg-pf-primary/10 border border-pf-border transition dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20 dark:border-pf-border-dark"
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
                    onClick={() => setMobileOpen(!mobileOpen)}
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
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute left-0 right-0 top-full z-50 border-b border-pf-border bg-pf-surface shadow-lg md:hidden dark:border-pf-border-dark dark:bg-pf-surface-dark">
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
                            <button
                                className="ml-2 mt-2 self-start p-3 rounded-full bg-pf-primary-l hover:bg-pf-primary/10 border border-pf-border transition dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20 dark:border-pf-border-dark"
                                onClick={toggleTheme}
                                title="Cambiar tema"
                            >
                                {theme === 'dark'
                                    ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
                                    : <HiOutlineMoon className="w-6 h-6 text-pf-primary" />}
                            </button>
                            <div className="mt-2 flex gap-2 border-t border-pf-border pt-3 dark:border-pf-border-dark">
                                {user ? (
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex-1 rounded-full border border-pf-border px-4 py-2 text-center text-sm font-medium text-pf-text-2 transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:text-pf-text-2dark"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Tancar sessió
                                    </Link>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
