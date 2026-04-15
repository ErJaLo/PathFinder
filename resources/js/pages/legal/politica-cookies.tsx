import { 
    Info, 
    AlignLeft, 
    Lock, 
    Settings, 
    BarChart2, 
    AlertTriangle, 
    Layout, 
    Users, 
    CheckCircle 
} from "lucide-react"
import { MainHeader } from "@/components/main-header"

export default function cookies(){

    return(
        <>
            <MainHeader/>

            <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
                <h1 className="text-3xl font-bold text-pf-text dark:text-pf-text-dark mb-8">Política de Cookies</h1>

                {/* Secció 1: Què són les cookies? */}
                <section className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-pf-bg dark:bg-pf-bg-dark border-b border-pf-border dark:border-pf-border-dark px-6 py-4 flex items-center gap-3">
                        <div className="bg-pf-primary-l dark:bg-pf-primary-ldark p-1.5 rounded-md text-pf-primary dark:text-pf-primary-dark">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">Què són les cookies?</h2>
                    </div>
                    <div className="p-6 space-y-4 text-pf-text-2 dark:text-pf-text-2dark leading-relaxed">
                        <p>
                            Les <strong className="text-pf-text dark:text-pf-text-dark">cookies</strong> són petits fitxers de text que els llocs web emmagatzemen al teu navegador quan els visites. Permeten que el lloc web recordi les teves preferències, la teva sessió iniciada i altres informacions per millorar la teva experiència.
                        </p>
                        <p>
                            A <strong className="text-pf-text dark:text-pf-text-dark">PathFinder</strong>, una plataforma de compartició d'experiències de viatge, les cookies ens ajuden a mantenir la teva sessió activa mentre navegues entre experiències, recordar els teus filtres de cerca i garantir la seguretat del teu compte.
                        </p>
                        
                            <p>
                                Aquesta política s'aplica únicament al lloc web <strong className="text-pf-text dark:text-pf-text-dark">pathfinder.cat</strong> i compleix el Reglament General de Protecció de Dades (RGPD) de la UE i la Llei de Serveis de la Societat de la Informació (LSSI).
                            </p>
                    </div>
                </section>

                {/* Secció 2: Tipus de cookies que emprem */}
                <section className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-pf-bg dark:bg-pf-bg-dark border-b border-pf-border dark:border-pf-border-dark px-6 py-4 flex items-center gap-3">
                        <div className="bg-pf-accent-l dark:bg-pf-accent-ldark p-1.5 rounded-md text-pf-accent dark:text-pf-accent-dark">
                            <AlignLeft className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">Tipus de cookies que emprem</h2>
                    </div>
                    <div className="p-6 space-y-6 text-pf-text-2 dark:text-pf-text-2dark leading-relaxed">
                        
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-5 h-5 text-pf-text dark:text-pf-text-dark" />
                                <h3 className="font-bold text-pf-text dark:text-pf-text-dark">Cookies estrictament necessàries</h3>
                            </div>
                            <p className="pl-7">
                                Indispensables per al funcionament de PathFinder. Sense elles no pots iniciar sessió, gestionar les teves experiències ni navegar amb seguretat. No requereixen el teu consentiment previ.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-5 h-5 text-pf-text dark:text-pf-text-dark" />
                                <h3 className="font-bold text-pf-text dark:text-pf-text-dark">Cookies funcionals</h3>
                            </div>
                            <p className="pl-7">
                                Recorden les teves preferències de la plataforma: idioma, ordre d'ordenació de les experiències, categoria activa al filtre o si prefereixes el mode fosc. Milloren la usabilitat però no són essencials.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart2 className="w-5 h-5 text-pf-text dark:text-pf-text-dark" />
                                <h3 className="font-bold text-pf-text dark:text-pf-text-dark">Cookies analítiques</h3>
                            </div>
                            <p className="pl-7">
                                Ens permeten entendre com s'utilitza PathFinder: quines experiències s'han vist més, on s'abandona la navegació o quin rendiment té la plataforma. Totes les dades són <strong className="text-pf-text dark:text-pf-text-dark">anonimitzades</strong> i mai no s'associen a un usuari identificat.
                            </p>
                        </div>

                            <p>
                                PathFinder <strong className="text-pf-text dark:text-pf-text-dark">no utilitza cookies de màrqueting ni de seguiment publicitari</strong>. Tampoc compartim dades de comportament de navegació amb tercers amb finalitats comercials.
                            </p>
                    </div>
                </section>

                {/* Secció 3: Cookies que utilitzem */}
                <section className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-pf-bg dark:bg-pf-bg-dark border-b border-pf-border dark:border-pf-border-dark px-6 py-4 flex items-center gap-3">
                        <div className="bg-pf-primary-l dark:bg-pf-primary-ldark p-1.5 rounded-md text-pf-primary dark:text-pf-primary-dark">
                            <Layout className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">Cookies que utilitzem</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-pf-text-2 dark:text-pf-text-2dark">
                            <thead className="text-xs uppercase bg-pf-bg dark:bg-pf-bg-dark text-pf-text-3 dark:text-pf-text-3dark border-b border-pf-border dark:border-pf-border-dark">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nom</th>
                                    <th className="px-6 py-4 font-semibold">Tipus</th>
                                    <th className="px-6 py-4 font-semibold">Durada</th>
                                    <th className="px-6 py-4 font-semibold">Finalitat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pf-border dark:divide-pf-border-dark">
                                {[
                                    { name: "pf_session", type: "Necessària", duration: "Sessió", desc: "Manté la sessió autenticada de l'usuari mentre navega per PathFinder.", color: "primary" },
                                    { name: "XSRF-TOKEN", type: "Necessària", duration: "Sessió", desc: "Token de seguretat per prevenir atacs CSRF (Laravel). S'envia automàticament amb cada petició.", color: "primary" },
                                    { name: "pf_remember", type: "Necessària", duration: "30 dies", desc: "Emmagatzema la sessió persistent quan l'usuari marca \"Recorda'm\" en iniciar sessió.", color: "primary" },
                                    { name: "pf_prefs", type: "Funcional", duration: "1 any", desc: "Guarda preferències d'interfície: mode fosc/clar, ordenació per defecte, categoria activa.", color: "accent" },
                                    { name: "pf_lang", type: "Funcional", duration: "1 any", desc: "Recorda l'idioma seleccionat per l'usuari a la plataforma.", color: "accent" },
                                    { name: "pf_cookie_consent", type: "Necessària", duration: "1 any", desc: "Registra la decisió de consentiment de cookies de l'usuari per no tornar a mostrar el banner.", color: "primary" },
                                    { name: "_pf_analytics", type: "Analítica", duration: "90 dies", desc: "Mesura el rendiment de la plataforma i el comportament de navegació de forma anònima.", color: "tag" }
                                ].map((cookie, idx) => (
                                    <tr key={idx} className="hover:bg-pf-surface-2 dark:hover:bg-pf-surface-2dark transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <span className={`px-2 py-1 rounded-md ${
                                                cookie.color === 'primary' ? 'bg-pf-primary-l dark:bg-pf-primary-ldark text-pf-primary dark:text-pf-primary-dark' :
                                                cookie.color === 'accent' ? 'bg-pf-accent-l dark:bg-pf-accent-ldark text-pf-accent dark:text-pf-accent-dark' :
                                                'bg-pf-tag-bg dark:bg-pf-tag-bgdark text-pf-tag-text dark:text-pf-tag-textdark'
                                            }`}>
                                                {cookie.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                cookie.color === 'primary' ? 'border-pf-primary dark:border-pf-primary-dark text-pf-primary dark:text-pf-primary-dark' :
                                                cookie.color === 'accent' ? 'border-pf-accent dark:border-pf-accent-dark text-pf-accent dark:text-pf-accent-dark' :
                                                'border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {cookie.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{cookie.duration}</td>
                                        <td className="px-6 py-4">{cookie.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Secció 4: Cookies de tercers */}
                <section className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl shadow-sm overflow-hidden mb-12">
                    <div className="bg-pf-bg dark:bg-pf-bg-dark border-b border-pf-border dark:border-pf-border-dark px-6 py-4 flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-md text-green-700 dark:text-green-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-pf-text dark:text-pf-text-dark">Cookies de tercers</h2>
                    </div>
                    <div className="p-6 space-y-6 text-pf-text-2 dark:text-pf-text-2dark leading-relaxed">
                        <p>
                            PathFinder pot integrar serveis externs que instal·len les seves pròpies cookies. En tots els casos, el tercer és responsable de la seva pròpia política de privacitat.
                        </p>

                        <div className="space-y-2">
                            <h3 className="font-bold text-pf-text dark:text-pf-text-dark text-base">OpenStreetMap / Leaflet</h3>
                            <p>
                                Quan visualitzes el mapa de coordenades d'una experiència, el servei de mapes de <strong className="text-pf-text dark:text-pf-text-dark">OpenStreetMap</strong> pot establir cookies pròpies per gestionar la seva infraestructura. Aquestes cookies no identifiquen l'usuari de PathFinder. Consulta la <a href="#" className="text-pf-primary dark:text-pf-primary-dark hover:underline">política de privacitat d'OpenStreetMap</a>.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-pf-text dark:text-pf-text-dark text-base">Cloudinary (CDN d'imatges)</h3>
                            <p>
                                Les imatges de PathFinder es serveixen des de <strong className="text-pf-text dark:text-pf-text-dark">Cloudinary</strong>. El servei pot registrar metadades tècniques de les peticions (IP, tipus de dispositiu) per optimitzar el lliurament. No s'utilitzen per crear perfils d'usuari.
                            </p>
                        </div>

                            <p>
                                PathFinder <strong className="text-pf-text dark:text-pf-text-dark">no integra</strong> Google Analytics, Meta Pixel, ni cap altra eina de seguiment publicitari de tercers.
                            </p>
                    </div>
                </section>

            </main>
        </>
    )
}