import Link from "next/link";
import { notFound } from "next/navigation";
import { proposals, timeline } from "@/data/mock-data";
import { ProposalTally, VotingPanel } from "@/components/voting-panel";
import { DemoWalletAssessments } from "@/components/risk-assessment";
import { Badge, Card } from "@/components/ui";

export function generateStaticParams() {
  return proposals.map((p) => ({ id: String(p.slot) }));
}

const dot = { blocked: "bg-threat", allowed: "bg-safe", flagged: "bg-warn", acquired: "bg-cyan", checked: "bg-cyan" } as const;

export default async function ProposalPage({ params }: PageProps<"/proposals/[id]">) {
  const { id } = await params;
  const p = proposals.find((x) => String(x.slot) === id);
  if (!p) notFound();
  const events = timeline.filter((e) => e.proposalSlot === p.slot);

  return (
    <div className="space-y-6 pt-8">
      <Link href="/" className="text-sm text-dim hover:text-ink">
        ← All proposals
      </Link>
      <header>
        <div className="flex flex-wrap gap-2">
          <Badge tone="violet">{p.category}</Badge>
          <Badge tone="safe">FlipGuard protected</Badge>
          <Badge>Demo Data</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
        <p className="mt-3 max-w-3xl text-dim">{p.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="order-2 space-y-6 lg:order-1">
          <DemoWalletAssessments slot={p.slot} />
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Activity timeline</h2>
              <Badge>Simulated monitor</Badge>
            </div>
            {events.length === 0 ? (
              <p className="mt-3 text-sm text-dim">No monitored activity for this proposal yet.</p>
            ) : (
              <ol className="mt-4 space-y-3 border-l border-line pl-5">
                {events.map((e) => (
                  <li key={e.id} className="relative text-sm">
                    <span className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ${dot[e.kind]}`} />
                    <span className="font-mono text-xs text-dim">{e.at}</span> · <span className="font-medium">{e.wallet}</span>
                    <p className="text-dim">{e.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
        <div className="order-1 space-y-6 lg:order-2">
          <VotingPanel slot={p.slot} />
          <ProposalTally slot={p.slot} />
        </div>
      </div>
    </div>
  );
}
