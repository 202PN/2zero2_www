import type { CSSProperties } from "react";

/**
 * A photographic plate: grain overlay, and a scroll-linked scale driven by
 * the single rAF loop in useLenis (via the `data-plate` hook). With `video`,
 * a muted loop plays over the image; the image stays as poster, alt text,
 * and the reduced-motion fallback.
 */
export default function Plate({
  src,
  alt,
  video,
  className = "",
  imgClassName = "",
  priority = false,
  style,
}: {
  src: string;
  alt: string;
  video?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      data-plate
      className={`grain relative overflow-hidden bg-elevated ${className}`}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`plate-img h-full w-full object-cover ${imgClassName}`}
      />
      {video && (
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className={`plate-img plate-video absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
