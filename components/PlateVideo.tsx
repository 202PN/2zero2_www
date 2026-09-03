import type { CSSProperties } from "react";

/**
 * The photographic plate, moving. Same treatment as `Plate` — grain overlay
 * and the scroll-linked scale driven by the rAF loop in useLenis — with a
 * looping clip in place of the still.
 *
 * Both the clip and its poster ship, and CSS picks one: under
 * `prefers-reduced-motion` the video is hidden and the still shows instead, so
 * the choice needs no JavaScript and cannot flash. The poster is the clip's
 * own first frame, so there is no jump when playback starts.
 *
 * `srcNarrow` is an optional portrait crop for phones, chosen by the `media`
 * attribute on the first <source>. A 16:9 clip cover-cropped into a tall
 * viewport shows about a quarter of its width, which reads as a grey smear;
 * the portrait cut shows nearly two thirds. Only the matching source is
 * downloaded. Browsers evaluate `media` once, at load, so a device that
 * rotates keeps whichever clip it started with — acceptable for a background.
 */
export default function PlateVideo({
  src,
  srcNarrow,
  poster,
  alt,
  className = "",
  style,
}: {
  src: string;
  srcNarrow?: string;
  poster: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-plate
      role="img"
      aria-label={alt}
      className={`grain relative overflow-hidden bg-elevated ${className}`}
      style={style}
    >
      <video
        className="plate-img motion-only h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        {srcNarrow && (
          <source src={srcNarrow} media="(max-width: 767px)" type="video/mp4" />
        )}
        <source src={src} type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="plate-img motion-still h-full w-full object-cover"
      />
    </div>
  );
}
