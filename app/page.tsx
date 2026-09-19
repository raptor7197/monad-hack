import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      <HeroSection />

      <BannerSection />

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

      <CalculatorSection />

      <PlaygroundSection />

      <ContractBar />

      <ApproachSection />

      <section id="proposals" className="w-full border-b border-border bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-16">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2
                className="font-display font-extrabold uppercase leading-none tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(28px, 5vw, 62px)" }}
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

      <CtaBanner />

      <section className="w-full border-b border-border bg-bg py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2
                className="font-display font-extrabold uppercase text-ink"
                style={{ fontSize: "clamp(24px, 4vw, 48px)", letterSpacing: "-0.03em" }}
              >
                PROTECTION LOG
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 font-display font-extrabold text-xs md:text-sm uppercase text-brand hover:underline"
            >
              FULL LOG <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ProtectionLog compact />
        </div>
      </section>

      <FaqSection />

      <SiteFooter />
    </div>
  );
}
