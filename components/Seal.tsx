const RING_TEXT = "2ZERO2 · DIGITAL AGENCY · WASHINGTON DC · EST. 2024 · ";

/**
 * Circular stamp — caps set around the ring against the wordmark's script in
 * the middle, which is the bold/script contrast at its smallest scale.
 *
 * The only saturated fill on the site (see DESIGN.md, The One Percent Rule):
 * it is a small asset, and the yellow is the logo's own.
 */
export default function Seal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="2zero2 — digital agency, Washington DC, established 2024"
    >
      <defs>
        {/* Inset from the edge, and started at the bottom so the text reads
            from the left of the ring. */}
        <path
          id="seal-ring"
          d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
          fill="none"
        />
      </defs>

      <circle cx="100" cy="100" r="100" fill="var(--color-signal)" />

      <g className="seal-rotate">
        <text
          fill="var(--color-ink)"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13.5px",
            letterSpacing: "0.24em",
          }}
        >
          <textPath href="#seal-ring" startOffset="0">
            {RING_TEXT.repeat(2)}
          </textPath>
        </text>
      </g>

      {/* Hairline inner ring, as on a stamped seal. */}
      <circle cx="100" cy="100" r="58" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />

      <text
        x="100"
        y="103"
        textAnchor="middle"
        fill="var(--color-ink)"
        style={{ fontFamily: "var(--font-script)", fontSize: "40px" }}
      >
        2zero2
      </text>
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fill="var(--color-ink)"
        style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.2em" }}
      >
        TRD · MRK
      </text>
    </svg>
  );
}
