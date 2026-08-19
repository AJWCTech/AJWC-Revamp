/* The project sub-pages, carried over from the original site.
 *
 * Content is deliberately thin here: the original pages listed module
 * work whose detail lives in the archived HTML under
 * public/Assets/Uni Work Pages/. Rather than duplicate that text and let
 * the two drift, each area links to the archive.
 *
 * TODO: confirm — the per-project write-ups from the original pages
 * should be pasted in here once you have decided which ones still earn
 * their place on a client-facing site.
 */

export type ProjectArea = {
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  items: { title: string; body: string; href?: string }[];
};

export const PROJECT_PAGES: Record<string, ProjectArea> = {
  "web-development": {
    slug: "web-development",
    title: "Web development",
    kicker: "Projects",
    intro:
      "Front-end and full-site work, from first-year coursework through to the client builds now shipping.",
    items: [
      {
        title: "Client sites",
        body: "Three production websites built and handed over through AJWC Tech Consulting.",
        href: "/work",
      },
      {
        title: "Web Development 1",
        body: "First-year module: HTML, CSS and the fundamentals of building for the browser.",
        href: "/Assets/Uni%20Work%20Pages/1st%20Year/Web%20Dev%201/WebDev1.html",
      },
      {
        title: "Web Development 2",
        body: "Second-year module: dynamic sites, server-side work and databases behind the page.",
        href: "/Assets/Uni%20Work%20Pages/2nd%20Year/Web%20Dev%202/WebDev2.html",
      },
    ],
  },
  "app-development": {
    slug: "app-development",
    title: "App development",
    kicker: "Projects",
    intro: "Application work and prototypes built during the degree.",
    items: [
      {
        title: "Codelab 1",
        body: "First-year programming module.",
        href: "/Assets/Uni%20Work%20Pages/1st%20Year/Codelab%201/Codelab.html",
      },
      {
        title: "Codelab 2",
        body: "Second-year programming module.",
        href: "/Assets/Uni%20Work%20Pages/2nd%20Year/Codelab%202/Codelab2.html",
      },
      {
        title: "Databases",
        body: "Second-year module covering relational design and querying.",
        href: "/Assets/Uni%20Work%20Pages/2nd%20Year/Databases/Databases.html",
      },
    ],
  },
  "network-admin": {
    slug: "network-admin",
    title: "Network administration",
    kicker: "Projects",
    intro: "Networking and infrastructure work from the degree.",
    items: [
      {
        title: "Network Administration",
        body: "Second-year module: network design, configuration and administration.",
        href: "/Assets/Uni%20Work%20Pages/2nd%20Year/Network%20Admin/NetworkAdmin.html",
      },
      {
        title: "Critical National Infrastructure",
        body: "Third-year module on securing infrastructure at national scale.",
        href: "/Assets/Uni%20Work%20Pages/3rd%20Year/Critical%20Infrastructure/CNI.html",
      },
      {
        title: "Securing IoT Devices",
        body: "Third-year module on the security of connected devices.",
        href: "/Assets/Uni%20Work%20Pages/3rd%20Year/Securing%20IoT%20Devices/IoT.html",
      },
    ],
  },
  "presentation-videos": {
    slug: "presentation-videos",
    title: "Presentation videos",
    kicker: "Projects",
    intro: "Recorded presentations and walkthroughs from the degree.",
    items: [
      {
        title: "Module presentations",
        body: "TODO: confirm — the original page embedded recorded presentations. Point me at the files or links and I will wire them in.",
      },
    ],
  },
};
