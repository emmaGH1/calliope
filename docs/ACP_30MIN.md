# Click-by-click: set up Virtuals ACP for Calliope

## First: this is NOT Vercel

| Name | What it is | Do you need it tonight? |
|---|---|---|
| **Vercel** | Website hosting (vercel.com) | **No.** Calliope desk runs on localhost. |
| **Virtuals** | Agent marketplace / ACP (app.virtuals.io) | **Yes** — only if you want the ×1.25 partner bonus. |

You are registering **AI agents on Virtuals Protocol**, so Calliope can hire another agent and pay with USDC on Base.

If this feels too heavy before 21:00 WAT: **skip it**. Sibyl-only (×1.00) is still a valid submission. Say “abort ACP”.

---

## What you are creating (2 agents)

Think of a shop:

1. **Buyer agent = Calliope Desk** — pays for work. Role: **Requestor**  
2. **Seller agent = Atelier** — does the work. Role: **Provider** (with one cheap offering)

Calliope’s code is the buyer. It needs the seller’s wallet + offering name to place a job.

---

## Step 0 — Browser wallet (5 min)

1. Install **MetaMask** or **Rabby** if you do not have one.  
2. Create/import a wallet. This is your **personal / “dev” wallet** (you sign with it).  
3. You will need a little **USDC on Base mainnet** later (~$1–$5). Not Ethereum mainnet. Not Sepolia.

---

## Step 1 — Open Virtuals ACP and connect

1. Go to: **https://app.virtuals.io/acp/join**  
2. Click **Connect Wallet** (top right).  
3. Approve in MetaMask/Rabby.  
4. Confirm your address shows in the UI.

---

## Step 2 — Create the BUYER agent (Calliope)

1. Click **Join ACP** → read the blurb → **Next**.  
2. Open **Register New Agent**.  
3. Fill in:
   - **Name:** `Calliope Desk`  
   - **Role:** **`Requestor`** ← this is the important one (buyer; hires others)  
   - Profile picture: any small JPG/PNG (required)  
4. Finish X / Telegram auth if the form requires it (use any account you can; VPN if blocked).  
5. On the agent page, create the agent smart wallet if prompted:
   - Click **Create Smart Contract Account** (or similar).  
6. **Whitelist your personal wallet** as the controller (Wallet Management / Whitelist).  
7. Copy these into a notepad (map to Calliope `.env` later):

| What you see on Virtuals | Put in `.env` as |
|---|---|
| Agent wallet address (the agent’s smart wallet, NOT your MetaMask address if they differ) | `CALLIOPE_WALLET_ADDRESS` |
| Wallet / Privy id (if shown) | `CALLIOPE_WALLET_ID` |
| Signer / whitelisted wallet private key (the key you use to sign — keep secret) | `CALLIOPE_SIGNER_KEY` |
| Builder code (optional) | `CALLIOPE_BUILDER_CODE` |

If the portal shows **Entity ID** instead of Wallet ID, paste what you see in chat and I will map it.

---

## Step 3 — Create the SELLER agent (vendor)

1. Still on ACP, **Register New Agent** again.  
2. Fill in:
   - **Name:** `Atelier JP`  
   - **Role:** **`Provider`** ← seller; offers a service  
   - Profile picture: any small image  
3. Create its smart wallet + whitelist the same personal wallet.  
4. Add a **service offering**:
   - Name: `localize-landing` (or any short name — remember it)  
   - Price: **$0.01** to **$1.00** (keep it tiny)  
   - Description: “Localize landing copy with brand voice”  
5. Copy:

| What you see | Put in `.env` as |
|---|---|
| Seller agent wallet address | `VENDOR_WALLET_ADDRESS` |
| Offering name exactly as typed | `VENDOR_OFFERING_NAME` |

---

## Step 4 — Fund the BUYER with USDC on Base

1. Buy/bridge a few dollars of **USDC**.  
2. Network must be **Base** (Coinbase’s L2, chain id **8453**).  
3. Send USDC to **`CALLIOPE_WALLET_ADDRESS`** (the Calliope Desk agent wallet).  
4. Wrong network = funds stuck. Double-check “Base” before send.

You need enough to cover the offering price (e.g. $1 offering → send ≥ $2 to be safe).

---

## Step 5 — Put secrets in the Calliope repo

In PowerShell:

```powershell
cd "C:\Users\Emma0\OneDrive\Documents\GitHub\sibyl labs\foreman\agent"
copy .env.example .env
notepad .env
```

Fill (example shape — use your real values):

```env
CALLIOPE_WALLET_ADDRESS=0x...
CALLIOPE_WALLET_ID=...
CALLIOPE_SIGNER_KEY=0x...
CALLIOPE_BUILDER_CODE=
VENDOR_WALLET_ADDRESS=0x...
VENDOR_OFFERING_NAME=localize-landing
```

Save. Restart the desk (`cd desk` → stop old server → `npm run dev`).

---

## Step 6 — Proof it worked

```powershell
cd "C:\Users\Emma0\OneDrive\Documents\GitHub\sibyl labs\foreman\agent"
npm run org -- reset --yes
npm run org -- found "Localize client landing copy with brand voice intact."
npm run org -- task "Localize the landing page hero to Japanese." 1
```

**Success:** log says `hire port: ACP(escrow on Base)` (not `SIM`).  
**Failure / still SIM:** say “abort ACP” — we submit Sibyl-only.

Then tell me **“env ready”** (you can hide the private key in chat).

---

## Abort rule

If you are not through Steps 1–4 within ~30 minutes, **stop**.  
Do not claim Base/Virtuals on the build page. Record the memory demo instead.
