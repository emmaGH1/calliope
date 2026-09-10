import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Card, Kicker, PillLink } from "@/components/ui";
import { Faq } from "@/components/faq";

const PRINCIPLES = [
  {
    title: "Memory is load-bearing or it is decoration",
    body:
      "The test is deletion: remove the memory layer and the product must stop doing what it claims. Everything in Calliope is built so that removing Sibyl removes the organization itself.",
  },
  {
    title: "Label every seam",
    body:
      "A simulation that poses as an onchain transaction is a lie with extra steps. Simulated vendors say SIM. Unrun integrations say not run. The status table is part of the product.",
  },
  {
    title: "Local-first, user-owned",
    body:
      "The memory store is a local file. The console runs on your machine against your own store. Nothing here requires an account, a chain, or a cloud to demonstrate the core claim.",
  },
  {
    title: "The user is not the memory bus",
    body:
      "Nobody should have to re-explain standards, re-list trusted vendors, or restate an interrupted job after a restart. That re-briefing is the bug this project exists to kill.",
  },
];

const FAQ = [
  {
    q: "Is this just a chatbot with a vector database?",
    a: (
      <>
        No. There is no chat interface and no embeddings. Sibyl Memory is a
        local-first, file-based store (SQLite with full-text search) and
        Calliope uses it for typed organizational entities — charter, roles,
        vendor book, obligations — plus an append-only journal. The workers are
        processes that read and write those rows; the “conversation” is a
        derived view in the console.
      </>
    ),
  },
  {
    q: "What exactly breaks if Sibyl Memory is removed?",
    a: (
      <>
        Everything organizational. With memory stubbed out, boot cannot found
        or reconstitute a company, no roles exist so the task is refused, there
        is no vendor book to consult, no standards to grade against, and no
        obligation to resume. The test suite runs exactly that experiment and
        reports a refusal, not a degraded-but-working agent.
      </>
    ),
  },
  {
    q: "Is anything actually onchain?",
    a: (
      <>
        Not yet. The Virtuals ACP hire port is implemented against the SDK’s
        real types and is gated behind explicit environment credentials, but no
        escrowed job has settled and no Base transaction is claimed. The
        deterministic simulation is the default and is labeled as such.
      </>
    ),
  },
  {
    q: "Can it spend money on its own?",
    a: (
      <>
        No. Nothing spends automatically. ACP activation requires registered
        agents, signer credentials, and wallets the user funds themselves. A
        production version would need a separate signing boundary with spend
        limits and approvals; that boundary is documented, not pretended.
      </>
    ),
  },
  {
    q: "Why the name Calliope?",
    a: (
      <>
        Calliope is the muse of epic poetry — the voice that carries a long
        story across many tellings without losing it. This project is about a
        story (an organization) surviving every retelling (every process). The
        internal working names Charter and Foreman remain in the git history as
        provenance.
      </>
    ),
  },
  {
    q: "Can I run it right now?",
    a: (
      <>
        Yes, locally: install the Sibyl Memory CLI (
        <code>uv tool install &apos;sibyl-memory-cli[mcp]&apos;</code>), then{" "}
        <code>npm install &amp;&amp; npm test</code> in <code>agent/</code>, and{" "}
        <code>npm run dev</code> in <code>desk/</code>. The console is a local
        control surface and is not deployed as a public service.
      </>
    ),
  },
];

const ROADMAP = [
  ["Real LLM workers", "Run the editor and QA roles on a live model key; the role model config is already read from memory."],
  ["One escrowed ACP job", "Register the agents, fund the wallets, and replace the simulated hire with a settled job plus its receipt."],
  ["Multi-org tenancy", "Namespace memory per organization so one host can carry several companies."],
  ["Signing boundary", "A separate approval service for any transaction authority, with spend limits and audit logs."],
];

export default function AboutPage() {
  return (
    <>
      <section className="pb-16 pt-20 sm:pt-24">
        <Reveal>
          <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:gap-14">
            <Image
              src="/calliope-logo.png"
              alt="The Calliope mark"
              width={112}
              height={112}
              priority
            />
            <div>
              <Kicker>About</Kicker>
              <h1 className="mt-4 max-w-3xl font-untitled-serif text-heading font-normal sm:text-heading-lg">
                Why Calliope exists.
              </h1>
            </div>
          </div>
          <p className="mt-10 max-w-2xl text-body-lg text-graphite">
            Most agent memory projects keep a list: a grudge, a credit file, a
            cache of payments. Calliope asks a larger question — what if the
            memory is the organization itself?
          </p>
        </Reveal>
      </section>

      {/* Principles */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Principles</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            Four rules this build holds itself to.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <Card className="h-full">
                <h3 className="font-untitled-serif text-subheading font-normal">{p.title}</h3>
                <p className="mt-4 text-body text-graphite">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Origin */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <Kicker>Origin</Kicker>
              <h2 className="mt-4 font-untitled-serif text-heading-sm font-normal">
                From a crowded lane to an open one.
              </h2>
              <p className="mt-5 text-body text-graphite">
                The first working concept was a buyer agent that remembers bad
                vendors — a grudge list. Useful, but the lane was already
                crowded with credit bureaus and consequence engines. The pivot
                was to make the memory bigger than any one list: an entire
                institution that a fresh process can reconstitute.
              </p>
              <p className="mt-5 text-body text-graphite">
                The rename to Calliope marks that pivot. The repository’s early
                commits (Charter, Foreman) are kept, not rewritten — the history
                is the honest record of how the idea changed.
              </p>
            </div>
            <Card tone="raised">
              <Kicker>Prior work</Kicker>
              <p className="mt-4 text-body text-graphite">
                The author previously built Redline, an onchain
                document-verification project on X Layer. Calliope reuses
                engineering patterns and design experience from that work — not
                its source code. Redline had no Sibyl Memory layer and no agent
                organization; this repository was built fresh for the current
                effort.
              </p>
              <p className="mt-4 text-body text-graphite">
                Working name history: Charter → Foreman → Calliope. See{" "}
                <code>REPOSITORY.md</code> for the record.
              </p>
            </Card>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>Questions</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            The honest FAQ.
          </h2>
        </Reveal>
        <div className="mt-10">
          <Faq items={FAQ} />
        </div>
      </section>

      {/* Roadmap */}
      <section className="pb-[var(--section-gap)]">
        <Reveal>
          <Kicker>What is next</Kicker>
          <h2 className="mt-4 max-w-3xl font-untitled-serif text-heading-sm font-normal">
            The work after the demo.
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-col">
          {ROADMAP.map(([title, body], i) => (
            <Reveal key={title} delay={i * 40}>
              <div className="flex flex-col gap-2 border-b border-ash py-8 sm:flex-row sm:items-baseline sm:gap-10">
                <h3 className="w-64 shrink-0 font-untitled-serif text-subheading font-normal">{title}</h3>
                <p className="text-body text-graphite">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-8">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row">
            <PillLink href="/evidence" tone="blue">
              Read the evidence
            </PillLink>
            <PillLink href="https://github.com/emmaGH1/calliope" tone="ghost" external>
              View the source
            </PillLink>
          </div>
          <p className="mt-8 text-body text-graphite">
            Licensed MIT. The full memory implementation note and setup guide
            live in the{" "}
            <Link
              href="https://github.com/emmaGH1/calliope#readme"
              className="underline underline-offset-4 hover:text-off-black"
              target="_blank"
              rel="noreferrer"
            >
              repository README
            </Link>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
