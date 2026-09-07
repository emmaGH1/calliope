import "dotenv/config";

/**
 * ModelPort: the only place a real LLM is touched. Workers get their brains
 * from here; the org never depends on a particular model — that is the point
 * of hot-swappable employees. Keyless dev uses the deterministic StubModel
 * and is always labeled STUB in output.
 */
export interface ModelPort {
  readonly label: string;
  complete(system: string, user: string): Promise<string>;
}

export class StubModel implements ModelPort {
  readonly label = "STUB(deterministic)";
  async complete(system: string, user: string): Promise<string> {
    const role = /ROLE: (\w+)/.exec(system)?.[1] ?? "WORKER";
    const quality = /QUALITY: (\d)/.exec(system)?.[1] ?? "3";
    if (role === "QA") {
      const sloppy = /cheap-and-sloppy/i.test(user) || /Sorry, machine output/.test(user);
      return sloppy
        ? JSON.stringify({ pass: false, issues: ["brand voice missing", "reads machine-generated"] })
        : JSON.stringify({ pass: true, issues: [] });
    }
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

export function modelFor(cfg: { provider: string; model: string }): ModelPort {
  if (cfg.provider === "stub" || (!process.env.OPENAI_API_KEY && !process.env.XAI_API_KEY)) {
    return new StubModel();
  }
  return new OpenAICompatModel(cfg.provider as "openai" | "xai", cfg.model);
}
