import { ProtectionLog } from "@/components/protection-log";
import { Card, Stat } from "@/components/ui";
import { totals, wallets } from "@/data/mock-data";
import { governance, registryAddress, tokenAddress } from "@/lib/contracts";
import { addressLink } from "@/lib/monad";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "Protection log · FlipGuard" };

const contracts = [
  ["FlipGuardGovernance", governance.address],
  ["MockRiskRegistry", registryAddress],
  ["MockGovernanceToken", tokenAddress],
] as const;

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16 py-12 md:py-16 space-y-10">
        <div>
          <h1
            className="font-display font-extrabold uppercase leading-none tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(32px, 5vw, 62px)" }}
          >
            PROTECTION DASHBOARD
          </h1>
          <p className="mt-4 text-muted max-w-2xl text-base md:text-lg">
            Real-time feed of allowed ballots, blocked flash-loan acquisitions, and monitor risk flags on Monad Testnet.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Stat label="Protected votes" value={totals.protectedVotes} hint="Validated onchain" accent="bg-safe" />
          <Stat label="Threats blocked" value={totals.threatsBlocked} hint="Reverted by contract" accent="bg-threat" />
          <Stat label="Monitored wallets" value={wallets.length} hint="Preflight active" accent="bg-brand" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ProtectionLog />
          <Card className="h-fit">
            <h2 className="font-display font-extrabold text-lg uppercase text-ink">Deployed Contracts</h2>
            <p className="mt-1 text-xs text-muted font-mono">Monad Testnet &middot; Chain ID 10143</p>
            <ul className="mt-6 space-y-4 divide-y divide-border">
              {contracts.map(([name, a]) => (
                <li key={name} className="pt-4 first:pt-0">
                  <p className="font-display font-extrabold text-sm uppercase text-ink">{name}</p>
                  {a ? (
                    <a
                      href={addressLink(a)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 block break-all font-mono text-xs text-brand hover:underline"
                    >
                      {a} ↗
                    </a>
                  ) : (
                    <p className="mt-1 font-mono text-xs text-warn">Not configured (Demo Preview)</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
