import { Head, useForm, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
}

export default function CategoryEditPage() {
    const { categoria } = usePage().props as unknown as { categoria: Category };

    const form = useForm<Partial<Category>>({
        name: categoria.name || '',
        description: categoria.description || ''
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Categories', href: '/admin/category' },
        { title: 'Editar Categoria', href: '#' }
    ];

    function submitCategory(e: React.FormEvent) {
        e.preventDefault();
        form.put(route('admin.category.update', { category: categoria.id }), {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Categoria — Administració" />
            
            <div className="p-6">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        {/* Header Targeta */}
                        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                            <Link href={route("admin.category.index")} className="mr-2 text-gray-400 hover:text-blue-600 transition">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Editar categoria: {categoria.name}
                            </h2>
                        </div>

                        {/* Cos Form */}
                        <form onSubmit={submitCategory} className="px-5 py-5 flex flex-col gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nom de la categoria
                                </label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Ex: Aventura, Gastronomia..."
                                    maxLength={30}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Descripció
                                </label>
                                <textarea
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Petita descripció..."
                                    maxLength={90}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                    href={route("admin.category.index")}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel·lar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Guardar canvis
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
