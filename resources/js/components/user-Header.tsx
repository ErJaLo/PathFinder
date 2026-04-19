import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { UserDropdown } from '@/components/user-dropdown';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { User } from '@/types/auth';


type UserHeaderProps = {
  user: User;
};



export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { auth } = usePage().props;
  
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const { theme, toggleTheme } = useTheme();
  const { isCurrentUrl } = useCurrentUrl();

  return (
    <header className="header w-full bg-pf-text dark:bg-pf-bg-dark text-white flex items-center justify-between px-4 md:px-6 h-16 sticky top-0 z-50 border-b border-pf-primary/20">
      <div className="header-logo flex items-center gap-3">
        <Link href="/" className="flex-shrink-0">
          <img
            src="/img/Logo_petit(1).jpg"
            alt="PathFinder"
            className="h-10 w-25 rounded-lg object-cover"
          />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="header-nav hidden xl:flex items-center gap-2">
        <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">El meu perfil</span>
        <Link
          href="/settings/profile"
          className={`header-item flex items-center gap-2 px-4 py-2 rounded-md ${isCurrentUrl('/llocs') ? 'text-white bg-pf-primary' : 'text-white/70 hover:bg-pf-primary-l hover:text-white'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          </svg>
          Dades personals
        </Link>
        <Link
          href="/settings/security"
          className={`header-item flex items-center gap-2 px-4 py-2 rounded-md ${isCurrentUrl('/settings/security') ? 'text-white bg-pf-primary' : 'text-white/70 hover:bg-pf-primary-l hover:text-white'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <rect x="3" y="7" width="10" height="7" rx="2" />
            <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round" />
          </svg>
          Contrasenya
        </Link>
        <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">Contingut</span>
        <Link
          href="/settings/experiences"
          className={`header-item flex items-center gap-2 px-4 py-2 rounded-md ${isCurrentUrl('/settings/experiences') ? 'text-white bg-pf-primary' : 'text-white/70 hover:bg-pf-primary-l hover:text-white'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M2 3h12M2 7h9M2 11h6" strokeLinecap="round" />
          </svg>
          Les meves experiències
        </Link>
      </nav>

      {/* Mobile menu toggle */}


      <div className="header-right flex items-center gap-4">
        <button
          className="ml-4 p-3 rounded-full bg-pf-primary-ldark hover:bg-pf-primary-dark/20 border border-pf-border-dark transition"
          onClick={toggleTheme}
          title="Cambiar tema"
        >
          {theme === 'dark'
            ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
            : <HiOutlineMoon className="w-6 h-6 text-pf-primary-dark" />}
        </button>
        <div className="header-user flex items-center">
          {user.img ? (
            <UserDropdown user={user} initials={<img src={`/storage/${user.img}`} alt="Perfil" className="h-full w-full rounded-full object-cover" />} />
          ) : (
            <UserDropdown user={user} initials={initials} />
          )}
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
        </>
      )}
    </header>
  );
};