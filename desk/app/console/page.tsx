"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrgEvent } from "../../lib/types";
import { DemoRail } from "../../components/demo-rail";

/** Local control surface: every action starts a fresh OS process. */

const fmt = (ts: string) =>
  new Date(ts).toLocaleTimeString("en-GB", { hour12: false });

/** Log toning: decisions read brightest; system chatter recedes. */
const KIND_TONE: Record<string, string> = {
  decision: "text-parchment font-medium",
  wipe: "text-parchment font-medium",
  refusal: "text-parchment font-medium",
  deliverable: "text-ash",
  obligation: "text-ash",
  founded: "text-smoke",
  reconstituted: "text-smoke",
  charter: "text-smoke",
  vendor: "text-smoke",
  "hire-port": "text-smoke",
  "set-model": "text-smoke",
};

const eventKey = (e: OrgEvent) => `${e.ts}|${e.pid}|${e.kind}|${e.text}`;

function mergeEvents(prev: OrgEvent[], incoming: OrgEvent[]): OrgEvent[] {
  const seen = new Set(prev.map(eventKey));
  const next = [...prev];
  for (const e of incoming) {
    const k = eventKey(e);
    if (!seen.has(k)) {
      seen.add(k);
      next.push(e);
    }
  }
  next.sort((a, b) => a.ts.localeCompare(b.ts) || a.pid - b.pid);
  return next;
}

function Panel({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ash p-8 sm:p-10">
      <h2 className="text-caption font-medium uppercase tracking-[0.18em] text-graphite">
        {step} · {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ConsolePage() {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mission, setMission] = useState(
    "Localize client landing copy with brand voice intact, on budget, every time."
  );
  const [task, setTask] = useState(
    "Localize the landing page hero to Japanese. Keep the brand voice."
  );
  const [budget, setBudget] = useState("3");
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [amnesic, setAmnesic] = useState(false);
  const [wipeArmed, setWipeArmed] = useState(false);
  const [logFilter, setLogFilter] = useState<"all" | "decision" | "vendor" | "system">("all");
  const logRef = useRef<HTMLDivElement>(null);
  const wipeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const budgetValid = (raw: string) =>
    /^\d+(\.\d{1,2})?$/.test(raw.trim()) && Number(raw) > 0 && Number(raw) <= 1000;

  const onBudgetChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    setBudget(cleaned);
    setBudgetError(
      cleaned.trim() === "" || budgetValid(cleaned)
        ? null
        : "Enter a number between 0 and 1000."
    );
  };

  /** Textareas grow with their content; the mission paragraph never scrolls. */
  const autogrow = (el: HTMLTextAreaElement, minPx: number) => {
    el.style.height = "auto";
    el.style.height = `${Math.max(minPx, el.scrollHeight)}px`;
  };

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/state");
      const j = await r.json();
      if (j.ok) setEvents((prev) => mergeEvents(prev, j.events as OrgEvent[]));
    } catch {
      /* transient; next poll retries */
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events.length]);

  const dispatch = async (cmd: string, opts: { crash?: boolean } = {}) => {
    if ((cmd === "task" || cmd === "amnesic-task") && !budgetValid(budget)) {
      setBudgetError("Enter a number between 0 and 1000.");
      return;
    }
    if (wipeTimer.current) clearTimeout(wipeTimer.current);
    setWipeArmed(false);
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cmd,
          crash: Boolean(opts.crash),
          mission,
          text: task,
          budget: budgetValid(budget) ? Number(budget) : 3,
        }),
      });
      const j = await r.json();
      if (Array.isArray(j.events)) {
        setEvents((prev) => mergeEvents(prev, j.events as OrgEvent[]));
      }
      if (!j.ok) {
        setError(
          `The worker process reported a problem (status ${j.status ?? "?"}). ${
            j.error ?? j.stderr ?? "See the run log."
          }`.trim()
        );
      }
    } catch (e) {
      setError(`Dispatch failed: ${(e as Error).message}`);
    }
    setBusy(false);
  };

  const sorted = events;
  const last = sorted[sorted.length - 1];
  const bootEvent = useMemo(
    () => [...sorted].reverse().find((e) => e.kind === "founded" || e.kind === "reconstituted"),
    [sorted]
  );
  const charterEvent = useMemo(
    () => [...sorted].reverse().find((e) => e.kind === "charter"),
    [sorted]
  );
  const vendors = useMemo(() => {
    const m = new Map<string, OrgEvent>();
    for (const e of sorted) {
      if (e.kind !== "vendor") continue;
      const name = (e.data?.name ?? e.text).toString();
      m.delete(name); // re-insert so iteration order is most-recent-last
      m.set(name, e);
    }
    return [...m.values()].slice(-6);
  }, [sorted]);
  const decisions = useMemo(
    () => [...sorted].reverse().filter((e) => e.kind === "decision").slice(0, 8),
    [sorted]
  );
  const obligations = useMemo(
    () => [...sorted].reverse().filter((e) => e.kind === "obligation").slice(0, 6),
    [sorted]
  );
  const lastDeliverable = useMemo(
    () => [...sorted].reverse().find((e) => e.kind === "deliverable"),
    [sorted]
  );
  const hirePort = useMemo(
    () => [...sorted].reverse().find((e) => e.kind === "hire-port"),
    [sorted]
  );
  const filteredLog = useMemo(() => {
    if (logFilter === "all") return sorted;
    if (logFilter === "decision") {
      return sorted.filter(
        (e) => e.kind === "decision" || e.kind === "refusal" || e.kind === "wipe"
      );
    }
    if (logFilter === "vendor") {
      return sorted.filter((e) => e.kind === "vendor" || e.kind === "hire-port");
    }
    return sorted.filter(
      (e) =>
        e.kind !== "decision" &&
        e.kind !== "refusal" &&
        e.kind !== "wipe" &&
        e.kind !== "vendor" &&
        e.kind !== "hire-port"
    );
  }, [sorted, logFilter]);

  useEffect(() => {
    return () => {
      if (wipeTimer.current) clearTimeout(wipeTimer.current);
    };
  }, []);

  return (
    <main id="main" className="mx-auto max-w-[var(--page-max-width)] px-6 pb-16 sm:px-10">
      {/* Console chrome */}
      <header className="flex flex-col gap-6 border-b border-ash py-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href="/" className="text-body-sm uppercase tracking-[0.1em] text-graphite hover:text-off-black">
            ← Calliope
          </Link>
          <h1 className="mt-3 font-untitled-serif text-heading-sm font-normal">Console</h1>
          <p className="mt-2 max-w-2xl text-body text-graphite">
            Local control surface. Every action starts a fresh OS process against
            your Sibyl Memory store — this page is not a public deployment.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-caption uppercase tracking-[0.12em] text-graphite">
          <span className="rounded-full border border-ash px-4 py-2">
            last pid {last?.pid ?? "—"}
          </span>
          {bootEvent && (
            <span className="rounded-full border border-ash px-4 py-2">
              {bootEvent.kind === "founded" ? "org founded" : "org reconstituted"} · {fmt(bootEvent.ts)}
            </span>
          )}
          {hirePort && (
            <span className="rounded-full border border-ash px-4 py-2">{hirePort.text}</span>
          )}
          <span aria-live="polite" className="text-off-black">
            {busy ? "session running…" : ""}
          </span>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-3xl border border-off-black bg-periwinkle-mist px-8 py-5 text-body"
        >
          {error}
        </div>
      )}

      <DemoRail
        events={sorted}
        busy={busy}
        onRun={(step) => {
          if (step === "found") void dispatch("found");
          else if (step === "crash") void dispatch("task", { crash: true });
          else if (step === "amnesic") void dispatch("amnesic-task");
          // dispatch, recall, and resume all spawn a fresh task process
          else void dispatch("task");
        }}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls — sticky so the primary actions stay in view */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
          <Panel step="01" title="Found">
            <label htmlFor="mission" className="block text-body-sm text-graphite">
              Founding mission — written into memory by one process, read back forever
            </label>
            <textarea
              id="mission"
              value={mission}
              onChange={(e) => {
                setMission(e.target.value);
                autogrow(e.target, 104);
              }}
              rows={4}
              className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-ash bg-transparent p-4 text-body outline-none focus:border-off-black"
            />
            <button
              type="button"
              onClick={() => dispatch("found")}
              disabled={busy}
              className="press mt-4 w-full rounded-full bg-off-black px-6 py-4 text-body-sm uppercase tracking-[0.08em] text-parchment hover:bg-graphite disabled:opacity-40"
            >
              Found the org from this paragraph
            </button>
          </Panel>

          <Panel step="02" title="Dispatch">
            <label htmlFor="task" className="block text-body-sm text-graphite">
              Task brief
            </label>
            <textarea
              id="task"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                autogrow(e.target, 76);
              }}
              rows={3}
              className="mt-3 min-h-[76px] w-full resize-none rounded-2xl border border-ash bg-transparent p-4 text-body outline-none focus:border-off-black"
            />
            <div className="mt-4 flex items-start gap-4">
              <label htmlFor="budget" className="pt-2 text-body-sm text-graphite">
                Budget (USDC)
              </label>
              <div className="w-32">
                <input
                  id="budget"
                  inputMode="decimal"
                  value={budget}
                  aria-invalid={budgetError ? true : undefined}
                  aria-describedby={budgetError ? "budget-error" : undefined}
                  onChange={(e) => onBudgetChange(e.target.value)}
                  className={`w-full rounded-2xl border bg-transparent px-4 py-2 text-body outline-none focus:border-off-black ${
                    budgetError ? "border-crimson" : "border-ash"
                  }`}
                />
                {budgetError && (
                  <p id="budget-error" role="alert" className="mt-1 text-caption text-crimson">
                    {budgetError}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dispatch(amnesic ? "amnesic-task" : "task")}
              disabled={busy || !!budgetError}
              className="press mt-5 w-full rounded-full bg-lake-blue px-6 py-4 text-body-sm uppercase tracking-[0.08em] text-parchment hover:bg-off-black disabled:opacity-40 aria-disabled:cursor-not-allowed"
            >
              {amnesic ? "Run amnesic (no memory) ▸" : "Dispatch task ▸"}
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="flex cursor-pointer items-center gap-3 text-body-sm text-graphite">
                <input
                  type="checkbox"
                  checked={amnesic}
                  onChange={(e) => setAmnesic(e.target.checked)}
                  className="h-4 w-4 accent-off-black"
                />
                Deletion-test mode
              </label>
              <button
                type="button"
                onClick={() => dispatch("task", { crash: true })}
                disabled={busy || amnesic}
                title={amnesic ? "Crash simulation applies to live tasks only" : undefined}
                className="press rounded-full border border-ash px-5 py-2.5 text-caption uppercase tracking-[0.12em] text-graphite hover:border-off-black hover:text-off-black disabled:opacity-40"
              >
                Crash mid-task
              </button>
            </div>
          </Panel>

          <Panel step="03" title="Destructive">
            <p className="text-body-sm text-graphite">
              Wiping archives the org&apos;s entities; the append-only journal keeps
              its residue, which QA can still cite. For a pristine store, use{" "}
              <code>npm run org -- reset --yes</code> in the agent.
            </p>
            <button
              type="button"
              onClick={() => {
                if (wipeArmed) {
                  void dispatch("wipe");
                  return;
                }
                setWipeArmed(true);
                wipeTimer.current = setTimeout(() => setWipeArmed(false), 3000);
              }}
              disabled={busy}
              aria-live="polite"
              className={`press mt-4 w-full rounded-full px-6 py-3 text-body-sm uppercase tracking-[0.08em] disabled:opacity-40 ${
                wipeArmed
                  ? "bg-off-black text-parchment"
                  : "border border-graphite text-graphite hover:border-off-black hover:text-off-black"
              }`}
            >
              {wipeArmed ? "Click again to archive the org" : "Wipe org from memory (archives)"}
            </button>
            {wipeArmed && (
              <p className="mt-2 text-caption text-graphite">
                Entities are archived; the journal keeps its residue. This
                resets itself in a few seconds.
              </p>
            )}
          </Panel>
        </div>

        {/* Memory + decisions */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <Panel step="04" title="What I remember">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              <div>
                {charterEvent?.data ? (
                  <>
                    <h3 className="font-untitled-serif text-subheading font-normal">
                      {charterEvent.data.name}
                    </h3>
                    <p className="mt-2 text-body text-graphite">{charterEvent.data.mission}</p>
                    {(charterEvent.data.clientStandards ?? []).length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {(charterEvent.data.clientStandards as string[]).map((s) => (
                          <li
                            key={s}
                            className="rounded-full border border-ash px-3 py-1 text-caption uppercase tracking-[0.1em] text-graphite"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-ash p-6">
                    <p className="text-body text-graphite">
                      No charter in memory yet — the org has not been founded.
                    </p>
                    <p className="mt-2 text-body-sm text-graphite">
                      Run step <span className="font-medium text-off-black">① Found</span> in
                      the walkthrough above, or write a mission and press the
                      black button.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-caption uppercase tracking-[0.18em] text-graphite">Vendor book</h3>
                {vendors.length === 0 ? (
                  <p className="mt-4 text-body-sm text-graphite">
                    Empty until the org is founded — step ① writes two vendors
                    into memory.
                  </p>
                ) : (
                  <ul className="mt-4 flex flex-col">
                    {vendors.map((v, i) => {
                      const d = v.data ?? {};
                      return (
                        <li
                          key={`${v.ts}-${i}`}
                          className="flex items-center justify-between gap-4 border-b border-ash py-3 text-body last:border-b-0"
                        >
                          <span className="flex items-center gap-3">
                            {d.name}
                            {d.banned && (
                              <span className="rounded-full bg-off-black px-3 py-1 text-caption uppercase tracking-[0.1em] text-parchment">
                                banned
                              </span>
                            )}
                          </span>
                          <span className="text-body-sm text-graphite">
                            {d.jobs ?? 0} job(s) · {d.failures ?? 0} fail · q{" "}
                            {typeof d.quality === "number" ? d.quality.toFixed(1) : "?"} · $
                            {(d.rate ?? 0).toFixed(2)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </Panel>

          <Panel step="05" title="Decision record">
            {busy ? (
              <div className="flex flex-col gap-4" aria-label="A worker process is deciding">
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-3/5" />
              </div>
            ) : decisions.length === 0 ? (
              <p className="text-body-sm text-graphite">
                Nothing decided yet — dispatch a task (step ②) and every choice
                will appear here with the memory row that caused it.
              </p>
            ) : (
              <>
                <div className="rounded-2xl bg-periwinkle-mist p-6">
                  <p className="text-caption font-medium uppercase tracking-[0.18em] text-graphite">
                    Latest decision
                  </p>
                  <p className="mt-3 font-untitled-serif text-subheading font-normal">
                    {decisions[0].text}
                  </p>
                  <p className="mt-2 text-body-sm text-graphite">
                    because: {decisions[0].data?.because ?? ""}
                    {decisions[0].data?.source && (
                      <span className="ml-3 inline-block rounded-full border border-ash px-3 py-1 text-caption uppercase tracking-[0.1em]">
                        {decisions[0].data.source}
                      </span>
                    )}
                  </p>
                </div>
                <ul className="mt-6 flex flex-col gap-5">
                  {decisions.slice(1).map((d, i) => (
                    <li key={`${d.ts}-${i}`}>
                      <p className="text-body">
                        <span className="text-graphite">{fmt(d.ts)}</span> —{" "}
                        <span className="font-medium">{d.text}</span>
                      </p>
                      <p className="mt-1 text-body-sm text-graphite">
                        because: {d.data?.because ?? ""}
                        {d.data?.source && (
                          <span className="ml-3 inline-block rounded-full border border-ash px-3 py-1 text-caption uppercase tracking-[0.1em]">
                            {d.data.source}
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>
      </div>

      {/* Obligations + log */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Panel step="06" title="Obligations">
            {obligations.length === 0 ? (
              <p className="text-body text-graphite">No obligations on the wall.</p>
            ) : (
              <ul className="flex flex-col">
                {obligations.map((o, i) => (
                  <li
                    key={`${o.ts}-${i}`}
                    className="flex items-center justify-between gap-4 border-b border-ash py-3 text-body last:border-b-0"
                  >
                    <span className="truncate">{o.text}</span>
                    <span className="shrink-0 text-caption uppercase tracking-[0.1em] text-graphite">
                      pid {o.pid}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {lastDeliverable && (
              <div className="mt-6 border-t border-ash pt-5">
                <h3 className="text-caption uppercase tracking-[0.18em] text-graphite">
                  Latest deliverable
                </h3>
                <p className="mt-2 font-untitled-serif text-body-lg">
                  {lastDeliverable.text.replace(/^deliverable: /, "")}
                </p>
              </div>
            )}
          </Panel>
        </div>
        <div className="lg:col-span-7">
          <section className="flex h-full flex-col rounded-3xl bg-off-black p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-caption uppercase tracking-[0.18em] text-ash">07 · Run log</h2>
              <div className="flex gap-2" role="group" aria-label="Filter run log">
                {(["all", "decision", "vendor", "system"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLogFilter(f)}
                    aria-pressed={logFilter === f}
                    className={`press rounded-full px-3 py-1 text-caption uppercase tracking-[0.12em] ${
                      logFilter === f
                        ? "bg-parchment text-off-black"
                        : "border border-graphite text-ash hover:text-parchment"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div
              ref={logRef}
              tabIndex={0}
              role="log"
              aria-label="Run log"
              className="mt-6 max-h-80 flex-1 overflow-y-auto pr-2"
            >
              {filteredLog.length === 0 ? (
                <p className="text-caption text-ash">No {logFilter} events yet.</p>
              ) : (
                filteredLog.map((e, i) => (
                  <p
                    key={`${eventKey(e)}-${i}`}
                    className={`border-b border-graphite py-2 text-caption leading-relaxed ${
                      KIND_TONE[e.kind] ?? "text-ash"
                    }`}
                  >
                    <span className="text-smoke">{fmt(e.ts)}</span> pid{e.pid}{" "}
                    <span className="uppercase tracking-[0.1em] text-smoke">{e.kind}</span> — {e.text}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-12 flex flex-col gap-2 border-t border-ash pt-6 text-body-sm text-graphite sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built with Sibyl Memory. ·{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-off-black">
            Back to the site
          </Link>
        </p>
        <p>Local-only surface — not a public deployment.</p>
      </footer>
    </main>
  );
}
