"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer aria-label="Footer" className="relative w-full border-t border-border bg-surface pt-16 md:pt-24 pb-12 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Tagline & CTA */}
          <div className="flex flex-col gap-6 max-w-xl">
            <p
              className="font-display font-extrabold uppercase text-ink leading-tight"
              style={{ fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.04em" }}
            >
              Fair votes. Stronger governance.
            </p>
            <p className="text-muted text-sm md:text-base leading-relaxed">
              Enforcing holding periods, checkpointed snapshots, and live risk signals directly on Monad Testnet.
            </p>
            <div>
              <Link
                href="/proposals/1"
                className="inline-flex items-center gap-3 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-brand hover:text-brand-hover transition-colors"
              >
                <span>OPEN DEMO PROPOSAL</span>
                <span className="text-xl">↗</span>
              </Link>
            </div>
          </div>

          {/* Social / Links in bordered boxes matching Dahl */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              {[
                { name: "GitHub", href: "https://github.com", icon: "GH" },
                { name: "Docs", href: "/#approach", icon: "DOC" },
                { name: "Monad", href: "https://monad.xyz", icon: "MON" },
                { name: "Explorer", href: "https://testnet.monadexplorer.com", icon: "EXP" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-2 font-mono text-xs font-bold text-muted hover:border-brand hover:text-ink hover:bg-brand/20 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-mono text-muted">
              <Link href="/dashboard" className="hover:text-ink">
                PROTECTION LOG
              </Link>
              <Link href="/#proposals" className="hover:text-ink">
                PROPOSALS
              </Link>
              <Link href="/#calculator" className="hover:text-ink">
                SIMULATOR
              </Link>
            </div>
          </div>
        </div>

        {/* Huge Wordmark SVG / Typography matching Dahl */}
        <div className="mt-16 md:mt-24 border-t border-border pt-10">
          <div className="overflow-hidden">
            <p
              className="font-display font-extrabold uppercase tracking-[-0.07em] text-surface-3/50 select-none text-center"
              style={{ fontSize: "clamp(48px, 16vw, 240px)", lineHeight: 0.75 }}
            >
              FLIPGUARD
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted">
            <p>© 2026 FlipGuard · Built for Monad Blitz</p>
            <div className="flex gap-6">
              <span className="text-safe">Monad Testnet (10143)</span>
              <span>Atlas Protocol DAO</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
