import Link from "next/link";
import Plate from "./Plate";
import type { Project } from "./content";

/** Editorial work card — plate, meta row, one-line summary. */
export default function ProjectCard({
  project,
  index,
  className = "",
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block ${className}`}
      aria-label={`${project.name}, ${project.type}`}
    >
      <Plate
        src={project.images[0].src}
        alt={project.images[0].alt}
        className="aspect-[4/3] w-full"
        imgClassName="grayscale transition-[filter,opacity] duration-700 group-hover:grayscale-0 group-hover:opacity-95"
      />
      <div className="rule-b flex items-baseline justify-between pt-5 pb-4">
        <h3 className="t-headline text-[1.5rem] transition-colors group-hover:text-accent sm:text-[1.9rem]">
          {project.name}
        </h3>
        <span className="t-serif text-dim text-lg">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="t-label mt-4 flex flex-wrap gap-x-4 gap-y-1 text-dim">
        <span>{project.type}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
      </div>
      <p className="t-body mt-3 max-w-[46ch] text-[0.95rem] text-paper/70">
        {project.summary}
      </p>
    </Link>
  );
}
