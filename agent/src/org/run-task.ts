import type { Decision, MemoryIo, TaskResult, VendorRecord } from "./types.js";
import { OrgMemory } from "./memory-schema.js";
import type { HirePort } from "./hire.js";
import { pickVendor } from "./hire.js";
import { modelFor } from "./model.js";
import { settleOnBase, baseSettleReady } from "./base-settle.js";

/**
 * The org's unit of work, split so interruption is REAL:
 *   openObligation() — write the in_progress obligation (brief, standards, budget)
 *   completeObligation() — roles read from memory, hire, QA, rule, learn
 *
 * A process that dies between them leaves recoverable state in memory; the
 * next session's task command resumes and finishes it.
 *
 * Load-bearing reads: charter (standards), roles (qa/editor mandates + model
 * choice — missing roles refuse the task), vendor book (who to hire), journal
 * (prior failures fed to QA). Every decision cites its memory source.
 */

export interface RunContext {
  mem: MemoryIo;
  hire: HirePort;
}

function vendorNameFor(v: VendorRecord | null): string {
  return v?.name ?? "editor(internal)";
}

/** Write the obligation and attach the brief. Returns the obligation id. */
export async function openObligation(
  mem: MemoryIo,
  input: { task: string; budget: number },
  decisions: Decision[]
): Promise<string> {
  const org = new OrgMemory(mem);
  const mission = await org.getMission();
  const standards = mission?.clientStandards ?? [];
  decisions.push({
    choice: `attach ${standards.length} client standard(s) to the brief`,
    because: standards.length
      ? "charter/mission in memory"
      : "no charter in memory — brief sent bare",
    source: "charter/mission",
  });

  const id = `obl-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  await org.setObligation({
    id,
    task: input.task,
    standard: standards,
    budget: input.budget,
    status: "in_progress",
    spend: 0,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

/** Does this task have an interrupted predecessor in memory? */
export async function findResumable(
  mem: MemoryIo
): Promise<{ id: string; task: string; status: string; budget: number } | null> {
  const org = new OrgMemory(mem);
  const open = (await org.listObligations()).filter(
    (o) => o.status === "in_progress"
  );
  if (!open.length) return null;
  const o = open[open.length - 1];
  return { id: o.id, task: o.task, status: o.status, budget: o.budget };
}

export async function completeObligation(
  ctx: RunContext,
  input: { task: string; budget: number },
  id: string,
  decisions: Decision[]
): Promise<TaskResult> {
  const { mem, hire } = ctx;
  const org = new OrgMemory(mem);

  // 1. Roles are the org chart IN MEMORY. No roles -> the org cannot route work.
  const roles = await org.listRoles();
  const qaRole = roles.find((r) => r.name === "qa");
  const editorRole = roles.find((r) => r.name === "editor");
  if (!qaRole || !editorRole) {
    decisions.push({
      choice: "task refused — no roles in memory",
      because: `roles found: ${roles.length}; the org cannot route work without its qa/editor charter roles`,
      source: "role/* in memory",
    });
    const o = await org.getObligation(id);
    if (o) {
      o.status = "failed";
      await org.setObligation(o);
    }
    await org.event("refusal", { id, why: "no roles in memory" });
    return { obligationId: id, deliverable: "(task refused)", vendor: "(none)", spend: 0, decisions };
  }

  // 2. Consult the vendor book (memory), then hire via the market port.
  const vendors = await org.listVendors();
  const pick = pickVendor(vendors, input.budget);
  decisions.push(...pick.decisions);

  let deliverable = "";
  let spend = 0;
  if (pick.vendor) {
    const standards = (await org.getMission())?.clientStandards ?? [];
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
    const model = modelFor(editorRole.model);
    deliverable = await model.complete(
      `ROLE: EDITOR\nQUALITY: 3\nModel: ${model.label}`,
      input.task
    );
  }

  // 3. QA: prompt assembled from the qa role's mandate (memory), the charter
  //    standards (memory), and this vendor's prior failures (journal, memory).
  const mission = await org.getMission();
  const standards = mission?.clientStandards ?? [];
  const vendorName = vendorNameFor(pick.vendor);
  let priorFailures = 0;
  if (pick.vendor) {
    const v = await org.getVendor(pick.vendor.name);
    priorFailures = v?.failures ?? 0;
    // journal consult: only real journal-tier events count (archived entities
    // from earlier orgs carry the same names and would muddy a fresh founding)
    const journal = await mem.search(`${pick.vendor.name} FAIL`, 5);
    const hits = ((journal as any).results ?? []).filter(
      (h: any) => h.tier === "journal"
    );
    if (hits.length) {
      decisions.push({
        choice: `QA context: ${hits.length} journal ruling(s) on record for ${pick.vendor.name}`,
        because: "journal search fed prior ruling notes into the QA brief",
        source: "journal (memory_search)",
      });
    }
  }

  const qaModel = modelFor(qaRole.model);
  const verdictRaw = await qaModel.complete(
    `ROLE: QA\nMandate: ${qaRole.mandate}\nStandards: ${standards.join("; ") || "none"}`,
    JSON.stringify({ draft: deliverable, standards, priorFailures, vendor: vendorName })
  );
  let verdict: { pass: boolean; issues: string[] };
  try {
    verdict = JSON.parse(verdictRaw);
  } catch {
    verdict = { pass: false, issues: ["unparseable QA verdict"] };
  }
  decisions.push({
    choice: verdict.pass ? "QA: pass" : `QA: fail (${verdict.issues.join(", ")})`,
    because: "graded by qa role mandate vs charter/mission clientStandards",
    source: "role/qa + charter/mission",
  });

  // 4. Rule + learn. Learned quality is a running average, written to the book.
  const obligation = await org.getObligation(id);
  if (verdict.pass) {
    if (obligation) {
      obligation.status = "paid";
      obligation.assignedTo = vendorName;
      obligation.spend = spend;
      await org.setObligation(obligation);
    }
    if (pick.vendor) {
      const v = await org.getVendor(pick.vendor.name);
      if (v) {
        const prevJobs = v.jobs;
        v.jobs += 1;
        v.quality = ((v.quality ?? 0) * prevJobs + 5) / (prevJobs + 1);
        v.notes.push(`job ${id}: pass`);
        await org.setVendor(v);
      }
    }
    await org.event("ruling", { id, pass: true, spend, vendor: vendorName });
  } else {
    if (obligation) {
      obligation.status = "failed";
      obligation.assignedTo = vendorName;
      await org.setObligation(obligation);
    }
    if (pick.vendor) {
      const v = await org.getVendor(pick.vendor.name);
      if (v) {
        const prevJobs = v.jobs;
        v.jobs += 1;
        v.failures += 1;
        v.quality = ((v.quality ?? 0) * prevJobs + 2) / (prevJobs + 1);
        v.notes.push(`job ${id}: FAIL ${verdict.issues.join("; ")}`);
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
    await org.event("ruling", { id, pass: false, vendor: vendorName });
  }

  // 5. Optional Base settlement — real onchain receipt when env is configured.
  let baseTx: string | undefined;
  let baseExplorer: string | undefined;
  if (baseSettleReady()) {
    const settled = await settleOnBase({
      obligationId: id,
      pass: verdict.pass,
      spendUsd: spend,
    });
    if (settled.ok) {
      baseTx = settled.txHash;
      baseExplorer = settled.explorerUrl;
      decisions.push({
        choice: `Base settle ${verdict.pass ? "PASS" : "FAIL"} → ${settled.txHash.slice(0, 10)}…`,
        because: `${settled.label}; obligation receipt posted onchain`,
        source: "CalliopeSettlement on Base",
      });
      await org.event("base-settle", {
        id,
        pass: verdict.pass,
        tx: settled.txHash,
        explorer: settled.explorerUrl,
        chainId: settled.chainId,
      });
    } else {
      decisions.push({
        choice: `Base settle skipped — ${settled.reason}`,
        because: settled.label,
        source: "CalliopeSettlement on Base",
      });
    }
  }

  return {
    obligationId: id,
    deliverable,
    vendor: vendorName,
    spend,
    decisions,
    baseTx,
    baseExplorer,
  };
}

/** Legacy single-shot entry (used by tests/spikes): open + complete. */
export async function runTask(
  mem: MemoryIo,
  hire: HirePort,
  input: { task: string; budget: number },
  opts: { quality?: number } = {}
): Promise<TaskResult> {
  const decisions: Decision[] = [];
  const id = await openObligation(mem, input, decisions);
  return completeObligation({ mem, hire }, input, id, decisions);
}
