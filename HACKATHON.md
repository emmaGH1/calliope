# Hackathon record — Charter (working repo dir: foreman/)

## Event and clock
- Event / official URL: Sibyl Labs Hackathon — https://hack.sibyllabs.org/
- Official deadline / timezone: mark submission ready before Sep 10, 2026, 23:59 UTC
- User timezone / converted deadline: WAT (UTC+1) → Sep 11, 00:59 WAT
- Time checked: 2026-09-07 (event pages fetched same day)
- Available working hours / assumptions: solo, 8+ h/day, Sep 7–10 (~26 h)
- Internal submission cutoff / reserve: Sep 10, 20:00 UTC (4 h reserve)
- Original event format: online; single challenge, no tracks
- Current mode: short sprint (entered on day 7 of 10-day window)
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
  commit hash); name builders + every Base/Virtuals stack; memory
  implementation note (what is persisted/recalled/how it changes decisions);
  build-in-public posts on the build page; repo + demo + posts added to the
  private link, then marked ready
- Sources (URL, accessed date, requirement):
  - https://hack.sibyllabs.org/ (2026-09-07): theme, prizes, dates, rubric, multipliers
  - https://hack.sibyllabs.org/rules (2026-09-07): gate litmus, deletion test, DQs, license
  - https://hack.sibyllabs.org/submissions (2026-09-07): deliverables, deadline, judging
  - https://docs.sibyllabs.org (2026-09-07): Sibyl Memory = local-first file-based,
    SQLite+FTS5, no embeddings, Python CLI + MCP, free tier, wallet/email auth
- Critical unknowns / independent work possible: ACP testnet vs mainnet
  (spike A); Sibyl-from-TypeScript path (spike B); ACP registration fee; all
  code/UI/testable work independent of these

## Build decision
- Competitive intel (2026-09-07, from public X posts; ~365 teams registered):
  spotlighted lane is vendor-grudge/credit over ACP (GRUDGE, Continuum) plus
  restart continuity (JANUS) and source-trust scores (RECEIPTS); other crowded
  lanes: payment dedup (Coral, HaggleMind), authorization/rules (Pact,
  OnRecord, GoBRA), scar memory (Vesper), meta data-layer (Dejavu). Almost all
  = one agent + a list; memory as inhibitor/consequence.
- PIVOT DECISION (2026-09-07): original "Foreman" concept sat directly in the
  GRUDGE/Continuum spotlight lane → pivoted to the open lane: memory as the
  institution itself. Skeleton (orchestrator, vendor agents, memory, desk)
  unchanged; framing and one memory domain added.
- Chosen user / task / current workaround: operator of a small multi-agent
  workforce; workaround = state lives in prompts/context windows, so restarts,
  crashes, and model swaps lose the "company" and the user re-explains
  everything
- Concept: CHARTER — "Your agents are employees; Charter is the company."
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
- Alternatives considered / rejection reasons: Foreman/Casebook (crowded
  spotlight lane / prior-work risk), Creditmind (two-sided, heavy),
  The Witness (no coordination pattern), XP Market (hard to demo), taste-
  convergence agent (single-agent, weak coordination fit — folded in as the
  Editor specialist's style memory instead)
- Provisional assumptions and confidence: ACP v2 SDK workable for solo demo
  (medium, resolves spike A); Sibyl MCP reachable from TS (medium-high,
  Python sidecar fallback); desk UI demo-only on localhost (high)

## Evidence
| Criterion | Claim | Actual evidence | Judge access path | Status / limitation |
| --- | --- | --- | --- | --- |
| Memory load-bearing (40) | Removing Sibyl dissolves the org (no roles/routes/standards/obligations reconstitute) | Deletion test as automated test + filmed kill-all/reboot side-by-side | repo test + demo video segment | Unknown until built |
| Innovation (25) | Memory as the institution, not the notebook; absorbs grudge/continuity mechanics as subsystems | README memory note + architecture diagram | README | Unknown until built |
| Execution (20) | Real escrow/payment txs on Base | tx hashes + explorer links in job log | desk UI + repo | Unknown until spike A |
| Pitch (15) | Fresh-session recall unmistakable | 2–5 min video, unedited restart segment with clock | demo video on build page | Unknown until recorded |
| PMF (+10) | Multi-agent spend/quality management pain | Framing + honest positioning only; no fabricated traction | README | Do not fabricate |
| Multiplier ×1.25 | Virtuals ACP jobs + Base settlement both real | named stacks on build page + tx evidence | build page | Unknown until spike A |

## Current execution
- Current objective / owner: day-1 spikes (Sibyl recall; ACP hello-world job) — agent
- Working state / verified commands and links: scaffold only; toolchain verified
  (Node 24.16, npm 11.13, Python 3.11.15, uv 0.11.32, git 2.54)
- Next concrete action: install Sibyl CLI + acp-node-v2; run both spikes
- Checkpoint and feature-freeze timing: freeze optional scope at Sep 9 noon UTC
- Largest current threat to placement: ACP friction burning day 1 (fallback ready)
- Blocker / fallback: user-side sign-ins (sibyl auth, ACP registration, LLM key)
  needed for full loop; local stubs unblocked meanwhile. ACP failure → x402 path
- Deferred ideas / accepted scope tradeoffs: hiring real third-party ACP agents
  (stretch, disclose anyway); mainnet stamps; multi-client support

## Submission
- Form, video/slides, README, access status: not started; build-page link held by user
- Final commit: —
- Required checks and any remaining failures: —
- Submission status / actual confirmation: not submitted
- Required judging availability: none stated beyond access through judging (Sep 11–12)

## Outcome and lesson
- Status: pending
- (fill after Sep 13–15 results)
