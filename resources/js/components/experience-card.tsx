import { Link } from '@inertiajs/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Experience } from '@/types';

type Props = {
    experience: Experience;
    size?: 'default' | 'lg';
    layout?: 'vertical' | 'horizontal';
    className?: string;
};

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'ara mateix';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `fa ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `fa ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `fa ${days}d`;
    const months = Math.floor(days / 30);
    return `fa ${months} mes${months > 1 ? 'os' : ''}`;
}

function formatNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const cardGradients = [
    'linear-gradient(135deg, #C0D8EE 0%, #8AB4D4 100%)',
    'linear-gradient(135deg, #D8E8F5 0%, #A8C8E8 100%)',
    'linear-gradient(135deg, #F0E4C8 0%, #D8C898 100%)',
    'linear-gradient(135deg, #C8E0D0 0%, #98C8A8 100%)',
];

export function ExperienceCard({ experience, size = 'default', layout = 'vertical', className = '' }: Props) {
    const category = experience.categories[0];
    const gradient = cardGradients[experience.id % cardGradients.length];
    const isLg = size === 'lg';
    const isHorizontal = layout === 'horizontal';

    return (
        <Link href={`/experiencies/${experience.id}`} className="block">
        <article
            className={`group flex h-full overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-pf-border-2 hover:shadow-lg dark:border-pf-border-dark dark:bg-pf-surface-dark dark:hover:border-pf-border-2dark ${
                isHorizontal ? 'h-[130px] flex-row' : 'flex-col max-sm:h-[120px] max-sm:flex-row'
            } ${className}`}
        >
            {/* Image */}
            <div
                className={`relative flex-shrink-0 overflow-hidden ${
                    isHorizontal
                        ? 'h-full w-[180px] min-w-[180px]'
                        : `w-full max-sm:h-full max-sm:w-[120px] max-sm:min-w-[120px] ${isLg ? 'sm:aspect-[4/3]' : 'sm:aspect-video'}`
                }`}
            >
                {experience.image ? (
                    <img
                        src={experience.image}
                        alt={experience.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className={`flex h-full w-full items-center justify-center transition-transform duration-400 group-hover:scale-105 ${
                            isHorizontal ? 'text-4xl' : `max-sm:text-3xl ${isLg ? 'text-6xl' : 'text-5xl'}`
                        }`}
                        style={{ background: gradient }}
                    >
                        🌍
                    </div>
                )}

                {/* Country badge */}
                {experience.main_country && (
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                        {experience.main_country.name}
                    </span>
                )}

                {/* Category badge */}
                {category && !isHorizontal && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-pf-primary px-2.5 py-0.5 text-[10px] font-medium text-white">
                        {category.name}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className={`flex flex-1 flex-col overflow-hidden ${
                isHorizontal ? 'px-4 py-3' : `max-sm:px-3 max-sm:py-2.5 ${isLg ? 'px-5 pb-5 pt-4' : 'px-4 pb-4 pt-3.5'}`
            }`}>
                <div className={isHorizontal ? 'flex items-start justify-between gap-2' : ''}>
                    <h3 className={`line-clamp-2 min-h-[2lh] font-semibold leading-snug text-pf-text dark:text-pf-text-dark ${
                        isHorizontal ? 'mb-1 text-[14px]' : `mb-2 max-sm:mb-1 max-sm:text-[13px] ${isLg ? 'text-base' : 'text-[15px]'}`
                    }`}>
                        {experience.title}
                    </h3>
                    {isHorizontal && category && (
                        <span className="mt-0.5 flex-shrink-0 rounded-full bg-pf-tag-bg px-2 py-0.5 text-[10px] font-medium text-pf-tag-text dark:bg-pf-tag-bgdark dark:text-pf-tag-textdark">
                            {category.name}
                        </span>
                    )}
                </div>

                <div className={`flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark ${
                    isHorizontal ? 'mb-auto text-[11px]' : `mb-3 max-sm:mb-0 max-sm:flex-1 ${isLg ? 'text-xs' : 'text-[11px]'}`
                }`}>
                    <span>{experience.user.name}</span>
                    <span className="opacity-40">·</span>
                    <span>{timeAgo(experience.created_at)}</span>
                </div>

                {/* Footer */}
                <div className={`mt-auto flex items-center justify-between border-t border-pf-border dark:border-pf-border-dark ${
                    isHorizontal ? 'pt-2' : `max-sm:pt-2 ${isLg ? 'pt-3' : 'pt-2.5'}`
                }`}>
                    <div className={`flex items-center gap-2.5 text-pf-text-3 dark:text-pf-text-3dark ${isLg ? 'text-sm' : 'text-xs'}`}>
                        <span className="flex items-center gap-1 text-pf-accent dark:text-pf-accent-dark">
                            <ThumbsUp className={isLg ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
                            {formatNum(experience.ratings_up_count)}
                        </span>
                        <span className="flex items-center gap-1">
                            <ThumbsDown className={isLg ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
                            {formatNum(experience.ratings_down_count)}
                        </span>
                    </div>

                    <div className={`flex items-center gap-1.5 text-pf-text-3 dark:text-pf-text-3dark ${isLg ? 'text-xs' : 'text-[11px]'}`}>
                        <div className={`flex flex-shrink-0 items-center justify-center rounded-full bg-pf-primary-l font-bold text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark ${isLg ? 'h-6 w-6 text-[10px]' : 'h-[22px] w-[22px] text-[9px]'}`}>
                            {getInitials(experience.user.name)}
                        </div>
                        {experience.user.name}
                    </div>
                </div>
            </div>
        </article>
        </Link>
    );
}
