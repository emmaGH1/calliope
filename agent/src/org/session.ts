/**
 * One Calliope session per process invocation — restarts are REAL restarts.
 *
 *   npx tsx src/org/session.ts boot                   -> found or reconstitute, report
 *   npx tsx src/org/session.ts found "Mission text"   -> found the org from a paragraph
 *   npx tsx src/org/session.ts task ["text" [budget]] -> boot + run (or RESUME) one task
 *   npx tsx src/org/session.ts task --crash [...]     -> die right after the obligation is
 *                                                        written (simulated crash mid-task)
 *   npx tsx src/org/session.ts amnesic-task           -> same task, memory calls stubbed
 *                                                        (deletion test control)
 *   npx tsx src/org/session.ts set-model qa xai grok-4-1-fast-non-reasoning
 *                                                     -> hot-swap a role's brain in memory
 *   npx tsx src/org/session.ts wipe                   -> forget the org (archives entities;
 *                                                        Sibyl keeps journal residue)
 *   npx tsx src/org/session.ts reset --yes            -> delete the local memory.db entirely
 *                                                        (pristine take for demos/tests)
 *
 * Add --json to also emit machine-readable events on stdout (used by the
 * deletion test); every invocation appends the same events to events.jsonl
 * for the desk UI.
 */
import "dotenv/config";
import { homedir } from "node:os";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { CALLIOPE_ENV } from "../config/env.js";
import { SibylMemory } from "../memory/sibyl.js";
import { boot, AmnesicMemory } from "../org/boot.js";
import { OrgMemory } from "../org/memory-schema.js";
import { SimHirePort } from "../org/hire.js";
import { hirePortForEnv } from "../org/acp-hire.js";
import {
  runTask,
  openObligation,
  findResumable,
  completeObligation,
} from "../org/run-task.js";
import { EventLog } from "../org/event-log.js";
import type { MemoryIo } from "../org/types.js";

const argv = process.argv.slice(2);
const flags = argv.filter((a) => a.startsWith("--"));
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
    if (cmd === "set-model") {
      const [, role, provider, model] = positionals;
      if (!role || !provider || !model) {
        print(mem, "usage: set-model <role> <provider stub|openai|xai> <model>");
        return;
      }
      const org = new OrgMemory(mem);
      const r = (await org.listRoles()).find((x) => x.name === role);
      if (!r) {
        print(mem, `role "${role}" not found in memory — boot first`);
        return;
      }
      r.model = { provider: provider as any, model };
      await org.setRole(r);
      log.emit("set-model", `role ${role} -> ${provider}:${model}`, { role, provider, model });
      print(mem, `role ${role} now uses ${provider}:${model} (stored in memory; next session reads it)`);
      return;
    }

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
      log.emit("wipe", "org wiped (entities archived; journal residue remains). next boot refounds from nothing.");
      print(mem, "org wiped. next boot will be a founding with nothing behind it.");
      return;
    }

    if (cmd === "reset") {
      // pristine take: delete the LOCAL memory.db entirely (journal included).
      // Guarded: requires --yes. Credentials stay; next run refounds an empty org.
      if (!flags.includes("--yes")) {
        print(mem, "reset refuses: pass --yes to delete the local memory database");
        return;
      }
      const db =
        CALLIOPE_ENV.db() ?? join(homedir(), ".sibyl-memory", "memory.db");
      await close();
      if (existsSync(db)) {
        rmSync(db, { force: true });
        print(mem as any, `local memory database deleted: ${db}`);
      } else {
        print(mem as any, `no memory database at ${db}`);
      }
      return;
    }

    const seed =
      cmd === "found"
        ? { mission: positionals.slice(1).join(" ") || undefined }
        : undefined;
    const report = await boot(mem, seed);
    if (report.founded) {
      log.emit("founded", `FOUNDED org (${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors) — charter written to memory`, { seed: seed?.mission ?? null });
      print(mem, `FOUNDED org (${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors) — charter written to memory`);
    } else {
      log.emit("reconstituted", `RECONSTITUTED org from memory: ${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors, ${report.obligationsResumed.length} obligation(s) resumed`, { resumed: report.obligationsResumed });
      print(mem, `RECONSTITUTED org from memory: ${report.rolesLoaded.length} roles, ${report.vendorsLoaded.length} vendors, ${report.obligationsResumed.length} obligation(s) resumed`);
    }
    // charter panel data for the desk (emitted every boot, read from memory)
    const mission = await new OrgMemory(mem).getMission();
    if (mission) {
      log.emit("charter", `charter: ${mission.name}`, mission);
    }
    for (const v of report.vendorsLoaded) {
      log.emit("vendor", `vendor ${v.name}: quality=${v.quality?.toFixed?.(1) ?? v.quality ?? "?"} rate=$${v.rate.toFixed(2)} jobs=${v.jobs} failures=${v.failures}${v.banned ? " [BANNED]" : ""}`, v);
      print(
        mem,
        `  vendor ${v.name}: quality=${v.quality?.toFixed?.(1) ?? v.quality ?? "?"} rate=$${v.rate.toFixed(2)} jobs=${v.jobs} failures=${v.failures}${v.banned ? " [BANNED]" : ""}`
      );
    }

    if (cmd === "task" || cmd === "amnesic-task") {
      const taskText = positionals[1] ?? "Localize the landing page hero to Japanese. Keep the brand voice.";
      const budget = positionals[2] ? Number(positionals[2]) : 3;
      const { port: hire, real } = hirePortForEnv();
      log.emit("hire-port", `hire port: ${hire.label}${real ? "" : " (real ACP activates with CALLIOPE_* env)"}`, { label: hire.label, real });
      print(mem, `hire port: ${hire.label}`);

      // crash beat: write the obligation, then die before completing it
      if (flags.includes("--crash")) {
        const decisions: any[] = [];
        const id = await openObligation(mem, { task: taskText, budget }, decisions);
        for (const d of decisions) {
          log.emit("decision", d.choice, d);
          print(mem, `  decision: ${d.choice}`);
        }
        log.emit("obligation", `obligation ${id} opened — SIMULATED CRASH: process dies mid-task (in_progress survives in memory)`, { id, crashed: true });
        print(mem, `obligation ${id} opened — SIMULATED CRASH: dying mid-task (exit 1). The obligation survives in memory.`);
        // flush stdout before signaling the crash via exit code
        process.exitCode = 1;
        return;
      }

      // resume beat: a predecessor in_progress obligation exists -> finish it
      const resumable = await findResumable(mem);
      let result;
      const decisions: any[] = [];
      if (resumable) {
        log.emit("decision", `resumed obligation ${resumable.id} from memory — the brief survived the crash`, { resumed: resumable.id });
        print(mem, `  decision: resumed obligation ${resumable.id} from memory — the brief survived the crash`);
        result = await completeObligation(
          { mem, hire },
          { task: resumable.task, budget: resumable.budget },
          resumable.id,
          decisions
        );
      } else {
        result = await runTask(mem, hire, { task: taskText, budget }, {});
      }

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
