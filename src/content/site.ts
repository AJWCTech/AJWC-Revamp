/* Site-level facts and copy.
 *
 * Positioning: this is a WEB DEVELOPMENT portfolio whose job is to win
 * clients. The Cyber Security degree is background credibility only — it
 * is never the theme, and nothing here should read as hacker, terminal
 * or security.
 *
 * Anything needing a real-world fact I could not verify is marked
 * `TODO: confirm` rather than invented.
 */

export const SITE = {
  name: "Archie Cook",
  role: "Web Developer",
  /* The canonical origin, www included. Everything derives from this:
     the sitemap, the OG and Twitter tags, the JSON-LD @ids and the
     robots.txt sitemap line. Changing it here changes all of them.

     www is canonical, so the .htaccess redirects the bare domain to it.
     Serving both would split search ranking across two origins. */
  url: "https://www.ajwctechconsulting.com",
  description:
    "Web developer building fast, accessible websites for small businesses. Three client sites shipped through AJWC Tech Consulting.",
  location: "Wiltshire, UK",
  company: "AJWC Tech Consulting Ltd",
  email: "archiecook7878@gmail.com", // TODO: confirm — business address instead?
  links: {
    linkedin: "https://www.linkedin.com/in/archiecook",
    // TODO: confirm — inferred from the AJWCTech org that hosts the site
    // repos. Change to a personal account if that is the one to show.
    github: "https://github.com/AJWCTech",
  },
} as const;

/* --- work: the centrepiece ------------------------------------------
 * Each entry becomes one 3D card in the Work section. `assetKey` points
 * into the asset manifest so imagery swaps without touching this file. */

export type WorkItem = {
  slug: string;
  client: string;
  sector: string;
  summary: string;
  /** What the site had to achieve — the client-facing reason it exists. */
  outcome: string;
  stack: string[];
  assetKey: "work-kritikal" | "work-umbra" | "work-white-phoenix";
  url?: string;
};

export const WORK: WorkItem[] = [
  {
    slug: "kritikal",
    client: "Kritikal Soundsystem",
    sector: "Audio hire, Bristol",
    summary:
      "A hire catalogue people can actually price up, instead of a phone number and a promise.",
    outcome:
      "Real prices on the page, so enquiries arrive already qualified.",
    stack: ["Design", "Build", "Content structure"],
    assetKey: "work-kritikal",
    // TODO: confirm — live URL to link the card to.
  },
  {
    slug: "umbra",
    client: "Umbra",
    sector: "Artist",
    summary:
      "A release page built around one striking visual idea, kept fast enough to open on a phone at a gig.",
    outcome: "A site that looks like the music without costing load time.",
    stack: ["Design", "Build", "WebGL"],
    assetKey: "work-umbra",
  },
  {
    slug: "white-phoenix",
    client: "White Phoenix",
    sector: "Oracle consultancy",
    summary:
      "A credibility-first site for a consultancy selling to enterprise buyers who check before they call.",
    outcome: "Positions a two-person firm to be taken seriously by large clients.",
    stack: ["Design", "Build", "3D"],
    assetKey: "work-white-phoenix",
  },
];

/* --- services -------------------------------------------------------- */

export const SERVICES = [
  {
    title: "Websites for small businesses",
    body: "Design and build, start to finish. Fast, accessible, and structured so customers find what they came for.",
  },
  {
    title: "Redesigns and rebuilds",
    body: "An existing site that loads slowly, reads badly on a phone, or no longer matches the business.",
  },
  {
    title: "Interactive and 3D work",
    body: "Motion and WebGL where it earns its place — for brands that need to look different, not just present.",
  },
  {
    title: "Handover and support",
    body: "Built so you can run it yourself, with the option of keeping me on for changes.",
  },
] as const;

/* --- 3D scene map -----------------------------------------------------
 * Camera and mark state per section, as data. Components never move the
 * camera; Scene.tsx interpolates between these. Adding a section means
 * adding an entry here and a matching <section id>. */

export type SceneState = {
  id: string;
  camera: [number, number, number];
  target: [number, number, number];
  /** 0 = mark hidden, 1 = mark at full presence */
  markPresence: number;
  /** Extra Y rotation applied to the mark in this state, radians */
  markSpin: number;
};

export const SCENE_STATES: SceneState[] = [
  { id: "hero", camera: [0, 0, 4.2], target: [0, 0, 0], markPresence: 1, markSpin: 0 },
  // The mark recedes hard through Work: the client sites are the subject
  // there, and a spinning logo competing with them would be the exact
  // "gimmicky" failure the brief warns about.
  { id: "work", camera: [-2.4, -0.3, 4.6], target: [-0.9, 0, 0], markPresence: 0.16, markSpin: 0.9 },
  { id: "about", camera: [0, 1.2, 5.0], target: [0, 0.3, 0], markPresence: 0.5, markSpin: 1.6 },
  { id: "services", camera: [2.6, 0.4, 4.0], target: [1.0, 0, 0], markPresence: 0.4, markSpin: 2.3 },
  { id: "contact", camera: [0, 0, 3.0], target: [0, 0, 0], markPresence: 1, markSpin: 3.14159 },
];

/* Multi-page, mirroring the original site rather than collapsing it into
 * one scroll. Every page the original had still exists. */
export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
] as const;

/* The project index, carried over from the original site. */
export const PROJECT_AREAS = [
  {
    href: "/projects/web-development",
    title: "Web development",
    body: "Sites and front-end work, from coursework through to shipped client builds.",
  },
  {
    href: "/projects/app-development",
    title: "App development",
    body: "Application work, including coursework projects and prototypes.",
  },
  {
    href: "/projects/network-admin",
    title: "Network administration",
    body: "Networking and infrastructure work from the degree.",
  },
  {
    href: "/projects/presentation-videos",
    title: "Presentation videos",
    body: "Recorded presentations and walkthroughs.",
  },
  {
    href: "/university",
    title: "University work",
    body: "Three years of module work, archived in full.",
  },
] as const;

/* Company details as published on the original legal pages. These are
 * real registered details — do not edit without checking Companies House
 * and the ICO register. */
export const COMPANY = {
  name: "AJWC Tech Consulting Ltd",
  number: "16867620",
  ico: "ZC149054",
  office: "3 The Row, Stanton St. Bernard, Marlborough, Wiltshire, SN8 4LR",
  contact: "Archie Cook",
  updated: "31 July 2026",
} as const;
