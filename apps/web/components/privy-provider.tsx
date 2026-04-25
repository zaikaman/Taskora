"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import type { ReactNode } from "react";
import { privyEnv } from "../lib/privy";

const privyConfig: PrivyClientConfig = {
    loginMethods: ["email", "wallet"],
    appearance: {
        theme: "dark",
        accentColor: "#14B8A6",
        landingHeader: "Log in or sign up",
        loginMessage: "Use email or wallet to access Taskora.",
        logo: "/icon-primary.png",
        walletChainType: "ethereum-only"
    }
};

export function AppPrivyProvider({ children }: { children: ReactNode }) {
    if (!privyEnv.enabled) {
        return children;
    }

    return (
        <PrivyProvider
            appId={privyEnv.appId}
            {...(privyEnv.clientId ? { clientId: privyEnv.clientId } : {})}
            config={privyConfig}
        >
            {children}
        </PrivyProvider>
    );
}
