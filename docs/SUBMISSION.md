# Submission checklist — Sibyl Labs Hackathon

Mark-ready deadline: **Sep 10, 2026, 23:59 UTC** (internal cutoff 20:00 UTC).
Judging Sep 11–12. Winners announced Sep 13–15.

**Virtuals ACP aborted.** **Base is live** via `CalliopeSettlement` on Base
Sepolia (×1.15). Do not claim Virtuals. Show a Basescan tx in the demo.

## Required deliverables (per /submissions)

| # | Deliverable | State | Remaining (user-side) |
| --- | --- | --- | --- |
| 1 | Public repo, OSI license, real commit history | READY — https://github.com/emmaGH1/calliope (public, MIT) | — |
| 2 | Demo video 2–5 min with fresh-session recall moment | SCRIPT READY — `docs/DEMO_SCRIPT.md` | record now; clock visible; sims labeled; point at Base settle tx |
| 3 | Team & partner stacks named | Sibyl required + **Base verified**; Virtuals NOT claimed | claim Base + Sibyl on build page |
| 4 | Memory implementation note | READY in README | paste into build page |
| + | Build-in-public posts | DRAFTS READY — `docs/POSTS.md` | post 2× tagging **@sibylcap** and Base |

## Build-page steps (user has the private link)

1. Add repo URL: https://github.com/emmaGH1/calliope · live site: https://calliopehq.vercel.app/
2. Add demo video + both post links.
3. Stacks: **Sibyl Memory + Base** (not Virtuals). Copy the README memory note + settlement links.
4. **Mark ready** — before Sep 10 23:59 UTC.

## Evidence references for the build page / README

- Deletion test: `cd agent && npm test` → 24/24 (screenshot or mention).
- Memory read sites: `agent/src/org/run-task.ts:36` (charter→standards),
  `:82` (roles→routing), `:101` (vendor book→hire),
  `agent/src/org/boot.ts:95-116` (founding/reconstitution).
- Memory write sites: `run-task.ts:174-210` (outcomes, quality, bans),
  `run-task.ts:48` (obligations), `session.ts:167-179` (resume).

## Time-boxed stretch (only after 1–4 are done)

- [ ] ACP registration (user) → real escrow hire → replace sim take in video
- [ ] OpenAI/xAI key → real-LLM take
- [ ] `sibyl init` account activation (optional; local store already works)

## Final checks before mark-ready

- [ ] Fresh clone → `npm install && npm test` passes on a second machine/run
- [ ] Video ≤ 5:00, recall segment unedited, clock visible, sims labeled
- [ ] README links resolve; repo is public; license file present
- [ ] Prior Work declaration present (README)
