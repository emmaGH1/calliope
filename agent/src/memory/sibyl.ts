import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Thin TS client for Sibyl Memory, spoken over stdio MCP.
 *
 * The server process is the sibyl-memory-cli tool venv:
 *   <venv>/Scripts/python.exe -m sibyl_memory_mcp
 * Credentials live in ~/.sibyl-memory/credentials.json (created by `sibyl init`).
 */
const DEFAULT_SIBYL_PYTHON =
  "C:\\Users\\Emma0\\AppData\\Roaming\\uv\\tools\\sibyl-memory-cli\\Scripts\\python.exe";

export class SibylMemory {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect(): Promise<void> {
    const python = process.env.SIBYL_PYTHON ?? DEFAULT_SIBYL_PYTHON;
    this.transport = new StdioClientTransport({
      command: python,
      args: ["-m", "sibyl_memory_mcp"],
    });
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
