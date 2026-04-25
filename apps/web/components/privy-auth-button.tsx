"use client";

import { usePrivy } from "@privy-io/react-auth";
import { privyEnv } from "../lib/privy";

type PrivyAuthButtonProps = {
    variant?: "hero" | "shell";
};

type UserLike = {
    email?: { address: string };
    wallet?: { address: string };
};

const loginOptions: {
    loginMethods: Array<"email" | "wallet">;
    walletChainType: "ethereum-only";
} = {
    loginMethods: ["email", "wallet"],
    walletChainType: "ethereum-only"
};

export function PrivyAuthButton({ variant = "hero" }: PrivyAuthButtonProps) {
    if (!privyEnv.enabled) {
        return (
            <button
                disabled
                title="Set NEXT_PUBLIC_PRIVY_APP_ID to enable Privy authentication."
                className={getLoginButtonClasses(variant, true)}
            >
                Sign in
            </button>
        );
    }

    return <PrivyAuthButtonInner variant={variant} />;
}

function PrivyAuthButtonInner({ variant = "hero" }: PrivyAuthButtonProps) {
    const { authenticated, login, logout, ready, user } = usePrivy();

    if (!ready) {
        return (
            <button disabled className={getLoginButtonClasses(variant, true)}>
                Loading...
            </button>
        );
    }

    if (!authenticated) {
        return (
            <button
                type="button"
                onClick={() => login(loginOptions)}
                className={getLoginButtonClasses(variant, false)}
            >
                Sign in
            </button>
        );
    }

    return (
        <div className="hidden sm:flex items-center gap-2">
            <div className={getUserPillClasses(variant)}>{getUserLabel(user)}</div>
            <button
                type="button"
                onClick={() => {
                    void logout();
                }}
                className={getLogoutButtonClasses(variant)}
            >
                Sign out
            </button>
        </div>
    );
}

function getUserLabel(user: UserLike | null) {
    if (user?.email?.address) {
        return user.email.address;
    }

    if (user?.wallet?.address) {
        return shortenAddress(user.wallet.address);
    }

    return "Signed in";
}

function shortenAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getLoginButtonClasses(variant: "hero" | "shell", disabled: boolean) {
    if (variant === "shell") {
        return `hidden sm:flex relative items-center justify-center h-9 px-6 rounded-full border text-sm font-medium transition-all duration-300 ${
            disabled
                ? "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/20 text-white border-white/5"
        }`;
    }

    return `flex items-center px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
        disabled
            ? "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"
            : "bg-white/10 border-white/10 text-white hover:bg-white/15"
    }`;
}

function getUserPillClasses(variant: "hero" | "shell") {
    if (variant === "shell") {
        return "hidden sm:flex items-center h-9 max-w-[220px] px-4 rounded-full border border-white/10 bg-white/5 text-sm text-gray-200 truncate";
    }

    return "hidden sm:flex items-center h-8 max-w-[220px] px-3 rounded-full border border-white/10 bg-white/5 text-sm text-gray-200 truncate";
}

function getLogoutButtonClasses(variant: "hero" | "shell") {
    if (variant === "shell") {
        return "hidden sm:flex items-center h-9 px-4 rounded-full border border-white/10 bg-transparent text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors";
    }

    return "hidden sm:flex items-center h-8 px-3 rounded-full border border-white/10 bg-transparent text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors";
}
