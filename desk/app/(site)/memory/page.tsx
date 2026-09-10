import { Reveal } from "@/components/reveal";
import { Card, Kicker, PillLink, StatusBadge } from "@/components/ui";

const READ_SITES = [
  {
    ref: "run-task.ts:36-43",
    what: "Charter standards are read and attached to the brief; no charter means the brief goes out bare.",
  },
  {
    ref: "run-task.ts:82-97",
    what: "Roles are read from memory. No qa/editor entities and the task is refused — the org cannot route work.",
  },
  {
    ref: "run-task.ts:101-117",
    what: "The vendor book drives hiring: bans are skipped, quality and rate decide who gets the job.",
  },
  {
    ref: "run-task.ts:137-149",
    what: "A journal search pulls prior rulings for the vendor into the QA brief.",
  },
  {
    ref: "boot.ts:95-116",
    what: "Boot recalls the mission, then reconstitutes roles, vendors, and unfinished obligations — or founds the org if nothing is there.",
  },
  {
    ref: "session.ts:169-178",
    what: "A fresh process finds an in-progress obligation and resumes it by id.",
  },
];

const WRITE_SITES = [
  {
    ref: "boot.ts:98-110",
    what: "Founding writes the charter, roles, vendor book, and boot state.",
  },
  {
    ref: "run-task.ts:48-57",
    what: "Opening an obligation persists brief, standards, budget, and in_progress status before any hire.",
  },
  {
    ref: "run-task.ts:174-210",
    what: "Outcomes write back: paid/failed status, running quality averages, failure notes, and bans.",
  },
];

const TEST_SECTIONS = [
  { n: "1", title: "Founding and learning", checks: 5, detail: "No history → explores cheapest → QA fails → ban written." },
  { n: "2", title: "Fresh process", checks: 8, detail: "New pid reconstitutes the org, cites the ban, hires differently, passes." },
  { n: "3", title: "Deletion control", checks: 6, detail: "Memory stubbed out: bare brief, no roles, refusal, nothing persists." },
  { n: "4", title: "Crash and resume", checks: 5, detail: "Worker dies mid-task; a fresh process finishes the obligation." },
];

export default function MemoryPage() {
  return (
    <>
      <section className="pb-16 pt-24 sm:pt-32">
        <Reveal>
          <Kicker>Memory</Kicker>
          <h1 className="mt-6 max-w-4xl font-untitled-serif text-heading font-normal sm:text-display">
            The company is a set of rows.
          </h1>
          <p className="mt-8 max-w-2xl text-body-lg text-graphite">
            Calliope stores its organization in Sibyl Memory — a local-first,
            file-based memory layer (SQLite with full-text search, no vector
            database) reached over stdio MCP. If the rows vanish, the company
            vanishes with them.
          </p>
        </Reveal>
      </section>

      {/* Architecture path */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Path of a memory call</Kicker>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <h2 className="font-untitled-serif text-subheading font-normal">Agent</h2>
              <p className="mt-4 text-body text-graphite">
                TypeScript worker processes. Each task runs in a fresh OS
                process; nothing organizational is kept in module state.
              </p>
            </Card>
            <Card>
              <h2 className="font-untitled-serif text-subheading font-normal">MCP client</h2>
              <p className="mt-4 text-body text-graphite">
                A thin typed client in <code>agent/src/memory/sibyl.ts</code>{" "}
                speaks remember / recall / list / search / forget / state /
                journal over stdio to the Sibyl server.
              </p>
            </Card>
            <Card>
              <h2 className="font-untitled-serif text-subheading font-normal">Sibyl Memory</h2>
              <p className="mt-4 text-body text-graphite">
                Local store with entities, a state tier, and an append-only
                journal. Reads are fence-wrapped as untrusted data — stored
                text is reference, never instructions.
              </p>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* Read sites */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Load-bearing reads</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Six places where memory changes what happens next.
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-col">
          {READ_SITES.map((r, i) => (
            <Reveal key={r.ref} delay={i * 40}>
              <div className="flex flex-col gap-3 border-b border-ash py-8 lg:flex-row lg:items-baseline lg:gap-10">
                <code className="shrink-0 text-body text-off-black">{r.ref}</code>
                <p className="text-body text-graphite">{r.what}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Write sites */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Writes that outlive the process</Kicker>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {WRITE_SITES.map((w) => (
              <Card key={w.ref}>
                <code className="text-body">{w.ref}</code>
                <p className="mt-4 text-body text-graphite">{w.what}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Deletion test */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>The deletion test</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Remove the memory and the org cannot work.
          </h2>
          <p className="mt-5 max-w-2xl text-body-lg text-graphite">
            The control group is a memory implementation whose every method is
            a no-op. Same task, same code path — and the org cannot even route
            the work, because there are no roles, no standards, and no vendor
            book to read.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TEST_SECTIONS.map((s, i) => (
            <Reveal key={s.n} delay={i * 60}>
              <Card className="h-full">
                <p className="text-caption uppercase tracking-[0.2em] text-graphite">
                  Section {s.n} · {s.checks} checks
                </p>
                <h3 className="mt-3 font-untitled-serif text-subheading font-normal">{s.title}</h3>
                <p className="mt-3 text-body text-graphite">{s.detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Card tone="ink" className="mt-8">
            <pre className="overflow-x-auto text-body-sm leading-relaxed text-ash">
{`$ cd agent && npm test
[1] session 1: founded, explores cheapest, fails QA, bans vendor
[2] session 2 (fresh process): reconstitutes, cites ban, passes
[3] deletion test: memory calls stubbed out -> the org cannot route
[4] crash mid-task -> a fresh process resumes and finishes the job

DELETION TEST: 24 checks passed. Delete Sibyl and there is no company.`}
            </pre>
          </Card>
        </Reveal>
      </section>

      {/* Archive semantics */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <Kicker>Honest semantics</Kicker>
              <h2 className="mt-4 font-untitled-serif text-heading-sm font-normal">
                Forget and delete are different things.
              </h2>
              <p className="mt-5 text-body-lg text-graphite">
                Sibyl archives entities rather than destroying them: a wipe
                removes the org from recall, list, and search, while the
                append-only journal keeps its forensic residue. That is why QA
                can cite past rulings after a wipe.
              </p>
              <p className="mt-5 text-body text-graphite">
                For a truly pristine store — a clean rehearsal — the agent
                exposes an explicit destructive command,{" "}
                <code>reset --yes</code>, which deletes the local database
                file. The site never does this implicitly.
              </p>
            </div>
            <Card>
              <ul className="flex flex-col gap-5 text-body text-graphite">
                <li className="flex items-start justify-between gap-6 border-b border-ash pb-4">
                  <span>Entity recall after wipe: not found — the org refounds</span>
                  <StatusBadge state="verified" />
                </li>
                <li className="flex items-start justify-between gap-6 border-b border-ash pb-4">
                  <span>Journal residue remains searchable (append-only)</span>
                  <StatusBadge state="verified" />
                </li>
                <li className="flex items-start justify-between gap-6">
                  <span>reset --yes deletes the local memory.db</span>
                  <StatusBadge state="verified" />
                </li>
              </ul>
            </Card>
          </div>
        </Reveal>
      </section>

      <section className="pb-8">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row">
            <PillLink href="/evidence" tone="blue">
              See the full evidence
            </PillLink>
            <PillLink href="/console" tone="ghost">
              Run the deletion control yourself
            </PillLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
