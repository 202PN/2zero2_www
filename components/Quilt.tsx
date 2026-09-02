/**
 * Quilted lattice: diagonals crossing into diamonds, with "202" set in the
 * bitmap face at every crossing where a quilt would carry a stitch point.
 *
 * Tiled at a fixed size in user space rather than stretched to the container,
 * so the diamonds stay square on any viewport instead of shearing — the
 * opposite choice to the construction lines this replaces, which wanted to
 * meet the frame's edge midpoints.
 *
 * The mark is drawn at the tile centre and at all four corners; the corner
 * copies are clipped by the tile and reassemble across neighbours, so the
 * lattice reads continuously with no seam.
 */
export default function Quilt({ className = "" }: { className?: string }) {
  const S = 124; // tile edge
  const half = S / 2;
  const mark = (x: number, y: number) => (
    <text
      key={`${x}-${y}`}
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="var(--grid-mark)"
      style={{ fontFamily: "var(--font-pixel)", fontSize: "9px" }}
    >
      202
    </text>
  );

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="quilt" width={S} height={S} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--grid-line)" strokeWidth="1">
            <path d={`M0 0 L${S} ${S} M${S} 0 L0 ${S}`} />
          </g>
          {mark(half, half)}
          {[
            [0, 0],
            [S, 0],
            [0, S],
            [S, S],
          ].map(([x, y]) => mark(x, y))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#quilt)" />
    </svg>
  );
}
