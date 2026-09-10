import assert from "node:assert/strict";
import { CALLIOPE_ENV } from "../config/env.js";

const saved = { ...process.env };
try {
  delete process.env.CALLIOPE_WALLET_ID;
  process.env.CHARTER_WALLET_ID = "legacy-wallet-id";
  assert.equal(CALLIOPE_ENV.walletId(), "legacy-wallet-id");

  process.env.CALLIOPE_WALLET_ID = "canonical-wallet-id";
  assert.equal(CALLIOPE_ENV.walletId(), "canonical-wallet-id");

  delete process.env.CALLIOPE_WALLET_ID;
  delete process.env.CHARTER_WALLET_ID;
  assert.equal(CALLIOPE_ENV.walletId(), undefined);

  console.log("environment compatibility: PASS (canonical wins; legacy fallback works)");
} finally {
  for (const key of Object.keys(process.env)) {
    if (!(key in saved)) delete process.env[key];
  }
  Object.assign(process.env, saved);
}
