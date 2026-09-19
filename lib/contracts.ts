import { getAddress, isAddress, keccak256, toHex, type Address } from "viem";
import { flipGuardGovernanceAbi } from "./abi";

const addr = (v: string | undefined): Address | undefined => (v && isAddress(v) ? getAddress(v) : undefined);

/** Mirrors `address(uint160(uint256(keccak256(label))))` used as defaults in the Foundry scripts. */
const derived = (label: string): Address => getAddress(`0x${keccak256(toHex(label)).slice(-40)}`);

export const governance = {
  address: addr(process.env.NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS),
  abi: flipGuardGovernanceAbi,
} as const;

export const tokenAddress = addr(process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS);
export const registryAddress = addr(process.env.NEXT_PUBLIC_RISK_REGISTRY_ADDRESS);
export const isLive = Boolean(governance.address);

const firstId = BigInt(process.env.NEXT_PUBLIC_FIRST_PROPOSAL_ID || "1");
/** Mock proposal slot (1..3) → onchain proposal id created by Seed.s.sol. */
export const onchainId = (slot: number) => firstId + BigInt(slot - 1);

export const demoWallets = {
  clean: addr(process.env.NEXT_PUBLIC_DEMO_CLEAN_WALLET),
  recent: addr(process.env.NEXT_PUBLIC_DEMO_RECENT_WALLET) ?? derived("flipguard.recent"),
  flagged: addr(process.env.NEXT_PUBLIC_DEMO_FLAGGED_WALLET) ?? derived("flipguard.flagged"),
  voted: addr(process.env.NEXT_PUBLIC_DEMO_VOTED_WALLET),
};

export type Tone = "safe" | "warn" | "threat" | "muted";

/** Index matches FlipGuardGovernance.Reason. */
export const REASONS: { code: string; label: string; detail: string; tone: Tone }[] = [
  { code: "ELIGIBLE", label: "Clean", detail: "Held voting power at snapshot for longer than the minimum holding period. No risk flags.", tone: "safe" },
  { code: "NO_PROPOSAL", label: "Unknown proposal", detail: "This proposal does not exist on the deployed contract yet. Run the seed script.", tone: "muted" },
  { code: "NOT_ACTIVE", label: "Voting closed", detail: "The proposal is outside its voting window.", tone: "muted" },
  { code: "ALREADY_VOTED", label: "Already voted", detail: "This wallet has already cast its one vote on this proposal.", tone: "muted" },
  { code: "NO_VOTING_POWER", label: "No voting power", detail: "The wallet held no checkpointed voting power at the proposal snapshot. Tokens bought after the snapshot do not count.", tone: "warn" },
  { code: "RISK_FLAGGED", label: "Borrowing Risk Flag", detail: "An authorized risk monitor flagged this wallet. The contract rejects its vote.", tone: "threat" },
  { code: "RECENT_ACQUISITION", label: "Recent Token Acquisition", detail: "Tokens arrived inside the minimum holding period before the snapshot. The contract rejects the vote.", tone: "warn" },
];

export const reasonByCode = (code: string) => REASONS.find((r) => r.code === code) ?? REASONS[1];

/** Index matches MockRiskRegistry.Risk. */
export const RISKS = ["None", "Recent acquisition", "Borrowing risk", "Wallet flip", "Manual review"];
