import Link from "next/link";
import { dao, proposals, totals } from "@/data/mock-data";
import { ProposalCard } from "@/components/proposal-card";
import { ProtectionLog } from "@/components/protection-log";
import { Badge, Card, Stat } from "@/components/ui";
import { WalletButton } from "@/components/site-header";

const steps = [
  { n: "01", title: "Snapshot power", text: "Vote weight comes from checkpointed balances at proposal creation. Tokens bought later count for nothing." },
  { n: "02", title: "Holding period", text: "Tokens that arrived just before the snapshot are rejected. Flash-acquired power can't vote." },
  { n: "03", title: "Risk registry", text: "An authorized monitor can flag wallets. The contract refuses their votes before they land." },
];

export default function Home() {
  return (
    <div className="space-y-12 pt-10 sm:pt-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Badge tone="violet">Fair votes. Stronger governance.</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Protect governance <span className="grad-text">before it&apos;s too late.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-dim sm:text-lg">
            FlipGuard stops last-minute voting-power grabs. Every vote is checked onchain against the snapshot, a
            minimum holding period and a risk registry, and suspicious wallets are rejected before they can swing a proposal.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <WalletButton />
            <Link href="/proposals/1" className="rounded-lg border border-line px-4 py-2 text-sm hover:border-cyan/60 hover:text-cyan">
              Try the demo proposal →
            </Link>
          </div>
        </div>

        <Card className="relative overflow-hidden border-violet/30">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
          <p className="relative text-xs uppercase tracking-wider text-dim">Demo scenario · Treasury Diversification</p>
          <ul className="relative mt-4 space-y-3 text-sm">
            {(
              [
                ["Long-Term Holder", "Vote accepted", "safe"],
                ["Recently Funded Wallet", "Blocked · RECENT_ACQUISITION", "warn"],
                ["Borrowing-Risk Wallet", "Blocked · RISK_FLAGGED", "threat"],
              ] as const
            ).map(([w, s, t]) => (
              <li key={w} className="flex items-center justify-between gap-3 rounded-xl bg-panel-2/80 px-3 py-2.5">
                <span>{w}</span>
                <Badge tone={t}>{s}</Badge>
              </li>
            ))}
          </ul>
          <p className="relative mt-4 text-[11px] text-dim">Illustration. Open a proposal for live onchain results.</p>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Active proposals" value={totals.activeProposals} hint={`${dao.name} · demo data`} accent="bg-gradient-to-r from-violet to-purple" />
        <Stat label="Protected votes" value={totals.protectedVotes} hint="Accepted after checks · simulated history" accent="bg-safe" />
        <Stat label="Threats blocked" value={totals.threatsBlocked} hint="Rejected by policy · simulated history" accent="bg-threat" />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Proposals</h2>
        <p className="mb-4 text-sm text-dim">{dao.name}. Content is demo data; votes and checks run on Monad Testnet.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {proposals.map((p) => (
            <ProposalCard key={p.slot} p={p} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n}>
            <p className="font-mono text-xs text-cyan">{s.n}</p>
            <h3 className="mt-2 font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-dim">{s.text}</p>
          </Card>
        ))}
      </section>

      <section>
        <ProtectionLog compact />
        <Link href="/dashboard" className="mt-3 inline-block text-sm text-cyan hover:underline">
          Full protection log →
        </Link>
      </section>
    </div>
  );
}
