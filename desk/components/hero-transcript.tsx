"use client";

import { useEffect, useState } from "react";

/**
 * The fresh-session story, playing in the hero: eight real events from the
 * demo run, revealed in sequence, then the process dies and a new pid does
 * the opposite. Reduced motion shows the full transcript statically.
 */
type Row = {
  pid: string;
  kind: string;
  text: string;
  tone: "system" | "decision" | "fail" | "pass" | "divider";
  because?: string;
};

const ROWS: Row[] = [
  { pid: "51816", kind: "HIRE", text: "hire cheap-and-sloppy @ $1.00", tone: "decision", because: "no history, exploring with the cheapest" },
  { pid: "51816", kind: "QA", text: "fail: brand voice missing", tone: "fail", because: "graded against charter standards" },
  { pid: "51816", kind: "BAN", text: "ban cheap-and-sloppy", tone: "decision", because: "never re-hire a banned vendor" },
  { pid: "", kind: "EXIT", text: "process exits. nothing organizational kept in RAM.", tone: "divider" },
  { pid: "50068", kind: "BOOT", text: "reconstituted from memory: 3 roles, 2 vendors", tone: "system" },
  { pid: "50068", kind: "SKIP", text: "skip cheap-and-sloppy: BANNED in memory", tone: "decision", because: "vendor/* in memory" },
  { pid: "50068", kind: "HIRE", text: "hire atelier-jp @ $2.50", tone: "decision", because: "remembered: quality 5.0/5" },
  { pid: "50068", kind: "QA", text: "pass: brand voice on", tone: "pass", because: "graded against charter standards" },
];

const toneClass: Record<Row["tone"], string> = {
  system: "text-smoke",
  decision: "text-off-black font-medium",
  fail: "text-off-black",
  pass: "text-off-black",
  divider: "text-smoke",
};

const dotClass: Record<Row["tone"], string> = {
  system: "bg-smoke",
  decision: "bg-off-black",
  fail: "border border-off-black",
  pass: "bg-off-black",
  divider: "bg-transparent",
};

export function HeroTranscript() {
  const [visible, setVisible] = useState(ROWS.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    setVisible(0);
    const advance = () => {
      if (cancelled) return;
      i += 1;
      setVisible(i);
      if (i < ROWS.length) {
        timer = setTimeout(advance, 850);
      } else {
        timer = setTimeout(() => {
          i = 0;
          setVisible(0);
          timer = setTimeout(advance, 500);
        }, 3200);
      }
    };
    timer = setTimeout(advance, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <figure
      className="mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-3xl border border-ash text-left"
      aria-label="Decision record from the demo run: two processes, one story"
    >
      <figcaption className="flex items-center justify-between border-b border-ash px-6 py-4 text-caption uppercase tracking-[0.18em] text-graphite">
        <span>Decision record</span>
        <span>two processes, one story</span>
      </figcaption>
      <ol className="flex flex-col px-6 py-4">
        {ROWS.map((row, i) => (
          <li
            key={`${row.kind}-${i}`}
            className={`row-in flex items-baseline gap-4 border-b border-ash py-2.5 last:border-b-0 ${
              i < visible ? "" : "invisible"
            }`}
            aria-hidden={i >= visible}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass[row.tone]}`} aria-hidden />
            <span className="w-14 shrink-0 text-caption uppercase tracking-[0.12em] text-smoke">
              {row.pid ? `pid ${row.pid}` : "—"}
            </span>
            <span className="w-14 shrink-0 text-caption uppercase tracking-[0.12em] text-smoke">
              {row.kind}
            </span>
            <span className={`flex-1 text-body-sm ${toneClass[row.tone]}`}>
              {row.text}
              {row.because && (
                <span className="ml-3 hidden text-caption text-smoke lg:inline">
                  because: {row.because}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
