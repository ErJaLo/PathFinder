import { Link } from '@inertiajs/react';

export function MainFooter() {
    const year = new Date().getFullYear();

    const footerLinks = [
        { label: 'Inici', href: '/' },
        { label: 'Explorar', href: '/explorar' },
        { label: 'Contacte', href: '#contacte' },
        { label: 'Politica de privacitat', href: '/politica-privacitat' },
        { label: 'Termes i condicions', href: '#termes-condicions' },
        { label: 'Politica de cookies', href: '#politica-cookies' },
    ];

    return (
        <footer className="mt-auto border-t border-pf-border bg-white dark:border-pf-border-dark dark:bg-pf-surface-dark">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/img/Logo_petit.png"
                            alt="PathFinder"
                            className="h-7 w-7 rounded-md object-cover"
                        />
                        <span className="text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                            PathFinder
                        </span>
                    </Link>
                    <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                        &copy; {year} PathFinder. Tots els drets reservats.
                    </span>
                </div>
                <nav aria-label="Peu de pàgina">
                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        {footerLinks.map((link) => (
                            <li key={link.label}>
                                {link.href.startsWith('#') ? (
                                    <a
                                        href={link.href}
                                        className="text-pf-text-3 transition-colors hover:text-pf-primary dark:text-pf-text-3dark dark:hover:text-pf-primary-dark"
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="text-pf-text-3 transition-colors hover:text-pf-primary dark:text-pf-text-3dark dark:hover:text-pf-primary-dark"
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
