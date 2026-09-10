# Calliope

> **Your agents are employees. Calliope is the company.**
> A workforce of AI specialist agents whose *entire institution* lives in Sibyl Memory —
> the charter, roles, handoff routes, client standards, vendor book, and obligations.
> Kill every process, and a fresh boot reassembles the org from memory and finishes the job.
> Wipe the memory, and there is no company.

Built for the **Sibyl Labs Hackathon** ("Forgetting is a bug", Sep 1–10 2026).
MIT licensed · commit history is real and readable · submission: repo + demo + memory note.

---

## The one sentence for a judge

Delete the Sibyl Memory layer and Calliope does not merely work worse —
**it stops being an org**: every boot re-founds itself from nothing, sends briefs
with no standards, knows no vendors, and repeats the exact mistakes the last
session learned to ban. Run `npm test` in `agent/` to watch that happen.

## Why this entry

The ecosystem's serious agents all keep *one* list in memory: a grudge, a credit file,
a payment cache. Calliope's claim is larger: **the organization itself is the memory.**
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
stubbed out** — no charter, no roles (the task is refused), no vendor book;
a fourth section **crashes a process mid-task** and shows a fresh boot resuming
and finishing the interrupted obligation. Delete Sibyl and there is no company:
that is the load-bearing proof.

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
npm test                        # deletion test (24 checks)
npm run org -- reset --yes      # pristine local store (deletes memory.db)
npm run org -- found "We localize client landing copy with the brand voice intact, on budget."
npm run org -- task             # session 1: explores cheapest, fails QA, bans vendor
npm run org -- task             # session 2 (fresh process): reconstitutes, dodges the ban, passes
npm run org -- task --crash     # dies mid-task; the obligation stays in memory
npm run org -- task             # fresh process RESUMES and finishes the interrupted job
npm run org -- amnesic-task     # control: memory stubbed — the org cannot even route the task
npm run org -- wipe             # forget the org (entities archived; journal residue remains)
```

Optional env (`agent/.env`, copied from `agent/.env.example`):

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` / `XAI_API_KEY` | real LLM brains for editor/QA (default: deterministic STUB, labeled in output) |
| `CALLIOPE_WALLET_ADDRESS`, `CALLIOPE_WALLET_ID`, `CALLIOPE_SIGNER_KEY`, `CALLIOPE_BUILDER_CODE` | real ACP hires (Virtuals Agent Commerce Protocol, escrow on Base) |
| `VENDOR_WALLET_ADDRESS`, `VENDOR_OFFERING_NAME` | the vendor agent's registered offering |
| `SIBYL_PYTHON` | override for the Sibyl server python. Default resolution probes: `SIBYL_PYTHON` → the `uv tool` venv python → `python`/`python3`/`py` (import check) → the `sibyl-memory-mcp` console script on PATH |

## Memory implementation note (what persists, recalls, and changes decisions)

All memory I/O goes through one typed client: [`agent/src/memory/sibyl.ts`](agent/src/memory/sibyl.ts)
(MCP stdio → `sibyl_memory_mcp`) and the org schema in
[`agent/src/org/memory-schema.ts`](agent/src/org/memory-schema.ts).

**Schema — the org's entities:**

| Category | Entity | Holds | Written | Read |
| --- | --- | --- | --- | --- |
| `charter` | `mission` | name, mission, client standards, policies | founding (`boot.ts:98`) | every task (`run-task.ts:36`), boot |
| `role` | coordinator, editor, qa | mandate + handoff routes + **model config** | founding (`boot.ts:105`); `set-model` hot-swap | task routing — **missing roles refuse the task** (`run-task.ts:82`) |
| `vendor` | per-market-vendor | quality (running avg), rate, jobs, failures, notes, `banned` | founding; **every outcome** (`run-task.ts:183,210`) | vendor-book consult (`run-task.ts:101`), boot |
| `obligation` | per-job | task, standards, budget, status, spend | task open (`run-task.ts:48`) + each ruling | boot resume list (`boot.ts:116`); crash recovery via `findResumable` (`run-task.ts:62`) |
| journal | `memory_record_event` | founding/reconstitution/hire/ban/ruling (append-only) | everywhere | **QA consults it** (`run-task.ts:137`) — prior rulings feed the verdict |

**Read sites that change a decision** (the load-bearing ones):
- `run-task.ts:36` — the charter defines the QA standards; no charter → brief sent bare.
- `run-task.ts:82` — roles come from memory; **no qa/editor roles → the task is refused**.
- `run-task.ts:101` — the vendor book (memory) decides *who* gets hired and *at what rate*;
  bans are remembered and cited (`hire.ts` `pickVendor`).
- `run-task.ts:137` — QA feeds on journal rulings for the vendor (`memory_search`).
- `boot.ts:114-116` — a fresh process only knows the org if memory reconstitutes it.

**Write sites that change future sessions**:
- `run-task.ts:183` (pass → quality average up) and `run-task.ts:210` (fail → quality
  average down, failure note, **ban**) — `boot.ts:115` reads them back next process.
- `run-task.ts:48` — obligations survive process death; `run-task.ts:62` resumes them.

**Deletion test**: `agent/src/org/boot.ts` `AmnesicMemory` is a `MemoryIo` whose every
call is a no-op — booting and running on it is the wipe. `agent/test/deletion-test.ts`
asserts the regression in 24 checks across real processes, including real recall-based
persistence proof (amnesic writes are verifiably absent; session writes are verifiably
present). `npm run org -- reset --yes` deletes the local store for pristine takes —
Sibyl's `wipe`/forget *archives* entities by design, and the append-only journal
survives an entity wipe (Calliope treats that residue as honest history; QA consults it).

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
  when registration env is present (`CALLIOPE_*`, `VENDOR_*`; registered at app.virtuals.io/acp).
  **Status: implemented against the SDK's actual types; NOT yet exercised live — honest
  disclosure:** sim stays the default until the agents are registered and one escrow job
  has settled. The multiplier claim follows evidence, not intent.
- **Base**: ACP's escrow/payment rails (Base mainnet USDC). x402 (HTTP 402 payment
  negotiation, USDC on Base) was validated as a fallback payment rail during planning.

## Honesty table

| Thing | State | Evidence |
| --- | --- | --- |
| Memory load-bearing (deletion test) | **VERIFIED** | `npm test`, 24/24 |
| Fresh-process reconstitution | **VERIFIED** | session pids differ; vendor book + ban intact |
| Crash → resume of interrupted work | **VERIFIED** | `task --crash` then fresh `task` in `npm test` section 4 |
| Decision provenance chips | **VERIFIED** | desk + `--json` output |
| Roles & journal change decisions | **VERIFIED** | missing roles refuse the task; QA cites journal rulings |
| Org founding from a paragraph | **VERIFIED** | `npm run org -- found "…"` |
| Real ACP escrow job | **NOT RUN — needs agent registration + wallet funding (user-side)** | code compiles; sim port active |
| LLM-backed editor/QA | **WIRED — NOT RUN without an API key** | role entities carry model config; STUB fallback labeled |
| Vendor quality (atelier vs sloppy) | SIMULATED (labeled `SIM`, `skill` field documented) | honest — real vendors replace it in the ACP path |

## Prior Work declaration

Built Sep 7–10 2026 entirely within the hackathon window in this repository
(`calliope/`, MIT). The author previously built an onchain document-verification
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
