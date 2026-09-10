# Calliope — demo video script (2–5 min, single take sections)

Rules compliance: 2–5 minutes, shows the problem, the product, how it works, and a
**fresh session recalling earlier state as one continuous unedited segment with an
on-screen timestamp**. Every simulation is labeled on screen. No fabricated data.

## Setup before recording

1. Terminal 1: `cd agent && npm run org -- reset --yes` (pristine local store for the take — deletes memory.db; a CLI wipe would archive entities and leave journal residue that shows up in QA context chips).
2. Start the site: `cd desk && npm run dev` → http://localhost:3737
   (optional 15s pre-roll: hold on the landing hero, then move to /console)
3. Recording window covers: the site in a browser + nothing else needed. The console lives at /console.
   Use the DemoRail across the top: Found → Dispatch → **Recall** → Crash → Resume → Amnesic.
   OS clock visible in the taskbar or `date` echoed into a scratch terminal —
   the recall segment must carry an on-screen timestamp.
4. Micro-check: `cd agent && npm test` (24 checks) — output available to show if asked.

## Beats (target ≈ 3.5 min)

| Time | Beat | What happens on screen | Narration |
| --- | --- | --- | --- |
| 0:00–0:25 | Hook | Desk header + empty log. | "Your agents are employees. Calliope is the company — and the company lives in Sibyl Memory, not in prompts or processes." |
| 0:25–0:55 | Problem | Split concept: same task, first run vs later runs. | "First contact with a vendor is a gamble: agents explore, get burned, and the next session forgets everything — because the memory was the chat log." |
| 0:55–1:35 | Found | Click **found the org from this paragraph** (mission is pre-filled). Log shows pid, `FOUNDED org`, vendor book rows appear in *What I remember*. | "One paragraph founds the org. Calliope, roles, vendor book — written into memory by one process that then dies." |
| 1:35–2:20 | Session 1 | Click **dispatch task ▸**. Wait ~4 s (STUB, fast). Decision record fills: *attach 2 standards → hire cheap-and-sloppy @ $1.00 (exploring, no history) → QA fail → **ban***. Deliverable panel shows machine output. | "First dispatch: no history, so it explores with the cheapest vendor… QA grades it against the charter standards… and the org learns: ban written into the vendor book. This process is now dead — everything it knew lives in memory." |
| 2:20–3:10 | **THE RECALL MOMENT (unedited)** | Click DemoRail **Recall** (or **dispatch task ▸** again). Point at the pid chip changing. Decision record: *attach 2 standards → **skip cheap-and-sloppy — banned in memory** → hire atelier-jp @ $2.50 → QA pass*. Deliverable: brand voice on. | "That was a brand-new process — new pid, zero context. It reconstituted the org from memory: it knows the charter, it remembers the ban, and it hires differently. That's the entire product." |
| 3:10–3:40 | Crash → resume | Click **crash mid-task**. Log: obligation opened, process died (status 1). Then **dispatch task ▸** again. Decision record leads with *resumed obligation … — the brief survived the crash*, and the job finishes. | "Now the hard part of real work: this process died halfway through a job. The obligation — brief, standards, budget — was already in memory, so the next process picked it up and finished it. Interrupted work survives its worker." |
| 3:40–4:15 | Deletion test | Tick **deletion-test mode**, dispatch again. Record: *attach 0 standards → **task refused — no roles in memory***. | "The control: the same task with every Sibyl call stubbed out. No charter, no roles, no vendor book — the org can't even route the work. The repo runs this as `npm test` — 24 checks." |
| 4:15–4:45 | Proof + wipe | Scroll the *What I remember* panel (charter, standards, vendor book). Click **wipe org from memory**, dispatch once more → `FOUNDED org` from scratch. | "The org isn't the processes — they're disposable. It isn't the model — swap it any time. It's the memory. That's what we're building: agents you can fire, and a company that survives them." |

## Honest labeling (rules)

- When the vendor deliverables are STUB outputs, the console log already says
  `hire port: SIM(no real escrow)` — do not obscure it; say "simulated vendors in this
  take; the ACP escrow path activates with registered agents."
- The recall segment (2:20–3:10) must not be cut or sped up; leave the clock visible.
- Keep the whole video ≤ 5:00 including any title card.

## Upload / attach

- mp4 ≤ 100 MB; name `calliope-demo.mp4`; add to the private build page with this
  repo URL and the two build-in-public posts (tag @sibylcap; do not claim Base
  or Virtuals).
