import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { OrgEvent } from "./types";

/** Event-log path: explicit CALLIOPE_EVENT_LOG wins, then legacy alias, then
 *  the agent directory default — matching the agent's EventLog resolution. */
export function eventLogPath(agentDir: string): string {
  return (
    process.env.CALLIOPE_EVENT_LOG ??
    process.env.CHARTER_EVENT_LOG ??
    resolve(agentDir, "events.jsonl")
  );
}

/** Parse `--json` stdout lines emitted by the agent session. */
export function parseEventsFromStdout(stdout: string): OrgEvent[] {
  return stdout
    .split("\n")
    .filter((l) => l.startsWith('{"ts"'))
    .map((l) => {
      try {
        return JSON.parse(l) as OrgEvent;
      } catch {
        return null;
      }
    })
    .filter((e): e is OrgEvent => e !== null);
}

/** Read the tail of the shared JSONL event log. */
export function readEventLog(agentDir: string, limit = 400): OrgEvent[] {
  try {
    const raw = readFileSync(eventLogPath(agentDir), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .slice(-limit)
      .map((l) => {
        try {
          return JSON.parse(l) as OrgEvent;
        } catch {
          return null;
        }
      })
      .filter((e): e is OrgEvent => e !== null);
  } catch {
    return [];
  }
}
