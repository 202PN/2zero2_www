import type { CSSProperties } from "react";

/**
 * A photographic plate: grain overlay, and a scroll-linked scale driven by
 * the single rAF loop in useLenis (via the `data-plate` hook).
 */
export default function Plate({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  style,
}: {
  src: string;
  alt: string;
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
    </div>
  );
}
