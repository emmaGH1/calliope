import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { CALLIOPE_ENV } from "../config/env.js";

/**
 * Structured run events, appended as JSONL so the desk UI and tests can
 * read what a (dead) process did without talking to it. One file, no magic.
 */
export interface OrgEvent {
  ts: string;
  pid: number;
  kind:
    | "boot"
    | "founded"
    | "reconstituted"
    | "vendor"
    | "decision"
    | "deliverable"
    | "ruling"
    | "hire-port"
    | "wipe"
    | "obligation"
    | "set-model"
    | "refusal"
    | "charter";
  text: string;
  data?: unknown;
}

export class EventLog {
  readonly path: string;
  private pid = process.pid;

  constructor(path?: string) {
    this.path = resolve(path ?? CALLIOPE_ENV.eventLog() ?? "events.jsonl");
  }

  emit(kind: OrgEvent["kind"], text: string, data?: unknown): OrgEvent {
    const e: OrgEvent = { ts: new Date().toISOString(), pid: this.pid, kind, text, data };
    appendFileSync(this.path, JSON.stringify(e) + "\n");
    if (process.argv.includes("--json")) console.log(JSON.stringify(e));
    return e;
  }
}
