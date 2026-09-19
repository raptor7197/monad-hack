"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import gsap from "gsap";
import { useMounted } from "@/lib/use-mounted";
import { monadTestnet, privyAppId } from "@/lib/monad";
import { isLive } from "@/lib/contracts";
import { short } from "./ui";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 px-4 md:px-6 py-3 font-display font-extrabold text-lg md:text-xl tracking-tight text-ink hover:text-brand transition-colors whitespace-nowrap"
    >
      <span className="grid h-7 w-7 place-items-center rounded bg-brand text-brand-contrast">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      </span>
      <span>FLIPGUARD</span>
    </Link>
  );
}

const pillBtn =
  "inline-flex items-center justify-center font-display font-extrabold text-xs md:text-sm uppercase tracking-tight px-4 py-2 md:px-5 md:py-2.5 bg-brand text-brand-contrast rounded-full hover:bg-brand-hover transition-colors";

function ConnectedChip({ onDisconnect }: { onDisconnect: () => void }) {
  const { address, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (chainId !== monadTestnet.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: monadTestnet.id })}
        disabled={isPending}
        className="font-display font-extrabold text-xs uppercase px-3 py-1.5 rounded-full bg-warn text-bg hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "SWITCHING…" : "SWITCH TO MONAD"}
      </button>
    );
  }

  return (
    <button
      onClick={onDisconnect}
      title="Click to disconnect"
      className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-2 font-mono text-xs text-ink hover:border-brand"
    >
      <span className="h-2 w-2 rounded-full bg-safe" />
      <span>{short(address)}</span>
      <span className="hidden text-[10px] text-muted group-hover:inline">✕</span>
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
      <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className={pillBtn}>
        INSTALL WALLET
      </a>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={() => connect({ connector: connectors[0], chainId: monadTestnet.id })}
        disabled={isPending}
        className={pillBtn}
      >
        {isPending ? "CONNECTING…" : "CONNECT WALLET"}
      </button>
      {error && <span className="mt-1 max-w-44 text-right text-[10px] text-threat">{error.message.split("\n")[0]}</span>}
    </div>
  );
}

function PrivyButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { isConnected } = useAccount();

  if (!ready) return <div className="h-8 w-28 animate-pulse rounded-full bg-surface-3" />;
  if (authenticated && isConnected) return <ConnectedChip onDisconnect={logout} />;

  return (
    <button onClick={login} className={pillBtn}>
      {authenticated ? "LOADING…" : "SIGN IN"}
    </button>
  );
}

export function WalletButton() {
  const mounted = useMounted();
  if (!mounted) return <div className="h-8 w-28 rounded-full bg-surface-3" />;
  return privyAppId ? <PrivyButton /> : <MetaMaskButton />;
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileRef.current) return;
    if (mobileOpen) {
      gsap.fromTo(mobileRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(mobileRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur-md">
      {/* Dahl segmented navigation grid */}
      <div className="mx-auto flex w-full max-w-[1440px] items-stretch justify-between">
        <div className="flex items-stretch border-r border-border">
          <Logo />
        </div>

        {/* Desktop segmented links */}
        <nav className="hidden items-stretch xl:flex flex-1">
          <Link
            href="/#proposals"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            PROPOSALS
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            PROTECTION LOG
          </Link>
          <Link
            href="/#calculator"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            SIMULATOR
          </Link>
          <Link
            href="/#approach"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            APPROACH
          </Link>
          <Link
            href="/#faq"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/slides"
            className="flex items-center px-6 border-r border-border font-display font-extrabold text-sm uppercase tracking-tight text-brand hover:text-brand-hover hover:bg-surface-2 transition-colors"
          >
            DECK ↗
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-2.5">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
            <span className={`h-2 w-2 rounded-full ${isLive ? "bg-safe pulse-dot" : "bg-warn"}`} />
            <span>{isLive ? "MONAD TESTNET" : "DEMO PREVIEW"}</span>
          </div>

          <Link
            href="/proposals/1"
            className="hidden md:inline-flex items-center justify-center font-display font-extrabold text-xs uppercase px-3 py-2 border border-border hover:border-brand rounded-full text-muted hover:text-ink transition-colors"
          >
            TRY DEMO →
          </Link>

          <WalletButton />

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="xl:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink hover:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div ref={mobileRef} className="overflow-hidden border-t border-border bg-surface xl:hidden" style={{ height: 0, opacity: 0 }}>
        <div className="flex flex-col divide-y divide-border px-6 py-4">
          <Link
            href="/#proposals"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-ink hover:text-brand"
          >
            PROPOSALS
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-ink hover:text-brand"
          >
            PROTECTION LOG
          </Link>
          <Link
            href="/#calculator"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-ink hover:text-brand"
          >
            SIMULATOR
          </Link>
          <Link
            href="/#approach"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-ink hover:text-brand"
          >
            APPROACH
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-ink hover:text-brand"
          >
            FAQ
          </Link>
          <Link
            href="/slides"
            onClick={() => setMobileOpen(false)}
            className="py-3 font-display font-extrabold text-base uppercase tracking-tight text-brand hover:text-brand-hover"
          >
            PRESENTATION DECK (PPT) ↗
          </Link>
          <div className="pt-4 flex items-center justify-between">
            <span className="font-mono text-xs text-muted">Chain ID: 10143 (Monad)</span>
            <Link
              href="/proposals/1"
              onClick={() => setMobileOpen(false)}
              className="font-display font-extrabold text-xs uppercase text-brand"
            >
              Demo Proposal →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
