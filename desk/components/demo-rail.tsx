"use client";

import type { OrgEvent } from "../lib/types";

/**
 * Guided demo rail: the five beats of the product story, derived from the
 * event log, clickable in order. Turns the console from a control panel into
 * a narrated demonstration a judge can follow without a script.
 */
type Step = {
  id: "found" | "dispatch" | "crash" | "resume" | "amnesic";
  label: string;
  hint: string;
};

const STEPS: Step[] = [
  { id: "found", label: "Found", hint: "write the org into memory" },
  { id: "dispatch", label: "Dispatch", hint: "explore, fail, ban" },
  { id: "crash", label: "Crash", hint: "die mid-task" },
  { id: "resume", label: "Resume", hint: "finish the interrupted job" },
  { id: "amnesic", label: "Amnesic", hint: "memory stubbed: refusal" },
];

function completed(events: OrgEvent[]): Record<Step["id"], boolean> {
  const text = events.map((e) => e.text);
  return {
    found: events.some(
      (e) => e.kind === "founded" || e.kind === "reconstituted" || e.kind === "charter"
    ),
    dispatch: events.some(
      (e) => e.kind === "obligation" && /-> (atelier|cheap)/.test(e.text)
    ),
    crash: events.some((e) => e.kind === "obligation" && e.data?.crashed === true),
    resume: text.some((t) => t.includes("resumed obligation")),
    amnesic: text.some((t) => t.includes("task refused") || t.includes("attach 0 client standard")),
  };
}

export function DemoRail({
  events,
  busy,
  onRun,
}: {
  events: OrgEvent[];
  busy: boolean;
  onRun: (step: Step["id"]) => void;
}) {
  const done = completed(events);
  const nextIndex = STEPS.findIndex((s) => !done[s.id]);

  return (
    <nav
      aria-label="Demo walkthrough"
      className="mt-8 overflow-x-auto rounded-3xl border border-ash"
    >
      <ol className="flex min-w-[640px] divide-x divide-ash">
        {STEPS.map((s, i) => {
          const isDone = done[s.id];
          const isNext = i === nextIndex;
          return (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => onRun(s.id)}
                disabled={busy}
                aria-current={isNext ? "step" : undefined}
                className={`flex w-full items-start gap-3 px-6 py-5 text-left transition-colors disabled:opacity-50 ${
                  isNext ? "bg-periwinkle-mist" : "hover:bg-periwinkle-mist/50"
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption ${
                    isDone
                      ? "bg-off-black text-parchment"
                      : isNext
                        ? "border border-off-black text-off-black"
                        : "border border-ash text-graphite"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span>
                  <span className={`block text-body-sm uppercase tracking-[0.08em] ${isDone ? "text-off-black" : "text-graphite"}`}>
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-caption text-graphite">{s.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
