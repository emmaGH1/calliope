import { spawnSync } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Thin TS client for Sibyl Memory, spoken over stdio MCP.
 *
 * Server resolution order (first that can import sibyl_memory_mcp wins):
 *   1. SIBYL_PYTHON env → `python -m sibyl_memory_mcp`
 *   2. python / python3 / py -3 on PATH (probed via import check)
 *   3. sibyl-memory-mcp console script on PATH (uv tool / pip both expose it;
 *      wrapped in `cmd /c` on Windows so stdio stays a clean pipe)
 * Install: `uv tool install 'sibyl-memory-cli[mcp]'` (or pip). Works
 * pre-activation — the store is local SQLite at ~/.sibyl-memory/memory.db.
 */
interface ServerLaunch {
  command: string;
  args: string[];
}

function canImport(pythonCmd: string): boolean {
  const r = spawnSync(pythonCmd, ["-c", "import sibyl_memory_mcp"], {
    encoding: "utf8",
    shell: true,
    timeout: 15_000,
  });
  return r.status === 0;
}

export function resolveSibylServer(): ServerLaunch {
  const pythons = [
    process.env.SIBYL_PYTHON,
    "python",
    "python3",
    "py -3",
  ].filter((p): p is string => !!p);
  for (const p of pythons) {
    if (canImport(p)) return { command: p, args: ["-m", "sibyl_memory_mcp"] };
  }
  if (process.platform === "win32") {
    const probe = spawnSync("cmd", ["/c", "sibyl-memory-mcp --help"], {
      encoding: "utf8",
      shell: true,
      timeout: 15_000,
    });
    if (probe.status === 0) return { command: "cmd", args: ["/c", "sibyl-memory-mcp"] };
  } else {
    const probe = spawnSync("sibyl-memory-mcp", ["--help"], {
      encoding: "utf8",
      shell: true,
      timeout: 15_000,
    });
    if (probe.status === 0) return { command: "sibyl-memory-mcp", args: [] };
  }
  throw new Error(
    "sibyl_memory_mcp not found. Install Sibyl Memory first: uv tool install 'sibyl-memory-cli[mcp]' " +
      "(or pip install 'sibyl-memory-cli[mcp]'), or point SIBYL_PYTHON at a python that has it."
  );
}

export class SibylMemory {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect(): Promise<void> {
    const { command, args } = resolveSibylServer();
    this.transport = new StdioClientTransport({ command, args });
    this.client = new Client(
      { name: "charter-agent", version: "0.1.0" },
      { capabilities: {} }
    );
    await this.client.connect(this.transport);
  }

  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = null;
    this.transport = null;
  }

  private async call<T = any>(name: string, args: Record<string, unknown>): Promise<T> {
    if (!this.client) throw new Error("SibylMemory not connected");
    const res = await this.client.callTool({ name, arguments: args });
    const text = (res.content as any[])?.find((c) => c.type === "text")?.text;
    if (text === undefined) return res as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  /** Idempotent write/update of an entity, keyed by (category, name). */
  remember(category: string, name: string, body: unknown) {
    return this.call("memory_remember", { category, name, body });
  }

  /** Exact lookup. Returns entity with body + created_at/updated_at, or NOT_FOUND. */
  recall(category: string, name: string) {
    return this.call("memory_recall", { category, name });
  }

  /** FTS across all tiers (entity/state/reference/journal); zeros self-explain via verdict. */
  search(query: string, limit = 10, tiers?: string) {
    return this.call("memory_search", { query, limit, ...(tiers ? { tiers } : {}) });
  }

  list(category?: string, limit = 50) {
    return this.call("memory_list", { ...(category ? { category } : {}), limit });
  }

  forget(category: string, name: string, reason?: string) {
    return this.call("memory_forget", { category, name, ...(reason ? { reason } : {}) });
  }

  setState(key: string, body: unknown) {
    return this.call("memory_set_state", { key, body });
  }

  getState(key: string) {
    return this.call("memory_get_state", { key });
  }

  /** Append-only journal: entity is the noun, journal is the verb. */
  recordEvent(kind: string, body: unknown, category?: string, name?: string) {
    return this.call("memory_record_event", {
      kind,
      body,
      ...(category ? { category } : {}),
      ...(name ? { name } : {}),
    });
  }
}
