/**
 * The globe badge — arched wordmark over a wireframe globe over DIGITAL
 * DESIGN.
 *
 * Painted as a mask tinted by `currentColor` rather than as an <img>: the
 * source art has a periwinkle globe and a fixed-colour wordmark, and the
 * system allows one chroma. This way a single asset follows both prints and
 * inherits whatever colour it is placed in.
 */
export default function GlobeMark({
  className = "",
  label = "2zero2 — digital design",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span className={`globe-mark ${className}`} role="img" aria-label={label} />
  );
}
