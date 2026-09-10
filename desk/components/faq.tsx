import type { ReactNode } from "react";

export function Faq({ items }: { items: Array<{ q: string; a: ReactNode }> }) {
  return (
    <div className="border-t border-ash">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-ash">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-10 [&::-webkit-details-marker]:hidden">
            <span className="font-untitled-serif text-subheading font-normal">{item.q}</span>
            <span
              aria-hidden
              className="text-subheading text-off-black transition-transform duration-300 group-open:rotate-180"
            >
              ↓
            </span>
          </summary>
          <div className="max-w-3xl pb-10 text-body text-graphite">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
