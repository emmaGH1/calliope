import Link from "next/link";
import type { ReactNode } from "react";

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-caption uppercase tracking-[0.2em] text-graphite">{children}</p>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <Tag
        className={`mt-4 font-untitled-serif font-normal ${
          Tag === "h1" ? "text-heading sm:text-display" : "text-heading-sm sm:text-heading"
        }`}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={`mt-5 max-w-2xl text-body-lg text-graphite ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  tone = "plain",
  className = "",
}: {
  children: ReactNode;
  tone?: "plain" | "raised" | "ink";
  className?: string;
}) {
  const tones = {
    plain: "border border-ash bg-transparent",
    raised: "border border-ash bg-periwinkle-mist",
    ink: "bg-off-black text-parchment",
  } as const;
  return (
    <div className={`rounded-3xl p-10 ${tones[tone]} ${className}`}>{children}</div>
  );
}

export function FeatureCard({
  title,
  children,
  meta,
}: {
  title: string;
  children: ReactNode;
  meta?: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="font-untitled-serif text-subheading font-normal">{title}</h3>
      <div className="mt-4 flex-1 text-body text-graphite">{children}</div>
      {meta && <p className="mt-6 text-caption uppercase tracking-[0.15em] text-graphite">{meta}</p>}
    </Card>
  );
}

export function PillLink({
  href,
  children,
  tone = "ghost",
  external = false,
}: {
  href: string;
  children: ReactNode;
  tone?: "blue" | "black" | "ghost";
  external?: boolean;
}) {
  const tones = {
    blue: "bg-lake-blue text-parchment hover:bg-off-black",
    black: "bg-off-black text-parchment hover:bg-graphite",
    ghost: "border border-off-black text-off-black hover:bg-off-black hover:text-parchment",
  } as const;
  const cls = `inline-flex items-center gap-2 rounded-full px-8 py-4 text-body-sm uppercase tracking-[0.08em] transition-colors ${tones[tone]}`;
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function StatusBadge({
  state,
}: {
  state: "verified" | "simulated" | "not-run";
}) {
  const map = {
    verified: { dot: "bg-off-black", label: "verified", cls: "border-off-black text-off-black" },
    simulated: { dot: "bg-smoke", label: "simulated", cls: "border-ash text-graphite" },
    "not-run": { dot: "border border-graphite", label: "not run", cls: "border-ash text-graphite" },
  } as const;
  const s = map[state];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-caption uppercase tracking-[0.12em] ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  );
}

export function Wash({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[70px] ${className}`}
    />
  );
}
