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
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Voter risk assessment</h2>
        <Badge tone={isLive ? "cyan" : "warn"}>{isLive ? "Live · assessVoter()" : "Demo Preview · simulated"}</Badge>
      </div>
      {isError && <p className="mt-3 text-sm text-threat">RPC read failed. Check NEXT_PUBLIC_MONAD_RPC_URL and try again.</p>}
      <ul className="mt-4 divide-y divide-line">
        {rows.map(({ w, address }) => {
          const i = live.findIndex((r) => r.w.key === w.key);
          const res = i >= 0 ? data?.[i] : undefined;
          const onchain = res?.status === "success" ? res.result : undefined;
          const reason = onchain ? REASONS[onchain[2]] : reasonByCode(w.expected);
          return (
            <li key={w.key} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium">{w.label}</p>
                <p className="font-mono text-xs text-dim">{address ? short(address) : w.short}</p>
                <p className="mt-0.5 text-xs text-dim">{w.history}</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                {isLive && address && isLoading ? <Skeleton className="h-5 w-32" /> : <Badge tone={reason.tone}>{reason.label}</Badge>}
                <span className="text-[11px] text-dim">
                  {onchain
                    ? `${Number(formatUnits(onchain[1], 18)).toLocaleString()} ATLAS at snapshot · flag: ${RISKS[onchain[3]]}`
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
