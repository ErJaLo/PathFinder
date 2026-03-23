import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';

export default function Home() {
    return (
        <MainLayout>
            <Head title="PathFinder — Experiències de viatges" />
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
                <img
                    src="/img/Logo_petit.png"
                    alt="PathFinder"
                    className="h-20 w-20 rounded-2xl object-cover"
                />
                <h1 className="text-3xl font-bold text-pf-text dark:text-pf-text-dark">
                    PathFinder
                </h1>
                <p className="max-w-md text-center text-pf-text-2 dark:text-pf-text-2dark">
                    Comparteix les teves experiències de viatge: rutes, allotjaments, fotografies,
                    recomanacions i molt més.
                </p>
            </div>
        </MainLayout>
    );
}
