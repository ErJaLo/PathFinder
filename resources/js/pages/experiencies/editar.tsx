import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { ExperienceForm } from '@/components/experience-form';
import type { Experience, ExperienceCategory, ExperienceCountry } from '@/types';

type Props = {
    experience: Experience;
    categories: ExperienceCategory[];
    countries: ExperienceCountry[];
};

export default function EditarExperiencia({ experience, categories, countries }: Props) {
    return (
        <MainLayout>
            <Head title={`Editar: ${experience.title} — PathFinder`} />
            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pf-text dark:text-pf-text-dark">
                        Editar experiencia
                    </h1>
                    <p className="mt-1 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Modifica la teva experiencia i guarda els canvis
                    </p>
                </div>
                <ExperienceForm experience={experience} categories={categories} countries={countries} />
            </div>
        </MainLayout>
    );
}
