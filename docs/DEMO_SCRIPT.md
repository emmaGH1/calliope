# Charter — demo video script (2–5 min, single take sections)

Rules compliance: 2–5 minutes, shows the problem, the product, how it works, and a
**fresh session recalling earlier state as one continuous unedited segment with an
on-screen timestamp**. Every simulation is labeled on screen. No fabricated data.

## Setup before recording

1. Terminal 1: `cd agent && npm run org -- wipe` (clean founding for the take).
2. Start the desk: `cd desk && npm run dev` → http://localhost:3737
3. Recording window covers: the desk in a browser + nothing else needed.
   OS clock visible in the taskbar or `date` echoed into a scratch terminal —
   the recall segment must carry an on-screen timestamp.
4. Micro-check: `cd agent && npm test` output available to show if asked.

## Beats (target ≈ 3.5 min)

| Time | Beat | What happens on screen | Narration |
| --- | --- | --- | --- |
| 0:00–0:25 | Hook | Desk header + empty log. | "Your agents are employees. Charter is the company — and the company lives in Sibyl Memory, not in prompts or processes." |
| 0:25–0:55 | Problem | Split concept: same task, first run vs later runs. | "First contact with a vendor is a gamble: agents explore, get burned, and the next session forgets everything — because the memory was the chat log." |
| 0:55–1:35 | Found | Click **found the org from this paragraph** (mission is pre-filled). Log shows pid, `FOUNDED org`, vendor book rows appear in *What I remember*. | "One paragraph founds the org. Charter, roles, vendor book — written into memory by one process that then dies." |
| 1:35–2:20 | Session 1 | Click **dispatch task ▸**. Wait ~4 s (STUB, fast). Decision record fills: *attach 2 standards → hire cheap-and-sloppy @ $1.00 (exploring, no history) → QA fail → **ban***. Deliverable panel shows machine output. | "First dispatch: no history, so it explores with the cheapest vendor… QA grades it against the charter standards… and the org learns: ban written into the vendor book. This process is now dead — everything it knew lives in memory." |
| 2:20–3:10 | **THE RECALL MOMENT (unedited)** | Click **dispatch task ▸** again. Point at the pid chip changing. Decision record: *attach 2 standards → **skip cheap-and-sloppy — banned in memory** → hire atelier-jp @ $2.50 → QA pass*. Deliverable: brand voice on. | "That was a brand-new process — new pid, zero context. It reconstituted the org from memory: it knows the charter, it remembers the ban, and it hires differently. That's the entire product." |
| 3:10–3:50 | Deletion test | Tick **deletion-test mode**, dispatch again. Record: *attach 0 standards → no eligible vendor → QA fail*. | "Now the control: the same task with every Sibyl call stubbed out. No charter, no vendor book, no ban. Delete the memory and there is no company. The repo runs this as `npm test` — 18 checks." |
| 3:50–4:20 | Proof + wipe | Scroll the *What I remember* panel; click **wipe org**, dispatch once more → `FOUNDED org` from scratch. | "The org isn't the processes — they're disposable. It isn't the model — swap it any time. It's the memory. That's what we're building: agents you can fire, and a company that survives them." |

## Honest labeling (rules)

- When the vendor deliverables are STUB outputs, the desk log already says
  `hire port: SIM(no real escrow)` — do not obscure it; say "simulated vendors in this
  take; the ACP escrow path activates with registered agents."
- The recall segment (2:20–3:10) must not be cut or sped up; leave the clock visible.
- Keep the whole video ≤ 5:00 including any title card.

## Upload / attach

- mp4 ≤ 100 MB; name `charter-demo.mp4`; add to the private build page with this
  repo URL and the two build-in-public posts.
