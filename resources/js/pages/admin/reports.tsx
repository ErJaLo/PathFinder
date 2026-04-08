import Summary from "@/components/admin/summary";
import AdminLayout from "@/layouts/admin-layout";
import type { BreadcrumbItem } from '@/types';


export default function reports(){
        const breadcrumbs: BreadcrumbItem[] = [
            { title: 'Administració', href: '/admin' },
            { title: 'reports', href: '/admin/reports' }
        ];
    
    return(
        <>
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Summary/>
        </AdminLayout>
        </>
    )
}