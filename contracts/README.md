# CalliopeSettlement (Base)

Minimal obligation receipt used for the Sibyl Labs Hackathon **Base** partner stack.

- **Network:** Base Sepolia (84532)
- **Contract:** [`0xEc8749f2e33E4B4cdBee1B79A2CF9b12E2183819`](https://sepolia.basescan.org/address/0xEc8749f2e33E4B4cdBee1B79A2CF9b12E2183819)
- **Deploy tx:** [`0x4a2e6ca2772ad3f98ae71e39eeea4c78c31b262d14ea7773fa2885892125dab4`](https://sepolia.basescan.org/tx/0x4a2e6ca2772ad3f98ae71e39eeea4c78c31b262d14ea7773fa2885892125dab4)
- **Example Settled (FAIL):** [`0x28bc3dd8…`](https://sepolia.basescan.org/tx/0x28bc3dd8cd39a06636d391994bde0a779092dfcf5960731b0c43aabb4fdbc40e)
- **Example Settled (PASS):** [`0xd21f5676…`](https://sepolia.basescan.org/tx/0xd21f5676db240c65bcca43b78ee63ffc47394125d78a86efdfc466f07990bdf9)

```bash
forge build
forge create src/CalliopeSettlement.sol:CalliopeSettlement \
  --rpc-url https://sepolia.base.org \
  --private-key $CALLIOPE_BASE_PRIVATE_KEY \
  --broadcast
```

Agent env: `CALLIOPE_SETTLEMENT_ADDRESS`, `CALLIOPE_BASE_PRIVATE_KEY`, `CALLIOPE_BASE_CHAIN=base-sepolia`.
