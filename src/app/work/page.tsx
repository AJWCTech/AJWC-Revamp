import type { Metadata } from "next";
import { PageHeader } from "@/components/PageShell";
import { WorkCard } from "@/components/WorkCard";
import { WORK } from "@/content/site";

export const metadata: Metadata = {
  title: "Client work",
  description:
    "Websites built through AJWC Tech Consulting — three businesses, three different problems.",
};

export default function WorkPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Client work"
        title="Three businesses, three different problems."
        intro="Every one of these had to earn something specific — a booking, an enquiry, a first impression that held up."
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
