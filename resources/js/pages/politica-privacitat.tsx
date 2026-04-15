import { Head } from '@inertiajs/react';
import { MainHeader } from '@/components/main-header';

export default function PoliticaPrivacitat() {
    return (
        <>
            <Head title="Politica de privacitat — PathFinder" />
            <MainHeader />

            <main className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
                <h1 className="mb-8 text-3xl font-bold text-pf-text dark:text-pf-text-dark">
                    Politica de privacitat
                </h1>

                <Section title="1. Responsable del tractament">
                    <p>
                        El responsable del tractament de les dades personals es <strong className="text-pf-text dark:text-pf-text-dark">PathFinder</strong>,
                        plataforma comunitaria per compartir experiencies de viatge. Per a qualsevol
                        consulta relacionada amb la privacitat, pots contactar-nos a traves del
                        formulari de contacte de la web.
                    </p>
                    <p>
                        Aquesta politica s&apos;aplica unicament al lloc web <strong className="text-pf-text dark:text-pf-text-dark">pathfinder.cat</strong> i
                        compleix el Reglament General de Proteccio de Dades (RGPD) de la UE i la Llei de Serveis
                        de la Societat de la Informacio (LSSI).
                    </p>
                </Section>

                <Section title="2. Dades que recollim">
                    <p>Recollim les seguents dades personals:</p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li><strong className="text-pf-text dark:text-pf-text-dark">Dades de registre:</strong> nom, correu electronic i contrasenya (xifrada amb bcrypt). Opcionalment, pais de residencia.</li>
                        <li><strong className="text-pf-text dark:text-pf-text-dark">Contingut publicat:</strong> titol, text, imatges, categories, ubicacio (coordenades al mapa) i data de les experiencies.</li>
                        <li><strong className="text-pf-text dark:text-pf-text-dark">Dades d&apos;interaccio:</strong> votacions (+1/-1) a experiencies i reports d&apos;abus amb motiu.</li>
                        <li><strong className="text-pf-text dark:text-pf-text-dark">Dades tecniques:</strong> adreca IP, tipus de navegador i cookies de sessio.</li>
                    </ul>
                </Section>

                <Section title="3. Finalitat del tractament">
                    <p>Utilitzem les dades per a:</p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Gestionar el registre i l&apos;autenticacio d&apos;usuaris (inclos 2FA).</li>
                        <li>Permetre la creacio, edicio i visualitzacio d&apos;experiencies de viatge.</li>
                        <li>Mostrar contingut personalitzat (experiencies destacades, filtres per pais o categoria).</li>
                        <li>Gestionar el sistema de votacions i reports d&apos;abus.</li>
                        <li>Administracio de la plataforma (gestio d&apos;usuaris, categories i moderacio).</li>
                        <li>Millorar la plataforma i garantir-ne la seguretat.</li>
                    </ul>
                </Section>

                <Section title="4. Base legal">
                    <p>
                        El tractament de les dades es basa en el <strong className="text-pf-text dark:text-pf-text-dark">consentiment</strong> de
                        l&apos;usuari al registrar-se, l&apos;execucio del contracte de servei (termes d&apos;us) i
                        l&apos;interes legitim per mantenir la seguretat de la plataforma i prevenir abusos.
                    </p>
                </Section>

                <Section title="5. Conservacio de les dades">
                    <p>
                        Les dades personals es conserven mentre el compte d&apos;usuari estigui actiu.
                        En cas d&apos;eliminacio del compte (disponible a <strong className="text-pf-text dark:text-pf-text-dark">Configuracio &gt; Perfil</strong>),
                        les dades es suprimeixen de forma definitiva, incloent experiencies, votacions i reports associats.
                        Es conserven unicament les dades necessaries per obligacio legal.
                    </p>
                </Section>

                <Section title="6. Drets dels usuaris">
                    <p>Tens dret a:</p>
                    <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-pf-border text-xs uppercase text-pf-text-3 dark:border-pf-border-dark dark:text-pf-text-3dark">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Dret</th>
                                    <th className="px-4 py-3 font-semibold">Descripcio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pf-border dark:divide-pf-border-dark">
                                {[
                                    { right: 'Acces', desc: 'Consultar les teves dades personals.' },
                                    { right: 'Rectificacio', desc: 'Modificar les dades incorrectes o incompletes.' },
                                    { right: 'Supressio', desc: "Sol·licitar l'eliminacio del teu compte i dades." },
                                    { right: 'Portabilitat', desc: 'Obtenir una copia de les teves dades en format estructurat.' },
                                    { right: 'Oposicio', desc: 'Oposar-te al tractament de les teves dades.' },
                                ].map((item) => (
                                    <tr key={item.right} className="transition-colors hover:bg-pf-surface-2 dark:hover:bg-pf-surface-2dark">
                                        <td className="px-4 py-3 font-medium text-pf-text dark:text-pf-text-dark">{item.right}</td>
                                        <td className="px-4 py-3">{item.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3">
                        Pots exercir aquests drets des de la seccio de configuracio del teu perfil
                        o contactant-nos directament.
                    </p>
                </Section>

                <Section title="7. Cookies">
                    <p>
                        PathFinder utilitza cookies essencials per al funcionament de la sessio
                        d&apos;usuari i les preferencies de tema (clar/fosc). No utilitzem cookies
                        de seguiment ni de publicitat de tercers. Consulta la nostra
                        {' '}<a href="/legal/politica-cookies" className="text-pf-primary hover:underline dark:text-pf-primary-dark">Politica de Cookies</a> per
                        a mes detalls.
                    </p>
                </Section>

                <Section title="8. Seguretat">
                    <p>
                        Apliquem mesures de seguretat tecniques i organitzatives per protegir les dades:
                    </p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Contrasenyes xifrades amb <strong className="text-pf-text dark:text-pf-text-dark">bcrypt</strong>.</li>
                        <li>Autenticacio de dos factors (<strong className="text-pf-text dark:text-pf-text-dark">2FA</strong>) opcional.</li>
                        <li>Proteccio <strong className="text-pf-text dark:text-pf-text-dark">CSRF</strong> en tots els formularis.</li>
                        <li>Control d&apos;acces basat en rols (usuari, moderador, administrador).</li>
                        <li>Verificacio de correu electronic obligatoria.</li>
                    </ul>
                </Section>

                <Section title="9. Imatges">
                    <p>
                        Les imatges pujades pels usuaris es processen automaticament:
                        es redimensionen (maxim <strong className="text-pf-text dark:text-pf-text-dark">1600px</strong> d&apos;amplada) i
                        es converteixen a format <strong className="text-pf-text dark:text-pf-text-dark">WebP</strong> (qualitat 80%)
                        per optimitzar l&apos;emmagatzematge i la velocitat de carrega.
                        Les imatges originals no es conserven al servidor.
                    </p>
                </Section>

                <Section title="10. Modificacions">
                    <p>
                        Ens reservem el dret de modificar aquesta politica de privacitat en qualsevol moment.
                        Qualsevol canvi es publicara en aquesta mateixa pagina amb la data d&apos;actualitzacio.
                    </p>
                    <p className="mt-4 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Ultima actualitzacio: abril 2026
                    </p>
                </Section>
            </main>
        </>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="overflow-hidden rounded-xl border border-pf-border bg-pf-surface shadow-sm dark:border-pf-border-dark dark:bg-pf-surface-dark">
            <div className="border-b border-pf-border bg-pf-bg px-6 py-4 dark:border-pf-border-dark dark:bg-pf-bg-dark">
                <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">{title}</h2>
            </div>
            <div className="space-y-4 p-6 leading-relaxed text-pf-text-2 dark:text-pf-text-2dark">
                {children}
            </div>
        </section>
    );
}
