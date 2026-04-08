import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import type { User } from '@/types/auth';


type UserHeaderProps = {
  user: User;
};



export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
    const { theme, toggleTheme } = useTheme();
    


  return (
    <header className="header w-full bg-pf-text dark:bg-pf-bg-dark text-white flex items-center justify-between px-4 md:px-6 h-16 sticky top-0 z-50 border-b border-pf-primary/20">
      <div className="header-logo flex items-center gap-3">
        <Link href="/" className="flex-shrink-0">
          <img
            src="/img/Logo_petit.png"
            alt="PathFinder"
            className="h-10 w-10 rounded-lg object-cover"
          />
        </Link>
        <div>
          <div className="header-logo-text font-serif font-bold text-lg leading-tight">PathFinder</div>
          <div className="header-logo-badge text-xs uppercase tracking-wider text-pf-accent mt-0.5">El meu perfil</div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="header-nav hidden xl:flex items-center gap-2">
        <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">Compte</span>
        <Link href="/settings/profile" className="header-item active flex items-center gap-2 px-4 py-2 rounded-md text-white bg-pf-primary">
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          </svg>
          Dades personals
        </Link>
        <Link href="/settings/security" className="header-item flex items-center gap-2 px-4 py-2 rounded-md text-white/70 hover:bg-pf-primary-l hover:text-white">
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <rect x="3" y="7" width="10" height="7" rx="2" />
            <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round" />
          </svg>
          Contrasenya
        </Link>
        <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">Contingut</span>
        <Link href="/experiencies/meves" className="header-item flex items-center gap-2 px-4 py-2 rounded-md text-white/70 hover:bg-pf-primary-l hover:text-white">
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M2 3h12M2 7h9M2 11h6" strokeLinecap="round" />
          </svg>
          Les meves experiències
        </Link>
      </nav>

      {/* Mobile menu toggle */}


      <div className="header-right flex items-center gap-4">
        <Link href="/" className="header-back flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition text-xs md:text-base">
          <svg fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
            <path d="M9 2L4 6l5 4" strokeLinecap="round" />
          </svg>
          <span className="hidden xs:inline">Tornar a la web</span>
        </Link>
        <button
          className="ml-4 p-3 rounded-full bg-pf-primary-ldark hover:bg-pf-primary-dark/20 border border-pf-border-dark transition"
          onClick={toggleTheme}
          title="Cambiar tema"
        >
          {theme === 'dark'
            ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
            : <HiOutlineMoon className="w-6 h-6 text-pf-primary-dark" />}
        </button>
        <div className="header-user flex items-center gap-2">
          <div className="header-user-ava w-8 h-8 rounded-full bg-pf-accent-l flex items-center justify-center font-bold text-pf-accent text-sm">
            {initials}
          </div>
          <div className="hidden md:block">
            <div className="header-user-name text-sm font-medium text-white/90">{user.name}</div>
            <div className="header-user-role text-xs text-white/60">Usuari registrat</div>
          </div>
        </div>
        
        {/* Mobile menu toggle */}
        <button
          className="header-toggle flex xl:hidden flex-col items-center justify-center w-10 h-10 rounded-lg bg-white/10 ml-2"
          aria-label="Menú"
          onClick={() => setMobileNavOpen((open) => !open)}
          type="button"
        >
          <span className={`bar block w-5 h-0.5 bg-white rounded transition-transform duration-300 ${mobileNavOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
          <span className={`bar block w-5 h-0.5 bg-white rounded my-1 transition-opacity duration-200 ${mobileNavOpen ? 'opacity-0' : ''}`}></span>
          <span className={`bar block w-5 h-0.5 bg-white rounded transition-transform duration-300 ${mobileNavOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
        </button>


      </div>

      {/* Mobile nav  */}
      {mobileNavOpen && (
        <>
          {/* Overlay  */}
          <div
            className="fixed inset-0 z-40 bg-black opacity-80 transition-opacity xl:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Tancar menú"
          />
          {/* Top-down animated nav */}
          <nav
            className="fixed left-0 top-0 w-full bg-pf-text flex flex-col xl:hidden z-50 shadow-2xl animate-mobile-nav-slide-down"
            style={{
              animation: 'mobile-nav-slide-down 0.35s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <div className="flex justify-end px-4 pt-4 mb-4">
              <button
                className="rounded-xl bg-white/20 hover:bg-white/30 text-white p-2 transition"
                aria-label="Tancar menú"
                onClick={() => setMobileNavOpen(false)}
              >
                <svg fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 px-2 pb-4">
              <Link href="/settings/profile" className="header-item active flex items-center gap-3 px-4 py-3 text-base rounded-lg text-white bg-pf-primary font-medium" onClick={() => setMobileNavOpen(false)}>
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <circle cx="8" cy="5" r="3" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                </svg>
                Dades personals
              </Link>
              <Link href="/settings/security" className="header-item flex items-center gap-3 px-4 py-3 text-base rounded-lg text-white/80 hover:bg-pf-primary-l hover:text-white font-medium" onClick={() => setMobileNavOpen(false)}>
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <rect x="3" y="7" width="10" height="7" rx="2" />
                  <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round" />
                </svg>
                Contrasenya
              </Link>
              <Link href="/experiencies/meves" className="header-item flex items-center gap-3 px-4 py-3 text-base rounded-lg text-white/80 hover:bg-pf-primary-l hover:text-white font-medium" onClick={() => setMobileNavOpen(false)}>
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M2 3h12M2 7h9M2 11h6" strokeLinecap="round" />
                </svg>
                Les meves experiències
              </Link>
            </div>
          </nav>
          {/* Animation keyframes for slide down */}
          <style>{`
            @keyframes mobile-nav-slide-down {
              0% { transform: translateY(-100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .animate-mobile-nav-slide-down {
              animation: mobile-nav-slide-down 0.35s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </>
      )}
    </header>
  );
};