import { Head } from '@inertiajs/react';
import { MainHeader } from '@/components/main-header';

export default function TermesUs() {
    return (
        <>
            <Head title="Termes d'ús — PathFinder" />
            <MainHeader />

            <main className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
                <h1 className="mb-8 text-3xl font-bold text-pf-text dark:text-pf-text-dark">
                    Termes d&apos;ús
                </h1>

                <Section title="1. Acceptació dels termes">
                    <p>
                        En accedir i utilitzar <strong className="text-pf-text dark:text-pf-text-dark">PathFinder</strong> (pathfinder.cat),
                        acceptes plenament aquests termes d&apos;ús. Si no estàs d&apos;acord amb algun dels punts,
                        t&apos;has d&apos;abstenir d&apos;utilitzar la plataforma.
                    </p>
                    <p>
                        Ens reservem el dret de modificar aquests termes en qualsevol moment. Els canvis
                        s&apos;anunciaran en aquesta mateixa pàgina amb la data d&apos;actualització. L&apos;ús continuat
                        de la plataforma després dels canvis implica l&apos;acceptació dels nous termes.
                    </p>
                </Section>

                <Section title="2. Descripció del servei">
                    <p>
                        PathFinder és una plataforma comunitària que permet als usuaris registrats crear,
                        compartir i descobrir experiències de viatge: rutes, allotjaments, fotografies,
                        recomanacions i contingut relacionat. El contingut és generat pels mateixos usuaris.
                    </p>
                    <p>
                        El servei s&apos;ofereix de forma gratuïta i sense garantia de disponibilitat contínua.
                        Ens reservem el dret de modificar, suspendre o interrompre qualsevol funcionalitat
                        en qualsevol moment i sense previ avís.
                    </p>
                </Section>

                <Section title="3. Registre i compte d'usuari">
                    <p>Per publicar contingut a PathFinder cal crear un compte. En registrar-te, et compromets a:</p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Proporcionar informació veraç i actualitzada (nom i correu electrònic vàlid).</li>
                        <li>Mantenir la confidencialitat de la teva contrasenya i no compartir-la amb tercers.</li>
                        <li>Notificar-nos immediatament si detectes un ús no autoritzat del teu compte.</li>
                        <li>No crear comptes falsos, duplicats ni en nom d&apos;una altra persona.</li>
                        <li>Tenir almenys 14 anys per registrar-te a la plataforma.</li>
                    </ul>
                    <p>
                        Ets responsable de tota l&apos;activitat que es realitzi des del teu compte.
                        PathFinder no es fa responsable dels danys derivats de l&apos;ús no autoritzat
                        del teu compte per no haver protegit adequadament les teves credencials.
                    </p>
                </Section>

                <Section title="4. Normes de contingut">
                    <p>
                        En publicar experiències, imatges o qualsevol altre contingut a PathFinder,
                        et compromets a no publicar material que:
                    </p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Sigui fals, enganyós o fraudulent.</li>
                        <li>Sigui ofensiu, difamatori, discriminatori o que inciti a l&apos;odi.</li>
                        <li>Vulneri drets de propietat intel·lectual de tercers (imatges amb drets d&apos;autor, etc.).</li>
                        <li>Contingui publicitat no autoritzada, spam o contingut comercial no sol·licitat.</li>
                        <li>Inclogui dades personals de tercers sense el seu consentiment explícit.</li>
                        <li>Sigui il·legal o que fomenti activitats il·legals.</li>
                        <li>Contingui malware, virus o codi maliciós de qualsevol tipus.</li>
                    </ul>
                    <p>
                        PathFinder es reserva el dret d&apos;eliminar qualsevol contingut que incompleixi
                        aquestes normes, sense obligació de notificació prèvia.
                    </p>
                </Section>

                <Section title="5. Sistema de votació i reports">
                    <p>
                        La plataforma disposa d&apos;un sistema de valoració (<strong className="text-pf-text dark:text-pf-text-dark">+1 / -1</strong>)
                        per a les experiències publicades, i d&apos;una opció per reportar contingut abusiu.
                        L&apos;ús d&apos;aquests mecanismes ha de ser honest i de bona fe.
                    </p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Queda prohibit l&apos;ús de sistemes automàtics per manipular les puntuacions.</li>
                        <li>Els reports falsos o malintencionats poden resultar en la suspensió del compte.</li>
                        <li>Les experiències reportades seran revisades per l&apos;equip de moderació, que podrà mantenir-les o rebutjar-les.</li>
                    </ul>
                </Section>

                <Section title="6. Propietat intel·lectual">
                    <p>
                        El contingut que publiques a PathFinder (textos, imatges, ubicacions) continua
                        sent propietat teva. En publicar-lo, ens concedeixas una llicència no exclusiva,
                        gratuïta i mundial per mostrar, reproduir i distribuir aquest contingut dins de
                        la plataforma i amb finalitats de promoció del servei.
                    </p>
                    <p>
                        El disseny, logotip, codi i contingut propi de PathFinder estan protegits per
                        drets d&apos;autor. Queda prohibida la seva reproducció o ús sense autorització expressa.
                    </p>
                </Section>

               

                <Section title="7. Suspensió i eliminació de comptes">
                    <p>
                        PathFinder pot suspendre o eliminar un compte, de forma temporal o permanent,
                        en cas d&apos;incompliment d&apos;aquests termes, sense necessitat de previ avís. Les causes
                        poden incloure:
                    </p>
                    <ul className="list-inside list-disc space-y-1.5 pl-2">
                        <li>Publicació repetida de contingut que infringeixi les normes de la plataforma.</li>
                        <li>Ús fraudulent del sistema de votacions o reports.</li>
                        <li>Intents d&apos;accés no autoritzat o atacs a la infraestructura.</li>
                        <li>Qualsevol activitat il·legal o que perjudiqui altres usuaris.</li>
                    </ul>
                    <p>
                        L&apos;usuari pot eliminar el seu propi compte en qualsevol moment des de
                        <strong className="text-pf-text dark:text-pf-text-dark"> Configuració &gt; Perfil</strong>.
                        Aquesta acció és irreversible i elimina totes les dades associades al compte.
                    </p>
                </Section>

                <Section title="8. Limitació de responsabilitat">
                    <p>
                        PathFinder actua com a plataforma d&apos;allotjament de contingut generat per usuaris
                        i no es responsabilitza de la veracitat, qualitat ni adequació d&apos;aquest contingut.
                        Les experiències publicades reflecteixen l&apos;opinió dels seus autors.
                    </p>
                    <p>
                        La plataforma no garanteix la disponibilitat ininterrompuda del servei ni es fa
                        responsable dels danys derivats d&apos;interrupcions tècniques, pèrdua de dades o
                        accessos no autoritzats deguts a vulnerabilitats de tercers.
                    </p>
                </Section>

                <Section title="9. Llei aplicable">
                    <p>
                        Aquests termes es regeixen per la legislació espanyola i de la Unió Europea,
                        incloent el Reglament General de Protecció de Dades (RGPD) i la Llei de Serveis
                        de la Societat de la Informació (LSSI). Per a qualsevol controvèrsia derivada
                        de l&apos;ús de la plataforma, les parts se sotmeten als tribunals competents de
                        Catalunya, amb renúncia expressa a qualsevol altre fur.
                    </p>
                    <p className="mt-4 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Última actualització: abril 2026
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