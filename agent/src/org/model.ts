import "dotenv/config";

/**
 * ModelPort: the only place a real LLM is touched. Each role carries its own
 * model config IN MEMORY (role entity -> model), so the org's brains are
 * hot-swappable without touching code — set-model <role> <provider> <model>.
 * Keyless dev falls back to the deterministic StubModel, always labeled.
 */
export interface ModelPort {
  readonly label: string;
  complete(system: string, user: string): Promise<string>;
}

export class StubModel implements ModelPort {
  readonly label = "STUB(deterministic)";
  async complete(system: string, user: string): Promise<string> {
    const role = /ROLE: (\w+)/.exec(system)?.[1] ?? "WORKER";
    if (role === "QA") {
      // payload: { draft, standards, priorFailures, mandate }
      let p: any = {};
      try {
        p = JSON.parse(user);
      } catch {}
      const sloppy = /Sorry, machine output/.test(p.draft ?? "") || /brand voice: off/.test(p.draft ?? "");
      if (sloppy) {
        const prior = Number(p.priorFailures ?? 0);
        const issues = ["brand voice missing", "reads machine-generated"];
        if (prior > 0) issues.push(`prior failures on record: ${prior} (journal)`);
        return JSON.stringify({ pass: false, issues });
      }
      return JSON.stringify({ pass: true, issues: [] });
    }
    const quality = /QUALITY: (\d)/.exec(system)?.[1] ?? "3";
    if (Number(quality) >= 4) {
      return `Localized copy (quality ${quality}): "Built for teams who ship. Take the office with you." [brand voice: on]`;
    }
    return `Localized copy (quality ${quality}): "TRANSLATED TEXT GOES HERE. Sorry, machine output." [brand voice: off]`;
  }
}

/** OpenAI-compatible (api.openai.com or api.x.ai) — one fetch, no SDK weight. */
export class OpenAICompatModel implements ModelPort {
  readonly label: string;
  constructor(
    private provider: "openai" | "xai",
    private model: string
  ) {
    this.label = `${provider}:${model}`;
  }
  async complete(system: string, user: string): Promise<string> {
    const base =
      this.provider === "xai" ? "https://api.x.ai/v1" : "https://api.openai.com/v1";
    const key =
      this.provider === "xai" ? process.env.XAI_API_KEY : process.env.OPENAI_API_KEY;
    if (!key) throw new Error(`No API key for ${this.provider} (set XAI_API_KEY / OPENAI_API_KEY)`);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${this.provider} ${res.status}: ${await res.text()}`);
    const j: any = await res.json();
    return j.choices[0].message.content as string;
  }
}

/**
 * Resolve a role's model config (from memory) to a ModelPort, falling back to
 * the labeled StubModel when the provider has no key — keyless dev never breaks.
 */
export function modelFor(cfg: { provider: string; model: string }): ModelPort {
  if (cfg.provider === "stub") return new StubModel();
  const key =
    cfg.provider === "xai" ? process.env.XAI_API_KEY : process.env.OPENAI_API_KEY;
  if (cfg.provider !== "openai" && cfg.provider !== "xai") return new StubModel();
  if (!key) return new StubModel();
  return new OpenAICompatModel(cfg.provider, cfg.model);
}
