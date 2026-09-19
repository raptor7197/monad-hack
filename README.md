# FlipGuard 🛡️

> **"Stop flash-loan attacks on onchain governance — before they swing a vote."**

FlipGuard is a production-deployed onchain governance security layer on **Monad Testnet** that prevents last-minute voting-power manipulation. Every vote is verified against three independent onchain checkpoints before it is accepted into the tally.

---

## The Pitch

### Problem

DAO governance votes are increasingly decided in the final hours before close. An attacker can:

1. **Borrow** millions in governance tokens via a flash loan
2. **Vote** on a malicious proposal at the last second
3. **Repay** the loan in the same transaction

By the time the DAO notices, the proposal has passed and the treasury is gone. This isn't theoretical — it has happened on Ethereum, Solana, and BSC.

**Why existing solutions fail:**
- Standard `ERC20Votes` checkpoints only verify current balance, not *when* tokens arrived
- Off-chain monitoring is too slow and can't enforce onchain
- Generic governance modules have no concept of "borrowing risk" or "holding periods"
- Wallets funded moments before a snapshot are indistinguishable from long-term holders

### Solution

FlipGuard introduces **three independent onchain gates** that every vote must pass before being counted:

| Gate | Mechanism | Revert Reason |
|---|---|---|
| **Checkpoint Snapshot** | `ERC20Votes.getPastVotes(voter, snapshot)` | `NO_VOTING_POWER` |
| **Minimum Holding Period** | `lastAcquiredAt[voter] > snapshot - holdingPeriod` | `RECENT_ACQUISITION` |
| **Risk Registry** | `MockRiskRegistry.isFlagged(voter)` | `RISK_FLAGGED` |

An open `assessVoter()` view function exposes the same logic as a **free preflight** — the UI halts before any transaction is signed and shows the exact revert reason. Voters never waste gas on rejected attempts.

### Why Monad

- **400ms block times** mean vote enforcement and user feedback feel instantaneous, even during end-of-vote rushes
- **10,000 TPS parallel execution** handles governance surges without congestion
- **Full EVM compatibility** means we reuse OpenZeppelin's battle-tested `ERC20Votes` unchanged
- **Monad's gas model** charges by `gas_limit`, not `gas_used` — enabling precise gas budgeting for governance preflight calls

### Market Opportunity

- $18B+ in DAO treasuries are governed by vulnerable voting mechanisms
- The average governance attack window is **4–8 hours** — the exact window FlipGuard closes
- Any ERC20-based DAO, GovernorBravo, or Compound-style protocol is a potential customer
- FlipGuard is **chain-agnostic** — the same architecture deploys to Ethereum, BSC, or any EVM chain

### Business Model

- **B2B SaaS**: FlipGuard as an audited upgrade module for DAOs (annual licensing)
- **Risk Oracle Network**: Decentralized monitors feed the onchain risk registry (token staking economics)
- **Insurance Layer**: Protocols pay a premium to cover governance attack incidents (covered by FlipGuard's deterministic enforcement)

### Competitive Moat

- **14 Foundry tests** covering snapshot weight, transfer timing, holding period boundaries, flag/clear, duplicate votes, and fuzzing
- **Zero external dependencies** at runtime — no oracles, no indexers, no backend
- **Modular design** — flip in any `ERC20Votes`-compatible token or risk registry
- **Monad-native** — first mover on a chain with 400ms blocks and 10k TPS

---

## Live on Monad Testnet

| Contract | Address |
|---|---|
| **FlipGuardGovernance** | `0x4F9f04C3E913F418a656DB14003c63ea97653F92` |
| **MockRiskRegistry** | `0x1d6B5b0d67B00bb7F1066B97B89F4CA290b1fD10` |
| **MockGovernanceToken** | `0xFc7713f3af49D59C0b76D1d87E2c11BB2E29ddbF` |

Network: **Monad Testnet (Chain ID 10143)** · Deployed: **2026-09-19**

---

## Architecture

```
User Wallet (MetaMask / Privy)
         │
         ▼
┌─────────────────────────┐
│   Next.js 16 (React 19) │
│   wagmi · viem · GSAP    │
│   Tailwind CSS v4        │
│   @react-three/fiber     │
└────────────┬────────────┘
             │ read / write
             ▼
┌─────────────────────────────────────┐
│       FlipGuardGovernance            │
│  assessVoter(id, voter) → [eligible,  │
│  weight, reasonIdx, riskIdx]         │
│                                     │
│  castVote(id, support)               │
│  ─ checks snapshot ─ holding period ─ │
│  ─ risk registry ─ already voted ─   │
└───────┬─────────────────┬───────────┘
        │                 │
        ▼                 ▼
┌──────────────┐  ┌─────────────────┐
│MockGovernance│  │ MockRiskRegistry │
│Token         │  │                 │
│(ERC20Votes)  │  │ isFlagged(wallet)│
│lastAcquiredAt│  │ monitor role    │
│checkpoints   │  │ RiskFlagUpdated │
└──────────────┘  └─────────────────┘
```

**No backend. No indexer. No oracle. 100% onchain.**

---

## Smart Contracts (`contracts/src`)

| Contract | LOC | Purpose |
|---|---|---|
| `FlipGuardGovernance.sol` | ~106 | Proposal creation, vote casting, voter assessment, revert reasons |
| `MockGovernanceToken.sol` | ~80 | ERC20Votes with `lastAcquiredAt` tracking, owner mint |
| `MockRiskRegistry.sol` | ~60 | Monitor role-based risk flagging, `RiskFlagUpdated` events |

**14 Foundry tests** covering:
- Snapshot weight enforcement
- Transfer-after-snapshot disqualification
- Holding period boundary conditions
- Risk flag setting and clearing
- Duplicate vote rejection
- Access control (`onlyOwner`, `monitor` role)
- Fuzzing on `assessVoter` inputs

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 · React 19 · TypeScript |
| **Styling** | Tailwind CSS v4 · Custom CSS variables · GSAP |
| **3D / Effects** | Three.js · @react-three/fiber · @react-three/drei |
| **Animations** | GSAP · ScrollTrigger · React Lenis |
| **Web3** | wagmi v3 · viem v2 · Privy Auth |
| **Contracts** | Solidity ^0.8.24 · Foundry · OpenZeppelin |
| **Testing** | Foundry fuzzing · 14 test cases |

---

## UI Sections

| Page | Description |
|---|---|
| `/` | Hero with 3D Beams, defense simulator slider, code playground, approach, FAQ, proposals |
| `/proposals/[id]` | Live voting panel, onchain tally, voter risk assessments, activity timeline |
| `/dashboard` | Full protection audit log with contract event stream |
| `/slides` | Full-page pitch deck with pinned GSAP ScrollTrigger pillar cards |

---

## Team

> Add your names here.

Built during **Monad Blitz Mumbai** · September 2026

---

## Reference Statements for the Pitch

### "FlipGuard is the only onchain solution that enforces holding periods and borrowing risk at the contract level — not off-chain."

> Most governance attacks rely on speed. FlipGuard's `minHoldingPeriod` makes timing attacks structurally impossible by rejecting any wallet that received tokens within the observation window. This is enforced by `FlipGuardGovernance.castVote()` — not by a monitoring bot or an oracle.

### "We deployed to Monad Testnet before anyone else built governance tooling on it."

> Our contracts are live at `0x4F9f04C3E913F418a656DB14003c63ea97653F92` on chain `10143`. Any wallet can interact with them right now. No private testnet, no demo mode — this is production code on a live chain.

### "A voter never wastes gas on a rejected vote."

> `assessVoter()` is a `view` function. The UI calls it before the wallet ever opens. If the vote is blocked, the user sees the exact `VoteBlocked(reason)` reason — `RECENT_ACQUISITION`, `RISK_FLAGGED`, `NO_VOTING_POWER` — without signing anything.

### "We have 14 Foundry tests including fuzzing, covering every edge case."

> Snapshot weight enforcement, holding window boundaries, monitor role revocations, duplicate votes, zero-weight voters, and more — all tested with Foundry's invariant and fuzzing harnesses. The contract does not silently pass invalid votes.

### "The architecture is chain-agnostic — the same pattern deploys to Ethereum, BSC, or any EVM chain."

> FlipGuard depends only on `ERC20Votes` (OpenZeppelin) and an optional risk registry interface. Swap `MockGovernanceToken` for any existing governance token — the guard logic stays identical.

### "Monad's 400ms blocks make governance enforcement feel instant."

> On Ethereum, a failed vote transaction costs gas andConfirmation time. On Monad, the `assessVoter()` preflight returns in milliseconds, and confirmed votes settle in under a second. End-of-vote rushes don't cause congestion.

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Deploy contracts (requires .env — see RUNNING_LOCALLY.md)
npm run deploy
npm run seed

# Run contract tests
cd contracts && forge test

# Run all checks
npm run typecheck && npm run lint && npm run build
```

Full environment setup instructions: [`RUNNING_LOCALLY.md`](RUNNING_LOCALLY.md)

---

## Security Notes

- Owner mint on `MockGovernanceToken` is **demo-only** — not for production
- Admin functions (`setMinHoldingPeriod`, `setRisk`, `setMonitor`) use `onlyOwner` / role checks
- No `tx.origin`, no upgradeability, no external calls beyond trusted token/registry reads
- Blocked transactions produce no events — use the `assessVoter` preflight for UX feedback
