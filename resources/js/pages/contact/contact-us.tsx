import { Head, useForm } from '@inertiajs/react';
import { Send, CheckCircle } from 'lucide-react';
import { MainHeader } from '@/components/main-header';

type ContactForm = {
    type: string;
    subject: string;
    message: string;
};

const TIPUS_OPTIONS = [
    { value: 'suggestion', label: 'Suggeriment' },
    { value: 'technical_issue', label: 'Problema tècnic' },
    { value: 'account', label: 'Gestió del compte' },
    { value: 'other', label: 'Altre' },
];

export default function Contacte() {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm<ContactForm>({
        type: '',
        subject: '',
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/contact-us', {
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Contacte — PathFinder" />
            <MainHeader />

            <main className="container mx-auto max-w-2xl space-y-8 px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold text-pf-text dark:text-pf-text-dark">
                    Contacte
                </h1>
                <p className="text-pf-text-2 dark:text-pf-text-2dark">
                    Tens algun dubte, problema o suggeriment? Omple el formulari i t&apos;haurem
                    respost al teu correu registrat.
                </p>

                {wasSuccessful && (
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-800 dark:bg-green-950">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">Missatge enviat correctament</p>
                            <p className="mt-0.5 text-sm text-green-700 dark:text-green-400">
                                Hem rebut la teva consulta. Et respondrem al correu del teu compte.
                            </p>
                        </div>
                    </div>
                )}

                <section className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
                    <div className="border-b border-pf-border bg-pf-bg px-6 py-4 dark:border-pf-border-dark dark:bg-pf-bg-dark">
                        <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">Nou missatge</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 p-6">

                        {/* Tipus de consulta */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="tipus"
                                className="block text-sm font-semibold text-pf-text dark:text-pf-text-dark"
                            >
                                Tipus de consulta <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="tipus"
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="w-full rounded-lg border border-pf-border bg-pf-bg px-4 py-2.5 text-sm text-pf-text transition-colors focus:border-pf-primary focus:outline-none focus:ring-2 focus:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-dark dark:focus:border-pf-primary-dark dark:focus:ring-pf-primary-dark/20"
                            >
                                <option value="" disabled>Selecciona una opció...</option>
                                {TIPUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-xs text-red-500">{errors.type}</p>
                            )}
                        </div>

                        {/* Assumpte */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="assumpte"
                                className="block text-sm font-semibold text-pf-text dark:text-pf-text-dark"
                            >
                                Assumpte <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="assumpte"
                                type="text"
                                maxLength={120}
                                placeholder="Descriu breument el motiu del contacte"
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                                className="w-full rounded-lg border border-pf-border bg-pf-bg px-4 py-2.5 text-sm text-pf-text placeholder:text-pf-text-3 transition-colors focus:border-pf-primary focus:outline-none focus:ring-2 focus:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus:border-pf-primary-dark dark:focus:ring-pf-primary-dark/20"
                            />
                            <p className="text-right text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                {data.subject.length}/120
                            </p>
                            {errors.subject && (
                                <p className="text-xs text-red-500">{errors.subject}</p>
                            )}
                        </div>

                        {/* Missatge */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="missatge"
                                className="block text-sm font-semibold text-pf-text dark:text-pf-text-dark"
                            >
                                Missatge <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="missatge"
                                rows={6}
                                maxLength={1000}
                                placeholder="Explica'ns amb detall el teu dubte o suggeriment..."
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                className="w-full resize-none rounded-lg border border-pf-border bg-pf-bg px-4 py-2.5 text-sm text-pf-text placeholder:text-pf-text-3 transition-colors focus:border-pf-primary focus:outline-none focus:ring-2 focus:ring-pf-primary/20 dark:border-pf-border-dark dark:bg-pf-bg-dark dark:text-pf-text-dark dark:placeholder:text-pf-text-3dark dark:focus:border-pf-primary-dark dark:focus:ring-pf-primary-dark/20"
                            />
                            <p className="text-right text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                {data.message.length}/1000
                            </p>
                            {errors.message && (
                                <p className="text-xs text-red-500">{errors.message}</p>
                            )}
                        </div>

                        {/* Footer del formulari */}
                        <div className="flex items-center justify-between border-t border-pf-border pt-4 dark:border-pf-border-dark">
                            <p className="text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                La resposta s&apos;enviarà al correu del teu compte.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-pf-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-pf-primary-dark"
                            >
                                <Send className="h-4 w-4" />
                                {processing ? 'Enviant...' : 'Enviar missatge'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}