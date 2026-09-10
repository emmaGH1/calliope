import { Reveal } from "./reveal";

/**
 * Org lifecycle as an editorial pipeline (DESIGN.md): pill nodes, ash
 * hairlines, soft periwinkle emphasis on the load-bearing path, and one
 * ambient dashed flow (disabled under prefers-reduced-motion).
 */

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  accent?: boolean;
};

const NODES: Node[] = [
  { id: "mission", label: "Mission", sub: "one paragraph", x: 40, y: 48 },
  { id: "charter", label: "Charter", sub: "standards · policies", x: 260, y: 48, accent: true },
  { id: "roles", label: "Roles", sub: "who routes what", x: 480, y: 48, accent: true },
  { id: "book", label: "Vendor book", sub: "quality · bans · rates", x: 700, y: 48, accent: true },
  { id: "obligation", label: "Obligation", sub: "brief · budget · state", x: 260, y: 168, accent: true },
  { id: "qa", label: "QA", sub: "graded vs standards", x: 480, y: 168 },
  { id: "learn", label: "Learning", sub: "scores · notes · bans", x: 700, y: 168, accent: true },
  { id: "base", label: "Base settle", sub: "onchain receipt", x: 700, y: 268 },
];

const EDGES: Array<[string, string, boolean]> = [
  ["mission", "charter", true],
  ["charter", "roles", true],
  ["roles", "book", true],
  ["charter", "obligation", true],
  ["roles", "obligation", false],
  ["book", "obligation", false],
  ["obligation", "qa", true],
  ["qa", "learn", true],
  ["learn", "book", true],
  ["qa", "base", true],
];

function nodeById(id: string) {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}

export function PipelineDiagram() {
  const width = 920;
  const height = 340;

  return (
    <figure className="rounded-[2.5rem] border border-ash/80 bg-ash/20 p-1.5 sm:p-2">
      <div className="rounded-[calc(2.5rem-0.375rem)] border border-ash bg-parchment p-5 sm:p-8">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.18em] text-smoke">
                Data shape
              </p>
              <p className="mt-2 max-w-xl font-untitled-serif text-subheading font-normal">
                Every node is a Sibyl Memory entity.
              </p>
            </div>
            <p className="text-caption uppercase tracking-[0.14em] text-graphite">
              Kill the process · the shape remains
            </p>
          </div>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="The organization lifecycle: mission becomes charter, roles, and a vendor book; obligations are graded by QA against standards, feed learning back into the book, and settle a receipt on Base."
            className="w-full"
          >
            <defs>
              <linearGradient id="flowWash" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff9473" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#a0b5eb" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a7fccd" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <rect
              x="24"
              y="24"
              width="872"
              height="292"
              rx="28"
              fill="url(#flowWash)"
              opacity="0.35"
            />
            {EDGES.map(([from, to, flow]) => {
              const a = nodeById(from);
              const b = nodeById(to);
              const x1 = a.x + 90;
              const y1 = a.y + 24;
              const x2 = b.x + 90;
              const y2 = b.y + 24;
              const d =
                Math.abs(a.y - b.y) < 8
                  ? `M ${x1} ${y1} L ${x2} ${y2}`
                  : `M ${x1} ${y1} C ${x1 + 28} ${y1 + (y2 - y1) * 0.35}, ${x2 - 28} ${y2 - (y2 - y1) * 0.35}, ${x2} ${y2}`;
              return (
                <path
                  key={`${from}-${to}`}
                  d={d}
                  fill="none"
                  stroke={flow ? "#2b59d1" : "#cecac8"}
                  strokeWidth={flow ? "1.5" : "1"}
                  strokeOpacity={flow ? 0.55 : 1}
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
                  height={48}
                  rx={24}
                  fill={n.accent ? "#cfdaf5" : "var(--color-parchment)"}
                  stroke="#cecac8"
                  strokeWidth="1"
                />
                <text
                  x={n.x + 18}
                  y={n.y + 20}
                  fontSize="12"
                  letterSpacing="0.08em"
                  fill="#242424"
                  fontFamily="var(--font-abc-diatype-mono)"
                >
                  {n.label.toUpperCase()}
                </text>
                <text
                  x={n.x + 18}
                  y={n.y + 36}
                  fontSize="10"
                  letterSpacing="0.02em"
                  fill="#797776"
                  fontFamily="var(--font-abc-diatype-mono)"
                >
                  {n.sub}
                </text>
              </g>
            ))}
          </svg>
        </Reveal>
        <figcaption className="mt-5 border-t border-ash pt-4 text-body-sm text-graphite">
          Charter, roles, vendor book, and open obligations are memory rows a
          fresh process reads back — then QA stamps the ruling on Base.
        </figcaption>
      </div>
    </figure>
  );
}
