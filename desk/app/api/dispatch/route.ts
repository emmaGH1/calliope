import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { parseEventsFromStdout, readEventLog } from "../../../lib/server-events";
import type { OrgEvent } from "../../../lib/types";

/**
 * Every dispatch spawns a REAL fresh process (a new OS pid talking to
 * Sibyl Memory) — the restart that makes reconstitution honest.
 *
 * Hardened: command allowlist, validated arguments, and no shell — the
 * agent's tsx CLI runs under this Node binary with an args array, so no
 * request value can reach a shell parser.
 */
const ALLOWED = new Set(["boot", "found", "task", "amnesic-task", "wipe"]);

export async function POST(req: Request) {
  const AGENT = resolve(process.env.CALLIOPE_AGENT_DIR ?? process.env.CHARTER_AGENT_DIR ?? "../agent");
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const cmd = String(body.cmd ?? "boot");
  if (!ALLOWED.has(cmd)) {
    return Response.json(
      { ok: false, cmd, events: [], status: null, error: `command "${cmd}" is not allowed` },
      { status: 400 }
    );
  }

  const mission = typeof body.mission === "string" ? body.mission.slice(0, 500) : "";
  const text = typeof body.text === "string" ? body.text.slice(0, 300) : "";
  const rawBudget = Number(body.budget);
  const budget = Number.isFinite(rawBudget) && rawBudget > 0 && rawBudget <= 1000 ? rawBudget : 3;
  const crash = body.crash === true && cmd === "task";

  const args = ["src/org/session.ts", "--json", cmd];
  if (cmd === "found" && mission) args.push(mission);
  if (cmd === "task" || cmd === "amnesic-task") {
    if (crash) args.push("--crash");
    if (text) args.push(text);
    if (body.budget !== undefined) args.push(String(budget));
  }

  const tsxCli = resolve(AGENT, "node_modules", "tsx", "dist", "cli.mjs");
  const r = spawnSync(process.execPath, [tsxCli, ...args], {
    cwd: AGENT,
    encoding: "utf8",
    shell: false,
    timeout: 90_000,
  });

  const stdout = r.stdout ?? "";
  let events: OrgEvent[] = parseEventsFromStdout(stdout);
  const spawnError = r.error?.message ?? null;
  const status = r.status;

  if (events.length === 0 && (status === 0 || spawnError === null)) {
    // process printed nothing usable — surface the real log tail instead
    events = readEventLog(AGENT, 3);
  }

  const ok = spawnError === null && (events.length > 0 || status === 0);
  return Response.json({
    ok,
    cmd,
    events,
    status,
    error: spawnError,
    stderr: r.stderr?.slice(0, 500) ?? null,
  });
}
