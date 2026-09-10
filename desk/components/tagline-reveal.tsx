"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mandatory tagline moment: a full-width serif statement whose words activate
 * one at a time, in reading order, when the section enters view.
 * One IntersectionObserver + a stagger; no scroll listeners.
 */
export function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // stable global word index across lines (duplicate words get distinct indices)
  let gi = 0;
  const indexed = lines.map((line) =>
    line.split(" ").map((w) => ({ w, gi: gi++ }))
  );
  const total = gi;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(total);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          let i = 0;
          const tick = () => {
            i += 1;
            setActive(i);
            if (i < total) setTimeout(tick, 130);
          };
          setTimeout(tick, 150);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  return (
    <div ref={ref} className="mx-auto max-w-4xl text-center">
      {indexed.map((line, li) => (
        <p
          key={li}
          className="font-untitled-serif text-heading font-normal leading-tight sm:text-heading-lg"
        >
          {line.map(({ w, gi: idx }) => (
            <span
              key={idx}
              className="transition-colors duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                color:
                  idx < active
                    ? "var(--color-off-black)"
                    : "color-mix(in srgb, var(--color-off-black) 28%, transparent)",
              }}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
