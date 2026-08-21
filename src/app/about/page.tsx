import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, Section } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { ASSETS } from "@/content/assets";
import { SITE, COMPANY, COLOPHON } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Web developer in Wiltshire, with a BSc (Hons) in Cyber Security from Bath Spa University.",
};

const SKILLS = [
  "Design and front-end build",
  "Accessibility to WCAG AA",
  "Performance and Core Web Vitals",
  "WebGL, 3D and motion",
  "Content structure and SEO",
  "Hosting, deployment and handover",
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="About"
        title="Archie Cook, web developer"
        intro={`I work from ${SITE.location} and run ${COMPANY.name}, taking on design and build work for small businesses.`}
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-24 sm:px-8">
        <div className="grid gap-16 md:grid-cols-[1fr_320px]">
          <div>
            <Reveal>
              <p className="max-w-[56ch]">
                I hold a BSc (Hons) in Cyber Security from Bath Spa University.
                It is the reason security, performance and accessibility are
                built into the work rather than added at the end, though web
                development is what I do day to day.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-[56ch]">
                Three client sites are live so far, for an equipment hire
                company, a musician and an Oracle consultancy. Each was handed
                over with documentation so the owner can maintain it.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-12 grid gap-x-10 gap-y-4 border-t border-border pt-10 sm:grid-cols-2">
                {SKILLS.map((skill) => (
                  <li key={skill} className="flex gap-3 text-[0.9375rem]">
                    <span aria-hidden="true" className="text-brand">
                      &mdash;
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <Image
              src={ASSETS["portrait"].path}
              alt={ASSETS["portrait"].alt}
              width={ASSETS["portrait"].width}
              height={ASSETS["portrait"].height}
              sizes="(min-width: 768px) 320px, 100vw"
              className="h-auto w-full rounded-md border border-border"
            />
          </Reveal>
        </div>
      </div>

      <Section>
        <Reveal>
          <span className="mb-4 block font-display text-xs uppercase tracking-[0.2em] text-muted">
            Colophon
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-[22ch]">How this site is built</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[54ch]">
            The logo in the background is 3D geometry, extruded at runtime from
            the same SVG file the favicon uses. If your device cannot run it,
            or your system settings ask for reduced motion, the page falls back
            to a static version with no loss of content.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <ul className="mt-8 flex flex-wrap gap-2">
            {COLOPHON.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section raised>
        <Reveal>
          <h2 className="max-w-[20ch]">University work</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 max-w-[56ch]">
            Coursework, reports and presentations from all three years are
            archived here as they were submitted, rather than summarised.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/university"
              className="btn-sweep rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand"
            >
              Browse module work
            </Link>
            <Link
              href="/cv"
              className="link-sweep self-center text-muted"
            >
              Read the CV
            </Link>
          </p>
        </Reveal>
      </Section>
    </main>
  );
}
