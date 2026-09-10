import { statSync } from "node:fs";
import { resolve } from "node:path";
import { eventLogPath, readEventLog } from "../../../lib/server-events";

export const dynamic = "force-dynamic";

export async function GET() {
  const AGENT = resolve(process.env.CALLIOPE_AGENT_DIR ?? process.env.CHARTER_AGENT_DIR ?? "../agent");
  const events = readEventLog(AGENT, 400);
  let mtime = 0;
  try {
    mtime = statSync(eventLogPath(AGENT)).mtimeMs;
  } catch {
    /* log does not exist yet */
  }
  return Response.json({ ok: true, events, mtime });
}
