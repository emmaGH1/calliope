/** Domain types for the Calliope org. Memory IS the org; these are its shapes. */

export interface Mission {
  name: string;
  mission: string;
  clientStandards: string[];
  policies: string[];
  foundedAt: string;
}

export type RouteTarget = { on: string; to: string; note?: string };

export interface Role {
  name: string;
  mandate: string;
  routes: RouteTarget[]; // handoff rules read at boot, not hardcoded
  model: { provider: "openai" | "xai" | "stub"; model: string };
}

export interface VendorRecord {
  name: string;
  kind: "internal" | "acp";
  quality: number | null; // learned score, null = no history yet
  skill?: number; // intrinsic capability — SIM port only, never read by decisions
  rate: number; // USDC
  jobs: number;
  failures: number;
  notes: string[];
  banned: boolean;
  walletAddress?: string; // ACP agents only
  offeringName?: string;
}

export interface Obligation {
  id: string;
  task: string;
  standard: string[];
  budget: number;
  status: "open" | "in_progress" | "delivered" | "paid" | "failed";
  assignedTo?: string;
  spend: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResult {
  obligationId: string;
  deliverable: string;
  vendor: string;
  spend: number;
  /** Set when a Base settlement tx was attempted (ok or honest failure). */
  baseTx?: string;
  baseExplorer?: string;
  decisions: Decision[];
}

/** Every choice the org makes cites the memory that caused it. */
export interface Decision {
  choice: string;
  because: string; // provenance chip text, e.g. "remembered: quality 4.6 @ $2.50"
  source: string; // memory category/name or "none (first contact)"
}

export interface MemoryIo {
  remember(category: string, name: string, body: unknown): Promise<unknown>;
  recall(category: string, name: string): Promise<{ ok: boolean; entity?: any }>;
  search(query: string, limit?: number): Promise<{ ok: boolean; count?: number; results?: any[] }>;
  list(category?: string, limit?: number): Promise<{ ok: boolean; count?: number; results?: any[] }>;
  forget(category: string, name: string, reason?: string): Promise<unknown>;
  setState(key: string, body: unknown): Promise<unknown>;
  getState(key: string): Promise<{ ok: boolean; value?: any }>;
  recordEvent(kind: string, body: unknown, category?: string, name?: string): Promise<unknown>;
}
