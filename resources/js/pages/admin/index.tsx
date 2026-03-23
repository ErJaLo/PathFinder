import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administració', href: '/admin' },
];

export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Administració — PathFinder" />
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <h1 className="text-2xl font-bold">Panell d'Administració</h1>
                <p className="text-muted-foreground">
                    Selecciona una secció al menú lateral.
                </p>
            </div>
        </AdminLayout>
    );
}
