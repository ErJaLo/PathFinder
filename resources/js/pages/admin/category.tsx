// import type { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import Routing from '@/actions/Illuminate/Routing';
import Summary from '@/components/admin/summary';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface Category {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    status: string;
    experiencies_categories?: number;
}

export default function CategoryPage() {

    const { category: categories = [] } = usePage().props as unknown as { category: Category[] };

    const form = useForm<Partial<Category>>({
        name: '',
        description: ''
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'Categories', href: '/admin/category' }
    ];

    function handleToggleStatus(id: number) {
        form.delete(route("admin.category.destroy", { category: id }), {
            preserveScroll: true
        });
    }

    function submitCategory(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('admin.categories.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    // Colors d'exemple per pintar les boles de les categories
    const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-teal-500'];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories — Administració" />
            
            <Summary />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* COLUMNA ESQUERRA - Afegir Nova Categoria */}
                    <div className="lg:col-span-5 h-fit">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Header Targeta */}
                            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Nova categoria
                                </h2>
                            </div>

                            {/* Cos Form */}
                            <form onSubmit={submitCategory} className="px-5 py-5">
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Nom de la categoria..."
                                        maxLength={30}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                                        required
                                    />
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        placeholder="Descripció de la categoria..."
                                        maxLength={90}
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                                        required
                                    />
                                    <div className="flex flex-col sm:flex-row items-center justify-between mt-1 gap-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
                                            Màxim 30 caràcters. Les categories s'apliquen a totes les experiències.
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="w-full sm:w-auto shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            + Afegir
                                        </button>
                                    </div>
                                </div>
                               
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DRETA - Llistat de categories */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Header Llistat */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        Categories actuals
                                    </h2>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {categories.length} categories
                                </span>
                            </div>

                            {/* Elements de la llista */}
                            <div className="flex flex-col gap-2 p-5">
                                {categories.map((cat, idx) => (
                                    <div
                                        key={cat.id || idx}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3 transition hover:border-blue-300 hover:bg-blue-50/20 dark:border-gray-600 dark:bg-gray-700 hover:dark:border-blue-500"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Punt de color aleatori determinístic x donar la visió colorida */}
                                            <div className={`h-2.5 w-2.5 rounded-full ${colors[idx % colors.length]}`}></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {cat.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Badge d'experiències si l'envies des del Backend */}
                                            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                {cat.experiencies_categories || 0} exp.
                                            </span>
                                            
                                            {/* Accions */}
                                            <div className="flex gap-1.5">
                                                <Link
                                                    href={route('admin.category.edit', { category: cat.id })}
                                                    title="Editar"
                                                    className="rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:dark:text-blue-400"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    title="Eliminar"
                                                    onClick={() => handleToggleStatus(cat.id)}
                                                    className="rounded border border-gray-200 bg-white p-1.5 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:dark:text-red-400"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {categories.length === 0 && (
                                    <div className="text-center py-6 text-sm text-gray-500">
                                        Encara no hi ha categories.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}