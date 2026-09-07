import type { Decision, MemoryIo, TaskResult } from "./types.js";
import { OrgMemory } from "./memory-schema.js";
import type { HirePort } from "./hire.js";
import { pickVendor } from "./hire.js";
import { modelFor } from "./model.js";
import type { ModelPort } from "./model.js";

/**
 * The org's unit of work: create an obligation, route it through roles,
 * consult the vendor book for external hires, grade against the charter
 * standards, pay, and write what was learned back into memory.
 *
 * Every decision returns a `because` chip citing the memory it read —
 * that is the load-bearing provenance the desk UI renders.
 */
export async function runTask(
  mem: MemoryIo,
  hire: HirePort,
  input: { task: string; budget: number },
  opts: { quality?: number } = {}
): Promise<TaskResult> {
  const org = new OrgMemory(mem);
  const decisions: Decision[] = [];
  const id = `obl-${Date.now().toString(36)}`;

  // 1. The charter defines the standards. No charter, no standards.
  const mission = await org.getMission();
  const standards = mission?.clientStandards ?? [];
  decisions.push({
    choice: `attach ${standards.length} client standard(s) to the brief`,
    because: standards.length
      ? "charter/mission in memory"
      : "no charter in memory — brief sent bare",
    source: "charter/mission",
  });

  // 2. Create the obligation in memory (survives restarts mid-flight).
  const startedAt = new Date().toISOString();
  await org.setObligation({
    id,
    task: input.task,
    standard: standards,
    budget: input.budget,
    status: "in_progress",
    spend: 0,
    createdAt: startedAt,
    updatedAt: startedAt,
  });

  // 3. Consult the vendor book (memory), then hire via the market port.
  const vendors = await org.listVendors();
  const pick = pickVendor(vendors, input.budget);
  decisions.push(...pick.decisions);

  let deliverable = "";
  let spend = 0;
  const hiredName = pick.vendor?.name ?? "editor(internal)";

  if (pick.vendor) {
    const out = await hire.hire(pick.vendor, { task: input.task, standards });
    deliverable = out.deliverable;
    spend = out.spend;
    await org.event(
      "hire",
      { vendor: pick.vendor.name, spend, port: hire.label, task: input.task },
      "vendor",
      pick.vendor.name
    );
  } else {
    const model: ModelPort = modelFor({ provider: "stub", model: "n/a" });
    deliverable = await model.complete(`ROLE: EDITOR\nQUALITY: ${opts.quality ?? 3}`, input.task);
  }

  // 4. QA grades against the charter standards (memory), not gut feel.
  const model: ModelPort = modelFor({ provider: "stub", model: "n/a" });
  const verdictRaw = await model.complete(
    `ROLE: QA\nStandards: ${standards.join("; ") || "none"}`,
    JSON.stringify({ draft: deliverable, vendor: hiredName })
  );
  let verdict: { pass: boolean; issues: string[] };
  try {
    verdict = JSON.parse(verdictRaw);
  } catch {
    verdict = { pass: false, issues: ["unparseable QA verdict"] };
  }
  decisions.push({
    choice: verdict.pass ? "QA: pass" : `QA: fail (${verdict.issues.join(", ")})`,
    because: "graded against charter/mission clientStandards",
    source: "charter/mission",
  });

  // 5. Rule + learn. Payment and the vendor-book update are memory writes.
  const obligation = await org.getObligation(id);
  if (verdict.pass) {
    spend = Math.max(spend, 0);
    if (obligation) {
      obligation.status = "paid";
      obligation.assignedTo = hiredName;
      obligation.spend = spend;
      await org.setObligation(obligation);
    }
    if (pick.vendor) {
      const v = await org.getVendor(pick.vendor.name);
      if (v) {
        v.jobs += 1;
        v.quality = 5; // learned: this vendor passes our bar
        v.notes.push(`job ${id}: pass`);
        await org.setVendor(v);
      }
    }
    await org.event("ruling", { id, pass: true, spend, vendor: hiredName });
  } else {
    if (obligation) {
      obligation.status = "failed";
      obligation.assignedTo = hiredName;
      await org.setObligation(obligation);
    }
    if (pick.vendor) {
      const v = await org.getVendor(pick.vendor.name);
      if (v) {
        v.jobs += 1;
        v.failures += 1;
        v.quality = 2; // learned: this vendor fails our bar
        v.notes.push(`job ${id}: FAIL ${verdict.issues.join("; ")}`);
        // The grudge is one row in the vendor book — policy writes it, not code.
        if (v.failures >= 1 && v.quality < 3) {
          v.banned = true;
          await org.event("ban", { vendor: v.name, why: v.notes.at(-1) }, "vendor", v.name);
          decisions.push({
            choice: `ban vendor ${v.name}`,
            because: `failure recorded: ${v.notes.at(-1)} (policy: never re-hire a banned vendor)`,
            source: `vendor/${v.name} + charter/mission policies`,
          });
        }
        await org.setVendor(v);
      }
    }
    await org.event("ruling", { id, pass: false, vendor: hiredName });
  }

  return { obligationId: id, deliverable, vendor: hiredName, spend, decisions };
}
