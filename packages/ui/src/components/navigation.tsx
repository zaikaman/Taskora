import React from "react";
import Link from "next/link";

export function Navigation() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5 transition-all">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
                    <div className="flex items-center">
                        <Link className="flex items-center gap-3 group" href="/">
                            <img
                                src="/icon-primary.png"
                                alt="Taskora logo"
                                className="h-8 w-auto object-contain shrink-0 pointer-events-none drop-shadow-[0_0_8px_rgba(20,184,166,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(20,184,166,0.8)] transition-all duration-300"
                            />
                            <span className="text-white font-extrabold tracking-tighter text-xl hidden sm:block">Taskora</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 bg-white/[0.02] px-6 py-2 rounded-full border border-white/5 shadow-inner">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                            Dashboard
                        </Link>
                        <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide">
                            Marketplace
                        </Link>
                        <Link href="/developer" className="text-gray-400 hover:text-[#14B8A6] transition-colors text-sm font-medium tracking-wide">
                            Developers
                        </Link>
                    </nav>
                    <div className="flex items-center justify-end col-start-3 gap-3">
                        <button className="hidden sm:flex relative items-center justify-center h-9 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-300 overflow-hidden group border border-white/5">
                            <span className="relative z-10">Connect Wallet</span>
                        </button>
                        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
