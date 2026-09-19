"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Copy, Check } from "lucide-react";
import { wallets } from "@/data/mock-data";
import { reasonByCode } from "@/lib/contracts";

const sampleCodes: Record<string, { curl: string; returns: string }> = {
  clean: {
    curl: `// 1. Simulate check on Monad RPC (10143)
const [eligible, weight, reason, risk] = await flipGuard.read.assessVoter([
  1n, // proposalId
  "0x7a3f81e6b3799c82f91a5472149b25a3429ac21e" // Long-Term Holder
]);

// Result:
// eligible: true
// weight: 1000000000000000000000n (1,000 ATLAS)
// reason: REASONS[0] -> "ELIGIBLE"`,
    returns: "STATUS: ELIGIBLE · VOTE PERMITTED",
  },
  recent: {
    curl: `// Flash or just-in-time acquired tokens
const [eligible, weight, reason, risk] = await flipGuard.read.assessVoter([
  1n,
  "0x91b058a2d547f3316ccb7804df987e31bc784d7a" // Recently Funded
]);

// Result:
// eligible: false
// weight: 0n (tokens acquired inside holding window)
// reason: REASONS[6] -> "RECENT_ACQUISITION"
// castVote() will revert before wallet broadcast!`,
    returns: "STATUS: REJECTED · RECENT_ACQUISITION",
  },
  flagged: {
    curl: `// Wallet flagged by Risk Monitor Registry
const [eligible, weight, reason, risk] = await flipGuard.read.assessVoter([
  1n,
  "0x3c552bf87a124eb89e612c6a08153cfc905de90b" // Borrowing Risk
]);

// Result:
// eligible: false
// reason: REASONS[5] -> "RISK_FLAGGED"
// risk: RISKS[2] -> "Borrowing risk"
// Rejection enforced by smart contract.`,
    returns: "STATUS: REJECTED · RISK_FLAGGED",
  },
  voted: {
    curl: `// Wallet that has already cast its ballot
const [eligible, weight, reason, risk] = await flipGuard.read.assessVoter([
  1n,
  "0x5e28409b307a1158ca206584284b12fe9485a613" // Already Voted
]);

// Result:
// eligible: false
// reason: REASONS[3] -> "ALREADY_VOTED"
// One-wallet, one-vote strictly enforced.`,
    returns: "STATUS: REJECTED · ALREADY_VOTED",
  },
};

export function PlaygroundSection() {
  const [selectedKey, setSelectedKey] = useState<"clean" | "recent" | "flagged" | "voted">("clean");
  const [copied, setCopied] = useState(false);
  const codeBoxRef = useRef<HTMLDivElement>(null);

  const currentWallet = wallets.find((w) => w.key === selectedKey) || wallets[0];
  const sample = sampleCodes[selectedKey] || sampleCodes.clean;
  const reasonObj = reasonByCode(currentWallet.expected);

  useEffect(() => {
    if (codeBoxRef.current) {
      gsap.fromTo(codeBoxRef.current, { opacity: 0.6, y: 6 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }
  }, [selectedKey]);

  const copyCode = () => {
    navigator.clipboard.writeText(sample.curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full border-b border-border bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="mb-12">
          <h2
            className="font-display font-extrabold uppercase leading-none tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(28px, 5vw, 62px)" }}
          >
            Connect to the voter profile
          </h2>
          <p className="mt-4 text-muted max-w-xl text-base md:text-lg">
            FlipGuard evaluates eligibility before transactions are signed. Test each deterministic wallet persona below.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-3">
            {wallets.map((w) => {
              const active = w.key === selectedKey;
              return (
                <button
                  key={w.key}
                  onClick={() => setSelectedKey(w.key)}
                  className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all ${
                    active
                      ? "border-brand bg-surface-2 shadow-lg"
                      : "border-border bg-surface hover:border-border-strong hover:bg-surface-2/60"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-display font-extrabold text-base uppercase text-ink">{w.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        w.expected === "ELIGIBLE" ? "bg-safe" : w.expected === "RISK_FLAGGED" ? "bg-threat" : "bg-warn"
                      }`}
                    />
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">{w.short}</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">{w.history}</p>
                </button>
              );
            })}
          </div>

          <div
            ref={codeBoxRef}
            className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface-2 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-threat/70" />
                <span className="h-3 w-3 rounded-full bg-warn/70" />
                <span className="h-3 w-3 rounded-full bg-safe/70" />
                <span className="ml-2 font-mono text-xs text-muted">assessVoter.ts</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-full border border-border bg-surface text-ink">
                  {sample.returns}
                </span>
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-muted hover:border-brand hover:text-ink transition-colors"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>

            <div className="p-6 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed text-ink/90 bg-bg/60">
              <pre className="whitespace-pre">{sample.curl}</pre>
            </div>

            <div className="border-t border-border bg-surface-2 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-muted">EXPECTED CONTRACT REVERT: </span>
                <span className="font-bold text-ink">{reasonObj.code}</span>
              </div>
              <p className="text-muted">{reasonObj.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
