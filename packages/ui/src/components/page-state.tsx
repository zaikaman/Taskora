import React, { type ReactNode } from "react";

export interface PageStateProps {
    isLoading?: boolean;
    error?: Error | null;
    children: ReactNode;
    loadingFallback?: ReactNode;
    errorFallback?: ReactNode;
}

export function PageState(props: PageStateProps) {
    const {
        isLoading,
        error,
        children,
        loadingFallback = <div>Loading...</div>,
        errorFallback,
    } = props;

    if (error) {
        if (errorFallback) {
            return <>{errorFallback}</>;
        }
        return (
            <div className="relative overflow-hidden p-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-500 font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">SYSTEM ERROR</h2>
                </div>
                <div className="pl-14">
                    <p className="text-gray-400 text-sm font-mono">{error.message || "An unexpected termination occurred during execution."}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        if (loadingFallback) {
            return <>{loadingFallback}</>;
        }
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[40vh]">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-[#14B8A6] rounded-full border-t-transparent border-l-transparent animate-spin"></div>
                    <div className="w-2 h-2 bg-[#14B8A6] rounded-full animate-pulse shadow-[0_0_10px_#14B8A6]"></div>
                </div>
                <p className="mt-6 text-sm text-gray-500 font-mono tracking-widest uppercase animate-pulse">Initializing Protocol...</p>
            </div>
        );
    }

    return <>{children}</>;
}
