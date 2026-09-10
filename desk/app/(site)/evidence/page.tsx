import { Reveal } from "@/components/reveal";
import { Card, Kicker, PillLink, StatusBadge } from "@/components/ui";

const STATUS = [
  {
    thing: "Sibyl Memory persistence through the MCP server",
    state: "verified" as const,
    evidence: "Fresh-process tests read back charter, roles, vendors, obligations (npm test)",
  },
  {
    thing: "Fresh-session recall changes a decision",
    state: "verified" as const,
    evidence: "Session 2 skips the banned vendor and cites the ban by name",
  },
  {
    thing: "Deletion control (memory stubbed out)",
    state: "verified" as const,
    evidence: "Bare brief, no roles, task refused; verifiably nothing persisted",
  },
  {
    thing: "Crash → resume of an open obligation",
    state: "verified" as const,
    evidence: "Worker exits mid-task; fresh process resumes by obligation id",
  },
  {
    thing: "Vendor deliveries",
    state: "simulated" as const,
    evidence: "Deterministic simulation labeled SIM (no real escrow) in logs and console",
  },
  {
    thing: "Real LLM editor / QA",
    state: "not-run" as const,
    evidence: "Wired through role model config; runs on a labeled deterministic stub without a key",
  },
  {
    thing: "Base settlement receipt (CalliopeSettlement)",
    state: "not-run" as const,
    evidence: "Env-gated settle on Base Sepolia after QA; claim only with a live explorer tx in the demo",
  },
  {
    thing: "Virtuals ACP jobs",
    state: "not-run" as const,
    evidence: "Typed adapter exists; not used in the Sibyl-only / Base-only submission path",
  },
];

const REPRO = [
  ["reset --yes", "delete the local memory store for a clean rehearsal"],
  ["task", "session 1: explore, fail, ban"],
  ["task", "session 2: reconstitute, skip the ban, pass"],
  ["task --crash", "die mid-task after opening the obligation"],
  ["task", "fresh process resumes and finishes the job"],
  ["amnesic-task", "the deletion control: memory stubbed, task refused"],
  ["wipe", "archive the org; the next boot founds from nothing"],
];

export default function EvidencePage() {
  return (
    <>
      <section className="pb-16 pt-24 sm:pt-32">
        <Reveal>
          <Kicker>Evidence</Kicker>
          <h1 className="mt-6 max-w-4xl font-untitled-serif text-heading font-normal sm:text-display">
            Receipts, not adjectives.
          </h1>
          <p className="mt-8 max-w-2xl text-body-lg text-graphite">
            Every claim on this site maps to a command you can run or a status
            it honestly carries. Nothing unexercised is presented as live.
          </p>
        </Reveal>
      </section>

      {/* Run it */}
      <section className="pb-[var(--section-gap)]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <Kicker>Two-minute check</Kicker>
            <h2 className="mt-4 font-untitled-serif text-heading-sm font-normal">
              Clone, install, run the deletion test.
            </h2>
            <p className="mt-5 text-body text-graphite">
              The suite spawns real child processes — a new OS process per
              session — so the fresh-recall claim is tested at the process
              boundary, not simulated in one runtime.
            </p>
            <div className="mt-8">
              <Card tone="ink">
                <pre className="overflow-x-auto text-body-sm leading-relaxed text-ash">
{`git clone https://github.com/emmaGH1/calliope
cd calliope/agent
npm install
npm test        # 24 checks

# Sibyl Memory prerequisite:
# uv tool install 'sibyl-memory-cli[mcp]'`}
                </pre>
              </Card>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Kicker>What the check asserts</Kicker>
            <ul className="mt-6 flex flex-col gap-5 text-body text-graphite">
              <li className="border-b border-ash pb-4">
                Session 1 founds the org and bans a vendor after QA failure.
              </li>
              <li className="border-b border-ash pb-4">
                Session 2, a different pid, reconstitutes the org and behaves
                differently because of what it remembers.
              </li>
              <li className="border-b border-ash pb-4">
                With every memory call stubbed, the org cannot route work and
                nothing it “writes” can be read back.
              </li>
              <li>
                A worker dies mid-task and the next process resumes the
                interrupted obligation.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Status matrix */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Status matrix</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Verified, simulated, or not run — nothing in between.
          </h2>
        </Reveal>
        <Reveal>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-ash">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ash text-caption uppercase tracking-[0.15em] text-graphite">
                  <th className="px-8 py-5 font-normal">Claim</th>
                  <th className="px-8 py-5 font-normal">Status</th>
                  <th className="px-8 py-5 font-normal">Evidence / limitation</th>
                </tr>
              </thead>
              <tbody>
                {STATUS.map((s) => (
                  <tr key={s.thing} className="border-b border-ash align-top last:border-b-0">
                    <td className="px-8 py-6 text-body">{s.thing}</td>
                    <td className="px-8 py-6">
                      <StatusBadge state={s.state} />
                    </td>
                    <td className="px-8 py-6 text-body text-graphite">{s.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Reproduce by hand */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Reproduce the story by hand</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Seven commands, one company.
          </h2>
          <p className="mt-5 max-w-2xl text-body-lg text-graphite">
            From <code>agent/</code>, each command is a separate process. Use{" "}
            <code>--json</code> to watch the structured events, or watch the
            console do the same thing with buttons.
          </p>
        </Reveal>
        <div className="mt-10 flex flex-col">
          {REPRO.map(([cmd, what], i) => (
            <Reveal key={cmd + i} delay={i * 30}>
              <div className="flex flex-col gap-2 border-b border-ash py-6 sm:flex-row sm:items-baseline sm:gap-10">
                <code className="w-56 shrink-0 text-body">{cmd}</code>
                <p className="text-body text-graphite">{what}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Falsification + limits */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Card tone="raised">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <Kicker>How to falsify this</Kicker>
                <h2 className="mt-4 font-untitled-serif text-subheading font-normal">
                  The litmus is deletion, not explanation.
                </h2>
                <p className="mt-5 text-body text-graphite">
                  If removing Sibyl Memory still left a working org — retained
                  standards, remembered vendors, resumed obligations — the
                  project would be a wrapper. The amnesic run in the suite is
                  exactly that experiment, and it collapses into a refusal.
                </p>
              </div>
              <div>
                <Kicker>Known limits</Kicker>
                <ul className="mt-4 flex flex-col gap-4 text-body text-graphite">
                  <li className="border-b border-ash pb-3">
                    The console is local-only; its API has no auth and is not a
                    public deployment.
                  </li>
                  <li className="border-b border-ash pb-3">
                    The demo crash is a controlled checkpoint, not arbitrary OS
                    termination.
                  </li>
                  <li className="border-b border-ash pb-3">
                    Vendor work is deterministic simulation; real ACP escrow is
                    wired but not run.
                  </li>
                  <li>
                    No traction or PMF claims are made — there is no fabricated
                    evidence anywhere in this project.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>

      <section className="pb-8">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row">
            <PillLink href="/console" tone="blue">
              Run it in the console
            </PillLink>
            <PillLink href="/memory" tone="ghost">
              How the memory works
            </PillLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
