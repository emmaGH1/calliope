/**
 * THE DELETION TEST — run it: npm test
 *
 * Proves the pass/fail gate's litmus: remove Sibyl Memory and the org's
 * behavior collapses. Spawns REAL processes for every session, parses their
 * --json events, and asserts the memory-driven differences:
 *
 *  1. With memory, a failure BANS a vendor in the vendor book.
 *  2. A fresh process RECONSTITUTES the org, cites the ban, skips the
 *     banned vendor, attaches charter standards, and passes QA.
 *  3. With memory calls stubbed out (AmnesicMemory), the same task sends
 *     a bare brief, knows no vendors, and fails QA — the org is gone.
 */
import { spawnSync } from "node:child_process";
import assert from "node:assert";
import { readFileSync } from "node:fs";

type E = { ts: string; pid: number; kind: string; text: string; data?: any };

function session(cmd: string, args: string[] = []): E[] {
  const r = spawnSync("npx", ["tsx", "src/org/session.ts", "--json", cmd, ...args], {
    encoding: "utf8",
    shell: true,
  });
  if (!r.stdout) {
    throw new Error(`spawn failed for "${cmd}": ${r.error ?? r.stderr}`);
  }
  const lines = r.stdout.split("\n").filter((l) => l.startsWith('{"ts"'));
  return lines.map((l) => JSON.parse(l));
}

const decisions = (evs: E[]) => evs.filter((e) => e.kind === "decision").map((e) => e.text);

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    console.error(`  FAIL  ${name}`);
    throw e;
  }
}

console.log("wiping store for a clean run…");
session("wipe");

console.log("\n[1] session 1: founded, explores cheapest, fails QA, bans vendor");
const s1 = session("task");
const pids = new Set(s1.map((e) => e.pid));
check("one process ran the whole session", () => assert.equal(pids.size, 1));
check("org was FOUNDED from memory (not reconstituted)", () =>
  assert.ok(s1.some((e) => e.kind === "founded"))
);
check("vendor cheap-and-sloppy hired on exploration (no history)", () =>
  assert.ok(decisions(s1).some((t) => /hire cheap-and-sloppy/.test(t)))
);
check("QA failed the deliverable against charter standards", () =>
  assert.ok(decisions(s1).some((t) => /QA: fail/.test(t)))
);
check("vendor BANNED into memory after the failure", () =>
  assert.ok(decisions(s1).some((t) => /ban vendor cheap-and-sloppy/.test(t)))
);

console.log("\n[2] session 2 (fresh process): reconstitutes, cites ban, passes");
const s2 = session("task");
check("different process than session 1 (real restart)", () =>
  assert.notEqual([...pids][0], [...new Set(s2.map((e) => e.pid))][0])
);
check("org RECONSTITUTED from memory", () =>
  assert.ok(s2.some((e) => e.kind === "reconstituted"))
);
check("banned vendor remembered and cited by name", () =>
  assert.ok(decisions(s2).some((t) => /skip cheap-and-sloppy/.test(t)))
);
check("skipped vendor was the previously banned one", () =>
  assert.ok(s2.some((e) => e.kind === "vendor" && /BANNED/.test(e.text) && /cheap-and-sloppy/.test(e.text)))
);
check("hired the good vendor atelier-jp instead", () =>
  assert.ok(decisions(s2).some((t) => /hire atelier-jp/.test(t)))
);
check("charter standards attached to the brief", () =>
  assert.ok(decisions(s2).some((t) => /attach 2 client standard/.test(t)))
);
check("QA passed", () => assert.ok(decisions(s2).some((t) => /QA: pass/.test(t))));
check("deliverable keeps brand voice", () => {
  const d = s2.find((e) => e.kind === "deliverable");
  assert.ok(d && /brand voice: on/.test(d.text));
});

console.log("\n[3] deletion test: memory calls stubbed out -> the org is gone");
const am = session("amnesic-task");
check("no charter in memory: brief sent bare", () =>
  assert.ok(decisions(am).some((t) => /attach 0 client standard/.test(t)))
);
check("vendor book empty: no external hire possible", () =>
  assert.ok(decisions(am).some((t) => /no eligible external vendor/.test(t)))
);
check("no ban knowledge: nothing skipped (no skip decision exists)", () =>
  assert.ok(!decisions(am).some((t) => /skip /.test(t)))
);
check("QA fails the bare, vendorless output", () =>
  assert.ok(decisions(am).some((t) => /QA: fail/.test(t)))
);
check("events were never persisted (amnesic writes are no-ops)", () => {
  // a real process after the amnesic one sees NO obligation from it
  const after = session("boot");
  assert.ok(!after.some((e) => e.kind === "obligation"));
});

console.log("\ncleaning up…");
session("wipe");
console.log(`\nDELETION TEST: ${passed} checks passed. Delete Sibyl and there is no company.`);
