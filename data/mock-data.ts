// Deterministic demo fixtures. Every record is simulated; nothing here came from real users, lenders or DAOs.

export type Source = "mock";

export interface MockProposal {
  slot: 1 | 2 | 3;
  title: string;
  summary: string;
  description: string;
  category: string;
  source: Source;
}

export interface MockWallet {
  key: "clean" | "recent" | "flagged" | "voted";
  label: string;
  short: string;
  history: string;
  expected: "ELIGIBLE" | "RECENT_ACQUISITION" | "RISK_FLAGGED" | "ALREADY_VOTED";
  source: Source;
}

export interface MockEvent {
  id: string;
  at: string;
  kind: "acquired" | "flagged" | "checked" | "allowed" | "blocked";
  wallet: string;
  proposalSlot: number;
  text: string;
  source: Source;
}

export const dao = { name: "Atlas Protocol DAO", token: "ATLAS", members: 1284, source: "mock" as Source };

export const proposals: MockProposal[] = [
  {
    slot: 1,
    title: "Treasury Diversification",
    summary: "Move 18% of the treasury from ATLAS into stablecoins over six months.",
    description:
      "Reduce treasury volatility by converting 18% of ATLAS holdings into a basket of audited stablecoins, executed in monthly tranches with a public dashboard.",
    category: "Treasury",
    source: "mock",
  },
  {
    slot: 2,
    title: "Validator Incentive Adjustment",
    summary: "Raise validator rewards by 0.4% for operators with 99.9% uptime.",
    description:
      "Introduce an uptime-weighted bonus for validators, funded from the ecosystem pool, to reward reliable operators and discourage churn.",
    category: "Protocol",
    source: "mock",
  },
  {
    slot: 3,
    title: "Emergency Security Council Renewal",
    summary: "Renew the 5-of-9 security council for another 12 months.",
    description:
      "Reappoint the current emergency council members, keep the 5-of-9 multisig threshold and require quarterly transparency reports.",
    category: "Security",
    source: "mock",
  },
];

export const wallets: MockWallet[] = [
  { key: "clean", label: "Long-Term Holder", short: "0x7a3f…c21e", history: "Holding 1,000 ATLAS since well before the snapshot. No flags.", expected: "ELIGIBLE", source: "mock" },
  { key: "recent", label: "Recently Funded Wallet", short: "0x91b0…4d7a", history: "Received 5,000 ATLAS seconds before the snapshot.", expected: "RECENT_ACQUISITION", source: "mock" },
  { key: "flagged", label: "Borrowing-Risk Wallet", short: "0x3c55…e90b", history: "Monitor saw a loan-shaped inbound transfer. Flagged BORROWING_RISK.", expected: "RISK_FLAGGED", source: "mock" },
  { key: "voted", label: "Already-Voted Wallet", short: "0x5e28…a613", history: "Voted FOR earlier in this proposal.", expected: "ALREADY_VOTED", source: "mock" },
];

export const timeline: MockEvent[] = [
  { id: "e1", at: "T-6h", kind: "acquired", wallet: "Recently Funded Wallet", proposalSlot: 1, text: "Received 5,000 ATLAS just before the proposal snapshot", source: "mock" },
  { id: "e2", at: "T-5h", kind: "flagged", wallet: "Borrowing-Risk Wallet", proposalSlot: 1, text: "Monitor flagged BORROWING_RISK after a loan-shaped inbound transfer", source: "mock" },
  { id: "e3", at: "T-3h", kind: "checked", wallet: "Long-Term Holder", proposalSlot: 1, text: "Eligibility preflight passed: 1,000 ATLAS at snapshot", source: "mock" },
  { id: "e4", at: "T-2h", kind: "allowed", wallet: "Already-Voted Wallet", proposalSlot: 1, text: "Vote FOR accepted", source: "mock" },
  { id: "e5", at: "T-1h", kind: "blocked", wallet: "Recently Funded Wallet", proposalSlot: 1, text: "Vote rejected: RECENT_ACQUISITION", source: "mock" },
  { id: "e6", at: "T-40m", kind: "blocked", wallet: "Borrowing-Risk Wallet", proposalSlot: 1, text: "Vote rejected: RISK_FLAGGED", source: "mock" },
];

// Derived from the records above so dashboard totals always match them.
export const totals = {
  activeProposals: proposals.length,
  protectedVotes: timeline.filter((e) => e.kind === "allowed").length,
  threatsBlocked: timeline.filter((e) => e.kind === "blocked").length,
};
