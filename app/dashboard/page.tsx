import { ProtectionLog } from "@/components/protection-log";
import { Card, Stat } from "@/components/ui";
import { totals, wallets } from "@/data/mock-data";
import { governance, registryAddress, tokenAddress } from "@/lib/contracts";
import { addressLink } from "@/lib/monad";

export const metadata = { title: "Protection log · FlipGuard" };

const contracts = [
  ["FlipGuardGovernance", governance.address],
  ["MockRiskRegistry", registryAddress],
  ["MockGovernanceToken", tokenAddress],
] as const;

export default function Dashboard() {
  return (
    <div className="space-y-6 pt-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Protection dashboard</h1>
        <p className="mt-1 text-dim">Everything FlipGuard allowed, blocked or flagged, with the source of each record.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Protected votes" value={totals.protectedVotes} hint="Simulated history" accent="bg-safe" />
        <Stat label="Threats blocked" value={totals.threatsBlocked} hint="Simulated history" accent="bg-threat" />
        <Stat label="Monitored wallets" value={wallets.length} hint="Demo wallets" accent="bg-cyan" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ProtectionLog />
        <Card className="h-fit">
          <h2 className="font-semibold">Deployed contracts</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {contracts.map(([name, a]) => (
              <li key={name}>
                <p className="text-dim">{name}</p>
                {a ? (
                  <a href={addressLink(a)} target="_blank" rel="noreferrer" className="break-all font-mono text-xs text-cyan hover:underline">
                    {a} ↗
                  </a>
                ) : (
                  <p className="text-xs text-warn">Not configured (Demo Preview)</p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
