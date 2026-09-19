import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { proposals, timeline } from "@/data/mock-data";
import { ProposalTally, VotingPanel } from "@/components/voting-panel";
import { DemoWalletAssessments } from "@/components/risk-assessment";
import { Badge, Card } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";

export function generateStaticParams() {
  return proposals.map((p) => ({ id: String(p.slot) }));
}

const dot = {
  blocked: "bg-threat",
  allowed: "bg-safe",
  flagged: "bg-warn",
  acquired: "bg-accent",
  checked: "bg-accent",
} as const;

export default async function ProposalPage({ params }: PageProps<"/proposals/[id]">) {
  const { id } = await params;
  const p = proposals.find((x) => String(x.slot) === id);
  if (!p) notFound();
  const events = timeline.filter((e) => e.proposalSlot === p.slot);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16 py-10 md:py-16 space-y-8">
        <Link
          href="/#proposals"
          className="inline-flex items-center gap-2 font-display font-extrabold text-xs uppercase text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> ALL PROPOSALS
        </Link>

        <header className="border-b border-border pb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone="violet">{p.category}</Badge>
            <Badge tone="safe">FLIPGUARD PROTECTED</Badge>
            <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-full border border-border text-muted">
              SLOT #{p.slot}
            </span>
          </div>

          <h1
            className="font-display font-extrabold uppercase leading-tight tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(28px, 4.5vw, 58px)" }}
          >
            {p.title}
          </h1>
          <p className="mt-4 max-w-3xl text-muted text-base md:text-lg leading-relaxed">{p.description}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="order-2 space-y-8 lg:order-1">
            <DemoWalletAssessments slot={p.slot} />

            <Card>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-display font-extrabold text-lg uppercase text-ink">ACTIVITY TIMELINE</h2>
                <Badge>SIMULATED SIGNALS</Badge>
              </div>

              {events.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No monitored activity for this proposal yet.</p>
              ) : (
                <ol className="mt-6 space-y-4 border-l border-border pl-6">
                  {events.map((e) => (
                    <li key={e.id} className="relative text-sm">
                      <span className={`absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full ${dot[e.kind]}`} />
                      <span className="font-mono text-xs text-muted">{e.at}</span> &middot;{" "}
                      <span className="font-bold text-ink">{e.wallet}</span>
                      <p className="mt-1 text-muted text-xs md:text-sm">{e.text}</p>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <VotingPanel slot={p.slot} />
            <ProposalTally slot={p.slot} />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
