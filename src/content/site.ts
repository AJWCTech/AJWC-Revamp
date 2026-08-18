/* Site-level facts and copy.
 *
 * Anything that needs a real-world fact I could not verify is marked
 * `TODO: confirm` in place rather than invented. Search the codebase for
 * that string before launch — it is the pre-flight checklist.
 */

export const SITE = {
  name: "Archie Cook",
  role: "Cyber Security",
  // TODO: confirm — domain for the new site. Placeholder until hosting is decided.
  url: "https://ajwctechconsulting.com",
  description:
    "Cyber security graduate and director of AJWC Tech Consulting. Offensive security on one side, production web development on the other.",
  location: "Wiltshire, UK",
  company: "AJWC Tech Consulting Ltd",
  email: "archiecook7878@gmail.com", // TODO: confirm — use a business address instead?
  links: {
    linkedin: "https://www.linkedin.com/in/archiecook",
    // TODO: confirm — GitHub, HackTheBox and TryHackMe profile URLs.
    github: "",
    hackthebox: "",
    tryhackme: "",
  },
} as const;

/* The scene map from the approved plan, as data. Components never call
 * the camera directly; they declare which state they are in and the
 * scene interpolates between them. Adding a section means adding an
 * entry here and a matching <Section id>. */
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
  { id: "security", camera: [3.2, 0.6, 3.4], target: [1.2, 0, 0], markPresence: 0.55, markSpin: 0.6 },
  { id: "work", camera: [-2.8, -0.4, 3.8], target: [-0.8, 0, 0], markPresence: 0.3, markSpin: 1.2 },
  { id: "about", camera: [0, 1.4, 5.2], target: [0, 0.3, 0], markPresence: 0.45, markSpin: 1.8 },
  { id: "education", camera: [0, -1.1, 4.6], target: [0, -0.4, 0], markPresence: 0.35, markSpin: 2.4 },
  { id: "contact", camera: [0, 0, 3.0], target: [0, 0, 0], markPresence: 1, markSpin: 3.14159 },
];

export const NAV = [
  { href: "#security", label: "Security" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;
