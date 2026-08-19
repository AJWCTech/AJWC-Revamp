import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "CV",
  description: "Download or read Archie Cook's CV.",
};

/* The CV files are passed through public/ so the download is served
 * straight from this domain with no third party involved — which is what
 * the privacy and cookie policies promise. */

const FILES = [
  {
    label: "One-page CV",
    note: "PDF · the version to send",
    href: "/Assets/CV/Archie_Cook_CV_OnePage.pdf",
  },
  {
    label: "One-page CV",
    note: "Word document",
    href: "/Assets/CV/Archie_Cook_CV_OnePage.docx",
  },
  {
    label: "Full CV",
    note: "Word document · the long version",
    href: "/Assets/CV/Archie_Cook_CV_Full.docx",
  },
];

export default function CvPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="CV"
        title="The short version, on paper."
        intro="Download it, or read it in the browser. Served directly from this site — no viewer, no third party, no tracking."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <ul className="grid gap-4 sm:grid-cols-3">
          {FILES.map((file, i) => (
            <Reveal key={`${file.label}-${file.note}`} delay={0.06 * i} as="li">
              <a
                href={file.href}
                download
                className="card-hover block h-full rounded-md border border-border bg-bg-card/90 p-6"
              >
                <span className="block text-text">{file.label}</span>
                <span className="mt-2 block text-sm text-muted">{file.note}</span>
                <span className="mt-5 inline-block text-sm text-brand">Download &darr;</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <Link
              href="/cv/view"
              className="btn-sweep rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand"
            >
              Read it in the browser
            </Link>
            <a href={SITE.links.linkedin} target="_blank" rel="noopener" className="link-sweep text-muted">
              Or view LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
