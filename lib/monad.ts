import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { createConfig as createPrivyConfig } from "@privy-io/wagmi";
import { monadTestnet as baseChain } from "viem/chains";
import { defineChain } from "viem";

const rpc = process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz";
export const explorerUrl = (process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://testnet.monadexplorer.com").replace(/\/$/, "");

/** Set → Privy login (email/social/embedded wallet + MetaMask). Unset → direct MetaMask connect. */
export const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export const monadTestnet = defineChain({
  ...baseChain,
  rpcUrls: { default: { http: [rpc] } },
  blockExplorers: { default: { name: "Monad Explorer", url: explorerUrl } },
});

const transports = { [monadTestnet.id]: http(rpc) };

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [injected({ target: "metaMask" })],
  transports,
  ssr: true,
});

// Privy injects its own connectors; wagmi only needs chains + transports.
export const privyWagmiConfig = createPrivyConfig({ chains: [monadTestnet], transports, ssr: true });

export const txLink = (hash: string) => `${explorerUrl}/tx/${hash}`;
export const addressLink = (addr: string) => `${explorerUrl}/address/${addr}`;
