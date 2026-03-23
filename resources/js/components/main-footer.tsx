import { Link } from '@inertiajs/react';
import { home } from '@/routes';

export function MainFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-pf-border bg-pf-surface dark:border-pf-border-dark dark:bg-pf-surface-dark">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Link href={home()} className="flex items-center gap-2">
                        <img
                            src="/img/Logo_petit.png"
                            alt="PathFinder"
                            className="h-6 w-6 rounded-md object-cover"
                        />
                        <span className="text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                            PathFinder
                        </span>
                    </Link>
                    <span className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                        &copy; {year} PathFinder. Tots els drets reservats.
                    </span>
                </div>
                <nav className="flex flex-wrap gap-5">
                    <a
                        href="#"
                        className="text-xs text-pf-text-3 transition-colors hover:text-pf-primary dark:text-pf-text-3dark dark:hover:text-pf-primary-dark"
                    >
                        Privacitat
                    </a>
                    <a
                        href="#"
                        className="text-xs text-pf-text-3 transition-colors hover:text-pf-primary dark:text-pf-text-3dark dark:hover:text-pf-primary-dark"
                    >
                        Termes d'ús
                    </a>
                    <a
                        href="#"
                        className="text-xs text-pf-text-3 transition-colors hover:text-pf-primary dark:text-pf-text-3dark dark:hover:text-pf-primary-dark"
                    >
                        Contacte
                    </a>
                </nav>
            </div>
        </footer>
    );
}
