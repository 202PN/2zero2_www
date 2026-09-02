/**
 * Construction-line texture: frame diagonals, an inscribed diamond, and an
 * inset frame. Replaces the square grid over photography — a rectilinear grid
 * fights a photograph, where lines converging on the centre agree with it and
 * point at whatever the composition is built around.
 *
 * `preserveAspectRatio="none"` is deliberate: the geometry stretches to the
 * container, so the diamond widens on a landscape hero and stands up on a
 * phone, always meeting the edge midpoints. Strokes stay hairline regardless
 * via `vectorEffect`.
 */
export default function GeoField({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="var(--grid-line)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        {/* Corner to corner. */}
        <path d="M0 0 L100 100 M100 0 L0 100" />
        {/* Diamond on the edge midpoints. */}
        <path d="M50 0 L100 50 L50 100 L0 50 Z" />
        {/* Inset frame, cropped by the diamond's reach. */}
        <rect x="12" y="12" width="76" height="76" />
        {/* Half-scale diamond, so the centre keeps some structure. */}
        <path d="M50 26 L74 50 L50 74 L26 50 Z" />
      </g>
    </svg>
  );
}
