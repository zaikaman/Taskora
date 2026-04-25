export const privyEnv = {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
    clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? "",
    enabled: Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID)
} as const;
