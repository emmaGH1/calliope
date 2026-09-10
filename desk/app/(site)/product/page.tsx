import { Reveal } from "@/components/reveal";
import { Card, FeatureCard, Kicker, PillLink } from "@/components/ui";
import { PipelineDiagram } from "@/components/pipeline-diagram";

const DOMAINS = [
  {
    name: "charter/mission",
    holds: "Mission, client standards, policies",
    effect: "Standards are attached to every brief and every QA prompt",
  },
  {
    name: "role/*",
    holds: "Mandates, handoff routes, model configuration",
    effect: "Missing editor/QA roles refuse the task; model choice is read from memory",
  },
  {
    name: "vendor/*",
    holds: "Quality average, rate, jobs, failures, notes, ban",
    effect: "Hiring skips bans and prefers learned quality within budget",
  },
  {
    name: "obligation/*",
    holds: "Task, standards, budget, status, assignment, spend",
    effect: "Interrupted work resumes in a fresh process by obligation id",
  },
  {
    name: "journal",
    holds: "Foundings, hires, rulings, bans (append-only)",
    effect: "QA retrieves prior journal-tier rulings as context",
  },
];

const DECISIONS = [
  {
    choice: "hire cheap-and-sloppy @ $1.00",
    because: "no history for this vendor — exploring with the cheapest",
    source: "vendor/cheap-and-sloppy",
  },
  {
    choice: "QA: fail (brand voice missing, reads machine-generated)",
    because: "graded by qa role mandate vs charter/mission clientStandards",
    source: "role/qa + charter/mission",
  },
  {
    choice: "skip cheap-and-sloppy",
    because: "BANNED in memory after 1 failure(s)",
    source: "vendor/* in memory",
  },
  {
    choice: "hire atelier-jp @ $2.50",
    because: "remembered: quality 5.0/5 across 1 job(s)",
    source: "vendor/atelier-jp",
  },
];

export default function ProductPage() {
  return (
    <>
      <section className="pb-16 pt-24 sm:pt-32">
        <Reveal>
          <Kicker>Product</Kicker>
          <h1 className="mt-6 max-w-4xl font-untitled-serif text-heading font-normal sm:text-display">
            An org chart you can kill.
          </h1>
          <p className="mt-8 max-w-2xl text-body-lg text-graphite">
            Calliope is a small workforce of specialist workers — coordinator,
            editor, QA — whose mandates, routes, and standards are memory rows.
            The process is the employee. The memory is the company.
          </p>
        </Reveal>
      </section>

      {/* Lifecycle */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Lifecycle</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Found. Work. Learn. Reconstitute.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Reveal>
            <FeatureCard title="Found" meta="one paragraph">
              The operator writes a mission. Boot writes the charter, roles,
              standards, and the initial vendor book into Sibyl Memory. From
              then on the org exists outside the process that made it.
            </FeatureCard>
          </Reveal>
          <Reveal delay={60}>
            <FeatureCard title="Work" meta="obligations">
              A task becomes an obligation — brief, standards, budget, status —
              persisted before any vendor is contacted. Hiring consults the
              remembered vendor book, never a hardcoded list.
            </FeatureCard>
          </Reveal>
          <Reveal delay={120}>
            <FeatureCard title="Learn" meta="outcomes">
              QA grades the deliverable against the charter standards. The
              ruling is written back: quality averages move, failure notes
              accumulate, and a bad vendor is banned in the book itself.
            </FeatureCard>
          </Reveal>
          <Reveal delay={180}>
            <FeatureCard title="Reconstitute" meta="fresh process">
              A new process reads the org back: roles, vendor book, and
              unfinished obligations. It introduces itself to the work instead
              of asking the user to re-explain it.
            </FeatureCard>
          </Reveal>
        </div>
      </section>

      {/* Memory domains */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>The organization as data</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Five memory domains, each one load-bearing.
          </h2>
          <p className="mt-5 max-w-2xl text-body-lg text-graphite">
            Remove any one of these and behavior changes. Remove all of them
            and the org is gone — which is exactly what the deletion test
            demonstrates.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-12 overflow-x-auto rounded-3xl border border-ash">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ash text-caption uppercase tracking-[0.15em] text-graphite">
                  <th className="px-8 py-5 font-normal">Domain</th>
                  <th className="px-8 py-5 font-normal">Holds</th>
                  <th className="px-8 py-5 font-normal">How it changes behavior</th>
                </tr>
              </thead>
              <tbody>
                {DOMAINS.map((d) => (
                  <tr key={d.name} className="border-b border-ash last:border-b-0 align-top">
                    <td className="px-8 py-6 text-body">{d.name}</td>
                    <td className="px-8 py-6 text-body text-graphite">{d.holds}</td>
                    <td className="px-8 py-6 text-body text-graphite">{d.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Decisions with provenance */}
      <section className="pb-[var(--section-gap)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <Kicker>Decisions with receipts</Kicker>
            <h2 className="mt-4 font-untitled-serif text-heading-sm font-normal">
              Every choice cites the memory that caused it.
            </h2>
            <p className="mt-5 text-body-lg text-graphite">
              The console renders each decision with a provenance chip: the
              choice, the reason, and the memory row it came from. When the
              fresh process skips a vendor, the reason is on screen — “banned
              in memory after 1 failure” — not implied.
            </p>
            <p className="mt-5 text-body text-graphite">
              This is also how QA works: the grading prompt is assembled from
              the QA role’s mandate in memory, the charter’s standards, and
              journal rulings on record.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <Card className="flex flex-col gap-6">
              {DECISIONS.map((d, i) => (
                <div key={d.choice} className={i > 0 ? "border-t border-ash pt-6" : ""}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-body">{d.choice}</span>
                  </div>
                  <p className="mt-2 text-body-sm text-graphite">
                    because: {d.because}
                    <span className="ml-3 inline-block rounded-full border border-ash px-3 py-1 text-caption uppercase tracking-[0.12em]">
                      {d.source}
                    </span>
                  </p>
                </div>
              ))}
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Crash + resume */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Card tone="ink">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <Kicker>Interrupted work</Kicker>
                <h2 className="mt-4 font-untitled-serif text-heading-sm font-normal">
                  The brief survives the crash.
                </h2>
                <p className="mt-5 text-body text-ash">
                  Obligations are persisted before the risky work begins. When
                  a worker dies mid-task, the next process finds the open
                  obligation, resumes it by id, and finishes the job under the
                  budget and standards recorded at open time.
                </p>
              </div>
              <ul className="flex flex-col justify-center gap-5 text-body text-ash">
                <li className="border-b border-graphite pb-4">
                  Honest scope: the shipped demo crash is a controlled
                  checkpoint, not a claim about arbitrary OS termination.
                </li>
                <li className="border-b border-graphite pb-4">
                  The resume path is asserted in the test suite across real
                  process boundaries.
                </li>
                <li>
                  If the memory layer is removed, nothing resumes — verified by
                  the amnesic control run.
                </li>
              </ul>
            </div>
          </Card>
        </Reveal>
      </section>

      <section className="pb-8">
        <Reveal>
          <PipelineDiagram />
        </Reveal>
        <Reveal>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <PillLink href="/console" tone="blue">
              Try it in the console
            </PillLink>
            <PillLink href="/memory" tone="ghost">
              Read the memory note
            </PillLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
