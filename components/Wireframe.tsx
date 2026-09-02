/**
 * A hand-drawn browser wireframe, floating in the cloud plate.
 *
 * The concept is literal: wireframes are the first thing listed under Brand &
 * launch kits, so the hero shows the studio's own first deliverable sketched
 * into the sky rather than a stock device mockup.
 *
 * Every rule is a shallow quadratic rather than a straight line, and joins are
 * rounded, so it reads as drawn by hand against the machined type around it.
 * Structure inherits `currentColor` and follows the theme; the annotation is
 * Signal, which is the one place the brand yellow behaves like a red pen.
 */
export default function Wireframe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Window frame and chrome. */}
        <path d="M19 17 Q210 14 401 17 Q404 160 401 291 Q210 294 19 291 Q16 160 19 17 Z" />
        <path d="M19 62 Q210 59 401 62" />
        <circle cx="45" cy="39" r="7" />
        <circle cx="66" cy="39" r="7" />
        <circle cx="87" cy="39" r="7" />
        <path d="M120 29 Q225 26 330 29 Q332 40 330 51 Q225 54 120 51 Q118 40 120 29 Z" />

        {/* The mark, sketched in where the real page carries it. */}
        <text
          x="48"
          y="112"
          stroke="none"
          fill="currentColor"
          style={{ fontFamily: "var(--font-script)", fontSize: "36px" }}
        >
          2zero2
        </text>

        {/* Copy rules. */}
        <path d="M48 133 Q174 130 300 133" opacity="0.75" />
        <path d="M48 153 Q158 150 268 153" opacity="0.75" />
        <path d="M48 173 Q168 170 288 173" opacity="0.75" />
        <path d="M48 256 Q174 253 300 256" opacity="0.75" />
        <path d="M48 276 Q152 273 255 276" opacity="0.75" />

        {/* The element under review, hatched. */}
        <path d="M48 197 Q112 194 176 197 Q178 215 176 233 Q112 236 48 233 Q46 215 48 197 Z" />
        <g opacity="0.55" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${56 + i * 19} 233 L${76 + i * 19} 197`} />
          ))}
        </g>

        {/* Sidebar. */}
        <path d="M274 93 Q326 90 378 93 Q380 158 378 223 Q326 226 274 223 Q272 158 274 93 Z" />
        <path d="M274 126 Q326 123 378 126" opacity="0.75" />
        <path d="M274 158 Q326 155 378 158" opacity="0.75" />
        <path d="M274 191 Q326 188 378 191" opacity="0.75" />
      </g>

      {/* Annotation — the red-pen pass, in the brand's yellow. */}
      <g
        stroke="var(--color-signal)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M44 214 Q40 189 112 186 Q186 189 190 213 Q186 240 112 243 Q42 240 44 214" />
        <path d="M258 258 Q230 252 205 238" />
        <path d="M205 238 L219 240 M205 238 L212 250" />
        <g strokeWidth="2">
          <path d="M276 250 q9 -7 18 0 t18 0 t18 0" />
          <path d="M276 268 q9 -7 18 0 t18 0 t18 0" />
          <path d="M276 286 q9 -7 18 0 t18 0" />
        </g>
      </g>
    </svg>
  );
}
