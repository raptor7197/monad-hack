# Running FlipGuard locally

Everything you need to go from a fresh clone to a working demo: UI only, then contracts on Monad Testnet, then a real vote with MetaMask (or Privy).

---

## 0. Prerequisites

| Tool | Version used | Install |
|---|---|---|
| Node.js | 22.x | https://nodejs.org |
| npm | 10.x | ships with Node |
| Foundry (`forge`, `cast`) | 1.8.x | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |
| MetaMask | latest | https://metamask.io/download |
| Test MON | — | https://faucet.monad.xyz |

Add Foundry to your PATH if the installer asks you to: `export PATH="$PATH:$HOME/.foundry/bin"`.

---

## 1. Install

```bash
git clone <your-repo-url> flipguard && cd flipguard
npm install                      # .npmrc sets legacy-peer-deps (needed by Privy's optional peers)

cd contracts
# skip if contracts/lib/forge-std and contracts/lib/openzeppelin-contracts already exist
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts --no-git
cd ..
```

---

## 2. The one env file: `.env`

All config lives in a single git-ignored `.env` at the repo root. Next.js and the Foundry scripts (`npm run deploy` / `npm run seed`) both read it. It holds:

| Variable | What |
|---|---|
| `PRIVATE_KEY`, `DEPLOYER_ADDRESS` | Testnet-only deployer wallet |
| `MIN_HOLDING_PERIOD`, `PROPOSAL_DURATION`, `DEMO_FLAGGED_WALLET` | Script settings |
| `NEXT_PUBLIC_MONAD_*`, `NEXT_PUBLIC_BLOCK_EXPLORER_URL` | Network |
| `NEXT_PUBLIC_*_ADDRESS`, `NEXT_PUBLIC_FIRST_PROPOSAL_ID` | Deployed contracts |
| `NEXT_PUBLIC_DEMO_*_WALLET` | Wallets shown in the risk panel |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Optional Privy login |

`.env` is never committed. Share it with teammates privately. **Only ever put a testnet key in it.**

## 2.1 Run the UI

```bash
npm run dev
```

Open http://localhost:3000. If the contract addresses are empty, the app runs in **Demo Preview** (fixtures only, voting disabled, yellow header pill).

---

## 3. Build and test the contracts

```bash
cd contracts
forge fmt --check
forge build
forge test -vv            # 14 tests: snapshot weight, holding period, risk flags, access control, fuzzing
```

After any contract change, regenerate the frontend ABI:

```bash
cd .. && npm run abi       # writes lib/abi.ts from contracts/out
```

---

## 4. Deploy to Monad Testnet

### 4.1 Deployer wallet

Only needed if `.env` has no `PRIVATE_KEY` yet:

```bash
cast wallet new        # copy Address -> DEPLOYER_ADDRESS and Private key -> PRIVATE_KEY in .env
```

Fund it at https://faucet.monad.xyz, then check:

```bash
cast balance <DEPLOYER_ADDRESS> --rpc-url https://testnet-rpc.monad.xyz --ether
```

Optional: set `DEMO_FLAGGED_WALLET` in `.env` to a **second MetaMask account you control** so you can press "Vote" as a flagged wallet yourself (also set `NEXT_PUBLIC_DEMO_FLAGGED_WALLET` to the same value).

### 4.2 Deploy

```bash
npm run deploy
```

The script prints:

```
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_RISK_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=0x...
Deployer (clean holder): 0x...
```

It mints 1,000 ATLAS to the deployer (the **clean long-term holder**), mints 250 ATLAS to the flagged wallet and flags it `BORROWING_RISK`.

Copy the three printed addresses into `.env`.

### 4.3 Seed proposals (wait for the holding period first)

Wait at least `MIN_HOLDING_PERIOD` seconds (60 by default) so the deployer counts as a long-term holder, then:

```bash
npm run seed
```

This funds the "recently funded" wallet right before creating three proposals (so it is blocked with `RECENT_ACQUISITION`) and prints `NEXT_PUBLIC_FIRST_PROPOSAL_ID`.

**Demo reset:** run Seed again at any time. It opens three fresh proposals. Update `NEXT_PUBLIC_FIRST_PROPOSAL_ID` to the new value.

### 4.4 Verify the contracts

Use the current Monad guide as the authority: https://docs.monad.xyz/guides/verify-smart-contract/foundry. At the time of writing it verifies through Sourcify:

```bash
V="--chain 10143 --verifier sourcify --verifier-url https://sourcify-api-monad.blockvision.org"
forge verify-contract <TOKEN>    src/MockGovernanceToken.sol:MockGovernanceToken $V --constructor-args $(cast abi-encode "c(address)" <DEPLOYER>)
forge verify-contract <REGISTRY> src/MockRiskRegistry.sol:MockRiskRegistry       $V --constructor-args $(cast abi-encode "c(address)" <DEPLOYER>)
forge verify-contract <GOV>      src/FlipGuardGovernance.sol:FlipGuardGovernance $V --constructor-args $(cast abi-encode "c(address,address,uint48,address)" <TOKEN> <REGISTRY> 60 <DEPLOYER>)
```

Record addresses, tx hashes (from `contracts/broadcast/*/10143/run-latest.json`), compiler (`0.8.28`) and timestamp in `deployments/monad-testnet.json`.

### 4.5 Read-only sanity checks

```bash
RPC=https://testnet-rpc.monad.xyz
cast call $NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS "proposalCount()(uint256)" --rpc-url $RPC
cast call $NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS "assessVoter(uint256,address)(bool,uint256,uint8,uint8)" 1 <DEPLOYER> --rpc-url $RPC
# expected: true, 1000000000000000000000, 0 (ELIGIBLE), 0 (NONE)
```

---

## 5. Point the UI at the deployment

Make sure `.env` has `NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS`, `NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS`, `NEXT_PUBLIC_RISK_REGISTRY_ADDRESS`, `NEXT_PUBLIC_FIRST_PROPOSAL_ID` and `NEXT_PUBLIC_DEMO_CLEAN_WALLET` (= deployer), then restart `npm run dev`. The header pill turns cyan: **Monad Testnet · 10143**.

---

## 6. Wallets: MetaMask and Privy

### MetaMask (default)
Leave `NEXT_PUBLIC_PRIVY_APP_ID` empty. The header shows **Connect MetaMask**, which asks MetaMask to add/switch to Monad Testnet (10143). If MetaMask is on another chain, the header shows **Switch to Monad Testnet**.

Import the deployer key into MetaMask (Account → Import account) to vote as the clean holder.

### Privy
1. Create an app at https://dashboard.privy.io.
2. In the app's allowed domains, add `http://localhost:3000` (and your hosted URL later).
3. Set `NEXT_PUBLIC_PRIVY_APP_ID=<app id>` in `.env` and restart.

The header then shows **Log in**. Privy's modal offers MetaMask, detected wallets, WalletConnect, email and Google. Email/Google users get an embedded wallet; fund it with test MON before voting.

---

## 7. The demo, end to end

1. Open **Treasury Diversification** (`/proposals/1`).
2. **Voter risk assessment** shows live `assessVoter()` results for the demo wallets: Clean, Recent Token Acquisition, Borrowing Risk Flag.
3. Connected as the deployer, **Your vote** shows *Clean* and 1,000 ATLAS snapshot power. Click **Vote FOR**, confirm in MetaMask, then follow the explorer link.
4. Click again: blocked with `ALREADY_VOTED` (simulated; nothing is sent).
5. Switch MetaMask to the flagged account (if you set `DEMO_FLAGGED_WALLET`) and click **Vote**: the contract's `VoteBlocked(RISK_FLAGGED)` reason is shown and logged.
6. Open **Protection log** (`/dashboard`): your vote is a *Contract event* with a tx link; blocked attempts are *Preflight (this browser)*; fixtures are *Simulated monitor*.

---

## 8. Production build

```bash
npm run typecheck
npm run lint
npm run build && npm start
```

On Vercel/Netlify, set the same `NEXT_PUBLIC_*` variables in the host dashboard.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ERESOLVE` on `npm install` | Make sure `.npmrc` (`legacy-peer-deps=true`) is present. |
| Header says *Demo Preview* | `NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS` is empty/invalid. Restart the dev server after editing `.env`. |
| "Proposal not found onchain" | Run `Seed.s.sol`, or fix `NEXT_PUBLIC_FIRST_PROPOSAL_ID`. |
| Deployer shows *Recent Token Acquisition* | You seeded before `MIN_HOLDING_PERIOD` elapsed. Wait, then run Seed again. |
| "Not enough MON for gas" | https://faucet.monad.xyz |
| Privy "Invalid Privy app ID" / origin error | Check the app id and allowed domains in the Privy dashboard. |
| Protection log misses old votes | It scans only the latest ~2,000 blocks (RPC log-range limits). Recent demo activity always shows. |
| `npm run seed` "environment variable not found" | Put `NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS` in `.env` first. |
| Console: `ObjectMultiplex - orphaned data for stream "metamask-multichain-provider"` | Harmless MetaMask extension (Firefox) log noise, not an app error. Ignore it. |
