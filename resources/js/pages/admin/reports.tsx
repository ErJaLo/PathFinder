import { usePage } from "@inertiajs/react";
import Summary from "@/components/admin/summary";
import AdminLayout from "@/layouts/admin-layout";
import type { BreadcrumbItem } from '@/types';

interface Reports{
    id:number;
    user_id:number;
    post_id:number;
    status:string;
    reason:string;
}


export default function reports(){
        const breadcrumbs: BreadcrumbItem[] = [
            { title: 'Administració', href: '/admin' },
            { title: 'reports', href: '/admin/reports' }
        ];

    const { reports: reports = [] } = usePage().props as unknown as { reports: Reports[] };
    
    
    return(
        <>
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Summary/>
        </AdminLayout>
        </>
    )
}