"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { useState } from "react";
import { monadTestnet, privyAppId, privyWagmiConfig, wagmiConfig } from "@/lib/monad";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  if (!privyAppId) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],
        loginMethods: ["wallet", "email", "google"],
        appearance: { theme: "#0b0f1a", accentColor: "#9d75cb", walletList: ["metamask", "detected_wallets", "wallet_connect"] },
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      <QueryClientProvider client={client}>
        <PrivyWagmiProvider config={privyWagmiConfig}>{children}</PrivyWagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
