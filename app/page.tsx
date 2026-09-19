import Link from "next/link";
import { dao, proposals, totals } from "@/data/mock-data";
import { ProposalCard } from "@/components/proposal-card";
import { ProtectionLog } from "@/components/protection-log";
import { Stat } from "@/components/ui";
import { HeroSection } from "@/components/hero-section";
import { BannerSection } from "@/components/banner-section";
import { CalculatorSection } from "@/components/calculator-section";
import { PlaygroundSection } from "@/components/playground-section";
import { ContractBar } from "@/components/contract-bar";
import { ApproachSection } from "@/components/approach-section";
import { CtaBanner } from "@/components/cta-banner";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="w-full">
      {/* Dahl Hero with ticker */}
      <HeroSection />

      {/* Brutalist Value Banner */}
      <BannerSection />

      {/* Stats Counter Section */}
      <section className="w-full border-b border-border bg-surface-2 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-16">
          <div className="grid gap-6 sm:grid-cols-3">
            <Stat
              label="Active Proposals"
              value={totals.activeProposals}
              hint={`${dao.name} · Live Monad Slots`}
              accent="bg-brand"
            />
            <Stat
              label="Protected Votes"
              value={totals.protectedVotes}
              hint="Checkpointed & Verified Valid"
              accent="bg-safe"
            />
            <Stat
              label="Threats Blocked"
              value={totals.threatsBlocked}
              hint="Flash Borrowers Rejected Onchain"
              accent="bg-threat"
            />
          </div>
        </div>
      </section>

      {/* Interactive Savings / Token Volume Simulator */}
      <CalculatorSection />

      {/* Interactive Voter / Code Playground */}
      <PlaygroundSection />

      {/* Contract Deployment Banner */}
      <ContractBar />

      {/* Our Approach (1, 2, 3 numbered blocks) */}
      <ApproachSection />

      {/* Proposals Grid */}
      <section id="proposals" className="w-full border-b border-border bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-16">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-brand tracking-widest mb-2">Live Ballots</p>
              <h2
                className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] text-ink"
                style={{ fontSize: "clamp(28px, 5vw, 68px)" }}
              >
                ACTIVE PROPOSALS
              </h2>
            </div>
            <p className="text-muted text-sm md:text-base max-w-md">
              Simulated DAO ballots executing holding verification and risk checks directly on Monad Testnet.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {proposals.map((p) => (
              <ProposalCard key={p.slot} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Giant CTA Banner */}
      <CtaBanner />

      {/* Protection Log Stream */}
      <section className="w-full border-b border-border bg-bg py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-brand tracking-widest mb-1">Live Audit Stream</p>
              <h2
                className="font-display font-extrabold uppercase text-ink"
                style={{ fontSize: "clamp(24px, 4vw, 52px)", letterSpacing: "-0.04em" }}
              >
                PROTECTION LOG
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="font-display font-extrabold text-xs md:text-sm uppercase text-brand hover:underline"
            >
              FULL LOG →
            </Link>
          </div>

          <ProtectionLog compact />
        </div>
      </section>

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Giant Footer */}
      <SiteFooter />
    </div>
  );
}
