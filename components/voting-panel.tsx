"use client";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BaseError, ContractFunctionRevertedError, formatUnits } from "viem";
import { governance, isLive, onchainId, REASONS, RISKS, reasonByCode } from "@/lib/contracts";
import { monadTestnet, txLink, addressLink } from "@/lib/monad";
import { recordBlocked } from "@/lib/session-log";
import { Badge, Card, Skeleton } from "./ui";
import { useMounted } from "@/lib/use-mounted";

const fmt = (v?: bigint) =>
  v === undefined ? "—" : Number(formatUnits(v, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 });

function revertReason(e: unknown): string {
  if (e instanceof BaseError) {
    const r = e.walk((x) => x instanceof ContractFunctionRevertedError);
    if (r instanceof ContractFunctionRevertedError && r.data?.errorName === "VoteBlocked") {
      return REASONS[Number(r.data.args?.[0])]?.code ?? "UNKNOWN";
    }
    const msg = e.shortMessage.toLowerCase();
    if (msg.includes("insufficient funds")) return "INSUFFICIENT_FUNDS";
    if (msg.includes("rejected") || msg.includes("denied")) return "USER_REJECTED";
    return e.shortMessage;
  }
  return "UNKNOWN";
}

export function ProposalTally({ slot }: { slot: number }) {
  const { data: p, isLoading, isError } = useReadContract({
    ...governance,
    address: governance.address!,
    functionName: "getProposal",
    args: [onchainId(slot)],
    query: { enabled: isLive, refetchInterval: 5_000 },
  });
  const forV = p?.forVotes ?? 0n;
  const against = p?.againstVotes ?? 0n;
  const total = forV + against;
  const pct = total > 0n ? Number((forV * 1000n) / total) / 10 : 0;
  const exists = p && p.snapshot > 0;

  return (
    <Card className="rounded-3xl border-2 border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="font-display font-extrabold text-lg uppercase text-ink">ONCHAIN TALLY</h2>
        {isLive && exists && <Badge tone="cyan">PROPOSAL #{onchainId(slot).toString()}</Badge>}
      </div>
      {!isLive ? (
        <p className="mt-4 text-xs font-mono text-muted">Demo Preview: set contract addresses in .env.local to read live totals.</p>
      ) : isLoading ? (
        <Skeleton className="mt-4 h-16" />
      ) : isError ? (
        <p className="mt-4 text-xs font-mono text-threat">Could not read proposal from Monad RPC.</p>
      ) : !exists ? (
        <p className="mt-4 text-xs font-mono text-warn">Proposal not found onchain. Run the seed script (see RUNNING_LOCALLY.md).</p>
      ) : (
        <>
          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-threat/30 border border-border">
            <div className="bg-safe transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-b border-border pb-4">
            <div>
              <p className="font-mono text-xs text-muted">FOR</p>
              <p className="font-display text-2xl font-extrabold tabular-nums text-safe">{fmt(forV)}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-muted">AGAINST</p>
              <p className="font-display text-2xl font-extrabold tabular-nums text-threat">{fmt(against)}</p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">
            Snapshot {new Date(Number(p.snapshot) * 1000).toLocaleTimeString()} · Ends {new Date(Number(p.end) * 1000).toLocaleTimeString()}
          </p>
        </>
      )}
    </Card>
  );
}

export function VotingPanel({ slot }: { slot: number }) {
  const mounted = useMounted();
  const id = onchainId(slot);
  const { address, chainId, isConnected } = useAccount();
  const client = usePublicClient({ chainId: monadTestnet.id });
  const onMonad = chainId === monadTestnet.id;
  const [blocked, setBlocked] = useState<string>();

  const assess = useReadContract({
    ...governance,
    address: governance.address!,
    functionName: "assessVoter",
    args: [id, address!],
    query: { enabled: isLive && !!address, refetchInterval: 8_000 },
  });
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash, chainId: monadTestnet.id });
  const { refetch } = assess;

  useEffect(() => {
    if (receipt.isSuccess) refetch();
  }, [receipt.isSuccess, refetch]);

  const [eligible, weight, reasonIdx, riskIdx] = assess.data ?? [];
  const reason = reasonIdx !== undefined ? REASONS[reasonIdx] : undefined;

  async function vote(support: boolean) {
    if (!address || !client || !governance.address) return;
    setBlocked(undefined);
    reset();
    try {
      // Simulate first: a blocked vote never reaches the wallet and the contract's revert reason is shown.
      const { request } = await client.simulateContract({
        ...governance,
        address: governance.address,
        functionName: "castVote",
        args: [id, support],
        account: address,
      });
      // Monad charges the full gas limit, so pass a tight limit (estimate + 20%) instead of a wallet default.
      const gas = await client.estimateContractGas({ ...request, account: address });
      writeContract({ ...request, gas: (gas * 12n) / 10n });
    } catch (e) {
      const code = revertReason(e);
      setBlocked(code);
      if (REASONS.some((r) => r.code === code)) {
        recordBlocked({ proposalId: id.toString(), voter: address, reason: code, at: Date.now() });
      }
    }
  }

  if (!mounted)
    return (
      <Card>
        <Skeleton className="h-40" />
      </Card>
    );

  const txState = isPending
    ? "Awaiting wallet confirmation…"
    : hash && receipt.isLoading
      ? "Transaction pending on Monad…"
      : receipt.isSuccess
        ? "Vote confirmed onchain."
        : receipt.isError
          ? "Transaction failed."
          : undefined;
  const busy = isPending || receipt.isLoading;

  return (
    <Card className="rounded-3xl border-2 border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="font-display font-extrabold text-lg uppercase text-ink">YOUR VOTE</h2>
        {reason && <Badge tone={reason.tone}>{reason.label}</Badge>}
      </div>

      {!isLive ? (
        <p className="mt-4 text-xs font-mono text-muted">Demo Preview mode. Deploy contracts and set addresses to vote onchain.</p>
      ) : !isConnected ? (
        <p className="mt-4 text-xs font-mono text-muted">Connect wallet above to evaluate eligibility and cast vote.</p>
      ) : !onMonad ? (
        <p className="mt-4 text-xs font-mono text-warn">Wrong network. Switch to Monad Testnet (10143).</p>
      ) : assess.isLoading ? (
        <Skeleton className="mt-4 h-24" />
      ) : assess.isError ? (
        <p className="mt-4 text-xs font-mono text-threat">Eligibility check failed (RPC error). Retrying automatically.</p>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-surface-2 p-4 text-sm border border-border">
            <div>
              <dt className="font-mono text-xs text-muted">Snapshot Power</dt>
              <dd className="font-display text-lg font-bold tabular-nums text-ink">{fmt(weight)} ATLAS</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-muted">Registry Flag</dt>
              <dd className="font-display text-lg font-bold text-ink">{riskIdx !== undefined ? RISKS[riskIdx] : "—"}</dd>
            </div>
          </dl>
          {reason && <p className="mt-3 text-xs text-muted font-mono">{reason.detail}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => vote(true)}
              disabled={busy}
              className="font-display font-extrabold text-sm uppercase rounded-2xl bg-safe/15 py-3.5 text-safe ring-1 ring-safe/40 hover:bg-safe/25 disabled:opacity-50 transition-colors"
            >
              VOTE FOR
            </button>
            <button
              onClick={() => vote(false)}
              disabled={busy}
              className="font-display font-extrabold text-sm uppercase rounded-2xl bg-threat/15 py-3.5 text-threat ring-1 ring-threat/40 hover:bg-threat/25 disabled:opacity-50 transition-colors"
            >
              VOTE AGAINST
            </button>
          </div>
          {!eligible && (
            <p className="mt-3 text-xs text-muted font-mono leading-relaxed">
              Not eligible. Pressing a button simulates the vote and displays the contract&apos;s revert; nothing is sent to the chain.
            </p>
          )}
        </>
      )}

      {blocked && (
        <div role="alert" className="mt-4 rounded-xl border border-threat/40 bg-threat/10 p-3 text-sm">
          <p className="font-semibold text-threat">
            {blocked === "INSUFFICIENT_FUNDS"
              ? "Not enough MON for gas"
              : blocked === "USER_REJECTED"
                ? "Request rejected in wallet"
                : `Vote blocked by contract: ${blocked}`}
          </p>
          <p className="mt-1 text-dim">
            {blocked === "INSUFFICIENT_FUNDS" ? (
              <>
                Get test MON from{" "}
                <a className="text-cyan underline" href="https://faucet.monad.xyz" target="_blank" rel="noreferrer">
                  faucet.monad.xyz
                </a>
                .
              </>
            ) : reasonByCode(blocked).code === blocked ? (
              reasonByCode(blocked).detail
            ) : (
              blocked
            )}
          </p>
        </div>
      )}

      {(txState || writeError) && (
        <div className="mt-4 rounded-xl border border-line bg-panel-2 p-3 text-sm" aria-live="polite">
          {txState && <p className={receipt.isSuccess ? "text-safe" : receipt.isError ? "text-threat" : "text-cyan"}>{txState}</p>}
          {writeError && (
            <p className="text-threat">
              {revertReason(writeError) === "USER_REJECTED" ? "Request rejected in wallet." : (writeError as BaseError).shortMessage}
            </p>
          )}
          {hash && (
            <a href={txLink(hash)} target="_blank" rel="noreferrer" className="mt-1 block break-all font-mono text-xs text-cyan underline">
              {hash} ↗
            </a>
          )}
        </div>
      )}

      {governance.address && (
        <a href={addressLink(governance.address)} target="_blank" rel="noreferrer" className="mt-4 block break-all text-xs text-dim hover:text-cyan">
          Contract {governance.address} ↗
        </a>
      )}
    </Card>
  );
}
