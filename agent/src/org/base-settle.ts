/**
 * Optional Base settlement: after a QA ruling, post a Settled event on Base
 * Sepolia (or Base mainnet if configured). Env-gated — never pretends to run.
 *
 * Counts as the Base partner stack when judges see a real tx in the demo.
 * Virtuals/ACP is separate and not required for this path.
 */
import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
  encodeFunctionData,
  type Hex,
  keccak256,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import { CALLIOPE_ENV, env } from "../config/env.js";

const abi = parseAbi([
  "function settle(bytes32 obligationId, uint8 result, uint256 spendCents)",
  "event Settled(bytes32 indexed obligationId, address indexed settler, uint8 result, uint256 spendCents)",
]);

export type BaseSettleResult = {
  ok: true;
  txHash: Hex;
  explorerUrl: string;
  chainId: number;
  label: string;
} | {
  ok: false;
  reason: string;
  label: string;
};

function chainFor() {
  const name = (CALLIOPE_ENV.baseChain() ?? "base-sepolia").toLowerCase();
  return name === "base" || name === "8453" ? base : baseSepolia;
}

function explorerTx(chainId: number, hash: string) {
  return chainId === base.id
    ? `https://basescan.org/tx/${hash}`
    : `https://sepolia.basescan.org/tx/${hash}`;
}

/** True when settlement env is complete enough to attempt a live tx. */
export function baseSettleReady(): boolean {
  return !!(CALLIOPE_ENV.basePrivateKey() && CALLIOPE_ENV.settlementAddress());
}

export function baseSettleLabel(): string {
  if (!baseSettleReady()) return "BASE(not configured)";
  const c = chainFor();
  return c.id === base.id ? "BASE(mainnet settle)" : "BASE(sepolia settle)";
}

/**
 * Post a Settled receipt for this obligation. No-ops with an honest reason
 * when env is missing — callers must surface that to the log.
 */
export async function settleOnBase(input: {
  obligationId: string;
  pass: boolean;
  spendUsd: number;
}): Promise<BaseSettleResult> {
  const label = baseSettleLabel();
  const pk = CALLIOPE_ENV.basePrivateKey();
  const address = CALLIOPE_ENV.settlementAddress() as `0x${string}` | undefined;
  const rpc = CALLIOPE_ENV.baseRpc();

  if (!pk || !address) {
    return {
      ok: false,
      reason: "CALLIOPE_BASE_PRIVATE_KEY / CALLIOPE_SETTLEMENT_ADDRESS not set",
      label,
    };
  }

  const chain = chainFor();
  const account = privateKeyToAccount(pk as Hex);
  const transport = http(rpc ?? chain.rpcUrls.default.http[0]);
  const wallet = createWalletClient({ account, chain, transport });
  const publicClient = createPublicClient({ chain, transport });

  const obligationId = keccak256(toBytes(input.obligationId));
  const spendCents = BigInt(Math.max(0, Math.round(input.spendUsd * 100)));
  const result = input.pass ? 1 : 0;

  try {
    const data = encodeFunctionData({
      abi,
      functionName: "settle",
      args: [obligationId, result, spendCents],
    });
    const hash = await wallet.sendTransaction({
      to: address,
      data,
    });
    await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 });
    return {
      ok: true,
      txHash: hash,
      explorerUrl: explorerTx(chain.id, hash),
      chainId: chain.id,
      label,
    };
  } catch (e) {
    return {
      ok: false,
      reason: (e as Error).message?.slice(0, 200) ?? "settle failed",
      label,
    };
  }
}

/** Re-export env peek for session boot chip. */
export function baseSettleEnvHint() {
  return {
    ready: baseSettleReady(),
    label: baseSettleLabel(),
    chain: CALLIOPE_ENV.baseChain() ?? "base-sepolia",
    hasKey: !!CALLIOPE_ENV.basePrivateKey(),
    hasContract: !!CALLIOPE_ENV.settlementAddress(),
    rpc: !!env("CALLIOPE_BASE_RPC"),
  };
}
