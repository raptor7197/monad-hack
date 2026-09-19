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
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts --no-git
cd ..
```

---

## 2. Run the UI in Demo Preview (no chain needed, ~1 minute)

```bash
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. With no contract addresses set, the app runs in **Demo Preview**: all fixtures display, voting is disabled, and a yellow header pill says so.

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

### 4.1 Create an encrypted deployer keystore (never paste a raw key anywhere)

```bash
cast wallet new                                        # or use an existing hackathon-only wallet
cast wallet import flipguard-deployer --interactive    # paste key once; stored encrypted in ~/.foundry/keystores
cast wallet address --account flipguard-deployer
```

Fund that address at https://faucet.monad.xyz, then check:

```bash
cast balance $(cast wallet address --account flipguard-deployer) --rpc-url https://testnet-rpc.monad.xyz --ether
```

### 4.2 Optional script settings

```bash
cd contracts
cp .env.example .env
set -a; source .env; set +a
```

- `MIN_HOLDING_PERIOD` (default 60s): how long tokens must be held before a snapshot.
- `DEMO_FLAGGED_WALLET`: set to a **second MetaMask account you control** if you want to press "Vote" as a flagged wallet yourself. If unset, a derived demo address is used; its rejection still shows in the risk panel.

### 4.3 Deploy

```bash
forge script script/Deploy.s.sol --rpc-url monad --account flipguard-deployer --broadcast
```

The script prints:

```
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_RISK_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=0x...
Deployer (clean holder): 0x...
```

It mints 1,000 ATLAS to the deployer (the **clean long-term holder**), mints 250 ATLAS to the flagged wallet and flags it `BORROWING_RISK`.

### 4.4 Seed proposals (wait for the holding period first)

Wait at least `MIN_HOLDING_PERIOD` seconds (60 by default) so the deployer counts as a long-term holder, then:

```bash
export NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=0x...   # from 4.3
forge script script/Seed.s.sol --rpc-url monad --account flipguard-deployer --broadcast
```

This funds the "recently funded" wallet right before creating three proposals (so it is blocked with `RECENT_ACQUISITION`) and prints `NEXT_PUBLIC_FIRST_PROPOSAL_ID`.

**Demo reset:** run Seed again at any time. It opens three fresh proposals. Update `NEXT_PUBLIC_FIRST_PROPOSAL_ID` to the new value.

### 4.5 Verify the contracts

Use the current Monad guide as the authority: https://docs.monad.xyz/guides/verify-smart-contract/foundry. At the time of writing it verifies through Sourcify:

```bash
V="--chain 10143 --verifier sourcify --verifier-url https://sourcify-api-monad.blockvision.org"
forge verify-contract <TOKEN>    src/MockGovernanceToken.sol:MockGovernanceToken $V --constructor-args $(cast abi-encode "c(address)" <DEPLOYER>)
forge verify-contract <REGISTRY> src/MockRiskRegistry.sol:MockRiskRegistry       $V --constructor-args $(cast abi-encode "c(address)" <DEPLOYER>)
forge verify-contract <GOV>      src/FlipGuardGovernance.sol:FlipGuardGovernance $V --constructor-args $(cast abi-encode "c(address,address,uint48,address)" <TOKEN> <REGISTRY> 60 <DEPLOYER>)
```

Record addresses, tx hashes (from `contracts/broadcast/*/10143/run-latest.json`), compiler (`0.8.28`) and timestamp in `deployments/monad-testnet.json`.

### 4.6 Read-only sanity checks

```bash
RPC=https://testnet-rpc.monad.xyz
cast call $NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS "proposalCount()(uint256)" --rpc-url $RPC
cast call $NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS "assessVoter(uint256,address)(bool,uint256,uint8,uint8)" 1 <DEPLOYER> --rpc-url $RPC
# expected: true, 1000000000000000000000, 0 (ELIGIBLE), 0 (NONE)
```

---

## 5. Point the UI at the deployment

Edit `.env.local`:

```bash
NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_RISK_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_FIRST_PROPOSAL_ID=1
NEXT_PUBLIC_DEMO_CLEAN_WALLET=<deployer address>
# if you set DEMO_FLAGGED_WALLET for the scripts, use the same value here:
NEXT_PUBLIC_DEMO_FLAGGED_WALLET=
```

Restart `npm run dev`. The header pill turns cyan: **Monad Testnet · 10143**.

---

## 6. Wallets: MetaMask and Privy

### MetaMask (default)
Leave `NEXT_PUBLIC_PRIVY_APP_ID` empty. The header shows **Connect MetaMask**, which asks MetaMask to add/switch to Monad Testnet (10143). If MetaMask is on another chain, the header shows **Switch to Monad Testnet**.

Import the deployer key into MetaMask (Account → Import account) to vote as the clean holder.

### Privy
1. Create an app at https://dashboard.privy.io.
2. In the app's allowed domains, add `http://localhost:3000` (and your hosted URL later).
3. Set `NEXT_PUBLIC_PRIVY_APP_ID=<app id>` in `.env.local` and restart.

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
| Header says *Demo Preview* | `NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS` is empty/invalid. Restart the dev server after editing `.env.local`. |
| "Proposal not found onchain" | Run `Seed.s.sol`, or fix `NEXT_PUBLIC_FIRST_PROPOSAL_ID`. |
| Deployer shows *Recent Token Acquisition* | You seeded before `MIN_HOLDING_PERIOD` elapsed. Wait, then run Seed again. |
| "Not enough MON for gas" | https://faucet.monad.xyz |
| Privy "Invalid Privy app ID" / origin error | Check the app id and allowed domains in the Privy dashboard. |
| Protection log misses old votes | It scans only the latest ~2,000 blocks (RPC log-range limits). Recent demo activity always shows. |
| `forge script` "environment variable not found" | `export NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=...` before running Seed. |
