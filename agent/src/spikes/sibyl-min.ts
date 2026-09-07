import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const PY =
  "C:\\Users\\Emma0\\AppData\\Roaming\\uv\\tools\\sibyl-memory-cli\\Scripts\\python.exe";

async function main() {
  const t = new StdioClientTransport({
    command: PY,
    args: ["-m", "sibyl_memory_mcp"],
    stderr: "inherit",
  });
  t.onerror = (e) => console.error("[transport] error:", e);
  t.onclose = () => console.error("[transport] closed");

  const c = new Client({ name: "min", version: "0.0.1" }, { capabilities: {} });
  console.log("[min] connecting…");
  const started = Date.now();
  await c.connect(t);
  console.log(`[min] connected in ${Date.now() - started}ms`);

  const tools = await c.listTools();
  console.log("[min] tools:", tools.tools.map((x) => x.name).join(", "));

  const r = await c.callTool({
    name: "memory_remember",
    arguments: { category: "probe", name: "min", body: { hello: true, at: new Date().toISOString() } },
  });
  console.log("[min] remember:", JSON.stringify(r.content));
  await c.close();
}

main().catch((e) => {
  console.error("[min] FAILED after", Date.now(), e);
  process.exit(1);
});
