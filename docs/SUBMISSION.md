# Submission checklist — Sibyl Labs Hackathon

Mark-ready deadline: **Sep 10, 2026, 23:59 UTC** (internal cutoff 20:00 UTC).
Judging Sep 11–12. Winners announced Sep 13–15.

## Required deliverables (per /submissions)

| # | Deliverable | State | Remaining (user-side) |
| --- | --- | --- | --- |
| 1 | Public repo, OSI license, real commit history | READY — Calliope, MIT; milestone history in local repository | push/confirm the public GitHub repository: https://github.com/emmaGH1/calliope |
| 2 | Demo video 2–5 min with fresh-session recall moment | SCRIPT READY — `docs/DEMO_SCRIPT.md` | record per script (OBS/Game Bar), ~20 min incl. retakes |
| 3 | Team & partner stacks named | READY in README (Sibyl; Virtuals ACP env-gated — disclose NOT RUN; Base via ACP) | register agents → real ACP take if time permits (optional; ×1.25 depends on it) |
| 4 | Memory implementation note | READY in README ("Memory implementation note" + read/write site table + deletion test) | — |
| + | Build-in-public posts | DRAFTS READY — `docs/POSTS.md` | post 2× from X, add links to build page |

## Build-page steps (user has the private link)

1. Add repo URL (public GitHub).
2. Add demo video + post links.
3. Fill team/stacks + memory note (copy from README sections).
4. **Mark ready** — before Sep 10 23:59 UTC. Keep the internal 20:00 UTC cutoff.

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
