import Link from "next/link";
import Aperture from "@/components/Aperture";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import Schematic from "@/components/Schematic";
import SpecLabel from "@/components/SpecLabel";
import SiteChrome from "@/components/SiteChrome";
import { BOOKING_URL, PROJECTS, SERVICES, STEPS } from "@/components/content";

const HERO_LOGO = "/brand/2zero2_wordmark_black.svg";
/* Module constant so the array identity is stable across renders and the
   aperture effect does not re-run. */
const INTRO_PRELOAD = [HERO_LOGO];

export default function Home() {
  return (
    <>
      <Aperture preload={INTRO_PRELOAD} />
      <SiteChrome />

      <main id="main">
        {/* ---------------------------------------------------------------
            Hero
            --------------------------------------------------------------- */}
        {/* The hero is the whole first screen. The board runs full-bleed
            under everything; the header above and the copy panel below are
            frosted glass laid over it, so the board keeps the space. */}
        <section className="board relative flex min-h-[100svh] flex-col">
          {/* What the aperture opens onto. Each sheet is fitted whole and
              centred (SVG `meet`) in the clear space between the header and
              the panel's overlap, so no part is ever cropped or under the
              glass; the section's grid carries on around it, and that is
              what the frosting blurs. Both sheets ship and CSS shows one by
              orientation, so a phone gets the portrait sheet. */}
          <div className="relative min-h-[45svh] flex-1">
            <div
              className="board-wide absolute inset-x-0"
              style={{ top: "var(--header-h)", bottom: "var(--panel-overlap)" }}
            >
              <Schematic logoSrc={HERO_LOGO} layout="wide" />
            </div>
            <div
              className="board-tall absolute inset-x-0"
              style={{ top: "var(--header-h)", bottom: "var(--panel-overlap)" }}
            >
              <Schematic logoSrc={HERO_LOGO} layout="tall" />
            </div>
          </div>

          <div
            className="frost intro-enter relative"
            style={{
              marginTop: "calc(-1 * var(--panel-overlap))",
              paddingInline: "var(--gutter)",
              paddingBlock: "clamp(1.5rem,4vh,3rem)",
            }}
          >
            <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              {/* Leads with what we do, plainly. */}
              <h1
                className="t-headline max-w-[22ch] text-balance"
                style={{ fontSize: "clamp(1.65rem, 3.4vw, 3.2rem)" }}
              >
                Design and development for websites and web apps
              </h1>
              <div>
                <p className="t-body max-w-[52ch] text-[0.95rem] text-paper/85 sm:text-[1rem]">
                  Marketing sites, web applications, rebuilds, and launch kits,
                  delivered through one defined process: scoped up front, built
                  in signed-off milestones, supported after launch.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-5">
                  <a
                    href="#contact"
                    className="t-headline group flex items-center gap-3 border-b-2 border-b-paper pb-1.5 text-[1.3rem] transition-colors hover:border-b-accent hover:text-accent sm:text-[1.5rem]"
                  >
                    Start a project
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                  <a
                    href={BOOKING_URL}
                    className="t-label border-b border-b-paper/40 pb-1 text-paper/85 transition-colors hover:border-b-accent hover:text-accent"
                  >
                    Book a 30-minute call →
                  </a>
                </div>
              </div>
            </div>

            {/* What we do, named once more at the foot of the screen. Full
                paper rather than dim: dim fails contrast on the glass. Left
                off phones, where the board needs the room and the services
                section is the next thing down anyway. */}
            <ul className="rule-t mt-7 hidden flex-wrap gap-x-8 gap-y-2 pt-5 sm:flex">
              {SERVICES.map((service) => (
                <li key={service.name}>
                  <a
                    href="#services"
                    className="t-label text-paper/75 transition-colors hover:text-accent"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
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
            <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
              <div>
                <h2
                  className="t-headline"
                  style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
                >
                  Services
                </h2>
              </div>
              <p className="t-body max-w-[46ch] text-dim">
                Five defined engagements, each run through the same four-step
                framework. Fixed-scope projects are quoted once scope is agreed;
                support runs on a monthly plan.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.name} delay={(i % 3) * 70} className="h-full">
                <SpecLabel service={service} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Selected work
            --------------------------------------------------------------- */}
        <section
          id="work"
          className="rule-t scroll-mt-24"
          style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(5rem,11vw,9rem)" }}
        >
          <Reveal className="rule-b flex flex-wrap items-end justify-between gap-6 pb-8">
            <div>
              <h2
                className="t-headline max-w-[14ch]"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
              >
                Work
              </h2>
            </div>
            <Link href="/work" className="t-label text-dim hover:text-accent">
              All work →
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {PROJECTS.slice(0, 2).map((project, i) => (
              <Reveal key={project.slug} delay={i * 80}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Process
            --------------------------------------------------------------- */}
        <section id="process" className="rule-t scroll-mt-24">
          <div
            style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(5rem,11vw,9rem)" }}
          >
            <Reveal className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
              <h2
                className="t-headline"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
              >
                Process
              </h2>
              <p className="t-body max-w-[46ch] text-dim">
                The same four steps on every project, so you always know what
                happens next and what you&rsquo;ll have in hand when it&rsquo;s
                done.
              </p>
            </Reveal>

            {/* Four across, so the sequence reads left to right rather than as
                a list of unrelated services. */}
            <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <Reveal as="li" key={step.name} delay={(i % 4) * 70} className="rule-t pt-6">
                  <span className="t-serif text-dim block text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-headline mt-4 text-[1.5rem]">{step.name}</h3>
                  <p className="t-body mt-3 max-w-[34ch] text-[0.95rem] text-dim">
                    {step.copy}
                  </p>
                  <p className="t-label mt-5 text-paper/80">→ {step.output}</p>
                </Reveal>
              ))}
            </ol>
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
              <h2
                className="t-headline max-w-[12ch]"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
              >
                Start a project
              </h2>
              <p className="t-body mt-8 max-w-[38ch] text-dim">
                Tell us what you&rsquo;re building, and we&rsquo;ll follow up
                with next steps and a time for the scoping session.
              </p>
              <a
                href={BOOKING_URL}
                className="t-label mt-8 inline-block border-b border-b-dim/50 pb-1 text-dim transition-colors hover:border-b-accent hover:text-accent"
              >
                Or book a 30-minute call →
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
