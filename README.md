# Calliope

> **Your agents are employees. Calliope is the company.**

Calliope is a restart-safe organization of AI workers whose durable operating
state lives in [Sibyl Memory](https://docs.sibyllabs.org). The charter, roles,
standards, vendor history, and unfinished obligations survive process death.
A new process can reconstruct the organization and make a different decision
because it remembers what happened before.

Built for the [Sibyl Labs Hackathon](https://hack.sibyllabs.org/), whose rule is
simple: if removing memory does not break the product's claimed behavior, the
project is a wrapper. Calliope is designed around the opposite test:
**remove Sibyl and there is no company to resume.**

> Status: working local prototype. Sibyl persistence and the deletion test are
> verified. Real LLM and Virtuals ACP/Base settlement paths are wired but not
> live-verified without user credentials. Simulated vendor output is explicitly
> labeled in the desk and logs.

## The problem

AI workers are disposable processes. When a process restarts, a model changes,
or a worker crashes during a job, the next worker normally has to be briefed
again. It does not know:

- which standards the client cares about;
- which vendor failed and why;
- which role should handle the next step;
- what work was already promised;
- whether the previous job was paid, failed, or interrupted.

That makes the user the organization's memory bus.

## What Calliope does

Calliope turns that fragile context into persistent organizational state.

### First session

1. The operator founds Calliope from a mission paragraph.
2. The process writes the charter, roles, vendor book, and policies to Sibyl.
3. With no vendor history, Calliope explores with the cheapest available vendor.
4. The vendor returns poor work.
5. QA checks the work against the remembered client standards.
6. Calliope records the failure, updates the vendor score, and bans the vendor.

### Fresh session

The original process is gone. A new process starts with no conversation context.
It reads the organization from Sibyl, sees the remembered ban, skips the failed
vendor, attaches the remembered standards, hires the other vendor, and passes QA.

### Interrupted work

Calliope persists an obligation before completing it. The `task --crash` demo
exits after that checkpoint. A fresh process finds the `in_progress` obligation,
reads its task and budget from memory, and finishes it.

### Deletion control

The test suite replaces every memory operation with `AmnesicMemory`. The task
then has no charter, no roles, and no vendor book. It refuses to route the work.
That is the pass/fail evidence: the memory layer is not decoration.

## Two-minute verification

From the repository root:

```bash
cd agent
npm install
npm test
```

The final test reports **24 checks passed**. It spawns real child processes and
verifies:

- founding and vendor learning;
- fresh-process reconstruction;
- remembered vendor bans and changed routing;
- role-dependent refusal when memory is absent;
- real-store persistence versus amnesic non-persistence;
- crash checkpoint and fresh-process resume.

The controlled crash is a deterministic checkpoint test, not a claim that every
possible operating-system termination mode has been tested.

## Run the local site and console

Install Sibyl Memory first:

```bash
uv tool install 'sibyl-memory-cli[mcp]'
# or: pip install 'sibyl-memory-cli[mcp]'
```

Then start the local site:

```bash
cd desk
npm install
npm run dev
```

Open [http://localhost:3737](http://localhost:3737).

The site has six routes:

| Route | Purpose |
|---|---|
| `/` | Landing: thesis, the fresh-session moment, evidence strip |
| `/product` | How the org works: lifecycle, memory domains, crash/resume |
| `/memory` | Sibyl Memory deep-dive: read/write map, deletion test |
| `/evidence` | Status matrix, reproduction commands, falsification |
| `/console` | Live control surface (each action starts a fresh OS process) |
| `/about` | Principles, origin, FAQ, roadmap |

The console is intentionally a **local control surface**, not a deployed
production service. It starts a fresh Calliope process for each dispatch and
displays the resulting event projection. It has controls for:

- founding the organization from a paragraph;
- dispatching a task;
- simulating a crash before completion;
- running the amnesic deletion control;
- archiving the current entity records;
- viewing the charter, standards, vendor book, decisions, obligations, and log.

For a completely clean rehearsal, use the explicit destructive local command:

```bash
cd agent
npm run org -- reset --yes
```

`reset --yes` deletes the configured local memory database. The normal `wipe`
command archives known entity records and leaves the append-only journal intact.

## Architecture

```text
┌──────────────────────────── Calliope desk ────────────────────────────┐
│ found · dispatch · crash · amnesic · archive      charter/vendor view  │
└───────────────────────────────┬────────────────────────────────────────┘
                                │ starts a fresh OS process
┌───────────────────────────────▼────────────────────────────────────────┐
│ Calliope session                                                        │
│ boot: found ⇄ reconstitute       task: open → route → QA → learn        │
│ role config from memory          HirePort: SIM or Virtuals ACP           │
└───────────────────────┬────────────────────────────────────────────────┘
                        │ stdio MCP
┌───────────────────────▼────────────────────────────────────────────────┐
│ Sibyl Memory                                                            │
│ local SQLite + FTS5 · charter/* · role/* · vendor/* · obligation/*      │
│ journal events · recall/search/list/remember/set-state                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Memory domains

| Domain | Stored state | How it changes behavior |
|---|---|---|
| `charter/mission` | mission, standards, policies | standards are attached to every brief and QA prompt |
| `role/*` | mandates, routes, model configuration | missing editor/QA roles refuse the task; model choice is read from memory |
| `vendor/*` | quality average, rate, jobs, failures, notes, ban | vendor selection skips bans and prefers learned quality/rate |
| `obligation/*` | task, standards, budget, status, assignment, spend | open obligations survive a process checkpoint and can resume |
| journal | founding, hiring, rulings, bans, observations | QA can retrieve prior journal-tier rulings for context and provenance |

The integration lives in `agent/src/memory/sibyl.ts`. Typed domain access is in
`agent/src/org/memory-schema.ts`. Boot and reconstitution are in
`agent/src/org/boot.ts`. The task loop is in `agent/src/org/run-task.ts`.

### Read/write evidence map

- `boot.ts:95-116`: recall the mission; found or reconstitute roles, vendors,
  and obligations.
- `run-task.ts:36-57`: read charter standards and write an obligation before work.
- `run-task.ts:82-97`: read roles from memory; refuse when the organization
  cannot route to editor and QA.
- `run-task.ts:101-117`: read the vendor book and make the hiring decision.
- `run-task.ts:137-149`: search journal-tier rulings for QA context.
- `run-task.ts:174-210`: persist paid/failed outcomes, quality averages, notes,
  and bans.
- `session.ts:167-179`: find and resume an in-progress obligation in a fresh process.
- `test/deletion-test.ts`: 24 assertions across process boundaries, including
  real recall checks.

## How memory made this possible

Calliope is not an agent with a notebook. The organization itself is stored
state. A later process can skip a banned vendor, attach remembered client
standards, and finish interrupted work only because those facts survived the
previous process in Sibyl. Remove the memory layer and there is no charter,
no role table, no vendor book, and no obligation to resume — the product
cannot do what it claims. That is why the deletion test is the proof, not a
side demo.

## UI design

The site follows the design contract in `DESIGN.md` (kept in-repo): warm
parchment canvas, editorial serif hierarchy, monospace functional labels,
hairline borders, 40px cards, pill controls, Lake Blue reserved for the single
primary action per view, and restrained eased motion that respects
`prefers-reduced-motion`. An optional one-off analysis of a local inspiration
clip confirmed the same direction: near-zero-saturation light editorial
surfaces with one sustained ambient motion element (the lifecycle diagram's
flow lines).

The console's three evidence surfaces are:

1. **Found / dispatch** — mission paragraph, task brief, budget, crash and
   amnesic controls.
2. **Decision record / obligations** — each decision shows its reason and memory
   source, while obligations show current work history.
3. **What I remember / run log** — persisted charter, standards, vendor records,
   process IDs, and event timeline.

## Integrations and honest status

| Integration | Current status |
|---|---|
| Sibyl Memory | **Verified** through stdio MCP and fresh-process tests |
| OpenAI / xAI | Wired through role model configuration; deterministic STUB fallback; not run without a key |
| Virtuals ACP | Typed `AcpHirePort` exists; not live-verified without registered agents and signer credentials |
| Base | Intended ACP escrow/settlement layer; no transaction claim without a real receipt |
| Vendor work | Deterministic simulation by default, labeled `SIM(no real escrow)` |

## Environment and limitations

Copy `agent/.env.example` to `agent/.env` only when you have credentials.
Canonical names are `CALLIOPE_*`; legacy `CHARTER_*` aliases remain accepted
for one transition. Do not commit private keys or API keys.

The desk is a local-only demo surface: no login, rate limit, CSRF layer, or
multi-tenant isolation. Do not deploy it publicly with wallet signer secrets.

## Demo and submission

Use [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md). The 2–5 minute video must
include a fresh-session recall segment with an on-screen clock or timestamp.
Simulated work must remain visibly and verbally labeled.

The official package is: public MIT/Apache-2.0 repository, README, demo, two
build-in-public posts, and the private build-page submission marked ready.
The user-owned remaining actions are repository publishing, recording, posting,
and marking ready.

## Prior work

Calliope is the implementation in this repository. The author previously built
Redline, an onchain document-verification project on X Layer. Calliope reuses
general engineering patterns and design experience, not Redline source code.
The current history preserves the early internal Charter/Foreman names as
development provenance.

## Repository map

```text
agent/             TypeScript agent loop and Sibyl MCP client
desk/              local Next.js site (6 routes) + live console
docs/              demo script, posts, submission checklist
DESIGN.md          UI design reference
HACKATHON.md       event state and evidence
REPOSITORY.md      public repository record
LICENSE            MIT license
```

## License

MIT — see [`LICENSE`](LICENSE).
