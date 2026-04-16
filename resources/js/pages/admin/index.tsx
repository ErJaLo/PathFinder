import { Head, router, usePage } from '@inertiajs/react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { route } from 'ziggy-js';
import Summary from '@/components/admin/summary';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administració', href: '/admin' },
];

type RangeOption = 1 | 3 | 7 | 30;

interface ComparisonPoint {
    name: string;
    value: number;
}

interface TimelinePoint {
    label: string;
    value: number;
}

interface DashboardMetrics {
    postsByCategory: ComparisonPoint[];
    postsByCountry: ComparisonPoint[];
    reportedAbuseTimeline: TimelinePoint[];
    registeredUsersTimeline: TimelinePoint[];
}

interface AdminDashboardProps {
    range: RangeOption;
    ranges: RangeOption[];
    metrics: DashboardMetrics;
}

const chartCategoryColor = '#1A5FA8';
const chartCountryColor = '#0C4880';
const chartAbuseColor = '#E87D2C';
const chartUsersColor = '#D4920E';

function toRangeLabel(days: number): string {
    return `${days} dia${days === 1 ? '' : 's'}`;
}

function Card({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-pf-border bg-pf-surface p-4 shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
            <header className="mb-3">
                <h2 className="text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                    {title}
                </h2>
                <p className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                    {subtitle}
                </p>
            </header>
            {children}
        </section>
    );
}

export default function AdminDashboard() {
    const { range, ranges, metrics } = usePage().props as unknown as AdminDashboardProps;

    const selectRange = (nextRange: RangeOption) => {
        if (nextRange === range) {
            return;
        }

        router.get(
            route('admin.index'),
            { range: nextRange },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Administració — PathFinder" />
            <Summary />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-pf-primary dark:text-pf-primary-dark">
                            Panell d&apos;Administració
                        </h1>
                        <p className="text-sm text-pf-text-3 dark:text-pf-text-3dark">
                            Mètriques del període seleccionat.
                        </p>
                    </div>

                    <div className="inline-flex rounded-lg border border-pf-border bg-pf-surface p-1 dark:border-pf-border-dark dark:bg-pf-surface-dark">
                        {ranges.map((option) => {
                            const isActive = option === range;

                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => selectRange(option)}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-pf-primary text-white dark:bg-pf-primary-dark'
                                            : 'text-pf-text-3 hover:bg-pf-surface-2 hover:text-pf-text dark:text-pf-text-3dark dark:hover:bg-pf-surface-2dark dark:hover:text-pf-text-dark'
                                    }`}
                                >
                                    {toRangeLabel(option)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <Card
                        title={`Posts per categoria (${toRangeLabel(range)})`}
                        subtitle={``}
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={metrics.postsByCategory}
                                    layout="vertical"
                                    margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={false}
                                        contentStyle={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 10,
                                        }}
                                    />
                                    <Bar dataKey="value" name="Posts" fill={chartCategoryColor} radius={[0, 6, 6, 0]} activeBar={false} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card
                        title={`Posts per país (${toRangeLabel(range)})`}
                        subtitle={``}
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={metrics.postsByCountry}
                                    layout="vertical"
                                    margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={false}
                                        contentStyle={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 10,
                                        }}
                                    />
                                    <Bar dataKey="value" name="Posts" fill={chartCountryColor} radius={[0, 6, 6, 0]} activeBar={false} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card
                        title={`Abusos reportats (${toRangeLabel(range)})`}
                        subtitle={``}
                    >
                        <div className="h-70">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.reportedAbuseTimeline} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 10,
                                        }}
                                    />
                                    <Line type="monotone" dataKey="value" name="Reports" stroke={chartAbuseColor} strokeWidth={2.2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card
                        title={`Usuaris registrats (${toRangeLabel(range)})`}
                        subtitle={``}
                    >
                        <div className="h-70">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.registeredUsersTimeline} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 10,
                                        }}
                                    />
                                    <Line type="monotone" dataKey="value" name="Usuaris" stroke={chartUsersColor} strokeWidth={2.2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
