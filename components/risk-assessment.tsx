"use client";
import { useReadContracts } from "wagmi";
import { formatUnits, type Address } from "viem";
import { governance, isLive, onchainId, demoWallets, REASONS, RISKS, reasonByCode } from "@/lib/contracts";
import { wallets } from "@/data/mock-data";
import { Badge, Card, Skeleton, short } from "./ui";

/** Onchain preflight (`assessVoter`) for each labelled demo wallet. Falls back to fixtures in Demo Preview. */
export function DemoWalletAssessments({ slot }: { slot: number }) {
  const rows = wallets.map((w) => ({ w, address: demoWallets[w.key] as Address | undefined }));
  const live = rows.filter((r) => r.address);
  const { data, isLoading, isError } = useReadContracts({
    contracts: live.map((r) => ({
      address: governance.address!,
      abi: governance.abi,
      functionName: "assessVoter" as const,
      args: [onchainId(slot), r.address!] as const,
    })),
    query: { enabled: isLive, refetchInterval: 10_000 },
  });

  return (
    <Card className="rounded-3xl border-2 border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <h2 className="font-display font-extrabold text-lg uppercase text-ink">VOTER RISK ASSESSMENT</h2>
        <Badge tone={isLive ? "cyan" : "warn"}>{isLive ? "Live · assessVoter()" : "Demo Preview · simulated"}</Badge>
      </div>
      {isError && <p className="mt-3 text-xs font-mono text-threat">RPC read failed. Check NEXT_PUBLIC_MONAD_RPC_URL and try again.</p>}
      <ul className="mt-4 divide-y divide-border">
        {rows.map(({ w, address }) => {
          const i = live.findIndex((r) => r.w.key === w.key);
          const res = i >= 0 ? data?.[i] : undefined;
          const onchain = res?.status === "success" ? res.result : undefined;
          const reason = onchain ? REASONS[onchain[2]] : reasonByCode(w.expected);
          return (
            <li key={w.key} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-display font-bold text-sm uppercase text-ink">{w.label}</p>
                <p className="font-mono text-xs text-muted mt-0.5">{address ? short(address) : w.short}</p>
                <p className="mt-1 text-xs text-muted max-w-md">{w.history}</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                {isLive && address && isLoading ? <Skeleton className="h-5 w-32" /> : <Badge tone={reason.tone}>{reason.label}</Badge>}
                <span className="font-mono text-[11px] text-muted">
                  {onchain
                    ? `${Number(formatUnits(onchain[1], 18)).toLocaleString()} ATLAS · ${RISKS[onchain[3]]}`
                    : "simulated"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
