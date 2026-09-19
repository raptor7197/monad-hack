"use client";

import { useEffect } from "react";
import Link from "next/link";
import ReactLenis from "lenis/react";
import { StickyCard002, CardData } from "@/components/sticky-cards";
import { governance } from "@/lib/contracts";
import { addressLink } from "@/lib/monad";

const deckCards: CardData[] = [
  {
    id: "pillar-1",
    tag: "PILLAR 01",
    subtitle: "Checkpoint Verification",
    title: "Checkpointed Snapshot Power",
    description:
      "Vote weight is strictly computed from checkpointed token balances at the exact moment of proposal creation. Any tokens transferred or purchased after the snapshot count for zero weight.",
    metric: "100%",
    metricLabel: "Checkpointed Weight",
  },
  {
    id: "pillar-2",
    tag: "PILLAR 02",
    subtitle: "Time-Weighted Defense",
    title: "Minimum Holding Period",
    description:
      "Tokens that arrived into a wallet within the minimum holding period window before proposal creation are automatically disqualified. Flash loans and borrowed power cannot swing results.",
    metric: "0 FLASH",
    metricLabel: "Power Permitted",
  },
  {
    id: "pillar-3",
    tag: "PILLAR 03",
    subtitle: "Sybil & Loan Forensics",
    title: "Real-Time Risk Registry",
    description:
      "Authorized decentralized monitors inspect onchain liquidity signals. Known loan borrowers and sybil attack clusters are flagged in MockRiskRegistry, triggering contract-level rejections.",
    metric: "REALTIME",
    metricLabel: "Threat Detection",
  },
  {
    id: "pillar-4",
    tag: "PILLAR 04",
    subtitle: "Gas-Safe Preflight",
    title: "assessVoter() Simulation",
    description:
      "Before a voter ever broadcasts a transaction, FlipGuard simulates the vote against the Monad RPC. If ineligible, the UI halts and explains the exact reason without wasting gas.",
    metric: "< 0.001 MON",
    metricLabel: "Zero Wasted Gas",
  },
  {
    id: "pillar-5",
    tag: "PILLAR 05",
    subtitle: "High Throughput",
    title: "Native Monad Execution",
    description:
      "Built for Monad's parallel execution engine with 10,000 TPS and 1-second block times. Gas limits are explicitly budgeted to match Monad's gas-limit fee model.",
    metric: "10,000 TPS",
    metricLabel: "Monad Performance",
  },
];

export default function SlidesPage() {
  const contractAddr = governance.address || "0x9c368D5bA4F5b5d18d407817D5eA0A4815a5E3A7";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ReactLenis root>
      <div className="w-full bg-bg text-ink relative selection:bg-brand selection:text-brand-contrast">
        {/* Floating Top Presentation Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-bg/90 backdrop-blur-md px-6 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-extrabold text-sm uppercase text-muted hover:text-ink transition-colors"
            >
              ← <span className="hidden sm:inline">EXIT TO FLIPGUARD APP</span>
            </Link>
            <span className="h-4 w-px bg-border hidden sm:block" />
            <span className="font-mono text-xs text-brand uppercase tracking-wider hidden md:inline">
              MONAD BLITZ PRESENTATION DECK
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted uppercase hidden sm:inline">
              USE ↓ / ↑ TO NAVIGATE
            </span>
            <Link
              href="/proposals/1"
              className="font-display font-extrabold text-xs uppercase px-4 py-2 rounded-full bg-brand text-brand-contrast hover:bg-brand-hover transition-colors whitespace-nowrap"
            >
              LIVE DEMO →
            </Link>
          </div>
        </header>

        {/* ========================================================
            SLIDE 1: Title Slide (Full Page 100vh)
            ======================================================== */}
        <section
          id="slide-1"
          className="relative min-h-screen w-full flex flex-col justify-between border-b border-border px-6 md:px-16 pt-28 pb-12 overflow-hidden bg-bg"
        >
          <div className="my-auto max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs uppercase text-brand mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand pulse-dot" />
              SLIDE 01 · EXECUTIVE SUMMARY
            </div>

            <h1
              className="font-display font-extrabold uppercase leading-[0.84] tracking-[-0.06em] text-ink"
              style={{ fontSize: "clamp(48px, 10vw, 130px)" }}
            >
              FLIPGUARD
            </h1>

            <p className="mt-6 font-display font-bold uppercase text-brand tracking-tight text-xl sm:text-2xl md:text-4xl">
              Fair votes. Stronger governance.
            </p>

            <p className="mt-6 max-w-2xl text-muted text-base md:text-xl leading-relaxed">
              An onchain governance security layer on Monad Testnet that prevents flash-loan voting power grabs,
              enforces holding periods, and blocks sybil exploiters before transactions land.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs">
              <span className="px-4 py-2 rounded-xl border border-border bg-surface-2 text-ink">
                CHAIN: MONAD TESTNET (10143)
              </span>
              <span className="px-4 py-2 rounded-xl border border-border bg-surface-2 text-ink">
                BUILT FOR: MONAD BLITZ MUMBAI
              </span>
              <span className="px-4 py-2 rounded-xl border border-border bg-surface-2 text-ink">
                TARGET: DAO TREASURIES & PROTOCOLS
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6 font-mono text-xs text-muted">
            <span>FlipGuard Presentation</span>
            <span className="text-brand animate-bounce">Scroll Down to Pillars Stack ↓</span>
          </div>
        </section>

        {/* ========================================================
            SLIDE 2: THE 5 PILLARS (All in one place, continuous scrolling)
            ======================================================== */}
        <section id="slide-pillars" className="relative w-full border-b border-border bg-bg">
          {/* Clear fixed header height */}
          <div className="h-[72px]" />
          <StickyCard002
            cards={deckCards}
            headerTitle="5 PILLARS OF FLIPGUARD"
            headerSubtitle="CONTINUOUS SCROLLING DEFENSE STACK"
          />
        </section>

        {/* ========================================================
            SLIDE 3: The Threat (Down below pillars)
            ======================================================== */}
        <section
          id="slide-threat"
          className="relative min-h-screen w-full flex flex-col justify-between border-b border-border bg-surface px-6 md:px-16 pt-24 pb-28 overflow-hidden"
        >
          <div className="my-auto max-w-6xl">
            <p className="font-mono text-xs uppercase text-threat tracking-widest mb-3">
              SLIDE 03 · THE ATTACK VECTOR
            </p>
            <h2
              className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-ink"
              style={{ fontSize: "clamp(34px, 5.5vw, 80px)" }}
            >
              THE FLASH-LOAN GOVERNANCE EXPLOIT
            </h2>
            <p className="mt-6 text-muted text-base md:text-xl max-w-3xl leading-relaxed">
              Standard ERC20 governance tokens only check the current block balance or unshielded snapshots.
              Attackers borrow millions in liquidity, vote on malicious proposals, and repay the loan in a single transaction.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border-2 border-border bg-surface-2 p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-threat font-bold">STAGE 01</span>
                  <h3 className="mt-3 font-display font-extrabold text-xl uppercase text-ink">
                    Instant Borrowing
                  </h3>
                  <p className="mt-3 text-muted text-sm leading-relaxed">
                    Attacker borrows 10,000,000+ governance tokens from a lending pool or DEX flash loan for near-zero upfront capital.
                  </p>
                </div>
                <div className="mt-6 font-mono text-xs text-threat bg-threat/10 p-3 rounded-xl border border-threat/20">
                  Risk: Uncollateralized voting power
                </div>
              </div>

              <div className="rounded-3xl border-2 border-border bg-surface-2 p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-threat font-bold">STAGE 02</span>
                  <h3 className="mt-3 font-display font-extrabold text-xl uppercase text-ink">
                    Snapshot Hijack
                  </h3>
                  <p className="mt-3 text-muted text-sm leading-relaxed">
                    Tokens arrive seconds before a proposal snapshot or are cast directly on an unprotected Governor contract.
                  </p>
                </div>
                <div className="mt-6 font-mono text-xs text-threat bg-threat/10 p-3 rounded-xl border border-threat/20">
                  Risk: Quorum artificially swayed
                </div>
              </div>

              <div className="rounded-3xl border-2 border-border bg-surface-2 p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-threat font-bold">STAGE 03</span>
                  <h3 className="mt-3 font-display font-extrabold text-xl uppercase text-ink">
                    Treasury Drain
                  </h3>
                  <p className="mt-3 text-muted text-sm leading-relaxed">
                    Malicious proposal executes to transfer DAO treasury funds, then attacker repays the loan and keeps the stolen capital.
                  </p>
                </div>
                <div className="mt-6 font-mono text-xs text-threat bg-threat/10 p-3 rounded-xl border border-threat/20">
                  Outcome: Irreversible treasury loss
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6 font-mono text-xs text-muted">
            <span>Slide 03 / 05</span>
            <span>Scroll Down to Contract Logic ↓</span>
          </div>
        </section>

        {/* ========================================================
            SLIDE 4: Architecture & Flow (Down below)
            ======================================================== */}
        <section
          id="slide-logic"
          className="relative min-h-screen w-full flex flex-col justify-between border-b border-border bg-bg px-6 md:px-16 pt-24 pb-28 overflow-hidden"
        >
          <div className="my-auto max-w-6xl">
            <p className="font-mono text-xs uppercase text-brand tracking-widest mb-3">
              SLIDE 04 · ONCHAIN CONTRACT LOGIC
            </p>
            <h2
              className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-ink"
              style={{ fontSize: "clamp(34px, 5.5vw, 80px)" }}
            >
              HOW FLIPGUARD GUARDS THE VOTE
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Preflight Query",
                  code: "assessVoter(id, voter)",
                  desc: "RPC view call evaluates holding duration and registry flag. Rejects invalid attempts before gas is consumed.",
                },
                {
                  step: "02",
                  title: "Snapshot Balance",
                  code: "getPastVotes(voter, snap)",
                  desc: "Retrieves checkpointed weight at the exact proposal creation block. Future purchases have zero voting power.",
                },
                {
                  step: "03",
                  title: "Holding Window",
                  code: "snap - holdingPeriod",
                  desc: "Checks historical balance before the holding threshold. Wallets acquiring power inside the window are blocked.",
                },
                {
                  step: "04",
                  title: "Risk Registry",
                  code: "registry.isFlagged(voter)",
                  desc: "If an authorized monitor flagged the address for borrowing anomalies, castVote() reverts immediately.",
                },
              ].map((s) => (
                <div key={s.step} className="rounded-3xl border border-border bg-surface-2 p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <span className="font-display font-extrabold text-2xl text-brand">{s.step}</span>
                    <h3 className="mt-2 font-display font-extrabold text-lg uppercase text-ink">{s.title}</h3>
                    <code className="mt-2 block font-mono text-[11px] text-accent bg-surface-3 p-2 rounded-lg">
                      {s.code}
                    </code>
                    <p className="mt-3 text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-safe">
                    <span>✓ ENFORCED ONCHAIN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6 font-mono text-xs text-muted">
            <span>Slide 04 / 05</span>
            <span>Scroll Down to Deployment & Links ↓</span>
          </div>
        </section>

        {/* ========================================================
            SLIDE 5: Production Readiness & Deployment
            ======================================================== */}
        <section
          id="slide-deployed"
          className="relative min-h-screen w-full flex flex-col justify-between bg-surface px-6 md:px-16 pt-24 pb-28 overflow-hidden"
        >
          <div className="my-auto max-w-5xl">
            <p className="font-mono text-xs uppercase text-brand tracking-widest mb-3">
              SLIDE 05 · PRODUCTION READINESS
            </p>
            <h2
              className="font-display font-extrabold uppercase leading-[0.84] tracking-[-0.06em] text-ink"
              style={{ fontSize: "clamp(38px, 7vw, 100px)" }}
            >
              DEPLOYED ON MONAD TESTNET
            </h2>

            <p className="mt-6 text-muted text-base md:text-xl max-w-2xl leading-relaxed">
              Fully compiled, deployed, and verified with live mock DAO ballots, onchain tallies, and deterministic voter preflight simulations.
            </p>

            <div className="mt-8 rounded-2xl border-2 border-border bg-surface-2 p-5 max-w-2xl shadow-xl">
              <p className="font-mono text-xs text-muted uppercase">CONTRACT ADDRESS (CHAIN ID 10143)</p>
              <p className="mt-1 font-mono text-sm md:text-base text-brand break-all select-all">{contractAddr}</p>
              <a
                href={addressLink(contractAddr)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-xs text-accent underline"
              >
                View contract on Monad Explorer ↗
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/proposals/1"
                className="rounded-full bg-brand px-8 py-4 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-brand-contrast hover:bg-brand-hover transition-transform hover:-translate-y-1 shadow-2xl whitespace-nowrap"
              >
                TRY LIVE PROPOSAL #1 →
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-border bg-surface-2 px-8 py-4 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-ink hover:border-brand transition-colors shadow-md whitespace-nowrap"
              >
                OPEN AUDIT DASHBOARD
              </Link>
              <Link
                href="/"
                className="rounded-full border border-border bg-surface px-8 py-4 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-muted hover:text-ink transition-colors whitespace-nowrap"
              >
                HOME
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 font-mono text-xs text-muted gap-4">
            <span>© 2026 FlipGuard · Monad Blitz Mumbai</span>
            <span>Atlas Protocol Governance Defense</span>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
