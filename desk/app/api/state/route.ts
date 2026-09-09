import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import type { OrgEvent } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const AGENT = resolve(process.env.CHARTER_AGENT_DIR ?? "../agent");
  const path = resolve(AGENT, "events.jsonl");
  try {
    const raw = readFileSync(path, "utf8");
    const events: OrgEvent[] = raw
      .split("\n")
      .filter(Boolean)
      .slice(-400)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return Response.json({ ok: true, events, mtime: statSync(path).mtimeMs });
  } catch {
    return Response.json({ ok: true, events: [], mtime: 0 });
  }
}
