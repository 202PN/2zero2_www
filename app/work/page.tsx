import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SiteChrome from "@/components/SiteChrome";
import { PROJECTS } from "@/components/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work from 2zero2. Web applications, marketing sites, and launch design, shipped and running.",
};

export default function WorkIndex() {
  return (
    <>
      <SiteChrome />
      <main
        id="main"
        style={{
          paddingInline: "var(--gutter)",
          paddingTop: "clamp(8rem,16vh,12rem)",
          paddingBottom: "clamp(5rem,11vw,9rem)",
        }}
      >
        <Reveal className="rule-b pb-10">
          <p className="t-label text-dim">Index · {PROJECTS.length} projects</p>
          <h1
            className="t-display mt-8"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            Work
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 80}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
