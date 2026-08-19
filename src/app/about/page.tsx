import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, Section } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { ASSETS } from "@/content/assets";
import { SITE, COMPANY } from "@/content/site";

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
        title="Built properly, not just quickly."
        intro={`I'm Archie, a web developer in ${SITE.location}, and I run ${COMPANY.name}.`}
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-24 sm:px-8">
        <div className="grid gap-16 md:grid-cols-[1fr_320px]">
          <div>
            <Reveal>
              <p className="max-w-[56ch]">
                I hold a BSc (Hons) in Cyber Security from Bath Spa University.
                That degree is why the sites I build are secure, fast and
                accessible by default rather than as an afterthought — it is
                not what I sell.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 max-w-[56ch]">
                What I sell is a website that does a job for your business,
                delivered without jargon and handed over in a state you can
                maintain. Three are live now, built for very different clients.
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

      <Section raised>
        <Reveal>
          <h2 className="max-w-[20ch]">The degree, in full</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 max-w-[56ch]">
            Three years of module work is archived on this site rather than
            summarised — coursework, reports and presentations, kept as they
            were submitted.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/university"
              className="btn-sweep rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand"
            >
              University work
            </Link>
            <Link
              href="/cv"
              className="link-sweep self-center text-muted"
            >
              Or read the CV
            </Link>
          </p>
        </Reveal>
      </Section>
    </main>
  );
}
