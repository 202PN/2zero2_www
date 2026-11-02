/**
 * The hero banner: a circuit-board blueprint of the things the studio builds.
 * Wireframes of a site, a dashboard, and a phone sit on the board as parts,
 * black chips stand in for the services behind them, and every trace runs to
 * U1 — the 2zero2 mark — in the middle.
 *
 * Two compositions of the same parts ship. `wide` is a 1600 × 800 sheet for
 * landscape screens; `tall` is an 800 × 1020 sheet for portrait ones, with
 * the parts stacked above and below U1 so a phone sees every one of them
 * instead of a crop of the wide sheet. The page renders both and CSS shows
 * one by orientation (`.board-wide` / `.board-tall` in globals.css).
 *
 * The board's ground and blueprint grid are NOT drawn here: they are the
 * hero section's own background (`.board` in globals.css), so the board
 * keeps going past the SVG's edges on a screen taller than 2:1. Parts are
 * filled with the ground colour so the grid stops at their edges.
 *
 * Pure markup, no client JS. The LEDs and signal pulses are CSS animations,
 * switched off under reduced motion in globals.css.
 */

const INK = "var(--board-ink)";
const BG = "var(--board-bg)";

type Pt = [number, number];
type Rect = { x: number; y: number; w: number; h: number };

const LOGO_RATIO = 130.49 / 70.85; // the wordmark's own proportions
const PIN = 16; // pin length
const PITCH = 32;

const pins = (from: number, to: number) =>
  Array.from({ length: Math.floor((to - from) / PITCH) + 1 }, (_, i) => from + i * PITCH);

/** U1's pin rows and the coordinates where each row's pins end. */
function pinout(u: Rect) {
  return {
    side: pins(u.y + 40, u.y + u.h - 40),
    edge: pins(u.x + 50, u.x + u.w - 50),
    L: u.x - PIN,
    R: u.x + u.w + PIN,
    T: u.y - PIN,
    B: u.y + u.h + PIN,
  };
}

/** Horizontal, one 45° jog, horizontal. */
function hv(x0: number, y0: number, x1: number, y1: number, xm: number): Pt[] {
  const dir = Math.sign(x1 - x0);
  const dy = Math.abs(y1 - y0);
  return [
    [x0, y0],
    [xm, y0],
    [xm + dir * dy, y1],
    [x1, y1],
  ];
}

/** Vertical, one 45° jog, vertical. */
function vh(x0: number, y0: number, x1: number, y1: number, ym: number): Pt[] {
  const dir = Math.sign(y1 - y0);
  const dx = Math.abs(x1 - x0);
  return [
    [x0, y0],
    [x0, ym],
    [x1, ym + dir * dx],
    [x1, y1],
  ];
}

const d = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/* A route from a U1 pin to a part, ending on a via. `pulse` sends a signal
   along it; the delay staggers them. */
type Pulse = "cyan" | "magenta" | "green";
type Trace = { pts: Pt[]; pulse?: Pulse; delay?: number };

const PULSE_COLOR: Record<Pulse, string> = {
  cyan: "var(--wire-cyan)",
  magenta: "var(--wire-magenta)",
  green: "var(--wire-green)",
};

/** Pins fanning up (or down) to targets on a line, outer lines jogging first
    so the fan never crosses itself. */
function fan(x0s: number[], x1s: number[], y0: number, y1: number): Pt[][] {
  const dir = Math.sign(y1 - y0);
  return x0s.map((x0, i) =>
    vh(x0, y0, x1s[i], y1, y1 - dir * (Math.abs(x1s[i] - x0) + 6)),
  );
}

/* ---------------------------------------------------------------------------
   Parts
   --------------------------------------------------------------------------- */

function Label({ x, y, children, anchor = "start" }: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="board-label">
      {children}
    </text>
  );
}

function Via({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5.5} fill={INK} />
      <circle cx={x} cy={y} r={2} fill={BG} />
    </g>
  );
}

function Led({ x, y, color, delay = 0, steady = false }: {
  x: number;
  y: number;
  color: "red" | "green";
  delay?: number;
  steady?: boolean;
}) {
  const fill = color === "red" ? "var(--led-red)" : "var(--led-green)";
  /* A surface-mount LED: a black bezel that stays put, and a lit core with a
     faint bloom and a pinpoint highlight that dims when it blinks. */
  return (
    <g>
      <rect x={x - 6} y={y - 3.5} width={12} height={7} rx={3.5} fill={INK} />
      <g
        className={steady ? undefined : "board-led"}
        style={steady ? undefined : { animationDelay: `${delay}s` }}
      >
        <rect x={x - 8} y={y - 5} width={16} height={10} rx={5} fill={fill} opacity={0.18} />
        <rect x={x - 4.5} y={y - 2} width={9} height={4} rx={2} fill={fill} />
        <rect x={x - 2.5} y={y - 1.2} width={3.5} height={1.1} rx={0.55} fill="#fff" opacity={0.75} />
      </g>
    </g>
  );
}

/** A black IC with pins down both sides. */
function Chip({ x, y, w, h, name, sub, pinsPerSide = 3 }: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  sub?: string;
  pinsPerSide?: number;
}) {
  const step = h / (pinsPerSide + 1);
  return (
    <g>
      {Array.from({ length: pinsPerSide }, (_, i) => {
        const py = y + step * (i + 1);
        return (
          <g key={i} stroke={INK} strokeWidth={3}>
            <line x1={x - 10} y1={py} x2={x} y2={py} />
            <line x1={x + w} y1={py} x2={x + w + 10} y2={py} />
          </g>
        );
      })}
      <rect x={x} y={y} width={w} height={h} fill={INK} />
      <circle cx={x + 9} cy={y + 9} r={3} fill={BG} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -2 : 5)} textAnchor="middle" className="board-chip">
        {name}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="board-chip-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

/** Marketing-site wireframe in a browser frame. */
function Browser({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const bar = 24;
  const body = y + bar;
  return (
    <g stroke={INK} fill="none" strokeWidth={1.5}>
      <rect x={x} y={y} width={w} height={h} fill={BG} strokeWidth={2.5} />
      <line x1={x} y1={body} x2={x + w} y2={body} />
      <Led x={x + 14} y={y + 12} color="red" steady />
      <rect x={x + 26} y={y + 8.5} width={12} height={7} rx={3.5} fill={INK} stroke="none" />
      <Led x={x + 50} y={y + 12} color="green" delay={0.7} />
      <rect x={x + 70} y={y + 6} width={w - 84} height={12} strokeWidth={1} />
      {/* Nav */}
      <rect x={x + 12} y={body + 12} width={34} height={10} fill={INK} stroke="none" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + w - 124 + i * 28} y1={body + 17} x2={x + w - 106 + i * 28} y2={body + 17} />
      ))}
      {/* Hero: image placeholder against a headline and a button. */}
      <rect x={x + 12} y={body + 34} width={w * 0.46} height={86} />
      <line x1={x + 12} y1={body + 34} x2={x + 12 + w * 0.46} y2={body + 120} strokeWidth={1} />
      <line x1={x + 12 + w * 0.46} y1={body + 34} x2={x + 12} y2={body + 120} strokeWidth={1} />
      <rect x={x + w * 0.54} y={body + 40} width={w * 0.38} height={12} fill={INK} stroke="none" />
      <rect x={x + w * 0.54} y={body + 58} width={w * 0.28} height={12} fill={INK} stroke="none" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={x + w * 0.54} y1={body + 82 + i * 8} x2={x + w * 0.9} y2={body + 82 + i * 8} strokeWidth={1} />
      ))}
      <rect x={x + w * 0.54} y={body + 106} width={58} height={14} fill={INK} stroke="none" />
      {/* Cards */}
      {[0, 1, 2].map((i) => {
        const cw = (w - 48) / 3;
        const cx = x + 12 + i * (cw + 12);
        return (
          <g key={i}>
            <rect x={cx} y={body + 132} width={cw} height={h - bar - 144} />
            <line x1={cx + 8} y1={body + 144} x2={cx + cw - 16} y2={body + 144} strokeWidth={3} />
            <line x1={cx + 8} y1={body + 154} x2={cx + cw - 8} y2={body + 154} strokeWidth={1} />
          </g>
        );
      })}
    </g>
  );
}

/** Web-app dashboard: sidebar, KPI tiles, a line chart, a bar chart. */
function Dashboard({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const side = 62;
  const cx = x + side + 12;
  const cw = w - side - 24;
  return (
    <g stroke={INK} fill="none" strokeWidth={1.5}>
      <rect x={x} y={y} width={w} height={h} fill={BG} strokeWidth={2.5} />
      <rect x={x} y={y} width={side} height={h} fill={INK} stroke="none" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={x + 12}
          y1={y + 30 + i * 22}
          x2={x + side - 14}
          y2={y + 30 + i * 22}
          stroke={i === 1 ? "var(--led-green)" : BG}
          strokeWidth={i === 1 ? 4 : 2}
        />
      ))}
      <line x1={x + side} y1={y + 30} x2={x + w} y2={y + 30} />
      <rect x={cx} y={y + 10} width={70} height={10} fill={INK} stroke="none" />
      <Led x={x + w - 18} y={y + 15} color="red" delay={1.2} />
      {/* KPI tiles */}
      {[0, 1, 2].map((i) => {
        const tw = (cw - 16) / 3;
        return (
          <g key={i}>
            <rect x={cx + i * (tw + 8)} y={y + 42} width={tw} height={40} />
            <line x1={cx + i * (tw + 8) + 8} y1={y + 54} x2={cx + i * (tw + 8) + 40} y2={y + 54} strokeWidth={1} />
            <line x1={cx + i * (tw + 8) + 8} y1={y + 70} x2={cx + i * (tw + 8) + tw - 20} y2={y + 70} strokeWidth={5} />
          </g>
        );
      })}
      {/* Line chart */}
      <rect x={cx} y={y + 94} width={cw * 0.6} height={h - 106} />
      <polyline
        strokeWidth={2.5}
        points={[0.02, 0.7, 0.14, 0.55, 0.26, 0.62, 0.38, 0.4, 0.5, 0.46, 0.62, 0.25, 0.74, 0.32, 0.86, 0.14, 0.98, 0.18]
          .reduce<string[]>((acc, v, i, a) => {
            if (i % 2) acc.push(`${cx + a[i - 1] * cw * 0.6},${y + 94 + v * (h - 106)}`);
            return acc;
          }, [])
          .join(" ")}
      />
      {/* Bars */}
      <rect x={cx + cw * 0.6 + 8} y={y + 94} width={cw * 0.4 - 8} height={h - 106} />
      {[0.5, 0.75, 0.35, 0.9, 0.6].map((v, i) => {
        const bw = (cw * 0.4 - 8 - 12) / 5;
        const bh = (h - 106 - 16) * v;
        return (
          <rect
            key={i}
            x={cx + cw * 0.6 + 14 + i * bw}
            y={y + h - 20 - bh}
            width={bw - 5}
            height={bh}
            fill={INK}
            stroke="none"
          />
        );
      })}
    </g>
  );
}

function Phone({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g stroke={INK} fill="none" strokeWidth={1.5}>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={BG} strokeWidth={2.5} />
      <rect x={x + w / 2 - 16} y={y + 8} width={32} height={6} rx={3} fill={INK} stroke="none" />
      <rect x={x + 10} y={y + 26} width={w - 20} height={60} />
      <line x1={x + 10} y1={y + 26} x2={x + w - 10} y2={y + 86} strokeWidth={1} />
      <line x1={x + w - 10} y1={y + 26} x2={x + 10} y2={y + 86} strokeWidth={1} />
      <rect x={x + 10} y={y + 96} width={w * 0.7} height={9} fill={INK} stroke="none" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + 10} y1={y + 116 + i * 9} x2={x + w - 14} y2={y + 116 + i * 9} strokeWidth={1} />
      ))}
      <rect x={x + 10} y={y + h - 44} width={w - 20} height={18} fill={INK} stroke="none" />
      <Led x={x + w - 18} y={y + h - 14} color="green" delay={2.6} />
    </g>
  );
}

function Database({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const ry = 14;
  return (
    <g stroke={INK} fill={BG} strokeWidth={2}>
      <path d={`M${x} ${y + ry} V${y + h - ry} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + h - ry} V${y + ry}`} />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} />
      {[1, 2].map((i) => (
        <path
          key={i}
          fill="none"
          d={`M${x} ${y + ry + (i * (h - 2 * ry)) / 3} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry + (i * (h - 2 * ry)) / 3}`}
        />
      ))}
      <Led x={x + w - 16} y={y + h - 22} color="red" delay={0.3} />
    </g>
  );
}

function Resistor({ x, y, vertical = false }: { x: number; y: number; vertical?: boolean }) {
  const zig: Pt[] = [[0, 0], [12, 0], [15, -7], [21, 7], [27, -7], [33, 7], [39, -7], [42, 0], [54, 0]];
  const pts = zig.map(([a, b]) => (vertical ? [x + b, y + a] : [x + a, y + b]) as Pt);
  return <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={INK} strokeWidth={2} />;
}

function Capacitor({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={2}>
      <line x1={x} y1={y} x2={x + 16} y2={y} />
      <line x1={x + 16} y1={y - 11} x2={x + 16} y2={y + 11} strokeWidth={3} />
      <line x1={x + 23} y1={y - 11} x2={x + 23} y2={y + 11} strokeWidth={3} />
      <line x1={x + 23} y1={y} x2={x + 39} y2={y} />
    </g>
  );
}

/** A dimension line with end ticks and a centred measure. */
function Dimension({ x0, x1, y, label }: { x0: number; x1: number; y: number; label: string }) {
  const mid = (x0 + x1) / 2;
  return (
    <g stroke={INK} strokeWidth={1} opacity={0.7}>
      <line x1={x0} y1={y - 8} x2={x0} y2={y + 8} />
      <line x1={x1} y1={y - 8} x2={x1} y2={y + 8} />
      <line x1={x0} y1={y} x2={mid - 34} y2={y} />
      <line x1={mid + 34} y1={y} x2={x1} y2={y} />
      <path d={`M${x0} ${y} l8 -4 v8 Z M${x1} ${y} l-8 -4 v8 Z`} fill={INK} stroke="none" />
      <text x={mid} y={y + 4} textAnchor="middle" className="board-label" stroke="none">
        {label}
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------------------
   Wide sheet — 1600 × 800, for landscape screens.
   --------------------------------------------------------------------------- */

const WIDE = { w: 1600, h: 800, u1: { x: 430, y: 200, w: 740, h: 400 } };
const { side: LEFT_PINS, edge: TOP_PINS, L, R, T, B } = pinout(WIDE.u1);

/* Top fan: ten pins centred on U1 converge on the route header's pads. */
const TOP_FAN = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].map((pin, n) => ({
  x0: TOP_PINS[pin],
  x1: 800 + (n - 4.5) * 48,
}));
const J1_Y = 108;
/* Bottom: six pins down to the bus connector. */
const BOTTOM_FAN = [5, 7, 9, 11, 13, 15].map((pin, n) => ({
  x0: TOP_PINS[pin],
  x1: 800 + (n - 2.5) * 56,
}));
const J2_Y = 658;

const WIDE_TRACES: Trace[] = [
  // Left: three-line bus up into the site wireframe.
  ...[0, 1, 2].map((i) => ({
    pts: hv(L, LEFT_PINS[i], 300, 184 + i * 24, 404 - i * 10),
    pulse: i === 1 ? ("cyan" as const) : undefined,
    delay: 0.4,
  })),
  // Left: into the API chip's pins.
  ...[4, 5, 6].map((i, n) => ({
    pts: hv(L, LEFT_PINS[i], 356, 372 + n * 22, 398 - n * 8),
  })),
  // Left: long run down to the database.
  ...[8, 9].map((i, n) => ({
    pts: hv(L, LEFT_PINS[i], 238, 600 + n * 22, 392 - n * 14),
    pulse: n === 0 ? ("magenta" as const) : undefined,
    delay: 1.6,
  })),
  // Right: bus up into the phone.
  ...[0, 1, 2].map((i) => ({
    pts: hv(R, LEFT_PINS[i], 1340, 150 + i * 24, 1196 + i * 10),
    pulse: i === 2 ? ("green" as const) : undefined,
    delay: 2.2,
  })),
  // Right: into the CDN chip's pins.
  ...[4, 5].map((i, n) => ({
    pts: hv(R, LEFT_PINS[i], 1240, 374 + n * 22, 1200 + n * 8),
  })),
  // Right: down into the dashboard.
  ...[7, 8, 9].map((i, n) => ({
    pts: hv(R, LEFT_PINS[i], 1262, 520 + n * 22, 1204 + n * 10),
    pulse: n === 1 ? ("cyan" as const) : undefined,
    delay: 0.9,
  })),
  // Top: fan up to J1. Outer lines jog first, so the fan never crosses.
  ...TOP_FAN.map(({ x0, x1 }, n) => ({
    pts: vh(x0, T, x1, J1_Y, J1_Y + Math.abs(x1 - x0) + 6),
    pulse: n === 2 ? ("magenta" as const) : n === 7 ? ("cyan" as const) : undefined,
    delay: n * 0.3,
  })),
  // Bottom: down to J2.
  ...BOTTOM_FAN.map(({ x0, x1 }) => ({
    pts: vh(x0, B, x1, J2_Y, J2_Y - Math.abs(x1 - x0) - 6),
  })),
];

/* Short part-to-part links that don't touch U1, so no part floats free. */
const WIDE_LOCAL: Pt[][] = [
  [[240, 394], [214, 394]], // API → resistor
  hv(240, 416, 175, 448, 207), // API → capacitor
  [[1040, 86], [1100, 86]], // J1 → CMS
  [[1208, 86], [1300, 86], [1320, 106], [1320, 126]], // CMS → phone
  [[1386, 197], [1406, 197]], // phone → AUTH
  [[1386, 219], [1406, 219]],
  [[1370, 374], [1396, 374]], // CDN → resistor
  hv(1370, 396, 1410, 430, 1376), // CDN → capacitor
];


/* ---------------------------------------------------------------------------
   Tall sheet — 800 × 1020, for portrait screens. The site, API, and phone
   sit above U1; the data, edge, and dashboard below it.
   --------------------------------------------------------------------------- */

const TALL = { w: 800, h: 1020, u1: { x: 70, y: 350, w: 660, h: 340 } };
const TP = pinout(TALL.u1);

const TALL_TRACES: Trace[] = [
  // Up into the site wireframe.
  ...fan([0, 1, 2].map((i) => TP.edge[i]), [136, 164, 192], TP.T, 298).map((pts, n) => ({
    pts,
    pulse: n === 1 ? ("cyan" as const) : undefined,
    delay: 0.4,
  })),
  // Up into the API chip.
  ...fan([8, 9, 10].map((i) => TP.edge[i]), [410, 440, 470], TP.T, 210).map((pts, n) => ({
    pts,
    pulse: n === 0 ? ("magenta" as const) : undefined,
    delay: 1.3,
  })),
  // Up into the phone.
  ...fan([15, 16, 17].map((i) => TP.edge[i]), [630, 656, 682], TP.T, 292).map((pts, n) => ({
    pts,
    pulse: n === 2 ? ("green" as const) : undefined,
    delay: 2.2,
  })),
  // Down to the database.
  ...fan([0, 1].map((i) => TP.edge[i]), [90, 120], TP.B, 752).map((pts, n) => ({
    pts,
    pulse: n === 0 ? ("magenta" as const) : undefined,
    delay: 1.8,
  })),
  // Down to the CDN chip.
  ...fan([4, 5, 6].map((i) => TP.edge[i]), [245, 275, 305], TP.B, 764).map((pts) => ({ pts })),
  // Down into the dashboard.
  ...fan([10, 12, 14, 16].map((i) => TP.edge[i]), [450, 520, 590, 660], TP.B, 744).map(
    (pts, n) => ({
      pts,
      pulse: n === 1 ? ("cyan" as const) : undefined,
      delay: 0.9,
    }),
  ),
  // Side pins out to the frame.
  ...[1, 3, 5, 7].flatMap((i) => [
    { pts: [[TP.L, TP.side[i]], [40, TP.side[i]]] as Pt[] },
    { pts: [[TP.R, TP.side[i]], [TALL.w - 40, TP.side[i]]] as Pt[] },
  ]),
];

const TALL_LOCAL: Pt[][] = [
  [[334, 160], [382, 160]], // site → API
  [[498, 160], [510, 160]], // API → resistor
  [[564, 160], [612, 160]], // resistor → phone
  [[498, 181], [506, 181], [506, 236], [520, 236]], // API → capacitor
  [[170, 794], [210, 794]], // database → CDN
  [[340, 794], [400, 794]], // CDN → dashboard
  [[275, 838], [275, 880]], // CDN → AUTH
];

/* ---------------------------------------------------------------------------
   Shared sheet furniture
   --------------------------------------------------------------------------- */

/** Drawing frame with zone references, as on an engineering sheet. */
function Frame({ w, h, cols, rows, dwg }: {
  w: number;
  h: number;
  cols: number;
  rows: number;
  dwg: string;
}) {
  return (
    <>
      <g stroke={INK} fill="none">
        <rect x={20} y={20} width={w - 40} height={h - 40} strokeWidth={2} />
        <rect x={34} y={34} width={w - 68} height={h - 68} strokeWidth={0.8} opacity={0.6} />
        {Array.from({ length: cols - 1 }, (_, i) => (
          <line key={`zx${i}`} x1={(w / cols) * (i + 1)} y1={20} x2={(w / cols) * (i + 1)} y2={34} strokeWidth={1} />
        ))}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <line key={`zy${i}`} x1={20} y1={(h / rows) * (i + 1)} x2={34} y2={(h / rows) * (i + 1)} strokeWidth={1} />
        ))}
      </g>
      {Array.from({ length: cols }, (_, i) => (
        <Label key={`n${i}`} x={(w / cols) * (i + 0.5)} y={31} anchor="middle">
          {String(i + 1)}
        </Label>
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <Label key={`r${i}`} x={27} y={(h / rows) * (i + 0.5) + 4} anchor="middle">
          {"ABCDEFGH"[i]}
        </Label>
      ))}
      <Label x={50} y={56}>{dwg}</Label>
    </>
  );
}

/** Traces under everything, so parts sit on top of their own wiring. */
function Wiring({ traces, local }: { traces: Trace[]; local: Pt[][] }) {
  return (
    <>
      <g fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
        {traces.map((t, i) => (
          <path key={i} d={d(t.pts)} />
        ))}
        {local.map((pts, i) => (
          <path key={`l${i}`} d={d(pts)} strokeWidth={2} />
        ))}
      </g>
      {/* Signal pulses: a neon comet in four strokes riding the same dash —
          two soft blooms, the coloured core, and a white-hot centre. Wide
          translucent strokes instead of a blur filter, so it costs nothing
          to animate and looks the same in every browser. */}
      <g fill="none" strokeLinecap="round">
        {traces.filter((t) => t.pulse).map((t, i) => (
          <g key={i} style={{ animationDelay: `${t.delay ?? 0}s` }}>
            {(
              [
                [16, 0.2, PULSE_COLOR[t.pulse!]],
                [8, 0.42, PULSE_COLOR[t.pulse!]],
                [3.6, 1, PULSE_COLOR[t.pulse!]],
                [1.3, 0.95, "#fff"],
              ] as const
            ).map(([width, opacity, stroke]) => (
              <path
                key={width}
                d={d(t.pts)}
                pathLength={100}
                className="board-pulse"
                stroke={stroke}
                strokeWidth={width}
                opacity={opacity}
                style={{ animationDelay: `${t.delay ?? 0}s` }}
              />
            ))}
          </g>
        ))}
      </g>
      {traces.map((t, i) => {
        const [x, y] = t.pts[t.pts.length - 1];
        return <Via key={i} x={x} y={y} />;
      })}
    </>
  );
}

/** U1: the keep-out, its pins, and the mark. Filled so the grid and traces
    stop at its edge. */
function KeepOut({ u, logoSrc, logoW }: { u: Rect; logoSrc: string; logoW: number }) {
  const { side, edge, L, R, T, B } = pinout(u);
  const logoH = logoW / LOGO_RATIO;
  return (
    <g>
      <g stroke={INK} strokeWidth={3}>
        {side.map((y) => (
          <g key={`p${y}`}>
            <line x1={L} y1={y} x2={u.x} y2={y} />
            <line x1={u.x + u.w} y1={y} x2={R} y2={y} />
          </g>
        ))}
        {edge.map((x) => (
          <g key={`q${x}`}>
            <line x1={x} y1={T} x2={x} y2={u.y} />
            <line x1={x} y1={u.y + u.h} x2={x} y2={B} />
          </g>
        ))}
      </g>
      <rect x={u.x} y={u.y} width={u.w} height={u.h} fill={BG} stroke={INK} strokeWidth={3} />
      <rect
        x={u.x + 12}
        y={u.y + 12}
        width={u.w - 24}
        height={u.h - 24}
        fill="none"
        stroke={INK}
        strokeWidth={1}
        strokeDasharray="6 6"
        opacity={0.55}
      />
      <circle cx={u.x + 30} cy={u.y + 30} r={6} fill={INK} />
      <Label x={u.x + 44} y={u.y + 34}>U1 · 2ZERO2</Label>
      <Label x={u.x + u.w - 24} y={u.y + u.h - 24} anchor="end">
        DIGITAL DESIGN · EST. 2022
      </Label>
      <Led x={u.x + u.w - 30} y={u.y + 30} color="green" delay={0.5} />
      <Led x={u.x + u.w - 54} y={u.y + 30} color="red" steady />
      <image
        href={logoSrc}
        x={u.x + (u.w - logoW) / 2}
        y={u.y + (u.h - logoH) / 2}
        width={logoW}
        height={logoH}
      />
    </g>
  );
}

/* ---------------------------------------------------------------------------
   The two sheets
   --------------------------------------------------------------------------- */

function WideSheet({ logoSrc }: { logoSrc: string }) {
  const { w, h, u1 } = WIDE;
  return (
    <>
      <Frame w={w} h={h} cols={8} rows={4} dwg="2ZERO2 · DWG 2Z-001 · REV C" />
      <Label x={w - 50} y={h - 46} anchor="end">SCALE 1:1 · SHEET 01 OF 01</Label>
      <Wiring traces={WIDE_TRACES} local={WIDE_LOCAL} />

      {/* Left side of the board: what visitors see, and what feeds it. */}
      <Label x={96} y={142}>SITE.01 — MARKETING</Label>
      <Browser x={96} y={152} w={256} h={196} />
      <Chip x={250} y={350} w={96} h={88} name="API" sub="REST · v1" pinsPerSide={3} />
      <Resistor x={160} y={394} />
      <Capacitor x={136} y={448} />
      <Label x={128} y={540}>DB.04 — DATA</Label>
      <Database x={128} y={552} w={110} h={120} />

      {/* Right side: the app, the phone, the edge. */}
      <Label x={1270} y={116}>MOB.03 — APP</Label>
      <Phone x={1270} y={126} w={116} h={214} />
      <Chip x={1416} y={176} w={96} h={64} name="AUTH" pinsPerSide={2} />
      <Chip x={1250} y={352} w={110} h={66} name="CDN" sub="EDGE" pinsPerSide={2} />
      <Resistor x={1396} y={374} />
      <Capacitor x={1410} y={430} />
      <Label x={1250} y={490}>APP.02 — DASHBOARD</Label>
      <Dashboard x={1250} y={500} w={292} h={196} />

      {/* Top: the route header. */}
      <g>
        <rect x={560} y={70} width={480} height={34} fill={INK} />
        {TOP_FAN.map(({ x1 }) => (
          <rect key={x1} x={x1 - 8} y={81} width={16} height={12} fill={BG} />
        ))}
        <Label x={548} y={84} anchor="end">J1 — ROUTES</Label>
        <Label x={548} y={98} anchor="end">/ · /WORK · /CONTACT</Label>
        <Led x={1060} y={87} color="green" delay={1.1} />
        <Chip x={1110} y={64} w={88} h={44} name="CMS" pinsPerSide={1} />
      </g>

      {/* Bottom: the bus connector and the build width. */}
      <g>
        <rect x={636} y={664} width={328} height={22} fill={INK} />
        {BOTTOM_FAN.map(({ x1 }) => (
          <circle key={x1} cx={x1} cy={675} r={4} fill={BG} />
        ))}
        <Label x={636} y={708}>J2 — BUILD · TEST · DEPLOY</Label>
        <Led x={984} y={675} color="red" delay={2.0} />
        <Led x={1010} y={675} color="green" delay={0.2} />
      </g>
      <Dimension x0={u1.x} x1={u1.x + u1.w} y={740} label="1440 PX" />

      <KeepOut u={u1} logoSrc={logoSrc} logoW={590} />
    </>
  );
}

function TallSheet({ logoSrc }: { logoSrc: string }) {
  const { w, h, u1 } = TALL;
  return (
    <>
      <Frame w={w} h={h} cols={4} rows={5} dwg="2ZERO2 · DWG 2Z-002 · REV C" />
      <Wiring traces={TALL_TRACES} local={TALL_LOCAL} />

      {/* Above U1: what visitors see. */}
      <Label x={44} y={86}>SITE.01 — MARKETING</Label>
      <Browser x={44} y={96} w={290} h={196} />
      <Chip x={392} y={118} w={96} h={84} name="API" sub="REST · v1" pinsPerSide={3} />
      <Resistor x={510} y={160} />
      <Capacitor x={520} y={236} />
      <Label x={612} y={62}>MOB.03 — APP</Label>
      <Phone x={612} y={70} w={124} h={214} />

      {/* Below U1: what keeps it running. */}
      <Database x={50} y={760} w={120} h={140} />
      <Label x={50} y={926}>DB.04 — DATA</Label>
      <Chip x={220} y={772} w={110} h={66} name="CDN" sub="EDGE" pinsPerSide={2} />
      <Chip x={220} y={880} w={110} h={56} name="AUTH" pinsPerSide={2} />
      <Dashboard x={400} y={752} w={346} h={200} />
      <Label x={400} y={976}>APP.02 — DASHBOARD</Label>
      <Led x={700} y={976} color="red" delay={2.0} />
      <Led x={726} y={976} color="green" delay={0.2} />

      <KeepOut u={u1} logoSrc={logoSrc} logoW={540} />
    </>
  );
}

const ARIA =
  "2zero2 — a circuit-board blueprint of websites, web apps, and the services behind them";

export default function Schematic({
  logoSrc,
  layout = "wide",
}: {
  logoSrc: string;
  layout?: "wide" | "tall";
}) {
  const sheet = layout === "wide" ? WIDE : TALL;
  return (
    <svg
      viewBox={`0 0 ${sheet.w} ${sheet.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={ARIA}
    >
      {layout === "wide" ? <WideSheet logoSrc={logoSrc} /> : <TallSheet logoSrc={logoSrc} />}
    </svg>
  );
}
