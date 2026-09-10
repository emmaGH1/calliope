import assert from "node:assert/strict";

const base = process.env.CALLIOPE_DESK_URL ?? "http://localhost:3737";

// --- routes: each page renders with its landmark text ---
const ROUTES = [
  ["/", "Calliope is the company", true],
  ["/product", "An org chart you can kill", true],
  ["/memory", "The company is a set of rows", true],
  ["/evidence", "Receipts, not adjectives", true],
  ["/about", "Why Calliope exists", true],
  ["/console", "Local control surface", false],
];

for (const [path, landmark, hasSiteFooter] of ROUTES) {
  const res = await fetch(`${base}${path}`);
  assert.equal(res.status, 200, `${path} should return 200`);
  const html = await res.text();
  assert.ok(html.includes(landmark), `${path} should contain "${landmark}"`);
  assert.ok(
    html.includes("Built with Sibyl Memory"),
    `${path} should carry the built-with line`
  );
  if (hasSiteFooter) {
    assert.ok(
      html.includes("Built for the Sibyl Labs Hackathon"),
      `${path} should carry the footer hackathon line`
    );
  }
}

// --- api: state + dispatch allowlist ---
const state = await fetch(`${base}/api/state`).then((r) => r.json());
assert.equal(state.ok, true);
assert.ok(Array.isArray(state.events));

const bad = await fetch(`${base}/api/dispatch`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ cmd: "rm -rf /" }),
});
assert.equal(bad.status, 400, "unknown commands must be rejected");

const boot = await fetch(`${base}/api/dispatch`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ cmd: "boot" }),
}).then((r) => r.json());
assert.equal(boot.ok, true);
assert.ok(
  boot.events.some((e) => e.kind === "founded" || e.kind === "reconstituted"),
  "boot should report founded or reconstituted"
);

console.log(
  `smoke: PASS (${ROUTES.length} routes, allowlist rejection, boot via API — ${boot.events.length} events)`
);
