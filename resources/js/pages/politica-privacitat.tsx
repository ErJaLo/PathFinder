import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';

export default function PoliticaPrivacitat() {
    return (
        <MainLayout>
            <Head title="Politica de privacitat — PathFinder" />

            <div className="mx-auto w-full max-w-3xl">
                <h1 className="mb-6 text-[clamp(22px,3vw,30px)] font-bold tracking-tight text-pf-text dark:text-pf-text-dark">
                    Politica de privacitat
                </h1>

                <div className="space-y-6 text-[15px] leading-relaxed text-pf-text-2 dark:text-pf-text-2dark">
                    <p>
                        Aquesta politica de privacitat descriu com PathFinder recull, utilitza i protegeix
                        la informacio personal dels seus usuaris. En utilitzar la nostra plataforma, acceptes
                        les practiques descrites en aquest document.
                    </p>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            1. Responsable del tractament
                        </h2>
                        <p>
                            El responsable del tractament de les dades personals es PathFinder,
                            plataforma comunitaria per compartir experiencies de viatge. Per a qualsevol
                            consulta relacionada amb la privacitat, pots contactar-nos a traves del
                            formulari de contacte de la web.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            2. Dades que recollim
                        </h2>
                        <p className="mb-2">Recollim les seguents dades personals:</p>
                        <ul className="list-inside list-disc space-y-1 pl-2">
                            <li><strong>Dades de registre:</strong> nom, correu electronic i contrasenya (xifrada).</li>
                            <li><strong>Contingut publicat:</strong> titol, text, imatges, categories, ubicacio i coordenades de les experiencies.</li>
                            <li><strong>Dades d&apos;interaccio:</strong> votacions (+1/-1) i reports d&apos;abus.</li>
                            <li><strong>Dades tecniques:</strong> adreça IP, tipus de navegador i cookies de sessio.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            3. Finalitat del tractament
                        </h2>
                        <p className="mb-2">Utilitzem les dades per a:</p>
                        <ul className="list-inside list-disc space-y-1 pl-2">
                            <li>Gestionar el registre i l&apos;autenticacio d&apos;usuaris.</li>
                            <li>Permetre la creacio, edicio i visualitzacio d&apos;experiencies de viatge.</li>
                            <li>Mostrar contingut personalitzat (experiencies destacades, filtres per pais o categoria).</li>
                            <li>Gestionar el sistema de votacions i reports d&apos;abus.</li>
                            <li>Millorar la plataforma i garantir-ne la seguretat.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            4. Base legal
                        </h2>
                        <p>
                            El tractament de les dades es basa en el consentiment de l&apos;usuari al registrar-se,
                            l&apos;execucio del contracte de servei (termes d&apos;us) i l&apos;interes legitim per mantenir
                            la seguretat de la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            5. Conservacio de les dades
                        </h2>
                        <p>
                            Les dades personals es conserven mentre el compte d&apos;usuari estigui actiu.
                            En cas d&apos;eliminacio del compte, les dades es suprimeixen de forma definitiva,
                            excepte aquelles que calgui conservar per obligacio legal.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            6. Drets dels usuaris
                        </h2>
                        <p className="mb-2">Tens dret a:</p>
                        <ul className="list-inside list-disc space-y-1 pl-2">
                            <li><strong>Acces:</strong> consultar les teves dades personals.</li>
                            <li><strong>Rectificacio:</strong> modificar les dades incorrectes o incompletes.</li>
                            <li><strong>Supressio:</strong> sol·licitar l&apos;eliminacio del teu compte i dades.</li>
                            <li><strong>Portabilitat:</strong> obtenir una copia de les teves dades en format estructurat.</li>
                            <li><strong>Oposicio:</strong> oposar-te al tractament de les teves dades.</li>
                        </ul>
                        <p className="mt-2">
                            Pots exercir aquests drets des de la seccio de configuracio del teu perfil
                            o contactant-nos directament.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            7. Cookies
                        </h2>
                        <p>
                            PathFinder utilitza cookies essencials per al funcionament de la sessio
                            d&apos;usuari i les preferencies de tema (clar/fosc). No utilitzem cookies
                            de seguiment ni de publicitat de tercers.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            8. Seguretat
                        </h2>
                        <p>
                            Apliquem mesures de seguretat tecniques i organitzatives per protegir les dades:
                            contrasenyes xifrades amb bcrypt, autenticacio de dos factors (2FA) opcional,
                            proteccio CSRF en tots els formularis i control d&apos;acces basat en rols.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            9. Imatges
                        </h2>
                        <p>
                            Les imatges pujades pels usuaris es processen automaticament: es redimensionen
                            (maxim 1600px d&apos;amplada) i es converteixen a format WebP per optimitzar
                            l&apos;emmagatzematge i la velocitat de carrega. Les imatges originals no es conserven.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-2 text-lg font-semibold text-pf-text dark:text-pf-text-dark">
                            10. Modificacions
                        </h2>
                        <p>
                            Ens reservem el dret de modificar aquesta politica de privacitat en qualsevol moment.
                            Qualsevol canvi es publicara en aquesta mateixa pagina amb la data d&apos;actualitzacio.
                        </p>
                    </section>

                    <p className="text-sm text-pf-text-3 dark:text-pf-text-3dark">
                        Ultima actualitzacio: abril 2026
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
