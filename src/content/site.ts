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
    "Web developer in Wiltshire. Design and build for small businesses, delivered through AJWC Tech Consulting Ltd.",
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
      "A hire catalogue listing each system by capacity, with prices on the page.",
    outcome:
      "Enquiries arrive from people who already know the cost and the specification.",
    stack: ["Design", "Build", "Content structure"],
    assetKey: "work-kritikal",
    // TODO: confirm — live URL to link the card to.
  },
  {
    slug: "umbra",
    client: "Umbra",
    sector: "Artist",
    summary:
      "A release page built around a single WebGL visual, kept light enough to load on mobile data.",
    outcome: "The artwork carries the page, and it still opens quickly on a phone.",
    stack: ["Design", "Build", "WebGL"],
    assetKey: "work-umbra",
  },
  {
    slug: "white-phoenix",
    client: "White Phoenix",
    sector: "Oracle consultancy",
    summary:
      "A site for an Oracle consultancy whose buyers research a supplier before making contact.",
    outcome: "Sets out the firm's experience where prospective clients will look for it.",
    stack: ["Design", "Build", "3D"],
    assetKey: "work-white-phoenix",
  },
];

/* --- services -------------------------------------------------------- */

export const SERVICES = [
  {
    title: "Websites for small businesses",
    body: "Design and build from scratch, organised so customers find what they came for and quick to load on a phone.",
  },
  {
    title: "Redesigns and rebuilds",
    body: "For a site that loads slowly, reads badly on a phone, or no longer matches the business behind it.",
  },
  {
    title: "Interactive and 3D work",
    body: "Motion and WebGL for brands that need the site itself to make an impression.",
  },
  {
    title: "Handover and support",
    body: "Built so you can run it yourself. I can stay on for changes if you would rather not.",
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
  /* Order must match the order the sections appear in page.tsx, which is
     hero → work → services → about → contact. These two used to be the
     other way round, so the camera moved to the About state while the
     Services section was on screen. */
  { id: "work", camera: [-2.4, -0.3, 4.6], target: [-0.9, 0, 0], markPresence: 0.3, markSpin: 0.9 },
  { id: "services", camera: [2.6, 0.4, 4.0], target: [1.0, 0, 0], markPresence: 0.45, markSpin: 1.6 },
  { id: "about", camera: [0, 1.2, 5.0], target: [0, 0.3, 0], markPresence: 0.55, markSpin: 2.3 },
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
    body: "Front-end and full-site work, from first-year coursework through to the client builds now live.",
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

/* What this site itself is built with. On a web development portfolio
 * the stack is evidence, not trivia — it is the one project a visitor
 * can inspect for themselves. Keep it accurate: anyone can open the
 * network tab and check. */
export const COLOPHON = [
  "Next.js 16 (App Router)",
  "React 19",
  "React Three Fiber",
  "three.js",
  "GSAP + ScrollTrigger",
  "Lenis",
  "Tailwind v4",
  "TypeScript",
] as const;

/* --- contact enquiry types -------------------------------------------
 * Posted as the `subject` field, which contact.php already requires and
 * uses as the email subject line — so the handler needs no changes and
 * enquiries arrive pre-sorted in the inbox.
 *
 * Grouped because eight flat options is a wall. The grouping also does
 * real work: it separates "I want you to build something" from "I want
 * to employ you", which are different conversations.
 *
 * Labels must stay under 120 characters (MAX_SUBJECT_LEN in contact.php)
 * and must avoid the words in its spam filter — no URLs, no "buy now".
 */

export const ENQUIRY_GROUPS = [
  {
    label: "Project work",
    options: [
      "New website or app",
      "Quote or estimate",
      "Redesign or rebuild of an existing site",
      "Support or changes to an existing site",
    ],
  },
  {
    label: "Working together",
    options: ["Contract or freelance work", "Hiring for a role"],
  },
  {
    label: "Anything else",
    options: ["General question", "Something else"],
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
