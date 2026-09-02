/**
 * The script wordmark. Both prints ship and CSS picks one, so the mark never
 * flashes the wrong colour while the theme is being applied.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/brand/2zero2_wordmark_white.svg"
        alt="2zero2"
        width={130}
        height={71}
        className={`on-dark ${className}`}
      />
      <img
        src="/brand/2zero2_wordmark_black.svg"
        alt=""
        aria-hidden="true"
        width={130}
        height={71}
        className={`on-light ${className}`}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </>
  );
}
