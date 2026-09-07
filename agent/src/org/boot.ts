import type { MemoryIo, Mission, Role, VendorRecord } from "./types.js";
import { OrgMemory } from "./memory-schema.js";

export interface BootReport {
  founded: boolean; // true = fresh founding, false = reconstituted from memory
  rolesLoaded: Role[];
  vendorsLoaded: VendorRecord[];
  obligationsResumed: string[];
  amnesic: boolean;
}

const SEED_MISSION: Omit<Mission, "foundedAt"> = {
  name: "Charter Demo Org",
  mission:
    "Localize client landing copy with brand voice intact, on budget, every time.",
  clientStandards: [
    "Brand voice outranks literal accuracy",
    "No machine-output artifacts",
  ],
  policies: [
    "Never re-hire a banned vendor",
    "Attach client standards to every brief",
    "Record every spend and ruling in memory",
  ],
};

const SEED_ROLES: Role[] = [
  {
    name: "coordinator",
    mandate:
      "Read the vendor book and standards, create obligations, brief the editor, rule on delivery.",
    routes: [{ on: "copy task", to: "editor", note: "briefs carry standards from charter" }],
    model: { provider: "stub", model: "n/a" },
  },
  {
    name: "editor",
    mandate: "Produce localized copy that satisfies the charter standards.",
    routes: [{ on: "draft ready", to: "qa" }],
    model: { provider: "stub", model: "n/a" },
  },
  {
    name: "qa",
    mandate: "Grade drafts against charter standards; fail drafts with notes.",
    routes: [{ on: "pass", to: "coordinator", note: "release payment" }],
    model: { provider: "stub", model: "n/a" },
  },
];

const SEED_VENDORS: VendorRecord[] = [
  {
    name: "atelier-jp",
    kind: "acp",
    quality: null,
    skill: 5,
    rate: 2.5,
    jobs: 0,
    failures: 0,
    notes: [],
    banned: false,
  },
  {
    name: "cheap-and-sloppy",
    kind: "acp",
    quality: null,
    skill: 2,
    rate: 1.0,
    jobs: 0,
    failures: 0,
    notes: [],
    banned: false,
  },
];

/**
 * Boot the org. If charter/mission is absent, this is a founding: write the
 * charter, roles, and vendor book INTO MEMORY — they were never in code.
 * If present, this is a reconstitution: read everything back and resume
 * unfinished obligations. With an amnesic memory, the org is always "founded"
 * and remembers nothing — the deletion test's control group.
 */
export async function boot(mem: MemoryIo): Promise<BootReport> {
  const org = new OrgMemory(mem);
  const report: BootReport = {
    founded: false,
    rolesLoaded: [],
    vendorsLoaded: [],
    obligationsResumed: [],
    amnesic: mem instanceof AmnesicMemory,
  };

  const mission = await org.getMission();
  if (!mission) {
    report.founded = true;
    await org.setMission({ ...SEED_MISSION, foundedAt: new Date().toISOString() });
    for (const r of SEED_ROLES) await org.setRole(r);
    for (const v of SEED_VENDORS) await org.setVendor(v);
    await org.event("founding", { by: "boot", roles: SEED_ROLES.length });
    report.rolesLoaded = SEED_ROLES;
    report.vendorsLoaded = SEED_VENDORS;
    await mem.setState("org:boot", { at: new Date().toISOString(), mode: "founded" });
    return report;
  }

  report.rolesLoaded = await org.listRoles();
  report.vendorsLoaded = await org.listVendors();
  for (const o of await org.listObligations()) {
    if (o.status === "open" || o.status === "in_progress") {
      report.obligationsResumed.push(o.id);
    }
  }
  await org.event("reconstitution", {
    at: new Date().toISOString(),
    roles: report.rolesLoaded.length,
    vendors: report.vendorsLoaded.length,
    resumed: report.obligationsResumed.length,
  });
  await mem.setState("org:boot", { at: new Date().toISOString(), mode: "reconstituted" });
  return report;
}

/**
 * Deletion-test control group: a MemoryIo that remembers nothing and
 * records nothing. Boot with this and the org "founds" itself fresh every
 * time, re-explores, re-trusts banned vendors, ignores learned standards.
 */
export class AmnesicMemory implements MemoryIo {
  readonly label = "AMNESIC (memory calls stubbed out — the deletion test)";
  async remember() {
    return { ok: true, amnesic: true };
  }
  async recall() {
    return { ok: false, error: "NOT_FOUND (amnesic)" };
  }
  async search() {
    return { ok: true, count: 0, results: [] };
  }
  async list() {
    return { ok: true, count: 0, results: [] };
  }
  async forget() {
    return { ok: true };
  }
  async setState() {}
  async getState() {
    return { ok: false };
  }
  async recordEvent() {
    return { ok: true, amnesic: true };
  }
}
