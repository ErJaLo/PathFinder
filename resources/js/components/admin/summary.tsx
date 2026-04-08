import { Form, Link, usePage, useForm } from '@inertiajs/react';
import { Folder, Users, Flag, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

function Summary() {
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [totalUsuaris, setTotaUsuaris] = useState<number>(0);
  const [totalExperiencies, setTotalExperiencies] = useState<number>(0);
  const [totalReports, setTotalReports] = useState<number>(0);

  const form_summary = useForm();

  useEffect(() => {
      form_summary.get(route("admin.summaryStats"), {
      preserveState: true,
      preserveScroll: true,
      only: ['totalCategories', 'totalUsuaris', 'totalExperiencies', 'totalReports'], 
      onSuccess: (page: any) => {
        setTotalCategories(page.props.totalCategories || 0);
        setTotaUsuaris(page.props.totalUsuaris || 0);
        setTotalExperiencies(page.props.totalExperiencies || 0);
        setTotalReports(page.props.totalReports || 0);
      }
    });
  }, []); 

  // Funció per donar format numèric curt (ex: 42.8K)
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mx-2 sm:mx-4">
      {/* Targeta Categories */}
      <div className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl p-5 flex flex-row items-center gap-4 shadow-sm transition-colors">
        <div className="bg-pf-primary-l dark:bg-pf-primary-ldark p-3 rounded-lg flex items-center justify-center transition-colors">
          <Folder className="w-7 h-7 text-pf-amber dark:text-pf-amber-dark" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark leading-none transition-colors">{formatNumber(totalCategories)}</span>
          <span className="text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark mt-1 transition-colors">Categories</span>
        </div>
      </div>

      {/* Targeta Usuaris registrats */}
      <div className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl p-5 flex flex-row items-center gap-4 shadow-sm transition-colors">
        <div className="bg-[#E6F4EA] dark:bg-emerald-900/40 p-3 rounded-lg flex items-center justify-center transition-colors">
          <Users className="w-7 h-7 text-pf-primary dark:text-pf-primary-dark" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark leading-none transition-colors">{formatNumber(totalUsuaris)}</span>
          <span className="text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark mt-1 transition-colors">Usuaris registrats</span>
        </div>
      </div>

      {/* Targeta Abusos pendents */}
      <div className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl p-5 flex flex-row items-center gap-4 shadow-sm transition-colors">
        <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg flex items-center justify-center transition-colors">
          <Flag className="w-7 h-7 text-red-500 dark:text-red-400" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark leading-none transition-colors">{formatNumber(totalReports)}</span>
          <span className="text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark mt-1 transition-colors">Abusos pendents</span>
          {/* Mostrem advertència només si hi ha reportats */}
          {totalReports > 0 ? (
             <span className="text-[10px] font-bold text-red-500 dark:text-red-400 mt-1 uppercase tracking-wide transition-colors">Requereix atenció</span>
          ) : (
             <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wide transition-colors">Tot net</span>
          )}
        </div>
      </div>

      {/* Targeta Experiències */}
      <div className="bg-pf-surface dark:bg-pf-surface-dark border border-pf-border dark:border-pf-border-dark rounded-xl p-5 flex flex-row items-center gap-4 shadow-sm transition-colors">
        <div className="bg-pf-amber-l dark:bg-pf-amber-ldark p-3 rounded-lg flex items-center justify-center transition-colors">
          <FileText className="w-7 h-7 text-pf-primary dark:text-pf-primary-dark" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-pf-text dark:text-pf-text-dark leading-none transition-colors">{formatNumber(totalExperiencies)}</span>
          <span className="text-sm font-medium text-pf-text-2 dark:text-pf-text-2dark mt-1 transition-colors">Experiències</span>
        </div>
      </div>
    </div>
  );
}

export default Summary;