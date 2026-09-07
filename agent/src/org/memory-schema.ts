import type {
  Mission,
  Obligation,
  Role,
  VendorRecord,
} from "./types.js";

/**
 * Typed access to the org's memory domains. These categories ARE the org:
 * charter, roles, vendor book, obligations. If the store is empty, the org
 * does not exist and boot() founds it from the seed paragraph.
 */
export const CAT = {
  charter: "charter",
  role: "role",
  vendor: "vendor",
  obligation: "obligation",
} as const;

export class OrgMemory {
  constructor(readonly mem: import("./types.js").MemoryIo) {}

  async getMission(): Promise<Mission | null> {
    const r = await this.mem.recall(CAT.charter, "mission");
    return r.ok ? (r.entity.body as Mission) : null;
  }
  async setMission(m: Mission) {
    await this.mem.remember(CAT.charter, "mission", m);
  }

  async listRoles(): Promise<Role[]> {
    const r = await this.mem.list(CAT.role, 100);
    return (r.results ?? []).map((e: any) => e.body as Role);
  }
  async setRole(r: Role) {
    await this.mem.remember(CAT.role, r.name, r);
  }

  async listVendors(): Promise<VendorRecord[]> {
    const r = await this.mem.list(CAT.vendor, 100);
    return (r.results ?? []).map((e: any) => e.body as VendorRecord);
  }
  async getVendor(name: string): Promise<VendorRecord | null> {
    const r = await this.mem.recall(CAT.vendor, name);
    return r.ok ? (r.entity.body as VendorRecord) : null;
  }
  async setVendor(v: VendorRecord) {
    await this.mem.remember(CAT.vendor, v.name, v);
  }

  async listObligations(): Promise<Obligation[]> {
    const r = await this.mem.list(CAT.obligation, 100);
    return (r.results ?? []).map((e: any) => e.body as Obligation);
  }
  async getObligation(id: string): Promise<Obligation | null> {
    const r = await this.mem.recall(CAT.obligation, id);
    return r.ok ? (r.entity.body as Obligation) : null;
  }
  async setObligation(o: Obligation) {
    o.updatedAt = new Date().toISOString();
    await this.mem.remember(CAT.obligation, o.id, o);
  }

  event(kind: string, body: unknown, category?: string, name?: string) {
    return this.mem.recordEvent(kind, body, category, name);
  }
}
