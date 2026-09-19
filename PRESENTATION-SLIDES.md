# FlipGuard — Presentation Slides

---

## Slide 1: The Problem

**DAO votes are broken.**

Last-minute voting power grabs let attackers borrow tokens, swing a proposal, and exit — before anyone notices.

By the time the community reacts, the decision is irreversible.

> *"Flash loans gave us composability. They also gave governance a exploit."*

---

## Slide 2: FlipGuard

**Onchain governance guard.**

Every vote passes three checks before it counts:

1. **Snapshot Voting Power** — Weight from checkpointed balances at proposal creation. Late tokens = zero weight.
2. **Holding Period** — Tokens acquired within the minimum window are rejected. Flash loans can't swing results.
3. **Risk Registry** — Authorized monitors flag known loan-borrowers and sybil clusters onchain.

`assessVoter()` — free preflight. See exactly why before signing.

---

## Slide 3: Architecture

```
Next.js UI → wagmi + viem → FlipGuardGovernance (Solidity)
                                  ├── MockGovernanceToken (ERC20Votes)
                                  └── MockRiskRegistry

No backend. No database. No indexer.
```

- **Monad Testnet** — 400ms blocks, instant feedback
- **14 Foundry tests** — snapshot weight, holding period, flags, fuzzing
- **OpenZeppelin ERC20Votes** — audited checkpoint logic

---

## Slide 4: Demo Flow

| Step | Action | Result |
|------|--------|--------|
| 1 | Connect MetaMask → Monad Testnet | Wallet ready |
| 2 | Open "Treasury Diversification" | See live eligibility for 4 wallet types |
| 3 | Clean holder votes | ✅ Confirmed tx + explorer link |
| 4 | Suspicious wallet tries | ❌ Reverted — `VoteBlocked(reason)` |
| 5 | Check Protection Log | Contract events, blocked preflights, monitor signals |

---

## Slide 5: Why Monad + What's Next

**Why Monad:**
- 400ms blocks → vote enforcement feels instant
- Full EVM compatibility → reuse audited OpenZeppelin contracts
- 10,000 TPS → scales to real DAO governance

**What's Next:**
- Flash loan detection heuristics
- Cross-proposal wallet clustering
- Delegate voting support
- Production risk monitor integration

---

*FlipGuard — Fair votes. Stronger governance.*
