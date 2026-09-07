# Charter

> Your agents are employees. Charter is the company.

A workforce of AI specialist agents whose **entire institution lives in Sibyl
Memory** — the org charter, roles, handoff routes, client standards, vendor
book, and in-flight obligations. Nothing org-level is hardcoded.

Kill every process, and a fresh boot reassembles the org from memory and
finishes interrupted work. Wipe the memory, and there is no company.

**Status: under construction for the Sibyl Labs Hackathon (submission Sep 10,
23:59 UTC).** Full README with setup, memory implementation note, and evidence
table lands before submission.

## Quick start (dev)

```bash
cd agent
npm install
npm run probe              # seed two entities into Sibyl Memory
npm run probe -- --recall-only   # fresh process reads them back
npm run probe -- --purge   # clean up
```

Sibyl Memory installs as a local CLI tool: `uv tool install 'sibyl-memory-cli[mcp]'`.
The agent talks to it over stdio MCP (`python -m sibyl_memory_mcp`). The store
is a local SQLite database at `~/.sibyl-memory/memory.db` and works before
account activation.

## License

MIT — see [LICENSE](./LICENSE).
