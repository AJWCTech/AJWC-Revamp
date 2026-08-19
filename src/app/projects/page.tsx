import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { PROJECT_AREAS } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Project index — web development, app development, network administration, presentations and university work.",
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Projects"
        title="Everything else I've built."
        intro="Alongside client work, this is the wider body of projects — coursework, prototypes and recorded presentations, kept online rather than summarised."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <ul className="grid gap-6 sm:grid-cols-2">
          {PROJECT_AREAS.map((area, i) => (
            <Reveal key={area.href} delay={0.06 * i} as="li">
              <Link
                href={area.href}
                className="card-hover block h-full rounded-md border border-border bg-bg-card/90 p-7"
              >
                <h2 className="text-xl text-text">{area.title}</h2>
                <p className="mt-3 text-[0.9375rem]">{area.body}</p>
                <span className="mt-5 inline-block text-sm text-brand">
                  View &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </main>
  );
}
