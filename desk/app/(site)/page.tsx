import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { HeroTranscript } from "@/components/hero-transcript";
import { TaglineReveal } from "@/components/tagline-reveal";
import { Card, FeatureCard, Kicker, PillLink, StatusBadge } from "@/components/ui";

const FACTS = [
  { value: "24/24", label: "deletion-test checks", state: "verified" as const },
  { value: "5", label: "fresh processes in the test story", state: "verified" as const },
  { value: "5", label: "memory domains, each load-bearing", state: "verified" as const },
  { value: "ACP", label: "escrow path wired, not run", state: "not-run" as const },
];

const STEPS = [
  {
    n: "01",
    title: "Hold",
    body:
      "A paragraph founds the org: charter, roles, standards, vendor book — written into memory, not code. With no vendor history it explores, hires the cheapest, and gets burned. QA fails the work and the ban is recorded.",
  },
  {
    n: "02",
    title: "Kill",
    body:
      "The process dies. No session, no context window, no RAM survives. Everything the org knows exists only as Sibyl Memory rows — charter, roles, vendor notes, and the obligation that was opening.",
  },
  {
    n: "03",
    title: "Recall",
    body:
      "A fresh process reconstitutes the organization. It cites the ban by name, skips the failed vendor, attaches the remembered standards to the brief, passes QA — and if a job was interrupted, it resumes it by id.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero — centered hold, product story in the first screen */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-6 -z-10 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-coral/50 via-sky-blue/50 to-mint/50 blur-[70px]"
        />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Kicker>An organization that survives its workers</Kicker>
            <h1 className="mt-6 font-untitled-serif text-heading font-normal sm:text-display">
              Your agents are employees.
              <br />
              Calliope is the company.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-body-lg text-graphite">
              The charter, the standards, the vendor history, and the work in
              flight live in Sibyl Memory. Kill every process — the next one
              reads the organization back and finishes the job.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PillLink href="/console" tone="blue">
                Open the console
              </PillLink>
              <Link
                href="/evidence"
                className="text-body-sm uppercase tracking-[0.08em] text-graphite underline-offset-4 hover:text-off-black hover:underline"
              >
                See the evidence →
              </Link>
            </div>
            <p className="mt-6 text-body-sm text-graphite">
              <span className="font-medium text-off-black">24/24 deletion checks</span> ·
              kill the process, the org reassembles · runs locally · MIT licensed
            </p>
          </Reveal>
          <Reveal delay={120}>
            <HeroTranscript />
          </Reveal>
        </div>
      </section>

      {/* Verified facts strip */}
      <Reveal>
        <section aria-label="Verified facts" className="border-y border-ash">
          <dl className="grid grid-cols-1 divide-y divide-ash sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col gap-2 px-8 py-8">
                <dt className="font-untitled-serif text-heading-sm font-normal">{f.value}</dt>
                <dd className="flex items-center gap-3 text-body-sm text-graphite">
                  {f.label}
                  <StatusBadge state={f.state} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      {/* Problem */}
      <section className="pt-[var(--section-gap)]">
        <Reveal>
          <Kicker>The problem</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal sm:text-heading">
            Work does not survive the worker.
          </h2>
          <p className="mt-5 max-w-2xl text-body-lg text-graphite">
            AI workers are disposable processes. When one restarts, something
            it learned walks out the door — unless the organization itself is
            stored somewhere durable.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal>
            <FeatureCard title="Briefings evaporate" meta="context">
              Standards, tone, and rules usually live in a prompt. A restart
              loses all of it, and the user becomes the memory bus.
            </FeatureCard>
          </Reveal>
          <Reveal delay={80}>
            <FeatureCard title="Mistakes repeat" meta="vendors">
              The vendor that failed last week is a stranger again. Without a
              record, every session re-explores and re-trusts the same
              disappointment.
            </FeatureCard>
          </Reveal>
          <Reveal delay={160}>
            <FeatureCard title="Promises stall" meta="obligations">
              A crash mid-job leaves nobody who knows what was owed, at what
              budget, or against which standard. Interrupted work becomes lost
              work.
            </FeatureCard>
          </Reveal>
        </div>
      </section>

      {/* Tagline reveal — the held breath between problem and model */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <TaglineReveal
            lines={["The process is disposable.", "The company is not."]}
          />
        </Reveal>
      </section>

      {/* The model */}
      <section className="pt-[var(--section-gap)]">
        <Reveal>
          <Kicker>The model</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal sm:text-heading">
            Memory is not a notebook. It is the institution.
          </h2>
          <p className="mt-5 max-w-2xl text-body-lg text-graphite">
            Calliope keeps the org chart, the client standards, the vendor book,
            and open obligations as Sibyl Memory entities. Every decision the
            agent makes cites the row that caused it.
          </p>
        </Reveal>
        <div className="mt-12">
          <PipelineDiagram />
        </div>
      </section>

      {/* The moment */}
      <section className="pt-[var(--section-gap)]">
        <Reveal>
          <Kicker>The moment that matters</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal sm:text-heading">
            Three beats: hold, kill, recall.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <Card className="h-full">
                <p className="text-caption uppercase tracking-[0.2em] text-graphite">{s.n}</p>
                <h3 className="mt-4 font-untitled-serif text-subheading font-normal">{s.title}</h3>
                <p className="mt-4 text-body text-graphite">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-body text-graphite">
            This sequence is not a storyboard; it is a test.{" "}
            <code className="rounded-full border border-ash px-3 py-1 text-body-sm">npm test</code>{" "}
            spawns real child processes and asserts the difference.{" "}
            <Link href="/evidence" className="underline underline-offset-4 hover:text-off-black">
              Read the evidence
            </Link>
            .
          </p>
        </Reveal>
      </section>

      {/* Honest status */}
      <section className="pt-[var(--section-gap)]">
        <Reveal>
          <Card tone="raised">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <Kicker>What is real, stated plainly</Kicker>
                <h2 className="mt-4 font-untitled-serif text-subheading font-normal sm:text-heading-sm">
                  Verified where verified. Labeled where not.
                </h2>
                <p className="mt-5 text-body text-graphite">
                  A simulation that pretends to be onchain is worse than no
                  integration. Calliope labels its seams: the vendor port falls
                  back to a deterministic simulation, and the ACP escrow path
                  stays off until registered agents exist.
                </p>
                <div className="mt-8">
                  <PillLink href="/evidence" tone="black">
                    Full status table
                  </PillLink>
                </div>
              </div>
              <ul className="flex flex-col gap-6 text-body text-graphite">
                <li className="flex items-start justify-between gap-6 border-b border-ash pb-4">
                  <span>Sibyl Memory persistence, fresh-process recall, crash/resume</span>
                  <StatusBadge state="verified" />
                </li>
                <li className="flex items-start justify-between gap-6 border-b border-ash pb-4">
                  <span>Vendor deliveries (deterministic simulation, labeled SIM)</span>
                  <StatusBadge state="simulated" />
                </li>
                <li className="flex items-start justify-between gap-6 border-b border-ash pb-4">
                  <span>Real LLM editor / QA (wired through role model config)</span>
                  <StatusBadge state="not-run" />
                </li>
                <li className="flex items-start justify-between gap-6">
                  <span>Virtuals ACP jobs and Base settlement</span>
                  <StatusBadge state="not-run" />
                </li>
              </ul>
            </div>
          </Card>
        </Reveal>
      </section>

      {/* Closing */}
      <section className="pb-8 pt-[var(--section-gap)]">
        <Reveal>
          <Card tone="ink">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="font-untitled-serif text-subheading font-normal sm:text-heading-sm">
                  Meet the organization.
                </h2>
                <p className="mt-4 text-body text-ash">
                  Found it from a paragraph, watch it learn from a failure, then
                  kill it yourself. The console runs locally against your own
                  Sibyl Memory store.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <PillLink href="/console" tone="blue">
                  Open the console
                </PillLink>
                <PillLink href="/memory" tone="ghost">
                  How the memory works
                </PillLink>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>
    </>
  );
}
