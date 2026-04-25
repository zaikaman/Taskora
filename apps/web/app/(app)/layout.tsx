import React from "react";
import { AppShell } from "@taskora/ui/components/app-shell";
import { PrivyAuthButton } from "../../components/privy-auth-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell headerActions={<PrivyAuthButton variant="shell" />}>
            {children}
        </AppShell>
    );
}
