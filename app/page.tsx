import Link from "next/link";
import Aperture from "@/components/Aperture";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Plate from "@/components/Plate";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SpecLabel from "@/components/SpecLabel";
import SiteChrome from "@/components/SiteChrome";
import Sun from "@/components/Sun";
import { ABOUT, BOOKING_URL, PROJECTS, SERVICES, STEPS } from "@/components/content";

const HERO_PLATE = "/brand/plate-hero.webp";
/* Module constant so the array identity is stable across renders and the
   aperture effect does not re-run. */
const INTRO_PRELOAD = [HERO_PLATE];

/** Section eyebrow — the numbered micro-label that opens every section. */
function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="t-label text-dim">
      ({n}) {children}
    </p>
  );
}

const MARQUEE = [
  "Web applications",
  "Marketing sites",
  "Redesign & rebuild",
  "Brand & launch kits",
  "Events & nightlife",
  "Support & iteration",
];

export default function Home() {
  return (
    <>
      <Aperture preload={INTRO_PRELOAD} />
      <SiteChrome />

      <main id="main">
        {/* ---------------------------------------------------------------
            Hero
            --------------------------------------------------------------- */}
        <section
          className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
          style={{ paddingInline: "var(--gutter)", paddingBottom: "clamp(3rem,7vh,6rem)" }}
        >
          {/* Full-bleed plate. This is what the aperture opens onto, so it
              has to sit in the first viewport and stay legible under type. */}
          <div className="absolute inset-0">
            <Plate
              src={HERO_PLATE}
              alt="Cloud formation, monochrome"
              className="h-full w-full"
              priority
            />
            {/* Scrim: light through the middle where the mark opens, solid
                at the bottom where the headline sits. */}
            <div
              className="absolute inset-0"
              style={{
                background: "var(--hero-scrim)",
              }}
            />
          </div>

          <Sun />

          <div className="intro-enter relative max-w-[62rem] pt-32">
            <p className="t-label text-dim">(00) Digital agency · Est. 2022</p>
            {/* The wordmark set in the display face — the script mark in the
                header and this are the same name in two registers. */}
            <h1 className="mt-7 flex flex-col">
              <span
                className="t-display"
                style={{ fontSize: "clamp(3.6rem, 13vw, 11rem)" }}
              >
                2zero2
              </span>
              {/* The logo's tagline, split across two registers: bitmap
                  against script, both against the display grotesque above. */}
              <span className="-mt-[0.12em] flex items-baseline gap-[0.3em] self-end pr-[0.06em] text-signal">
                <span
                  className="t-pixel"
                  style={{ fontSize: "clamp(1.35rem, 4.3vw, 3.4rem)" }}
                >
                  digital
                </span>
                <span
                  className="t-script"
                  style={{ fontSize: "clamp(2.7rem, 8.6vw, 6.9rem)" }}
                >
                  design
                </span>
              </span>
            </h1>
            <p className="t-body mt-9 max-w-[46ch] text-[1.05rem] text-paper/80">
              Web applications, marketing sites, and launch design.
            </p>
          </div>
        </section>

        {/* Capability ticker */}
        <section className="rule-t rule-b overflow-hidden py-6" aria-hidden="true">
          <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-12">
                {MARQUEE.map((item) => (
                  <span key={item} className="t-label flex items-center gap-12 text-dim">
                    {item}
                    <span className="text-signal">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Services
            --------------------------------------------------------------- */}
        <section
          id="services"
          className="scroll-mt-24"
          style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(5rem,11vw,9rem)" }}
        >
          <Reveal>
            <Eyebrow n="01">Index</Eyebrow>
            <h2
              className="t-headline mt-6 max-w-[16ch]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
            >
              Offerings
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.name} delay={(i % 3) * 70} className="h-full">
                <SpecLabel service={service} index={i} total={SERVICES.length} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Selected work
            --------------------------------------------------------------- */}
        <section
          id="work"
          className="scroll-mt-24"
          style={{ paddingInline: "var(--gutter)", paddingBottom: "clamp(5rem,11vw,9rem)" }}
        >
          <Reveal className="rule-b flex flex-wrap items-end justify-between gap-6 pb-8">
            <div>
              <Eyebrow n="02">Index</Eyebrow>
              <h2
                className="t-headline mt-6 max-w-[14ch]"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
              >
                Selected work
              </h2>
            </div>
            <Link href="/work" className="t-label text-dim hover:text-accent">
              All work →
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Studio
            --------------------------------------------------------------- */}
        <section id="studio" className="scroll-mt-24">
          <div className="relative">
            <Plate
              src="/brand/plate-band.webp"
              alt="Cloud formation, monochrome"
              className="h-[38vh] w-full min-h-[240px]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "var(--band-scrim)",
              }}
            />
            <span
              aria-hidden="true"
              className="t-display t-outline pointer-events-none absolute inset-0 flex items-center justify-center text-paper/35"
              style={{ fontSize: "clamp(2.4rem, 7vw, 7rem)", letterSpacing: "0.02em" }}
            >
              Two Zero Two
            </span>
          </div>
          <div
            style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(5rem,11vw,9rem)" }}
          >
            <Reveal>
              <Eyebrow n="03">Studio</Eyebrow>
            </Reveal>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              <Reveal>
                <h2
                  className="t-headline max-w-[19ch]"
                  style={{ fontSize: "clamp(1.85rem, 4.4vw, 3.3rem)" }}
                >
                  Your dedicated team for digital growth.
                </h2>
                <div className="mt-8 flex flex-col gap-6">
                  {ABOUT.map((line) => (
                    <p key={line} className="t-body max-w-[52ch] text-[1.05rem] text-paper/75">
                      {line}
                    </p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={100}>
                <ol className="rule-t">
                  {STEPS.map((step, i) => (
                    <li key={step.name} className="rule-b flex gap-6 py-6">
                      <span className="t-serif text-dim w-8 shrink-0 text-lg">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="t-headline text-[1.15rem]">{step.name}</h3>
                        <p className="t-body mt-2 max-w-[38ch] text-[0.95rem] text-dim">
                          {step.copy}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Contact
            --------------------------------------------------------------- */}
        <section
          id="contact"
          className="rule-t scroll-mt-24"
          style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(5rem,11vw,9rem)" }}
        >
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <Eyebrow n="04">Inquiries</Eyebrow>
              <h2
                className="t-headline mt-6 max-w-[12ch]"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
              >
                Start a project
              </h2>
              <p className="t-body mt-8 max-w-[38ch] text-dim">
                The people who scope your project are the people who build it.
                No account managers, no handoffs.
              </p>
              <a
                href={BOOKING_URL}
                className="t-label mt-8 inline-block border-b border-b-dim/50 pb-1 text-dim transition-colors hover:border-b-accent hover:text-accent"
              >
                Or book 30 minutes →
              </a>
            </Reveal>
            <Reveal delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
