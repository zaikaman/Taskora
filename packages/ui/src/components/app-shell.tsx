import React, { type ReactNode } from "react";
import { Navigation } from "./navigation";

export interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen flex flex-col relative bg-[#050505] text-white font-sans overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[#14B8A6]/5 blur-[120px] rounded-full mix-blend-screen opacity-50 backdrop-blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] bg-[#3B82F6]/5 blur-[100px] rounded-full mix-blend-screen opacity-50 backdrop-blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-32 pb-16 relative">
                    <div className="absolute top-32 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14B8A6]/20 to-transparent"></div>
                    {children}
                </main>
            </div>
        </div>
    );
}
