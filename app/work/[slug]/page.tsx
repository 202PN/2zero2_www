import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Plate from "@/components/Plate";
import Reveal from "@/components/Reveal";
import SiteChrome from "@/components/SiteChrome";
import { PROJECTS, projectBySlug } from "@/components/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  return { title: project.name, description: project.summary };
}

/** One block of the case-study narrative. */
function Block({ label, children }: { label: string; children: string }) {
  return (
    <Reveal className="rule-t grid gap-4 py-10 lg:grid-cols-[10rem_1fr] lg:gap-12">
      <p className="t-label text-dim">{label}</p>
      <p className="t-body max-w-[62ch] text-[1.05rem] text-paper/80">{children}</p>
    </Reveal>
  );
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <>
      <SiteChrome />
      <main id="main">
        <header
          style={{
            paddingInline: "var(--gutter)",
            paddingTop: "clamp(8rem,16vh,12rem)",
            paddingBottom: "clamp(2.5rem,5vw,4rem)",
          }}
        >
          <Link href="/work" className="t-label text-dim hover:text-accent">
            ← Work
          </Link>
          <h1
            className="t-display mt-8"
            style={{ fontSize: "clamp(2.8rem, 9vw, 7.5rem)" }}
          >
            {project.name}
          </h1>
          <dl className="rule-t mt-10 grid gap-x-10 gap-y-6 pt-6 sm:grid-cols-3">
            {[
              ["Type", project.type],
              ["Stack", project.stack],
              ["Year", project.year],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="t-label text-dim">{label}</dt>
                <dd className="t-body mt-2 text-[0.95rem] text-paper/80">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Plate
          src={project.images[0].src}
          alt={project.images[0].alt}
          className="h-[62vh] min-h-[320px] w-full"
          priority
        />

        <div
          style={{
            paddingInline: "var(--gutter)",
            paddingTop: "clamp(4rem,8vw,7rem)",
            paddingBottom: "clamp(4rem,8vw,7rem)",
          }}
        >
          <Block label="Problem">{project.problem}</Block>
          <Block label="Built">{project.built}</Block>
          <Block label="Result">{project.result}</Block>

          {project.images.length > 1 && (
            <div className="mt-16 grid gap-10 md:grid-cols-2">
              {project.images.slice(1).map((image, n) => (
                <Reveal key={image.src} delay={n * 80}>
                  <figure>
                    <Plate src={image.src} alt={image.alt} className="aspect-[4/3] w-full" />
                    <figcaption className="t-label mt-4 max-w-[52ch] text-dim">
                      {image.alt}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/work/${next.slug}`}
          className="rule-t group flex items-baseline justify-between"
          style={{ paddingInline: "var(--gutter)", paddingBlock: "clamp(3rem,7vw,5rem)" }}
        >
          <div>
            <p className="t-label text-dim">Next project</p>
            <p
              className="t-headline mt-4 transition-colors group-hover:text-accent"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              {next.name}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="t-headline text-[2rem] transition-transform group-hover:translate-x-2"
          >
            →
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
