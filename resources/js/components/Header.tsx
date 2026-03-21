

import React, { useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Placeholder, implementa segons el teu setup

    const handleToggleMenu = () => setMobileOpen((v) => !v);
    const handleCloseMenu = () => setMobileOpen(false);
    const handleToggleTheme = () => setDarkMode((v) => !v); // Placeholder

    return (
        <nav className="bg-white shadow-sm border-b border-blue-100 fixed w-full z-30">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3 font-playfair text-2xl font-bold text-blue-800">
                    <img src="/img/Logo_petit.png" alt="PathFinder Logo" className="w-11 h-11 rounded-lg object-cover" />
                    PathFinder
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="nav-link text-blue-700 bg-blue-100 font-semibold rounded-lg px-4 py-2 text-base transition">Inicio</button>
                    <button className="nav-link text-blue-900 hover:text-blue-700 rounded-lg px-4 py-2 text-base transition">Explorar</button>
                    <button className="nav-link text-blue-900 hover:text-blue-700 rounded-lg px-4 py-2 text-base transition">Mapas</button>
                </div>

                {/* Desktop CTA & theme toggle */}
                <div className="hidden md:flex items-center gap-3">
                    {/* <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-4 py-1 shadow transition">+ Publicar</button> */}
                    <button className="btn-ghost border border-blue-200 text-blue-700 font-medium rounded-full px-5 py-2 text-base transition hover:bg-blue-50 hover:border-blue-500 hover:text-blue-800">Login</button>
                    <button className="btn-primary bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-full px-5 py-2 text-base transition">Sign in</button>
                    <button className="ml-2 p-3 rounded-full bg-blue-50 hover:bg-blue-200 transition" onClick={handleToggleTheme} title="Cambiar tema">
                        {darkMode
                            ? <HiOutlineSun className="w-6 h-6 text-blue-700" />
                            : <HiOutlineMoon className="w-6 h-6 text-blue-700" />}
                    </button>
                </div>

                {/* Hamburger (mobile only) */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-expanded={mobileOpen}
                    aria-label="Abrir menú"
                    onClick={handleToggleMenu}
                >
                    <span className={`block w-6 h-0.5 bg-blue-800 mb-1 transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`block w-6 h-0.5 bg-blue-800 mb-1 transition-opacity ${mobileOpen ? "opacity-0" : ""}`}></span>
                    <span className={`block w-6 h-0.5 bg-blue-800 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={handleCloseMenu}
                aria-hidden={!mobileOpen}
            />
            <div
                className={`fixed top-0 left-0 w-full max-w-full h-fit bg-white shadow-lg z-50 transition-all duration-300 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}
                style={{ borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}
                role="navigation"
                aria-label="Menú móvil"
            >
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <a href="/" className="flex items-center gap-2 font-playfair text-xl font-bold text-blue-800">
                            <img src="/img/Logo_petit.png" alt="PathFinder Logo" className="w-9 h-9 rounded-lg object-cover" />
                            PathFinder
                        </a>
                        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-200 text-blue-700 text-2xl" onClick={handleCloseMenu} aria-label="Tancar menú">
                            ×
                        </button>
                    </div>
                    <div className="px-4 flex flex-col gap-3 pb-4">


                        {/* Nav links */}
                        <button className="mobile-nav-link text-blue-700 font-semibold rounded-lg px-3 py-2 bg-blue-100 text-base" onClick={handleCloseMenu}>Inicio</button>
                        <button className="mobile-nav-link text-blue-900 rounded-lg px-3 py-2 hover:bg-blue-50 text-base" onClick={handleCloseMenu}>Explorar</button>
                        <button className="mobile-nav-link text-blue-900 rounded-lg px-3 py-2 hover:bg-blue-50 text-base" onClick={handleCloseMenu}>Mapas</button>
                    </div>
                    <div className="px-4 pb-4 flex gap-2">
                        <button className="btn-ghost flex-1 border border-blue-200 text-blue-700 font-medium rounded-full px-4 py-2 text-base transition hover:bg-blue-50 hover:border-blue-500 hover:text-blue-800" onClick={handleCloseMenu}>Login</button>
                        <button className="btn-primary flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-full px-4 py-2 text-base transition" onClick={handleCloseMenu}>Sign in</button>
                        <button className="p-3 rounded-full bg-blue-50 hover:bg-blue-200 transition" onClick={() => {
                            handleToggleTheme(); handleCloseMenu();
                        }} title="Cambiar tema">
                            {darkMode ? <HiOutlineSun className="w-6 h-6 text-blue-700" /> : <HiOutlineMoon className="w-6 h-6 text-blue-700" />}
                        </button>
                    </div>
                </div>
        </nav>
    );
}

export default Header;

