"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrgEvent } from "../lib/types";

/** Monad-styled site office for the org that lives in Sibyl Memory. */

const fmt = (ts: string) => {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour12: false });
};

function Pill({
  children,
  tone = "ghost",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  tone?: "blue" | "black" | "ghost" | "bad";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const tones: Record<string, string> = {
    blue: "bg-lake-blue text-white",
    black: "bg-off-black text-white",
    ghost: "border border-off-black text-off-black hover:bg-off-black hover:text-parchment",
    bad: "border border-ash text-smoke hover:text-off-black hover:border-off-black",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide transition-colors disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export default function Desk() {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [mission, setMission] = useState(
    "Localize client landing copy with brand voice intact, on budget, every time."
  );
  const [task, setTask] = useState("Localize the landing page hero to Japanese. Keep the brand voice.");
  const [budget, setBudget] = useState("3");
  const [mode, setMode] = useState<"live" | "amnesic">("live");
  const tailRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/state");
      const j = await r.json();
      if (j.ok) setEvents(j.events);
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    tailRef.current?.scrollTo({ top: tailRef.current.scrollHeight });
  }, [events.length]);

  const dispatch = async (cmd: string) => {
    if (cmd === "wipe" && !confirm("Wipe the org from memory? Next boot will be a founding with nothing behind it.")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cmd,
          mission,
          text: task,
          budget: Number(budget) || 3,
        }),
      });
      const j = await r.json();
      setEvents((prev) => [...prev, ...j.events]);
    } catch {
      alert("dispatch failed — check that the agent env is running (see README)");
    }
    setBusy(false);
  };

  const last = useMemo(() => events[events.length - 1], [events]);
  const bootEvent = useMemo(
    () =>
      [...events].reverse().find((e) => e.kind === "founded" || e.kind === "reconstituted"),
    [events]
  );
  const vendors = useMemo(() => {
    const m = new Map<string, OrgEvent>();
    for (const e of events) if (e.kind === "vendor") m.set((e.data?.name ?? e.text).toString(), e);
    return [...m.values()].slice(-6);
  }, [events]);
  const decisions = useMemo(
    () => [...events].reverse().filter((e) => e.kind === "decision").slice(0, 8),
    [events]
  );
  const obligations = useMemo(
    () => [...events].reverse().filter((e) => e.kind === "obligation").slice(0, 6),
    [events]
  );
  const lastDeliverable = useMemo(
    () => [...events].reverse().find((e) => e.kind === "deliverable"),
    [events]
  );
  const lastSessionPid = last?.pid;

  return (
    <main className="mx-auto max-w-[1432px] px-10">
      {/* header */}
      <header className="flex items-center justify-between border-b border-ash py-6">
        <div className="flex items-baseline gap-6">
          <h1 className="font-serif-ed text-[28px] font-normal tracking-[-0.02em]">Charter</h1>
          <p className="text-xs uppercase tracking-widest text-smoke">
            the org that lives in memory · sibyl labs 2026
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-smoke">
          {busy && <span className="animate-pulse text-lake-blue">session running…</span>}
          <span className="rounded-full border border-ash px-3 py-1">
            last pid {lastSessionPid ?? "—"}
          </span>
          {bootEvent && (
            <span className={`rounded-full border px-3 py-1 ${bootEvent.kind === "founded" ? "border-ash text-smoke" : "border-off-black text-off-black"}`}>
              {bootEvent.kind === "founded" ? "org founded" : "org reconstituted from memory"} · {fmt(bootEvent.ts)}
            </span>
          )}
        </div>
      </header>

      {/* three-zone body */}
      <div className="grid grid-cols-12 gap-6 py-10">
        {/* left: task intake */}
        <section className="col-span-3 flex flex-col gap-6">
          <div className="rounded-[40px] border border-ash p-10">
            <p className="mb-6 text-xs uppercase tracking-widest text-smoke">01 · found / dispatch</p>
            <label className="mb-2 block text-xs uppercase tracking-wider text-graphite">founding mission</label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={4}
              className="w-full resize-none border border-ash bg-transparent p-4 text-sm leading-relaxed outline-none focus:border-off-black"
            />
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => dispatch("found")}
                disabled={busy}
                className="rounded-full bg-off-black px-6 py-2 text-xs uppercase tracking-wide text-white disabled:opacity-40"
              >
                found the org from this paragraph
              </button>
              <p className="text-xs text-smoke">
                one process writes the charter, roles, and vendor book into memory. it exists after this process dies.
              </p>
            </div>
          </div>

          <div className="rounded-[40px] border border-ash p-10">
            <label className="mb-2 block text-xs uppercase tracking-wider text-graphite">task brief</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={3}
              className="w-full resize-none border border-ash bg-transparent p-4 text-sm outline-none focus:border-off-black"
            />
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-graphite">budget usdc</span>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ""))}
                className="w-20 border border-ash bg-transparent px-3 py-1.5 text-sm outline-none focus:border-off-black"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => dispatch(mode === "amnesic" ? "amnesic-task" : "task")}
                disabled={busy}
                className="rounded-full bg-lake-blue px-6 py-2 text-xs uppercase tracking-wide text-white disabled:opacity-40"
              >
                {mode === "amnesic" ? "run amnesic (no memory) ▸" : "dispatch task ▸"}
              </button>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs uppercase tracking-wider text-smoke">
                  <input
                    type="checkbox"
                    checked={mode === "amnesic"}
                    onChange={(e) => setMode(e.target.checked ? "amnesic" : "live")}
                    className="accent-off-black"
                  />
                  deletion-test mode
                </label>
              </div>
            </div>
            <div className="mt-5 flex gap-3 border-t border-ash pt-5">
              <Pill tone="bad" onClick={() => dispatch("wipe")} disabled={busy}>
                wipe org from memory
              </Pill>
            </div>
          </div>
        </section>

        {/* center: job wall + provenance */}
        <section className="col-span-5 flex flex-col gap-6">
          <div className="rounded-[40px] border border-ash p-10">
            <p className="mb-6 text-xs uppercase tracking-widest text-smoke">02 · decision record</p>
            {decisions.length === 0 && (
              <p className="text-sm text-smoke">nothing decided yet — found the org or dispatch a task.</p>
            )}
            <ul className="flex flex-col gap-5">
              {decisions.map((d, i) => (
                <li key={d.ts + i} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-smoke">{fmt(d.ts)}</span>
                    <span className="text-sm">{d.text}</span>
                  </div>
                  <p className="pl-16 text-xs leading-relaxed text-smoke">
                    because: {d.data?.because ?? ""}
                    <span className="ml-2 rounded-full border border-ash px-2 py-0.5 text-[10px] uppercase tracking-wider">
                      {d.data?.source ?? ""}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[40px] border border-ash p-10">
            <p className="mb-6 text-xs uppercase tracking-widest text-smoke">03 · obligations</p>
            {obligations.length === 0 && <p className="text-sm text-smoke">no obligations on the wall.</p>}
            <ul className="flex flex-col gap-3">
              {obligations.map((o, i) => (
                <li key={o.ts + i} className="flex items-center justify-between border-b border-ash pb-3 text-sm last:border-b-0">
                  <span className="truncate pr-4">{o.text}</span>
                  <span className="shrink-0 text-xs uppercase tracking-wider text-smoke">pid {o.pid}</span>
                </li>
              ))}
            </ul>
            {lastDeliverable && (
              <div className="mt-6 border-t border-ash pt-5">
                <p className="mb-2 text-xs uppercase tracking-widest text-smoke">latest deliverable</p>
                <p className="font-serif-ed text-lg leading-snug">{lastDeliverable.text.replace(/^deliverable: /, "")}</p>
              </div>
            )}
          </div>
        </section>

        {/* right: what i remember */}
        <section className="col-span-4 flex flex-col gap-6">
          <div className="rounded-[40px] border border-ash bg-periwinkle-mist p-10">
            <p className="mb-6 text-xs uppercase tracking-widest text-smoke">04 · what I remember</p>
            {vendors.length === 0 && <p className="text-sm text-smoke">vendor book empty — found the org first.</p>}
            <ul className="flex flex-col gap-4">
              {vendors.map((v, i) => {
                const d = v.data ?? {};
                return (
                  <li key={v.ts + i} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{d.name}</span>
                        {d.banned && (
                          <span className="rounded-full bg-off-black px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">banned</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-graphite">
                        {d.jobs ?? 0} job(s) · {d.failures ?? 0} failure(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${(d.rate ?? 0).toFixed(2)}</p>
                      <p className="text-xs text-graphite">quality {d.quality ?? "?"}/5</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-ash pt-4 text-xs leading-relaxed text-graphite">
              this panel is read back from Sibyl Memory by every fresh process — it is why the next session hires
              differently. delete the memory and this whole column empties.
            </p>
          </div>

          <div className="rounded-[40px] border border-ash p-10">
            <p className="mb-4 text-xs uppercase tracking-widest text-smoke">05 · run log</p>
            <div ref={tailRef} className="max-h-64 overflow-y-auto pr-2 font-mono-ui">
              {[...events].reverse().slice(0, 40).map((e, i) => (
                <p key={e.ts + i} className="border-b border-ash py-1.5 text-xs leading-relaxed text-graphite">
                  <span className="text-smoke">{fmt(e.ts)}</span> pid{e.pid}{" "}
                  <span className="uppercase tracking-wider text-smoke">{e.kind}</span> — {e.text}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-ash py-6 text-xs uppercase tracking-widest text-smoke">
        every dispatch is a fresh OS process · decisions carry memory provenance · wipe the org and nothing
        reassembles
      </footer>
    </main>
  );
}
