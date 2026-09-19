"use client";
import { useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { governance, isLive, registryAddress, RISKS } from "@/lib/contracts";
import { mockRiskRegistryAbi } from "@/lib/abi";
import { monadTestnet, txLink } from "@/lib/monad";
import { proposals, timeline } from "@/data/mock-data";
import { clearBlocked, useBlockedAttempts } from "@/lib/session-log";
import { Badge, Card, Skeleton, short } from "./ui";

type Kind = "Allowed" | "Protected" | "Flagged" | "Info";
interface Row {
  key: string;
  kind: Kind;
  title: string;
  detail: string;
  when: string;
  source: "Contract event" | "Preflight (this browser)" | "Simulated monitor";
  tx?: string;
}

const FILTERS = ["All", "Protected", "Allowed", "Flagged"] as const;
const toneOf = { Allowed: "safe", Protected: "threat", Flagged: "warn", Info: "muted" } as const;
const dotOf = { Allowed: "bg-safe", Protected: "bg-threat", Flagged: "bg-warn", Info: "bg-dim" } as const;

// ponytail: Monad RPC caps eth_getLogs ranges, so only the latest CHUNKS*SPAN blocks (~13 min) are scanned.
// Use the monskill indexer (Envio) if older history matters.
const SPAN = 100n;
const CHUNKS = 20;

function useOnchainEvents() {
  const client = usePublicClient({ chainId: monadTestnet.id });
  return useQuery({
    queryKey: ["flipguard-events", governance.address],
    enabled: isLive && !!client,
    refetchInterval: 15_000,
    queryFn: async (): Promise<Row[]> => {
      const latest = await client!.getBlockNumber();
      const ranges = Array.from({ length: CHUNKS }, (_, i) => latest - BigInt(i) * SPAN).filter((to) => to >= SPAN);
      const chunks = await Promise.all(
        ranges.map(async (toBlock) => {
          const fromBlock = toBlock - SPAN + 1n;
          const [votes, flags] = await Promise.all([
            client!.getContractEvents({ address: governance.address!, abi: governance.abi, eventName: "VoteCast", fromBlock, toBlock }),
            registryAddress
              ? client!.getContractEvents({ address: registryAddress, abi: mockRiskRegistryAbi, eventName: "RiskFlagUpdated", fromBlock, toBlock })
              : Promise.resolve([]),
          ]);
          const rows: Row[] = votes.map((v) => ({
            key: `${v.transactionHash}-${v.logIndex}`,
            kind: "Allowed",
            title: `Vote ${v.args.support ? "FOR" : "AGAINST"} accepted · proposal #${v.args.id}`,
            detail: `${short(v.args.voter)} · weight ${Number(formatUnits(v.args.weight ?? 0n, 18)).toLocaleString()} ATLAS`,
            when: `block ${v.blockNumber}`,
            source: "Contract event",
            tx: v.transactionHash,
          }));
          for (const f of flags) {
            rows.push({
              key: `${f.transactionHash}-${f.logIndex}`,
              kind: f.args.risk ? "Flagged" : "Info",
              title: f.args.risk ? `Risk flag set: ${RISKS[f.args.risk]}` : "Risk flag cleared",
              detail: `${short(f.args.wallet)} · by monitor ${short(f.args.monitor)}`,
              when: `block ${f.blockNumber}`,
              source: "Contract event",
              tx: f.transactionHash,
            });
          }
          return rows;
        }),
      );
      return chunks.flat();
    },
  });
}

export function ProtectionLog({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const events = useOnchainEvents();
  const blocked = useBlockedAttempts();

  const rows = useMemo<Row[]>(() => {
    const local: Row[] = blocked.map((b, i) => ({
      key: `b-${b.at}-${i}`,
      kind: "Protected",
      title: `Vote blocked: ${b.reason}`,
      detail: `${short(b.voter)} · proposal #${b.proposalId} · castVote simulation reverted`,
      when: new Date(b.at).toLocaleTimeString(),
      source: "Preflight (this browser)",
    }));
    const mock: Row[] = timeline.map((e) => ({
      key: e.id,
      kind: e.kind === "allowed" ? "Allowed" : e.kind === "blocked" ? "Protected" : e.kind === "flagged" ? "Flagged" : "Info",
      title: e.text,
      detail: `${e.wallet} · ${proposals.find((p) => p.slot === e.proposalSlot)?.title ?? ""}`,
      when: e.at,
      source: "Simulated monitor",
    }));
    return [...(events.data ?? []), ...local, ...mock];
  }, [events.data, blocked]);

  const filtered = rows.filter((r) => filter === "All" || r.kind === filter);
  const shown = compact ? filtered.slice(0, 6) : filtered;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Protection log</h2>
          <p className="text-xs text-dim">Contract events, preflight blocks from this browser and simulated monitor signals. Each row is labelled.</p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter log">
          {FILTERS.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset ${
                filter === f ? "bg-violet/20 text-violet-200 ring-violet/50" : "text-dim ring-line hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {events.isError && <p className="mt-3 text-xs text-threat">Could not load contract events from Monad RPC. Showing local and simulated entries.</p>}
      {events.isLoading && isLive && <Skeleton className="mt-4 h-12" />}

      <ol className="relative mt-5 space-y-4 border-l border-line pl-5">
        {shown.length === 0 && <li className="text-sm text-dim">No entries for this filter yet.</li>}
        {shown.map((r) => (
          <li key={r.key} className="relative">
            <span className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-panel ${dotOf[r.kind]}`} />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{r.title}</p>
              <Badge tone={toneOf[r.kind]}>{r.kind}</Badge>
              <Badge tone={r.source === "Contract event" ? "cyan" : r.source === "Simulated monitor" ? "muted" : "violet"}>{r.source}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-dim">
              {r.detail} · {r.when}
              {r.tx && (
                <>
                  {" · "}
                  <a href={txLink(r.tx)} target="_blank" rel="noreferrer" className="text-cyan underline">
                    tx ↗
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ol>
      {!compact && blocked.length > 0 && (
        <button onClick={clearBlocked} className="mt-5 text-xs text-dim underline hover:text-ink">
          Clear local blocked attempts
        </button>
      )}
    </Card>
  );
}
