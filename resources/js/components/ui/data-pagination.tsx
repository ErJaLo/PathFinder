import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPaginationProps {
    total: number;
    perPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function DataPagination({ total, perPage, currentPage, onPageChange }: DataPaginationProps) {
    const totalPages = Math.ceil(total / perPage);

    if (totalPages <= 1) return null;

    const pages: (number | 'ellipsis')[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== 'ellipsis') {
            pages.push('ellipsis');
        }
    }

    return (
        <div className="mb-3 flex items-center justify-center gap-1.5">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary disabled:opacity-40 disabled:hover:border-pf-border disabled:hover:text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark"
                aria-label="Pàgina anterior"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {pages.map((p, i) =>
                p === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="flex h-8 min-w-8 items-center justify-center px-2 text-xs font-medium text-pf-text-3 dark:text-pf-text-3dark"
                        aria-hidden="true"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        aria-current={p === currentPage ? 'page' : undefined}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-all ${
                            p === currentPage
                                ? 'border-transparent bg-pf-primary text-white'
                                : 'border-pf-border text-pf-text-2 hover:border-pf-primary hover:text-pf-primary dark:border-pf-border-dark dark:text-pf-text-2dark'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-pf-border text-pf-text-3 transition-all hover:border-pf-primary hover:text-pf-primary disabled:opacity-40 disabled:hover:border-pf-border disabled:hover:text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark"
                aria-label="Pàgina següent"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}