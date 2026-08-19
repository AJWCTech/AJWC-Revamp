import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "University work",
  description:
    "Three years of BSc (Hons) Cyber Security module work from Bath Spa University, archived in full.",
};

/* The module pages themselves are the original hand-written HTML, passed
 * through public/ untouched so their existing URLs keep working. They
 * are linked, not re-rendered — porting sixteen archive pages into the
 * new design would be a lot of work for material that is background
 * credibility rather than the pitch. */

const YEARS = [
  {
    year: "First year",
    modules: [
      ["Codelab 1", "1st Year/Codelab 1/Codelab.html"],
      ["Fundamentals of Cyber Security", "1st Year/Fundamentals of Cyber Sec/FundamentalsCyberSec.html"],
      ["Introduction to Computing", "1st Year/Intro to Computing/IntroComputing.html"],
      ["Web Development 1", "1st Year/Web Dev 1/WebDev1.html"],
    ],
  },
  {
    year: "Second year",
    modules: [
      ["Codelab 2", "2nd Year/Codelab 2/Codelab2.html"],
      ["Cyber Resilience", "2nd Year/Cyber Resilience/CyberResilience.html"],
      ["Databases", "2nd Year/Databases/Databases.html"],
      ["Intrusion Analysis & Response", "2nd Year/Intrusion Analysis & Response/Intrusion.html"],
      ["Network Administration", "2nd Year/Network Admin/NetworkAdmin.html"],
      ["Web Development 2", "2nd Year/Web Dev 2/WebDev2.html"],
    ],
  },
  {
    year: "Third year",
    modules: [
      ["Critical National Infrastructure", "3rd Year/Critical Infrastructure/CNI.html"],
      ["Cyber Crime, Law and Ethics", "3rd Year/Cyber Crime Law and Ethics/Cyber Crime Law & Ethics.html"],
      ["Cyber Defence", "3rd Year/Cyber Defence/Cyber Defence.html"],
      ["Cyber Offence", "3rd Year/Cyber Offence/Cyber Offence.html"],
      ["Research Project", "3rd Year/Research Project/Research Project.html"],
      ["Securing IoT Devices", "3rd Year/Securing IoT Devices/IoT.html"],
    ],
  },
];

export default function UniversityPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="University"
        title="Three years, kept in full."
        intro="BSc (Hons) Cyber Security, Bath Spa University. Module work is archived as it was submitted rather than summarised — including the parts that show the learning."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        {YEARS.map((group, gi) => (
          <section key={group.year} className="mb-16">
            <Reveal delay={0.04 * gi}>
              <h2 className="border-b border-border pb-4 text-xl">{group.year}</h2>
            </Reveal>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {group.modules.map(([label, path], i) => (
                <Reveal key={label} delay={0.03 * i} as="li">
                  <a
                    href={`/Assets/Uni Work Pages/${path}`}
                    className="card-hover block rounded-md border border-border bg-bg-card/90 px-5 py-4"
                  >
                    <span className="text-text">{label}</span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
