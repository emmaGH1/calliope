import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import type { OrgEvent } from "../../../lib/types";

/**
 * Every dispatch spawns a REAL fresh process (a new OS pid talking to
 * Sibyl Memory) — the restart that makes reconstitution honest.
 * Events land in the shared JSONL log; this route returns the ones the
 * process just emitted.
 */
export async function POST(req: Request) {
  const AGENT = resolve(process.env.CHARTER_AGENT_DIR ?? "../agent");
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const cmd = String(body.cmd ?? "boot");
  const args = ["tsx", "src/org/session.ts", "--json", cmd];
  if (cmd === "found" && body.mission) args.push(String(body.mission).slice(0, 500));
  if (cmd === "task") {
    if (body.text) args.push(String(body.text).slice(0, 300));
    if (body.budget) args.push(String(body.budget));
  }
  const r = spawnSync("npx", args, {
    cwd: AGENT,
    encoding: "utf8",
    shell: true,
    timeout: 90_000,
  });
  const out = (r.stdout ?? "") + (r.error ? `\nspawn: ${r.error.message}` : "");
  const events: OrgEvent[] = out
    .split("\n")
    .filter((l) => l.startsWith('{"ts"'))
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const ok = events.length > 0 || (r.status ?? 1) === 0;
  if (events.length === 0 && ok) {
    // boot with nothing printed — synthesize from the log tail
    const tail = readTail(AGENT, 3);
    events.push(...tail);
  }
  return Response.json({ ok, cmd, events, status: r.status, stderr: r.stderr?.slice(0, 500) ?? null });
}

export function readTail(AGENT: string, n: number): OrgEvent[] {
  try {
    const all = readFileSync(resolve(AGENT, "events.jsonl"), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return all.slice(-n);
  } catch {
    return [];
  }
}
