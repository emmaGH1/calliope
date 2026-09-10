import assert from "node:assert/strict";

const base = process.env.CALLIOPE_DESK_URL ?? "http://localhost:3737";

const state = await fetch(`${base}/api/state`).then((r) => {
  assert.equal(r.status, 200);
  return r.json();
});
assert.equal(state.ok, true);
assert.ok(Array.isArray(state.events));

const dispatch = await fetch(`${base}/api/dispatch`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ cmd: "boot" }),
}).then((r) => {
  assert.equal(r.status, 200);
  return r.json();
});
assert.equal(dispatch.ok, true);
assert.ok(dispatch.events.some((event) =>
  event.kind === "founded" || event.kind === "reconstituted"
));

console.log(`desk smoke: PASS (${dispatch.events.length} boot events)`);
