import { Link, useForm } from '@inertiajs/react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { route } from 'ziggy-js';
import { UserDropdown } from '@/components/user-dropdown';
import { useTheme } from '@/context/ThemeContext';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { User } from '@/types/auth';


type UserHeaderProps = {
  user: User;
};



export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);
  const logoutForm = useForm();
  
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const { theme, toggleTheme } = useTheme();
  const { isCurrentUrl } = useCurrentUrl();

  return (
    <header className="sticky top-0 z-50 border-b border-pf-border bg-pf-surface/90 backdrop-blur-sm dark:border-pf-border-dark dark:bg-pf-surface-dark/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
        <Link href="/" className="shrink-0">
          <img
            src="/img/Logo_petit(1).jpg"
            alt="PathFinder"
            className="h-9 w-24 rounded-lg object-cover md:h-10 md:w-25"
          />
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 xl:flex">
        {/* <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">El meu perfil</span> */}
        <Link
          href="/settings/profile"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isCurrentUrl('/settings/profile') ? 'bg-pf-primary-l text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark' : 'text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          </svg>
          Dades personals
        </Link>
        <Link
          href="/settings/security"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isCurrentUrl('/settings/security') ? 'bg-pf-primary-l text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark' : 'text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="3" y="7" width="10" height="7" rx="2" />
            <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round" />
          </svg>
          Contrasenya
        </Link>
        {/* <span className="header-section text-xs uppercase tracking-wider text-white/40 px-3">Contingut</span> */}
        <Link
          href="/settings/experiences"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isCurrentUrl('/settings/experiences') ? 'bg-pf-primary-l text-pf-primary dark:bg-pf-primary-ldark dark:text-pf-primary-dark' : 'text-pf-text-2 hover:bg-pf-primary-l hover:text-pf-primary dark:text-pf-text-2dark dark:hover:bg-pf-primary-ldark dark:hover:text-pf-primary-dark'}`}
        >
          <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M2 3h12M2 7h9M2 11h6" strokeLinecap="round" />
          </svg>
          Les meves experiències
        </Link>
      </nav>

      {/* Mobile menu toggle */}

      <div className="flex items-center gap-2">
        <div className="hidden items-center md:flex">
          {user.img ? (
            <UserDropdown user={user} initials={<img src={`/storage/${user.img}`} alt="Perfil" className="h-full w-full rounded-full object-cover" />} />
          ) : (
            <UserDropdown user={user} initials={initials} />
          )}
        </div>
        <button
          className="ml-4 hidden h-10 w-10 items-center justify-center rounded-full border border-pf-border bg-pf-primary-l transition hover:bg-pf-primary/10 md:flex dark:border-pf-border-dark dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20"
          onClick={toggleTheme}
          title="Cambiar tema"
        >
          {theme === 'dark'
            ? <HiOutlineSun className="w-6 h-6 text-pf-primary-dark" />
            : <HiOutlineMoon className="w-6 h-6 text-pf-primary" />}
        </button>
        
        {/* Mobile menu toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-pf-border text-pf-text transition-colors hover:bg-pf-primary-l md:hidden dark:border-pf-border-dark dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
          aria-label="Menú"
          onClick={() => {
            setMobileNavOpen((open) => {
              const nextOpen = !open;
              setMobileUserMenuOpen(nextOpen);

              return nextOpen;
            });
          }}
          aria-expanded={mobileNavOpen}
          type="button"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>


      </div>

      {/* Mobile nav  */}
      {mobileNavOpen && (
        <>
          {/* Overlay  */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => {
              setMobileNavOpen(false);
              setMobileUserMenuOpen(false);
            }}
            aria-label="Tancar menú"
          />
          <div className="fixed inset-x-0 top-0 z-50 max-h-screen overflow-y-auto border-b border-pf-border bg-pf-surface shadow-lg md:hidden dark:border-pf-border-dark dark:bg-pf-surface-dark">
            <div className="flex shrink-0 items-center justify-between border-b border-pf-border px-4 py-3 dark:border-pf-border-dark">
              <Link href="/" className="shrink-0" onClick={() => setMobileNavOpen(false)}>
                <img
                  src="/img/Logo_petit(1).jpg"
                  alt="PathFinder"
                  className="h-9 w-24 rounded-lg object-cover"
                />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-pf-border text-pf-text transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                  aria-label="Tancar menú"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setMobileUserMenuOpen(false);
                  }}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-1">
              <Link
                href="/settings/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                onClick={() => {
                  setMobileNavOpen(false);
                  setMobileUserMenuOpen(false);
                }}
              >
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <circle cx="8" cy="5" r="3" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                </svg>
                Dades personals
              </Link>
              <Link
                href="/settings/security"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                onClick={() => {
                  setMobileNavOpen(false);
                  setMobileUserMenuOpen(false);
                }}
              >
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <rect x="3" y="7" width="10" height="7" rx="2" />
                  <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round" />
                </svg>
                Contrasenya
              </Link>
              <Link
                href="/settings/experiences"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                onClick={() => {
                  setMobileNavOpen(false);
                  setMobileUserMenuOpen(false);
                }}
              >
                <svg fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path d="M2 3h12M2 7h9M2 11h6" strokeLinecap="round" />
                </svg>
                Les meves experiències
              </Link>

              <div className="mt-2 flex items-stretch gap-2 border-t border-pf-border pt-3 dark:border-pf-border-dark">
                <button
                  type="button"
                  onClick={() => setMobileUserMenuOpen((prev) => !prev)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-pf-border px-3 py-2 text-left transition-colors hover:bg-pf-primary-l dark:border-pf-border-dark dark:hover:bg-pf-primary-ldark"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-pf-surface-2 dark:bg-pf-surface-2dark">
                    {user.img || user.avatar ? (
                      <img
                        src={user.img ? `/storage/${user.img}` : user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-pf-text dark:text-pf-text-dark">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-pf-text-3 dark:text-pf-text-3dark">
                      {user.email}
                    </p>
                  </div>
                  {mobileUserMenuOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-pf-text-3 dark:text-pf-text-3dark" />
                  )}
                </button>

                <button
                  className="flex h-auto w-12 shrink-0 items-center justify-center rounded-full border border-pf-border bg-pf-primary-l transition hover:bg-pf-primary/10 dark:border-pf-border-dark dark:bg-pf-primary-ldark dark:hover:bg-pf-primary-dark/20"
                  onClick={toggleTheme}
                  title="Cambiar tema"
                >
                  {theme === 'dark'
                    ? <HiOutlineSun className="h-6 w-6 text-pf-primary-dark" />
                    : <HiOutlineMoon className="h-6 w-6 text-pf-primary" />}
                </button>
              </div>

              {mobileUserMenuOpen && (
                <div className="mt-2 flex flex-col gap-1 rounded-xl border border-pf-border p-2 dark:border-pf-border-dark">
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <Link
                      href="/admin"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                      onClick={() => {
                        setMobileNavOpen(false);
                        setMobileUserMenuOpen(false);
                      }}
                    >
                      Administrar web
                    </Link>
                  )}
                  <button
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-pf-text transition-colors hover:bg-pf-primary-l dark:text-pf-text-dark dark:hover:bg-pf-primary-ldark"
                    onClick={() => {
                      logoutForm.post(route('logout'));
                      setMobileNavOpen(false);
                      setMobileUserMenuOpen(false);
                    }}
                  >
                    Tancar sessió
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </header>
  );
};