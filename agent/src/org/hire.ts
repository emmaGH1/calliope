import type { Decision, VendorRecord } from "./types.js";

/**
 * HirePort: the seam where the org reaches the outside market.
 * AcpHirePort (real Virtuals ACP jobs with USDC escrow on Base) plugs in here
 * once agent registration is done. SimHirePort is an honest, labeled
 * simulation used for keyless dev — it never pretends to be onchain.
 */
export interface HirePort {
  readonly label: string; // "ACP(escrow on Base)" or "SIM(no real escrow)"
  hire(
    vendor: VendorRecord,
    requirement: { task: string; standards: string[] }
  ): Promise<{ deliverable: string; spend: number; tx?: string }>;
}

export class SimHirePort implements HirePort {
  readonly label = "SIM(no real escrow)";
  async hire(vendor: VendorRecord, req: { task: string; standards: string[] }) {
    const quality = vendor.skill ?? 2;
    const deliverable =
      quality >= 4
        ? `Localized copy: "Built for teams who ship. Take the office with you." [brand voice: on; standards: ${req.standards.join("; ") || "none attached"}]`
        : `Localized copy: "TRANSLATED TEXT GOES HERE. Sorry, machine output." [brand voice: off]`;
    return { deliverable, spend: vendor.rate };
  }
}

export function pickVendor(
  vendors: VendorRecord[],
  budget: number
): { vendor: VendorRecord | null; decisions: Decision[] } {
  const banNotes = (list: VendorRecord[]): Decision[] =>
    list.length
      ? [
          {
            choice: `skip ${list.map((b) => b.name).join(", ")}`,
            because: `BANNED in memory after ${list.map((b) => b.failures).join("/")} failure(s)`,
            source: "vendor/* in memory",
          },
        ]
      : [];
  const eligible = vendors.filter((v) => v.kind === "acp" && !v.banned && v.rate <= budget);
  if (eligible.length === 0) {
    return {
      vendor: null,
      decisions: [
        ...banNotes(vendors.filter((v) => v.banned)),
        {
          choice: "no eligible external vendor — internal editor takes the desk",
          because: "vendor book empty or over budget",
          source: "vendor/* in memory",
        },
      ],
    };
  }
  const known = eligible.filter((v) => v.quality != null);
  // No history = explore: cheapest first. History = exploit: best quality, then cheap.
  const sorted = known.length
    ? [...known].sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0) || a.rate - b.rate)
    : [...eligible].sort((a, b) => a.rate - b.rate);
  const best = sorted[0];
  return {
    vendor: best,
    decisions: [
      ...banNotes(vendors.filter((v) => v.banned)),
      {
        choice: `hire ${best.name} @ $${best.rate.toFixed(2)}`,
        because: known.length
          ? `remembered: quality ${best.quality}/5 across ${best.jobs} job(s)${best.failures ? `, ${best.failures} failure(s)` : ""}`
          : "no history for this vendor — exploring with the cheapest",
        source: `vendor/${best.name}`,
      },
    ],
  };
}
