import { Head, usePage } from '@inertiajs/react';
import Summary from '@/components/admin/summary';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administració', href: '/admin' },
];


export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Administració — PathFinder" />
            <Summary/>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <h1 className="text-2xl font-bold">Panell d'Administració</h1>
                <p className="text-muted-foreground">
                    Veure estadistiques generals, gestionar les categories, usuaris i reports
                </p>
            </div>
        </AdminLayout>
    );
}
