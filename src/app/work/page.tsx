import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { WorkCard } from "@/components/WorkCard";
import { WORK } from "@/content/site";

export const metadata: Metadata = {
  title: "Client work",
  description:
    "Three websites built through AJWC Tech Consulting, for an equipment hire company, a musician and an Oracle consultancy.",
};

export default function WorkPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Work"
        title="Sites built for clients"
        intro="Three websites delivered through AJWC Tech Consulting, for an equipment hire company, a musician and an Oracle consultancy. Each had a specific job to do, set out below."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <ul className="work-grid grid gap-14 md:grid-cols-2 lg:grid-cols-3">
          {WORK.map((item, i) => (
            <li key={item.slug}>
              <WorkCard item={item} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
