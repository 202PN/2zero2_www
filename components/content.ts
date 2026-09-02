/*
 * Product truth for the site: services, case studies, process, contact.
 * The design renders THIS content — do not invent claims here.
 */

export const CONTACT_EMAIL = "info@2zero2.build";
export const BOOKING_URL = "https://calendly.com/2zero2works/30min";

export const PROJECT_TYPES = [
  "Web app",
  "Marketing site",
  "Redesign & rebuild",
  "MVP",
  "Not sure yet",
];

export const TIMELINES = ["ASAP", "1–3 months", "Flexible"];

export type Service = {
  tag: string;
  name: string;
  copy: string;
  /** Matches a PROJECT_TYPES pill for form pre-selection; null = none. */
  type: string | null;
};

export const SERVICES: Service[] = [
  {
    tag: "Web app",
    name: "Web applications",
    copy: "Dashboards, portals, and internal tools your business runs on every day.",
    type: "Web app",
  },
  {
    tag: "Site",
    name: "Marketing sites",
    copy: "A site that loads instantly, reads clearly, and turns visitors into inquiries.",
    type: "Marketing site",
  },
  {
    tag: "Rebuild",
    name: "Website redesign & rebuild",
    copy: "Your aging site rebuilt from the ground up, without losing what works.",
    type: "Redesign & rebuild",
  },
  {
    tag: "MVP",
    name: "MVPs for founders",
    copy: "A first version real users can touch, shipped in weeks and ready to learn from.",
    type: "MVP",
  },
  {
    tag: "Care",
    name: "Support & iteration",
    copy: "Fixes, features, and performance after launch. Handled.",
    type: null,
  },
];

export type ProjectImage = { src: string; alt: string };

export type Project = {
  name: string;
  /** URL segment for /work/[slug]. */
  slug: string;
  type: string;
  stack: string;
  year: string;
  /** One line, always visible; the detail rows collapse beneath it. */
  summary: string;
  images: ProjectImage[];
  problem: string;
  built: string;
  result: string;
};

export const PROJECTS: Project[] = [
  {
    name: "LPT",
    slug: "lpt",
    type: "Web application",
    stack: "Next.js 14 · TypeScript · Tailwind · AWS serverless",
    year: "2025",
    summary:
      "Medicare lead generation in one compliant flow, meeting CMS, SOA, and HIPAA requirements out of the box.",
    images: [
      { src: "/work/LPT.webp", alt: "LPT Medicare lead-generation platform" },
      {
        src: "/work/LPT_form.webp",
        alt: "LPT intake form with appointment-type and call-time scheduling: “Tired of Medicare spam? We are too”",
      },
      {
        src: "/work/LPT_3.webp",
        alt: "LPT benefits page: licensed agents, step-by-step planning, 24-hour response, and customer stats",
      },
    ],
    problem:
      "Medicare enrollment affects millions of Americans, but the process is often frustrating. Beneficiaries are bombarded with marketing, struggle to compare plans, and worry about privacy. Insurance agencies need a compliant, efficient way to connect with qualified leads.",
    built:
      "A Medicare lead generation platform using Next.js 14, TypeScript, and Tailwind, backed by a serverless AWS architecture.",
    result:
      "A production-ready platform that turns a fragmented, privacy-eroding enrollment process into a single compliant flow. Capturing qualified leads while meeting CMS, SOA, and HIPAA requirements out of the box.",
  },
  {
    name: "BreNasty",
    slug: "brenasty",
    type: "Marketing site",
    stack: "Vanilla HTML · CSS · JavaScript · no build step",
    year: "2025",
    summary:
      "An album-launch listening experience: preview every track, jump to any streaming platform in one tap.",
    images: [
      { src: "/work/breNasty.webp", alt: "BreNasty marketing website" },
      {
        src: "/work/breNasty_2.webp",
        alt: "BreNasty full-screen track slide for “01. Vibes”: chrome android portrait over mirror-ball backdrop, with Spotify, Apple Music, and Tidal links",
      },
    ],
    problem:
      "An emerging DJ needed a marketing site to launch the album Prototype: something that felt like an experience, not a link tree. The goal was to let fans preview every track and hop straight to their streaming platform of choice, while keeping the artist's visual identity front and center. It also had to load instantly, work on any phone, and be cheap and simple to host and update.",
    built:
      "A custom single-page listening experience in vanilla HTML, CSS, and JavaScript, with no frameworks and no build step. Each track gets a full-screen slide with cover art and an inline preview, driven by an audio engine that respects browser autoplay rules and keeps manual controls in sync, with every slide linking out to Spotify, Apple Music, and Tidal.",
    result:
      "A polished, immersive marketing site where fans can preview all eight tracks and jump to streaming in one tap. It loads near-instantly and stays trivial to update for future releases.",
  },
  {
    name: "Blue Nile",
    slug: "blue-nile",
    type: "Marketing site",
    stack: "Wix · built for client self-service",
    year: "2024",
    summary:
      "A credible multi-city web presence with a quote pipeline the client runs entirely on their own.",
    images: [
      { src: "/work/blueNile.webp", alt: "Blue Nile Transports marketing website" },
      { src: "/work/blueNileLogo.webp", alt: "Blue Nile Transports logo" },
    ],
    problem:
      "Blue Nile Transports was expanding across multiple cities but had almost no digital presence to match. Without a central place for customers to learn about their trucking, relocation, and junk-removal services or request a quote, they leaned heavily on word of mouth, which capped their growth and made it hard to build credibility with new customers handling high-value freight.",
    built:
      "We designed and developed a clean, modern website on Wix, chosen for its ease of use and seamless handoff. The site breaks down their services with clear navigation, strong visuals, and a streamlined quote request form built to convert visitors into leads. Every section was crafted to signal reliability, transparency, and operational efficiency, while keeping the whole thing simple enough for the Blue Nile team to manage without a developer.",
    result:
      "A professional, fully responsive platform that gives Blue Nile Transports the credibility to win new business and the independence to run their own site. Since launch, they've seen stronger customer engagement and more consistent inbound inquiries, backed by a digital presence they can update and grow on their own.",
  },
];

export type Step = { name: string; copy: string };

export const STEPS: Step[] = [
  {
    name: "Discovery",
    copy: "We learn what you're building and why, then define the first release together.",
  },
  {
    name: "Build",
    copy: "Weekly progress you can click, not status decks.",
  },
  {
    name: "Launch",
    copy: "We ship to production and stay in the room until it's stable.",
  },
  {
    name: "Support",
    copy: "Fixes, features, iteration. Better every week.",
  },
];

export const ABOUT = [
  "We build software with intention: every screen, every dependency, every line of code earns its place.",
  "The team is small on purpose. The people who scope your project are the people who build it.",
  "Our standards are non-negotiable: fast pages, accessible interfaces, readable code, timelines we hit.",
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
