/**
 * One Charter session per process invocation — restarts are REAL restarts.
 *
 *   npx tsx src/org/session.ts boot                  -> found or reconstitute, report
 *   npx tsx src/org/session.ts found "Mission text"  -> found the org from a paragraph
 *   npx tsx src/org/session.ts task ["text" [budget]]-> boot + run one task, print decisions
 *   npx tsx src/org/session.ts amnesic-task          -> same task, memory calls stubbed (deletion test)
 *   npx tsx src/org/session.ts wipe                  -> forget the org (demo beat 3)
 *
 * Add --json to also emit machine-readable events on stdout (used by the
 * deletion test); every invocation appends the same events to events.jsonl
 * for the desk UI.
 */
import "dotenv/config";
import { SibylMemory } from "../memory/sibyl.js";
import { boot, AmnesicMemory } from "../org/boot.js";
import { OrgMemory } from "../org/memory-schema.js";
import { SimHirePort } from "../org/hire.js";
import { hirePortForEnv } from "../org/acp-hire.js";
import { runTask } from "../org/run-task.js";
import { EventLog } from "../org/event-log.js";
import type { MemoryIo } from "../org/types.js";

const argv = process.argv.slice(2);
const positionals = argv.filter((a) => !a.startsWith("--"));
const cmd = positionals[0] ?? "boot";
const log = new EventLog();

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
      log.emit("wipe", "org wiped. next boot will be a founding with nothing behind it.");
      print(mem, "org wiped. next boot will be a founding with nothing behind it.");
      return;
    }

    const seed =
      cmd === "found"
        ? {
            mission: positionals.slice(1).join(" ") || undefined,
            standards: ["Brand voice outranks literal accuracy", "No machine-output artifacts"],
          }
        : undefined;
    const report = await boot(mem, seed);
    if (report.founded) {
      log.emit("founded", `FOUNDED org (${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors) — charter written to memory`, { seed: seed?.mission ?? null });
      print(mem, `FOUNDED org (${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors) — charter written to memory`);
    } else {
      log.emit("reconstituted", `RECONSTITUTED org from memory: ${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors, ${report.obligationsResumed.length} obligation(s) resumed`, { resumed: report.obligationsResumed });
      print(mem, `RECONSTITUTED org from memory: ${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors, ${report.obligationsResumed.length} obligation(s) resumed`);
    }
    for (const v of report.vendorsLoaded) {
      log.emit("vendor", `vendor ${v.name}: quality=${v.quality ?? "?"} rate=$${v.rate.toFixed(2)} jobs=${v.jobs} failures=${v.failures}${v.banned ? " [BANNED]" : ""}`, v);
      print(
        mem,
        `  vendor ${v.name}: quality=${v.quality ?? "?"} rate=$${v.rate.toFixed(2)} jobs=${v.jobs} failures=${v.failures}${v.banned ? " [BANNED]" : ""}`
      );
    }

    if (cmd === "task" || cmd === "amnesic-task") {
      const taskText = positionals[1] ?? "Localize the landing page hero to Japanese. Keep the brand voice.";
      const budget = positionals[2] ? Number(positionals[2]) : 3;
      const { port: hire, real } = hirePortForEnv();
      log.emit("hire-port", `hire port: ${hire.label}${real ? "" : " (real ACP activates with CHARTER_* env)"}`, { label: hire.label, real });
      print(mem, `hire port: ${hire.label}`);
      const result = await runTask(mem, hire, { task: taskText, budget }, {});
      log.emit("obligation", `obligation ${result.obligationId} -> ${result.vendor} spend=$${result.spend.toFixed(2)}`, { id: result.obligationId, vendor: result.vendor, spend: result.spend });
      print(mem, `obligation ${result.obligationId} -> ${result.vendor} spend=$${result.spend.toFixed(2)}`);
      for (const d of result.decisions) {
        log.emit("decision", d.choice, d);
        print(mem, `  decision: ${d.choice}`);
        print(mem, `    because: ${d.because}  [source: ${d.source}]`);
      }
      log.emit("deliverable", result.deliverable, { deliverable: result.deliverable });
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
