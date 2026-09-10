# Hackathon record — Calliope (working repo dir: calliope/)

## Event and clock
- Event / official URL: Sibyl Labs Hackathon — https://hack.sibyllabs.org/
- Official deadline / timezone: mark submission ready before Sep 10, 2026, 23:59 UTC
- User timezone / converted deadline: WAT (UTC+1) → Sep 11, 00:59 WAT
- Time checked: 2026-09-10 16:41 UTC (event pages re-fetched same day)
- Available working hours / assumptions: solo; remaining calendar ~7 h to
  23:59 UTC; productive budget ~3 h before the 20:00 UTC cutoff
- Internal submission cutoff / reserve: Sep 10, 20:00 UTC (~3 h remaining)
- Original event format: online; single challenge, no tracks
- Current mode: rescue (deadline day; product built; submission incomplete)
- Primary award objective: strongest overall entry ($4,000 first prize);
  all placements 1–5 pay ($4k/$2.5k/$1.5k/$1k/$1k, USDC on Base)

## Binding requirements
- Eligibility / team / registration: 18+, teams 1–5; registration closed Aug 31 —
  user confirmed registered; private build-page link IS the submission surface
- Prior-work and AI-use rules / attribution: README must include a Prior Work
  declaration; no explicit ban on reuse; AI assistance not addressed in rules
- Required technology / data / hardware: Sibyl Memory required (never counts as
  bonus stack); optional verified stacks: Base ×1.15, Virtuals ×1.25 (cap ×1.25)
- Judging criteria, weights if published, and stages: pass/fail load-bearing
  memory gate → 100 pt rubric (Memory 40 / Innovation 25 / Execution 20 /
  Pitch 15, +10 PMF bonus) × stack multiplier; judging Sep 11–12
- Required artifacts / limits / access: public repo (MIT/Apache-2.0) with real
  commit history + README setup instructions; 2–5 min demo video with a fresh
  session recalling earlier state (unedited segment, on-screen timestamp or
  commit hash); name builders + every Base/Virtuals stack *claimed*; memory
  implementation note (what is persisted/recalled/how it changes decisions);
  two public posts tagging @sibylcap and each claimed partner (demo video +
  at least one build-log); repo + demo + posts added to the private link,
  then marked ready
- Sources (URL, accessed date, requirement):
  - https://hack.sibyllabs.org/ (2026-09-10): theme, prizes, dates, rubric, multipliers
  - https://hack.sibyllabs.org/rules (2026-09-10): gate litmus, deletion test, DQs,
    posts must tag @sibylcap; claimed unused stacks lose the bonus
  - https://hack.sibyllabs.org/submissions (2026-09-10): deliverables, deadline, judging
  - https://docs.sibyllabs.org (2026-09-07): Sibyl Memory = local-first file-based,
    SQLite+FTS5, no embeddings, Python CLI + MCP, free tier, wallet/email auth
- Critical unknowns / independent work possible: private build-page link is
  user-held; X posting and video recording require the user; ACP/Base remain
  NOT RUN — independent work is polish, tests, and submission copy

## Build decision
- Competitive intel (2026-09-07, from public X posts; ~365 teams registered):
  spotlighted lane is vendor-grudge/credit over ACP (GRUDGE, Continuum) plus
  restart continuity (JANUS) and source-trust scores (RECEIPTS); other crowded
  lanes: payment dedup (Coral, HaggleMind), authorization/rules (Pact,
  OnRecord, GoBRA), scar memory (Vesper), meta data-layer (Dejavu). Almost all
  = one agent + a list; memory as inhibitor/consequence.
- PIVOT DECISION (2026-09-07): original vendor-grudge concept sat directly in
  the GRUDGE/Continuum spotlight lane → pivoted to the open lane: memory as the
  institution itself. Product renamed from Charter to Calliope on 2026-09-09;
  implementation skeleton (orchestrator, vendor agents, memory, desk) preserved.
- Chosen user / task / current workaround: operator of a small multi-agent
  workforce; workaround = state lives in prompts/context windows, so restarts,
  crashes, and model swaps lose the "company" and the user re-explains
  everything
- Concept: CALLIOPE — "Your agents are employees; Calliope is the company."
  A workforce of specialist agents whose entire institution lives in Sibyl
  Memory: org charter, roles, handoff routes, client standards, vendor book,
  in-flight obligations. Nothing org-level is hardcoded. Kill every process →
  reboot reconstitutes the org in seconds and finishes interrupted work;
  hot-swap the model under an agent → work continues. Wipe Sibyl → no company.
  Meaningful difference vs field: GRUDGE's grudge = one table in our vendor
  book; JANUS resumes one agent's task, we resume the organization;
  consequence/pricing policies are subsystems, not the product
- Team advantage: proven wagmi/viem/Next.js onchain UI patterns (Redline);
  ACP + x402 spikes already scheduled
- Distinctive action judges will see: kill-all-processes on camera → fresh
  boot reassembles org from memory (roles, standards, banned vendor,
  interrupted job) → finishes the job; then wiped-memory boot shows nothing
  reconstitutes. Plus automated deletion test in repo
- Baseline / representative input: found org with one paragraph → recurring
  task (localized landing copy) run across sessions with internal handoffs
  and one external ACP hire
- Riskiest assumption / experiment / observed result / fallback:
  ACP end-to-end job usable in our timeframe (spike A, day 1). Fallback: own
  vendor agents + x402 USDC payments on Base (keeps Base ×1.15, drops Virtuals)
- Alternatives considered / rejection reasons: vendor-grudge Casebook (crowded
  spotlight lane / prior-work risk), Creditmind (two-sided, heavy),
  The Witness (no coordination pattern), XP Market (hard to demo), taste-
  convergence agent (single-agent, weak coordination fit — folded in as the
  Editor specialist's style memory instead)
- Provisional assumptions and confidence: ACP v2 SDK workable for solo demo
  (medium, resolves spike A); Sibyl MCP reachable from TS (medium-high,
  Python sidecar fallback); site + console demo-only on localhost (high)

## Evidence
| Criterion | Claim | Actual evidence | Judge access path | Status / limitation |
| --- | --- | --- | --- | --- |
| Memory load-bearing (40) | Removing Sibyl dissolves the org (no roles/routes/standards/vendor book reconstitute; tasks refused, bans forgotten) | VERIFIED via session.ts + npm test: amnesic control cannot route; real memory reconstitutes charter/roles/vendors/obligations and resumes crashed work | repo test + demo video segment | Sim vendor outputs labeled; filmed side-by-side pending |
| Innovation (25) | Memory as the institution, not the notebook; absorbs grudge/continuity mechanics as subsystems | README "How memory made this possible" + architecture + console decision records | README + /product + /console | Built; judges still have to watch |
| Execution (20) | Clean second-run: deletion test + honest SIM labels; no unused-stack claims | `cd agent && npm test` (24 checks); README integration table | repo + /evidence | ACP/Base NOT RUN; do not claim |
| Pitch (15) | Fresh-session recall unmistakable | 2–5 min video, unedited restart segment with clock | demo video on build page | Unknown until recorded |
| PMF (+10) | Multi-agent spend/quality management pain | Framing + honest positioning only; no fabricated traction | README | Default 0; do not fabricate |
| Multiplier | Do not claim Base or Virtuals | README discloses wired-but-NOT-RUN | build page stacks field | ×1.00 accepted |

## Current execution
- Current objective / owner: freeze product; ship remaining desk polish +
  submission copy; user records, posts, marks ready
- Working state / verified commands and links:
  - Public repo: https://github.com/emmaGH1/calliope (MIT, 33+ commits)
  - `cd agent && npm test` — deletion test, 24 checks (re-run 2026-09-10)
  - Site: six routes + /console; uncommitted polish (wipe arm, log filter,
    empty-state coaching, motion) completed locally and queued to push
  - Posts drafts retagged to @sibylcap; Base/Virtuals claims removed
- Next concrete action (user): record the demo (`docs/DEMO_SCRIPT.md`), post
  both drafts, fill the private build page, mark ready by 20:00 UTC
- Largest current threat to placement: no demo video / unmarked build page
  by 23:59 UTC — not the missing ×1.25
- Blocker / fallback: recording, X posts, and mark-ready require the user;
  ACP/LLM remain deferred
- Deferred ideas / accepted scope tradeoffs: live ACP hire; real-LLM take;
  public console deploy; partner-stack multiplier

## Submission
- Form, video/slides, README, access status: repo public; README complete;
  video not recorded; posts not published; build-page link held by user
- Final commit: pending push of desk polish + docs
- Required checks and any remaining failures: `cd agent && npm test` 24/24
  (2026-09-10); desk `tsc --noEmit` 0 errors
- Submission status / actual confirmation: not submitted
- Required judging availability: none stated beyond access through judging (Sep 11–12)

## Outcome and lesson
- Status: pending
- (fill after Sep 13–15 results)
