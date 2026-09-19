"use client";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useMounted } from "@/lib/use-mounted";
import { monadTestnet, privyAppId } from "@/lib/monad";
import { isLive } from "@/lib/contracts";
import { short } from "./ui";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-cyan shadow-[0_0_20px_-4px] shadow-violet">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">FlipGuard</span>
    </Link>
  );
}

const primaryBtn = "btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60";

/** Shared once a wallet is connected: wrong-network prompt or address chip. */
function ConnectedChip({ onDisconnect }: { onDisconnect: () => void }) {
  const { address, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  if (chainId !== monadTestnet.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: monadTestnet.id })}
        disabled={isPending}
        className="rounded-lg bg-warn px-4 py-2 text-sm font-semibold text-bg disabled:opacity-60"
      >
        {isPending ? "Switching…" : "Switch to Monad Testnet"}
      </button>
    );
  }
  return (
    <button
      onClick={onDisconnect}
      title="Disconnect"
      className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 font-mono text-sm hover:border-violet/60"
    >
      <span className="h-2 w-2 rounded-full bg-safe" /> {short(address)}
    </button>
  );
}

function MetaMaskButton() {
  const { isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const hasMetaMask = typeof window !== "undefined" && Boolean((window as { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask);

  if (isConnected) return <ConnectedChip onDisconnect={() => disconnect()} />;
  if (!hasMetaMask) {
    return (
      <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className={primaryBtn}>
        Install MetaMask
      </a>
    );
  }
  return (
    <div className="flex flex-col items-end">
      <button onClick={() => connect({ connector: connectors[0], chainId: monadTestnet.id })} disabled={isPending} className={primaryBtn}>
        {isPending ? "Check MetaMask…" : "Connect MetaMask"}
      </button>
      {error && <span className="mt-1 max-w-56 text-right text-[11px] text-threat">{error.message.split("\n")[0]}</span>}
    </div>
  );
}

function PrivyButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { isConnected } = useAccount();
  if (!ready) return <div className="h-9 w-36 animate-pulse rounded-lg bg-white/5" />;
  if (authenticated && isConnected) return <ConnectedChip onDisconnect={logout} />;
  return (
    <button onClick={login} className={primaryBtn}>
      {authenticated ? "Loading wallet…" : "Log in"}
    </button>
  );
}

export function WalletButton() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-9 w-36 rounded-lg bg-white/5" />;
  return privyAppId ? <PrivyButton /> : <MetaMaskButton />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden gap-5 text-sm text-dim sm:flex">
            <Link href="/" className="hover:text-ink">Proposals</Link>
            <Link href="/dashboard" className="hover:text-ink">Protection log</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-dim md:flex">
            <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${isLive ? "bg-cyan" : "bg-warn"}`} />
            {isLive ? "Monad Testnet · 10143" : "Demo Preview · no contract configured"}
          </span>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
