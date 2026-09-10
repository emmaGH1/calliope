/** Canonical Calliope env names with one-release Charter compatibility aliases. */
export function env(name: string, legacy?: string): string | undefined {
  return process.env[name] ?? (legacy ? process.env[legacy] : undefined);
}

export const CALLIOPE_ENV = {
  walletAddress: () => env("CALLIOPE_WALLET_ADDRESS", "CHARTER_WALLET_ADDRESS"),
  walletId: () => env("CALLIOPE_WALLET_ID", "CHARTER_WALLET_ID"),
  signerKey: () => env("CALLIOPE_SIGNER_KEY", "CHARTER_SIGNER_KEY"),
  builderCode: () => env("CALLIOPE_BUILDER_CODE", "CHARTER_BUILDER_CODE"),
  eventLog: () => env("CALLIOPE_EVENT_LOG", "CHARTER_EVENT_LOG"),
  agentDir: () => env("CALLIOPE_AGENT_DIR", "CHARTER_AGENT_DIR"),
  db: () => env("CALLIOPE_DB", "SIBYL_DB"),
  /** Base settlement (partner stack ×1.15) — independent of Virtuals ACP. */
  basePrivateKey: () => env("CALLIOPE_BASE_PRIVATE_KEY"),
  settlementAddress: () => env("CALLIOPE_SETTLEMENT_ADDRESS"),
  baseChain: () => env("CALLIOPE_BASE_CHAIN"), // "base-sepolia" (default) | "base"
  baseRpc: () => env("CALLIOPE_BASE_RPC"),
};
