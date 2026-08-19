import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "CV viewer",
  description: "Read Archie Cook's CV in the browser.",
};

/* Deliberately a plain <object> pointing at the PDF on this domain, not
 * Google's document viewer. The original site fell back to Google on
 * mobile, which is the one third-party request the privacy and cookie
 * policies have to disclose. Keeping it local means that disclosure can
 * eventually go away.
 *
 * Mobile browsers still render embedded PDFs poorly, so the download
 * link below is the fallback rather than a third-party viewer. */

export default function CvViewPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="CV"
        title="Read it here."
        intro="If the preview does not load on your device, download the PDF instead — it is served from this site directly."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <object
          data="/Assets/CV/Archie_Cook_CV_OnePage.pdf"
          type="application/pdf"
          className="h-[80vh] w-full rounded-md border border-border bg-bg-card"
          aria-label="Archie Cook CV, one page"
        >
          <p className="p-8">
            Your browser cannot display the PDF inline.{" "}
            <a href="/Assets/CV/Archie_Cook_CV_OnePage.pdf" download>
              Download the CV instead
            </a>
            .
          </p>
        </object>

        <p className="mt-8">
          <Link href="/cv" className="link-sweep text-muted">
            &larr; Back to CV downloads
          </Link>
        </p>
      </div>
    </main>
  );
}
