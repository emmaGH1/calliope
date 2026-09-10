# 45-minute Base-only path (×1.15, no Virtuals)

Virtuals is optional. **Base alone** is enough for one partner stack (×1.15).

## Score clarity (not a win probability)

| Setup | Multiplier |
|---|---|
| Sibyl only | ×1.00 |
| Sibyl + Base | ×1.15 |
| Sibyl + Base + Virtuals | ×1.25 |

Rubric is still out of 110 before that. A clear memory demo at ×1.00 can beat a weak ×1.25 entry. Missing the video is worse than missing the multiplier.

## What we built

`CalliopeSettlement` on **Base Sepolia** — after each QA ruling, Calliope posts a `Settled` event (pass/fail + spend). Judges see a real Basescan tx. That is an executed onchain action on Base.

## What you must do (≈5 min)

1. Open a Base Sepolia faucet (pick one that works for you):
   - https://www.alchemy.com/faucets/base-sepolia
   - https://faucet.quicknode.com/base/sepolia
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet (check for Sepolia)
2. Paste this address and request test ETH:

```text
0x752df8f16563f1dDd2ABf063ce951810a0Be1C1F
```

3. Reply **“funded”** when the faucet succeeds.

I will then deploy the contract, run one settle, and wire the explorer link into the demo script. If funding fails within the timebox, we abort and record Sibyl-only.
