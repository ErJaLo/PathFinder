import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { ExperienceForm } from '@/components/experience-form';
import type { ExperienceCategory, ExperienceCountry } from '@/types';

type Props = {
    categories: ExperienceCategory[];
    countries: ExperienceCountry[];
};

export default function CrearExperiencia({ categories, countries }: Props) {
    return (
        <MainLayout>
            <Head title="Crear experiencia — PathFinder" />
            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pf-text dark:text-pf-text-dark">
                        Crear experiencia
                    </h1>
                    <p className="mt-1 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Comparteix la teva aventura amb la comunitat de viatgers
                    </p>
                </div>
                <ExperienceForm categories={categories} countries={countries} />
            </div>
        </MainLayout>
    );
}
