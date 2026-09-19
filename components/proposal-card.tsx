import Link from "next/link";
import type { MockProposal } from "@/data/mock-data";
import { Badge } from "./ui";

export function ProposalCard({ p }: { p: MockProposal }) {
  return (
    <Link
      href={`/proposals/${p.slot}`}
      className="group flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 md:p-8 transition-all duration-300 hover:border-brand hover:shadow-2xl hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between">
          <Badge tone="violet">{p.category}</Badge>
          <span className="font-mono text-xs text-muted">SLOT #{p.slot}</span>
        </div>
        <h3
          className="mt-6 font-display font-extrabold uppercase leading-snug tracking-tight text-ink group-hover:text-brand transition-colors"
          style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
        >
          {p.title}
        </h3>
        <p className="mt-3 text-sm text-muted leading-relaxed">{p.summary}</p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-xs font-mono">
        <span className="flex items-center gap-2 text-safe">
          <span className="h-1.5 w-1.5 rounded-full bg-safe pulse-dot" /> FLIPGUARD ACTIVE
        </span>
        <span className="font-display font-extrabold uppercase text-brand group-hover:translate-x-1 transition-transform">
          VOTE NOW →
        </span>
      </div>
    </Link>
  );
}
