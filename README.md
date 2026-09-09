# Charter

> **Your agents are employees. Charter is the company.**
> A workforce of AI specialist agents whose *entire institution* lives in Sibyl Memory —
> the charter, roles, handoff routes, client standards, vendor book, and obligations.
> Kill every process, and a fresh boot reassembles the org from memory and finishes the job.
> Wipe the memory, and there is no company.

Built for the **Sibyl Labs Hackathon** ("Forgetting is a bug", Sep 1–10 2026).
MIT licensed · commit history is real and readable · submission: repo + demo + memory note.

---

## The one sentence for a judge

Delete the Sibyl Memory layer and Charter does not merely work worse —
**it stops being an org**: every boot re-founds itself from nothing, sends briefs
with no standards, knows no vendors, and repeats the exact mistakes the last
session learned to ban. Run `npm test` in `agent/` to watch that happen.

## Why this entry

The ecosystem's serious agents all keep *one* list in memory: a grudge, a credit file,
a payment cache. Charter's claim is larger: **the organization itself is the memory.**
Nothing org-level is hardcoded — no role table, no vendor list, no policy in code.
The charter is written *into* Sibyl at founding and read back by every fresh process,
so agents are hot-swappable, processes are disposable, and the company survives them all.

- **Coordination through memory** (the rubric's top band): roles and routes are
  memory entities (see schema), read at boot, extended as the org learns.
- **Dynamic storage**: the vendor book starts empty of history; quality scores,
  failure counts, and bans are *written by outcomes* and change the next hire.
- **Provenance on every decision**: each choice the org makes carries a
  `because` chip citing the memory row that caused it — the desk UI renders these.

## What a judge should do first (under two minutes)

```bash
cd agent
npm install                # installs sibyl-memory talks-to (see below) + deps
npm test                   # THE DELETION TEST — 18 assertions, ~30 s
```

`npm test` spawns real processes: session 1 founds the org and **bans** the flaky
vendor; session 2 is a *fresh OS process* that reconstitutes the org from memory,
**cites the ban by name**, hires the good vendor, attaches the charter standards,
and passes QA; the control group runs the same task with **every memory call
stubbed out** — bare brief, empty vendor book, QA fail. Delete Sibyl and there is
no company: that is the load-bearing proof.

Then, for the human version:

```bash
cd desk && npm install && npm run dev   # open http://localhost:3737
```

The desk is a local control surface: **found** the org from a paragraph, **dispatch**
tasks (each one is a brand-new OS process), watch the decision record fill with
memory provenance, then **wipe the org** and dispatch again — nothing reassembles.

## Quickstart (full)

Prerequisites: Node ≥ 20, and the Sibyl Memory CLI (our agent speaks to it over
stdio MCP; the store is a local SQLite database — no account needed for this demo):

```bash
uv tool install "sibyl-memory-cli[mcp]"     # or: pip install "sibyl-memory-cli[mcp]"
```

```bash
cd agent
npm install
npm test                        # deletion test (18 checks)
npm run org -- found "We localize client landing copy with the brand voice intact, on budget."
npm run org -- task             # session 1: explores cheapest, fails QA, bans vendor
npm run org -- task             # session 2 (fresh process): reconstitutes, dodges the ban, passes
npm run org -- amnesic-task     # control: memory stubbed — the org is gone
```

Optional env (`agent/.env`, copied from `agent/.env.example`):

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` / `XAI_API_KEY` | real LLM brains for editor/QA (default: deterministic STUB, labeled in output) |
| `CHARTER_WALLET_ADDRESS`, `CHARTER_WALLET_ID`, `CHARTER_SIGNER_KEY`, `CHARTER_BUILDER_CODE` | real ACP hires (Virtuals Agent Commerce Protocol, escrow on Base) |
| `VENDOR_WALLET_ADDRESS`, `VENDOR_OFFERING_NAME` | the vendor agent's registered offering |
| `SIBYL_PYTHON` | path to the sibyl tool venv python (auto-detected default) |

## Memory implementation note (what persists, recalls, and changes decisions)

All memory I/O goes through one typed client: [`agent/src/memory/sibyl.ts`](agent/src/memory/sibyl.ts)
(MCP stdio → `sibyl_memory_mcp`) and the org schema in
[`agent/src/org/memory-schema.ts`](agent/src/org/memory-schema.ts).

**Schema — the org's entities:**

| Category | Entity | Holds | Written | Read |
| --- | --- | --- | --- | --- |
| `charter` | `mission` | name, mission, client standards, policies | founding (`boot.ts:98`) | every task (`run-task.ts:27`), boot |
| `role` | coordinator, editor, qa | mandate + handoff routes | founding (`boot.ts:105`) | boot reconstitution (`boot.ts:114`) |
| `vendor` | per-market-vendor | quality, rate, jobs, failures, notes, `banned` | founding; **every outcome** (`run-task.ts:108,135`) | vendor-book consult (`run-task.ts:51`), boot |
| `obligation` | per-job | task, standards, budget, status, spend | task start (`run-task.ts:39`) + each ruling | boot resumes unfinished (`boot.ts:116`) |
| journal | `memory_record_event` | founding/reconstitution/hire/ban/ruling | everywhere (append-only) | `memory_search` across tiers |

**Read sites that change a decision** (the load-bearing ones):
- `run-task.ts:27` — the charter defines the QA standards; no charter → brief sent bare.
- `run-task.ts:51` — the vendor book (memory) decides *who* gets hired and *at what rate*;
  bans are remembered and cited (`hire.ts` `pickVendor`).
- `boot.ts:114-116` — a fresh process only knows the org if memory reconstitutes it.

**Write sites that change future sessions**:
- `run-task.ts:108` (pass → quality 5) and `run-task.ts:128-135` (fail → quality 2,
  failure note, **ban**), then `boot.ts:115` reads it back next process.
- `run-task.ts:39` — obligations survive mid-task process death.

**Deletion test**: `agent/src/org/boot.ts` `AmnesicMemory` is a `MemoryIo` whose every
call is a no-op — booting and running on it is the wipe. `agent/test/deletion-test.ts`
asserts the regression in 18 checks across real processes.

Notes a judge may appreciate: Sibyl wraps every recall in an untrusted-context
fence and returns self-explaining verdicts on empty searches; we treat memory as
**data** (we never let stored text instruct the agent) — that discipline is part of
the architecture, and the QA prompt lists standards from memory rather than obeying
deliverable text.

## Architecture

```
                 ┌──────────── desk (Next.js, local control surface) ────────────┐
   you ─────────►│ found | dispatch | wipe ──► POST /api/dispatch                │
                 │ decision record · vendor book · run log (poll /api/state)     │
                 └──────────────┬────────────────────────────────────────────────┘
                                │ spawns a REAL fresh process per action (pid shown)
                 ┌──────────────▼────────────────────────────────────────────────┐
                 │  org session (agent/src/org/session.ts)                       │
                 │  boot(): found ⇄ reconstitute        runTask(): obligation    │
                 │  pickVendor(decides) ──► HirePort ──► SIM │ ACP(env-gated)    │
                 │  QA vs charter standards               SimHirePort=honest sim │
                 └───────┬───────────────────────────▲──────────────────────────┘
                         │ remember/recall/list/event│ (stdio MCP)
                 ┌───────▼───────────────────────────┴──────┐
                 │  Sibyl Memory (required stack, local SQLite + FTS5) │
                 │  charter/mission · role/* · vendor/* · obligation/* │
                 └──────────────────────────────────────────────┘
```

## Stacks and the multiplier

- **Sibyl Memory (required, never counts as a bonus)**: the org itself — see above.
- **Virtuals (ACP)**: `AcpHirePort` (`agent/src/org/acp-hire.ts`) buys real work through
  the Agent Commerce Protocol — job offers, escrow, evaluation, USDC settlement on Base —
  when registration env is present (`CHARTER_*`, `VENDOR_*`; registered at app.virtuals.io/acp).
  **Status: implemented against the SDK's actual types; NOT yet exercised live — honest
  disclosure:** sim stays the default until the agents are registered and one escrow job
  has settled. The multiplier claim follows evidence, not intent.
- **Base**: ACP's escrow/payment rails (Base mainnet USDC). x402 (HTTP 402 payment
  negotiation, USDC on Base) was validated as a fallback payment rail during planning.

## Honesty table

| Thing | State | Evidence |
| --- | --- | --- |
| Memory load-bearing (deletion test) | **VERIFIED** | `npm test`, 18/18 |
| Fresh-process reconstitution | **VERIFIED** | session pids differ; vendor book + ban intact |
| Decision provenance chips | **VERIFIED** | desk + `--json` output |
| Org founding from a paragraph | **VERIFIED** | `npm run org -- found "…"` |
| Real ACP escrow job | **NOT RUN — needs agent registration + wallet funding (user-side)** | code compiles; sim port active |
| LLM-backed editor/QA | **NOT RUN — needs an API key** | deterministic STUB model active, labeled |
| Vendor quality (atelier vs sloppy) | SIMULATED (labeled `SIM`, `skill` field documented) | honest — real vendors replace it in the ACP path |

## Prior Work declaration

Built Sep 7–10 2026 entirely within the hackathon window in this repository
(`foreman/`, MIT). The author previously built an onchain document-verification
project (Redline, X Layer, Aug 2026) and reuses *patterns only* — Next.js +
Tailwind project shape and editorial design taste — no code was copied; that
project had no memory layer and no ACP/agent code. Its prior repo is not part
of this submission.

## Repo tour

```
agent/            the org itself (TypeScript, zero framework weight)
  src/memory/     Sibyl MCP client (stdio)
  src/org/        boot · run-task · hire · model · schema · session · event log
  test/           deletion-test.ts (npm test)
desk/             local control surface (Next.js, Monad design tokens)
HACKATHON.md      event record: rules, decisions, evidence, risks
docs/             demo script, submission checklist, build-in-public posts
```

## License

MIT — see [LICENSE](./LICENSE).
