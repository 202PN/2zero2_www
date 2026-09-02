import Link from "next/link";
import GeoField from "@/components/GeoField";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-[100svh] flex-col justify-center"
      style={{ paddingInline: "var(--gutter)" }}
    >
      <GeoField className="opacity-60" />
      <p className="t-serif text-dim relative text-4xl">404</p>
      <h1 className="t-display mt-6" style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
        Nothing here
      </h1>
      <Link
        href="/"
        className="t-headline mt-10 w-fit border-b-2 border-b-paper pb-1 text-[1.4rem] hover:border-b-accent hover:text-accent"
      >
        Back to 2zero2
      </Link>
    </main>
  );
}
