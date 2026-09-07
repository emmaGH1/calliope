/**
 * Spike B: prove Sibyl Memory works from TypeScript over stdio MCP,
 * and that a *fresh process* recalls what a previous process wrote.
 *
 * Phase 1 (write):  npm run probe        -> remembers charter/spike entities
 * Phase 2 (recall): npm run probe -- --recall-only  (fresh process reads them)
 * Phase 3 (purge):  npm run probe -- --purge        (forget everything)
 */
import { SibylMemory } from "../memory/sibyl.js";

const flag = process.argv[2] ?? "";

async function main() {
  const mem = new SibylMemory();
  await mem.connect();
  console.log("[probe] connected to sibyl-memory MCP server");

  const tools = await (mem as any).client.listTools();
  console.log(
    "[probe] tools:",
    tools.tools.map((t: any) => t.name).join(", ")
  );

  if (flag === "--recall-only") {
    const charter = await mem.recall("charter", "spike-org");
    console.log("[probe] recalled charter/spike-org ->", JSON.stringify(charter));
    const vendor = await mem.recall("vendor", "acme-translation");
    console.log("[probe] recalled vendor/acme-translation ->", JSON.stringify(vendor));
    const hit = await mem.search("late delivery");
    console.log("[probe] search('late delivery') ->", JSON.stringify(hit));
    await mem.disconnect();
    return;
  }

  if (flag === "--purge") {
    console.log("[probe] forget ->", JSON.stringify(await mem.forget("charter", "spike-org", "spike cleanup")));
    console.log("[probe] forget ->", JSON.stringify(await mem.forget("vendor", "acme-translation", "spike cleanup")));
    await mem.disconnect();
    return;
  }

  // write phase
  console.log(
    "[probe] remember ->",
    JSON.stringify(
      await mem.remember("charter", "spike-org", {
        mission: "Localized landing copy, brand voice first",
        foundedAt: new Date().toISOString(),
      })
    )
  );
  console.log(
    "[probe] remember ->",
    JSON.stringify(
      await mem.remember("vendor", "acme-translation", {
        quality: 2.1,
        notes: ["late delivery", "missed brand tone"],
        rate: "$1.00",
      })
    )
  );
  console.log(
    "[probe] event ->",
    JSON.stringify(
      await mem.recordEvent("decision", { what: "hired acme, regretted it" }, "vendor", "acme-translation")
    )
  );

  // same-process sanity recall
  const back = await mem.recall("charter", "spike-org");
  console.log("[probe] same-process recall ->", JSON.stringify(back));

  await mem.disconnect();
  console.log("[probe] done. now run: npm run probe -- --recall-only  (fresh process)");
}

main().catch((e) => {
  console.error("[probe] FAILED:", e?.message ?? e);
  process.exit(1);
});
