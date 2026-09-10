# 30-minute ACP attempt (Base mainnet, tiny USDC)

**Start:** note the clock. **Hard abort** if the hire-port chip is still
`SIM(no real escrow)` after 30 minutes → Sibyl-only submission.

## Why not Base Sepolia testnet?

Virtuals FAQ: external builders generally **cannot create testnet agents**
without DevRel. They recommend **Base mainnet** with tiny prices ($0.01).
Calliope already targets mainnet `base` — no code change needed for this path.

Hackathon Base credit needs an **executed onchain action** in the demo.
Mainnet USDC escrow at $0.01–$1 counts. Sepolia would also count in principle,
but registration is the blocker tonight.

## You do these steps (agent cannot create your Virtuals account)

### 1. Register buyer agent (~10 min)

1. Open https://app.virtuals.io/acp/new (or Join ACP → Register New Agent).
2. Role: **Requestor** (buyer / client).
3. Name it something like `Calliope Desk`.
4. Complete wallet connect + agent wallet provisioning (Base mainnet).
5. From the agent page, copy into a notes file:
   - Agent wallet address → `CALLIOPE_WALLET_ADDRESS`
   - Wallet / Privy id → `CALLIOPE_WALLET_ID`
   - Signer key (whitelisted) → `CALLIOPE_SIGNER_KEY`
   - Builder code if shown → `CALLIOPE_BUILDER_CODE` (optional)

### 2. Register or pick a vendor offering (~10 min)

You need a **provider** agent with a named offering Calliope can hire.

Options:
- Register a second agent as provider with a cheap offering ($0.01–$1), **or**
- Hire an existing public offering (copy its wallet + offering name).

Save:
- `VENDOR_WALLET_ADDRESS`
- `VENDOR_OFFERING_NAME`

### 3. Fund buyer with USDC on Base mainnet (~5 min)

Send a small amount of **USDC on Base (chain 8453)** to `CALLIOPE_WALLET_ADDRESS`.
$1–$5 is enough for a demo hire. Wrong chain = lost funds.

### 4. Drop env into the repo (~2 min)

```powershell
cd "C:\Users\Emma0\OneDrive\Documents\GitHub\sibyl labs\foreman\agent"
copy .env.example .env
# edit .env with the six values above
```

Restart the desk (`npm run dev` in `desk/`) so the agent process picks up env.

### 5. Proof check (~3 min)

```powershell
cd agent
npm run org -- reset --yes
npm run org -- found "Localize client landing copy with brand voice intact."
npm run org -- task "Localize the landing page hero to Japanese." 1
```

Success looks like:
- log line `hire port: ACP(escrow on Base)` (not SIM)
- a real job / spend / tx-ish id in the decision log

Paste those six env values (redact the signer key in chat if you want — put
it only in `.env`) and say **“env ready”** when steps 1–4 are done. I will
drive the proof hire and update demo/README claims only if ACP is live.

## Abort criteria

Abort and go Sibyl-only if any of these are true at T+30m:
- cannot finish agent registration
- no USDC on Base mainnet in the agent wallet
- console still shows `SIM(no real escrow)`
- hire throws / times out with no onchain job

Do **not** claim Base or Virtuals on the build page after an abort.
