import { usePage, useForm } from "@inertiajs/react";
import { AlertCircle, Search, Check, X, Info } from "lucide-react";
import { route } from 'ziggy-js';
import Summary from "@/components/admin/summary";
import AdminLayout from "@/layouts/admin-layout";
import type { BreadcrumbItem } from '@/types';


interface Reports{
    id:number;
    user_id:number;
    post_id:number;
    status:string;
    reason:string;
}


export default function reports(){
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Administració', href: '/admin' },
        { title: 'reports', href: '/admin/reports' }
    ];
    
    

    const { reports: reportes = [] } = usePage().props as unknown as { reports: Reports[] };
    
    const form = useForm<Partial<Reports>>({
        user_id: '',
        post_id: '',
        status:"",
        reason: ""
    });

    function filtrar({filtre}){
        if (filtre==="Pendents"){
            form.get(route(""))
        } else if( filtre==="Resolts"){
            form.get(route(""))
            
        }else if(filtre==="Descartats"){
            form.get(route(""))

        }else if (filtre==="Tots"){
            form.get(route(""))

        }else{
            alert("opcio no disponible per filtrar")
        }
    }
    
    return(
        <>
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Summary/>

            <div className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl shadow-sm mb-6 mx-2 sm:mx-4 overflow-hidden mt-6">
                
                {/* Header title */}
                <div className="flex items-center justify-between p-4 border-b border-pf-border dark:border-pf-border-dark bg-white dark:bg-pf-surface-dark">
                    <div className="flex items-center gap-3 text-pf-text dark:text-pf-text-dark">
                        <AlertCircle className="h-5 w-5 text-pf-primary dark:text-pf-primary-dark" />
                        <h2 className="text-lg font-bold">Abusos reportats</h2>
                    </div>
                    <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-red-800/50 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        {reportes.length} pendents
                    </div>
                </div>

                {/* Toolbar */}
                <div className="px-5 py-4 border-b border-pf-border dark:border-pf-border-dark flex flex-col xl:flex-row gap-4 items-center justify-between bg-white dark:bg-pf-surface-dark">
                    <div className="flex bg-pf-bg dark:bg-pf-bg-dark p-1 rounded-md border border-pf-border dark:border-pf-border-dark w-full xl:w-auto">
                        <button className="flex-1 xl:flex-none px-4 py-1.5 bg-white dark:bg-pf-surface-dark shadow-sm rounded text-sm font-bold text-pf-text dark:text-white border border-gray-200 dark:border-gray-700">Tots</button>
                        <button className="flex-1 xl:flex-none px-4 py-1.5 text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark hover:text-pf-text dark:hover:text-white transition-colors">Pendents</button>
                        <button className="flex-1 xl:flex-none px-4 py-1.5 text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark hover:text-pf-text dark:hover:text-white transition-colors">Resolts</button>
                        <button className="flex-1 xl:flex-none px-4 py-1.5 text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark hover:text-pf-text dark:hover:text-white transition-colors">Descartats</button>
                    </div>
                    <div className="flex-1 flex gap-3 w-full xl:max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                            <input type="text" placeholder="Cerca per títol o usuari..." className="w-full pl-9 pr-4 py-1.5 border border-pf-border dark:border-pf-border-dark rounded-md text-sm bg-pf-bg dark:bg-pf-bg-dark text-pf-text dark:text-white focus:outline-none focus:ring-2 focus:ring-pf-primary" />
                        </div>
                        <select className="border border-pf-border dark:border-pf-border-dark rounded-md text-sm px-3 py-1.5 bg-pf-bg dark:bg-pf-bg-dark text-pf-text dark:text-white focus:outline-none focus:ring-2 focus:ring-pf-primary">
                            <option>Tots els tipus</option>
                        </select>
                    </div>
                </div>

                {/* Sub-header Counters */}
                <div className="px-6 py-3 border-b border-pf-border dark:border-pf-border-dark flex justify-between text-xs font-bold bg-white dark:bg-pf-surface-dark">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span className="text-pf-text-3 dark:text-pf-text-3dark uppercase tracking-wider">Pendents</span>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                            <span className="text-pf-text dark:text-white text-sm">{reportes.length}</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <span className="text-pf-text-3 dark:text-pf-text-3dark uppercase tracking-wider">Resolts</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-pf-text dark:text-white text-sm">2</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-pf-text-3"></div>
                            <span className="text-pf-text-3 dark:text-pf-text-3dark uppercase tracking-wider">Descartats</span>
                        </div>
                        <span className="text-pf-text dark:text-white text-sm ml-2">1</span>
                    </div>
                </div>

                {/* Report Items List */}
                <div className="divide-y divide-pf-border dark:divide-pf-border-dark bg-white dark:bg-pf-surface-dark">
                    {reportes.map((rep, idx) => (
                        <div key={rep.id} className="p-5 flex flex-col md:flex-row gap-5 hover:bg-pf-bg dark:hover:bg-pf-bg-dark/50 transition-colors">
                            
                            {/* Left Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-900/30">
                                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 rounded">
                                        {rep.reason || "ODI / DISCRIMINACIÓ"}
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded bg-red-50/50 dark:bg-transparent">
                                        Alta
                                    </span>
                                </div>
                                
                                <h3 className="text-base font-bold text-pf-text dark:text-white mb-1 truncate">
                                    Experiència reportada a Marràqueix — guia completa
                                </h3>
                                <p className="text-sm text-pf-text-2 dark:text-pf-text-2dark line-clamp-2 mb-3">
                                    Aquest post conté comentaris ofensius sobre la població local que podrien resultar discriminatoris i fomentar actituds negatives envers la cultura marroquina.
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs text-pf-text-3 dark:text-pf-text-3dark">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-pf-primary-l dark:bg-pf-primary-ldark text-pf-primary dark:text-pf-primary-hdark font-bold flex items-center justify-center text-[9px] uppercase">
                                            {("User").substring(0,2)}
                                        </div>
                                        <span>Reportat per <span className="font-semibold text-pf-text dark:text-gray-300">u/usuari_{rep.user_id}</span></span>
                                    </div>
                                    <span>•</span>
                                    <span>Autor: <span className="font-semibold text-pf-text dark:text-gray-300">u/autor_{rep.post_id}</span></span>
                                </div>
                            </div>

                            {/* Right Actions & Meta */}
                            <div className="flex flex-col items-end justify-between flex-shrink-0 mt-4 md:mt-0">
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <span className="text-xs text-pf-text-3 dark:text-gray-500 font-medium">Avui, 09:42</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        Pendent
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-pf-border dark:border-pf-border-dark rounded-md text-xs font-bold text-pf-text dark:text-gray-300 hover:bg-pf-bg dark:hover:bg-pf-bg-dark transition-colors shadow-sm">
                                        <Search className="w-3.5 h-3.5" /> Detalls
                                    </button>
                                    <button className="flex items-center justify-center w-8 h-8 border border-emerald-200 dark:border-emerald-900/50 rounded-md text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors shadow-sm bg-white dark:bg-transparent">
                                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                                    </button>
                                    <button className="flex items-center justify-center w-8 h-8 border border-pf-border dark:border-pf-border-dark rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm bg-white dark:bg-transparent">
                                        <X className="w-4 h-4" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {reportes.length === 0 && (
                        <div className="p-8 text-center text-pf-text-3 dark:text-pf-text-3dark border-t border-pf-border dark:border-pf-border-dark flex flex-col items-center gap-3">
                            <Check className="w-10 h-10 text-emerald-500" />
                            <p className="text-sm font-medium">No hi ha cap abús pendent de revisar.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
        </>
    )
}