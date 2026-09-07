/**
 * One Charter session per process invocation — restarts are REAL restarts.
 *
 *   npx tsx src/org/session.ts boot          -> found or reconstitute, report
 *   npx tsx src/org/session.ts task          -> boot + run one task, print decisions
 *   npx tsx src/org/session.ts amnesic-task  -> same task, memory calls stubbed (deletion test)
 *   npx tsx src/org/session.ts wipe          -> forget the org (demo beat 3)
 *
 * The demo story across invocations:
 *   task (session 1: founded, explores, gets burned, bans vendor)
 *   task (session 2: reconstituted, dodges banned vendor, attaches standards)
 *   amnesic-task      -> control: no memory, no charter, no vendor book
 *   wipe              -> boot reports "founded" again — the org was gone
 */
import "dotenv/config";
import { SibylMemory } from "../memory/sibyl.js";
import { boot, AmnesicMemory } from "../org/boot.js";
import { OrgMemory } from "../org/memory-schema.js";
import { SimHirePort } from "../org/hire.js";
import { runTask } from "../org/run-task.js";
import type { MemoryIo } from "../org/types.js";

const cmd = process.argv[2] ?? "boot";

function print(mem: MemoryIo, s: string) {
  console.log(`[${mem instanceof AmnesicMemory ? "AMNESIC" : "charter"}] ${s}`);
}

async function main() {
  const useAmnesic = cmd === "amnesic-task";
  let mem: MemoryIo;
  let close: () => Promise<void> = async () => {};
  if (useAmnesic) {
    mem = new AmnesicMemory();
  } else {
    const sm = new SibylMemory();
    await sm.connect();
    mem = sm as unknown as MemoryIo;
    close = () => sm.disconnect();
  }

  try {
    if (cmd === "wipe") {
      const org = new OrgMemory(mem);
      for (const [cat, names] of [
        ["charter", ["mission"]],
        ["role", ["coordinator", "editor", "qa"]],
        ["vendor", ["atelier-jp", "cheap-and-sloppy"]],
      ] as const) {
        for (const n of names) await mem.forget(cat, n, "demo: wipe the org");
      }
      for (const o of await org.listObligations()) {
        await mem.forget("obligation", o.id, "demo: wipe the org");
      }
      await mem.recordEvent("wipe", { what: "org wiped for deletion demo" });
      print(mem, "org wiped. next boot will be a founding with nothing behind it.");
      return;
    }

    const report = await boot(mem);
    print(
      mem,
      report.founded
        ? `FOUNDED org (${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors) — charter written to memory`
        : `RECONSTITUTED org from memory: ${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors, ${report.obligationsResumed.length} obligation(s) resumed`
    );
    if (report.vendorsLoaded.length) {
      for (const v of report.vendorsLoaded) {
        print(
          mem,
          `  vendor ${v.name}: quality=${v.quality ?? "?"} rate=$${v.rate.toFixed(2)} jobs=${v.jobs} failures=${v.failures}${v.banned ? " [BANNED]" : ""}`
        );
      }
    }

    if (cmd === "task" || cmd === "amnesic-task") {
      const hire = new SimHirePort();
      print(mem, `hire port: ${hire.label}`);
      const result = await runTask(
        mem,
        hire,
        { task: "Localize the landing page hero to Japanese. Keep the brand voice.", budget: 3 },
        {}
      );
      print(mem, `obligation ${result.obligationId} -> ${result.vendor} spend=$${result.spend.toFixed(2)}`);
      for (const d of result.decisions) {
        print(mem, `  decision: ${d.choice}`);
        print(mem, `    because: ${d.because}  [source: ${d.source}]`);
      }
      print(mem, `deliverable: ${result.deliverable}`);
    }
  } finally {
    await close();
  }
}

main().catch((e) => {
  console.error("[charter] FAILED:", e);
  process.exit(1);
});
