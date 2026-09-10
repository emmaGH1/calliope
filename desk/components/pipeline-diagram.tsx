import { Reveal } from "./reveal";

/**
 * The org lifecycle as a hairline pipeline diagram (DESIGN.md imagery:
 * pill nodes, ash borders, thin curved connectors). The dashed flow is the
 * single ambient-motion element, matching the inspiration clip's sustained
 * motion segment; it is disabled under prefers-reduced-motion.
 */

type Node = { id: string; label: string; sub: string; x: number; y: number };

const NODES: Node[] = [
  { id: "mission", label: "Mission", sub: "one paragraph", x: 80, y: 60 },
  { id: "charter", label: "Charter", sub: "standards + policies", x: 300, y: 60 },
  { id: "roles", label: "Roles", sub: "who routes what", x: 520, y: 60 },
  { id: "book", label: "Vendor book", sub: "who delivered, who failed", x: 740, y: 60 },
  { id: "obligation", label: "Obligation", sub: "brief · budget · state", x: 300, y: 190 },
  { id: "qa", label: "QA", sub: "graded vs standards", x: 520, y: 190 },
  { id: "learn", label: "Learning", sub: "scores · notes · bans", x: 740, y: 190 },
];

const EDGES: Array<[string, string, boolean]> = [
  ["mission", "charter", true],
  ["charter", "roles", true],
  ["roles", "book", true],
  ["book", "obligation", false],
  ["obligation", "qa", true],
  ["qa", "learn", true],
  ["learn", "book", false],
];

function nodeById(id: string) {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}

export function PipelineDiagram() {
  const width = 920;
  const height = 270;

  return (
    <figure className="rounded-3xl border border-ash p-6 sm:p-10">
      <Reveal>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="The organization lifecycle: mission becomes charter, roles, and a vendor book; obligations are graded by QA against standards and feed learning back into the book."
          className="w-full"
        >
          {EDGES.map(([from, to, flow]) => {
            const a = nodeById(from);
            const b = nodeById(to);
            const x1 = a.x + 90;
            const y1 = a.y + 22;
            const x2 = b.x + 90;
            const y2 = b.y + 22;
            const midX = (x1 + x2) / 2;
            const d =
              Math.abs(a.y - b.y) < 4
                ? `M ${x1} ${y1} L ${x2} ${y2}`
                : `M ${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}`;
            return (
              <path
                key={`${from}-${to}`}
                d={d}
                fill="none"
                stroke="#cecac8"
                strokeWidth="1"
                className={flow ? "flow-line" : undefined}
              />
            );
          })}
          {NODES.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={180}
                height={44}
                rx={22}
                fill="var(--color-parchment)"
                stroke="#cecac8"
              />
              <text
                x={n.x + 18}
                y={n.y + 20}
                fontSize="13"
                letterSpacing="0.4"
                fill="#242424"
                fontFamily="var(--font-abc-diatype-mono)"
              >
                {n.label.toUpperCase()}
              </text>
              <text
                x={n.x + 18}
                y={n.y + 35}
                fontSize="10"
                letterSpacing="0.2"
                fill="#797776"
                fontFamily="var(--font-abc-diatype-mono)"
              >
                {n.sub}
              </text>
            </g>
          ))}
          <text
            x={80}
            y={250}
            fontSize="10"
            letterSpacing="0.6"
            fill="#797776"
            fontFamily="var(--font-abc-diatype-mono)"
          >
            EVERY NODE IS A SIBYL MEMORY ENTITY — KILL THE PROCESS, THE SHAPE REMAINS
          </text>
        </svg>
      </Reveal>
      <figcaption className="mt-4 text-body-sm text-graphite">
        The org chart, the standards, and the vendor book are not code — they are
        memory rows that a fresh process reads back.
      </figcaption>
    </figure>
  );
}
