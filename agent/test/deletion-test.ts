/**
 * THE DELETION TEST — run it: npm test
 *
 * Proves the pass/fail gate's litmus: remove Sibyl Memory and the org's
 * behavior collapses. Spawns REAL processes for every session, parses their
 * --json events, and asserts the memory-driven differences:
 *
 *  [1] With memory, a failure BANS a vendor in the vendor book.
 *  [2] A fresh process RECONSTITUTES the org, cites the ban, skips the
 *      banned vendor, attaches charter standards, and passes QA.
 *  [3] With memory calls stubbed out (AmnesicMemory), the org cannot even
 *      route the task — no roles, no charter, no vendor book.
 *  [4] A crash mid-task leaves the obligation in memory; a fresh process
 *      RESUMES and finishes it. Wipe the memory and it is gone for good.
 */
import { spawnSync } from "node:child_process";
import assert from "node:assert";
import { SibylMemory } from "../src/memory/sibyl.js";

type E = { ts: string; pid: number; kind: string; text: string; data?: any };

function session(cmd: string, args: string[] = []): { events: E[]; status: number } {
  const r = spawnSync("npx", ["tsx", "src/org/session.ts", "--json", cmd, ...args], {
    encoding: "utf8",
    shell: true,
  });
  if (!r.stdout) {
    throw new Error(`spawn failed for "${cmd}": ${r.error ?? r.stderr}`);
  }
  const lines = r.stdout.split("\n").filter((l) => l.startsWith('{"ts"'));
  return { events: lines.map((l) => JSON.parse(l)), status: r.status ?? -1 };
}

const decisions = (evs: E[]) => evs.filter((e) => e.kind === "decision").map((e) => e.text);
const kindText = (evs: E[], kind: string) => evs.filter((e) => e.kind === kind).map((e) => e.text);

let passed = 0;
async function check(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (e) {
    console.error(`  FAIL  ${name}`);
    throw e;
  }
}

async function main() {
  console.log("resetting the local memory database for a pristine run…");
  session("reset", ["--yes"]);

  console.log("\n[1] session 1: founded, explores cheapest, fails QA, bans vendor");
  const s1 = session("task");
  const pids = new Set(s1.events.map((e) => e.pid));
  await check("one process ran the whole session", () => assert.equal(pids.size, 1));
  await check("org was FOUNDED from memory (not reconstituted)", () =>
    assert.ok(s1.events.some((e) => e.kind === "founded"))
  );
  await check("vendor cheap-and-sloppy hired on exploration (no history)", () =>
    assert.ok(decisions(s1.events).some((t) => /hire cheap-and-sloppy/.test(t)))
  );
  await check("QA failed the deliverable against charter standards", () =>
    assert.ok(decisions(s1.events).some((t) => /QA: fail/.test(t)))
  );
  await check("vendor BANNED into memory after the failure", () =>
    assert.ok(decisions(s1.events).some((t) => /ban vendor cheap-and-sloppy/.test(t)))
  );

  console.log("\n[2] session 2 (fresh process): reconstitutes, cites ban, passes");
  const s2 = session("task");
  await check("different process than session 1 (real restart)", () =>
    assert.notEqual([...pids][0], [...new Set(s2.events.map((e) => e.pid))][0])
  );
  await check("org RECONSTITUTED from memory", () =>
    assert.ok(s2.events.some((e) => e.kind === "reconstituted"))
  );
  await check("banned vendor remembered and cited by name", () =>
    assert.ok(decisions(s2.events).some((t) => /skip cheap-and-sloppy/.test(t)))
  );
  await check("skipped vendor was the previously banned one", () =>
    assert.ok(s2.events.some((e) => e.kind === "vendor" && /BANNED/.test(e.text) && /cheap-and-sloppy/.test(e.text)))
  );
  await check("hired the good vendor atelier-jp instead", () =>
    assert.ok(decisions(s2.events).some((t) => /hire atelier-jp/.test(t)))
  );
  await check("charter standards attached to the brief", () =>
    assert.ok(decisions(s2.events).some((t) => /attach 2 client standard/.test(t)))
  );
  await check("QA passed", () => assert.ok(decisions(s2.events).some((t) => /QA: pass/.test(t))));
  await check("deliverable keeps brand voice", () => {
    const d = s2.events.find((e) => e.kind === "deliverable");
    assert.ok(d && /brand voice: on/.test(d.text));
  });

  console.log("\n[3] deletion test: memory calls stubbed out -> the org cannot route");
  const am = session("amnesic-task");
  await check("no charter in memory: brief sent bare", () =>
    assert.ok(decisions(am.events).some((t) => /attach 0 client standard/.test(t)))
  );
  await check("no roles in memory: task refused", () =>
    assert.ok(decisions(am.events).some((t) => /task refused — no roles in memory/.test(t)))
  );
  await check("no vendor book: nothing was hired", () =>
    assert.ok(am.events.every((e) => !(e.kind === "obligation" && /-> (atelier|cheap)/.test(e.text))))
  );
  await check("no ban knowledge: nothing skipped (no skip decision exists)", () =>
    assert.ok(!decisions(am.events).some((t) => /skip /.test(t)))
  );
  const amObl = am.events.find((e) => e.kind === "obligation");
  const s2Obl = s2.events.find((e) => e.kind === "obligation");
  // one shared connection for both persistence checks — spawning a second
  // MCP server back-to-back after ~20 child processes is flaky on Windows
  const probe = new SibylMemory();
  await probe.connect();
  await check("amnesic writes never persisted: its obligation is NOT in the real store", async () => {
    assert.ok(amObl, "amnesic run reported an obligation");
    const r = await probe.recall("obligation", amObl.data.id);
    assert.equal(r.ok, false, `obligation ${amObl.data.id} should not exist`);
  });
  await check("session 2's obligation IS in the real store (writes really persist)", async () => {
    assert.ok(s2Obl);
    const r = await probe.recall("obligation", s2Obl.data.id);
    assert.equal(r.ok, true, `obligation ${s2Obl.data.id} should exist`);
  });
  await probe.disconnect();

  console.log("\n[4] crash mid-task -> a fresh process resumes and finishes the job");
  const crash = session("task", ["--crash"]);
  await check("crash process exited non-zero (died mid-task)", () =>
    assert.notEqual(crash.status, 0)
  );
  const crashedObl = crash.events.find((e) => e.data?.crashed);
  await check("crash left an in_progress obligation behind", () => assert.ok(crashedObl));
  const resume = session("task");
  await check("fresh process RESUMED the crashed obligation by id", () => {
    assert.ok(crashedObl);
    assert.ok(
      decisions(resume.events).some((t) => t.includes(`resumed obligation ${crashedObl.data.id}`)),
      `expected resume of ${crashedObl.data.id}`
    );
  });
  await check("the resumed job was finished by a hired vendor (paid path)", () => {
    assert.ok(crashedObl);
    const final = resume.events.find((e) => e.kind === "obligation" && e.data?.id === crashedObl.data.id);
    assert.ok(final && final.data.vendor !== "(none)", "resumed obligation not completed");
  });
  await check("reconstitution report counted the resumable obligation", () => {
    const bootEv = resume.events.find((e) => e.kind === "reconstituted");
    assert.ok(bootEv && bootEv.data.resumed.includes(crashedObl!.data.id));
  });

  console.log("\ncleaning up…");
  session("reset", ["--yes"]);
  console.log(`\nDELETION TEST: ${passed} checks passed. Delete Sibyl and there is no company.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
