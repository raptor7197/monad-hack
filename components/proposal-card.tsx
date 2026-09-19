import Link from "next/link";
import type { MockProposal } from "@/data/mock-data";
import { Badge } from "./ui";

export function ProposalCard({ p }: { p: MockProposal }) {
  return (
    <Link
      href={`/proposals/${p.slot}`}
      className="group flex flex-col rounded-2xl border border-line bg-panel/80 p-5 transition hover:-translate-y-0.5 hover:border-violet/50 hover:shadow-[0_12px_40px_-16px] hover:shadow-violet/50"
    >
      <div className="flex items-center justify-between">
        <Badge tone="violet">{p.category}</Badge>
        <Badge>Demo Data</Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-white">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm text-dim">{p.summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-safe">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-safe" /> FlipGuard protected
        </span>
        <span className="text-cyan transition group-hover:translate-x-0.5">Open →</span>
      </div>
    </Link>
  );
}
