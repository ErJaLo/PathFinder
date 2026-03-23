import { MainFooter } from '@/components/main-footer';
import { MainHeader } from '@/components/main-header';
import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-pf-bg dark:bg-pf-bg-dark">
            <MainHeader />
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
                {children}
            </main>
            <MainFooter />
        </div>
    );
}
