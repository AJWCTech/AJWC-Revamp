import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { PROJECT_PAGES } from "@/content/projects";

/* One route for all four project areas. They share a shape, so four
 * near-identical page files would be four places to fix a layout bug. */

export function generateStaticParams() {
  return Object.keys(PROJECT_PAGES).map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[area]">): Promise<Metadata> {
  const { area } = await params;
  const page = PROJECT_PAGES[area];
  if (!page) return {};
  return { title: page.title, description: page.intro };
}

export default async function ProjectAreaPage({ params }: PageProps<"/projects/[area]">) {
  const { area } = await params;
  const page = PROJECT_PAGES[area];
  if (!page) notFound();

  return (
    <main id="main">
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <ul className="grid gap-6 sm:grid-cols-2">
          {page.items.map((item, i) => {
            const inner = (
              <>
                <h2 className="text-lg text-text">{item.title}</h2>
                <p className="mt-3 text-[0.9375rem]">{item.body}</p>
                {item.href ? (
                  <span className="mt-5 inline-block text-sm text-brand">Open &rarr;</span>
                ) : null}
              </>
            );

            return (
              <Reveal key={item.title} delay={0.06 * i} as="li">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="card-hover block h-full rounded-md border border-border bg-bg-card/60 p-7"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="h-full rounded-md border border-border bg-bg-card/60 p-7">
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>

        <p className="mt-14">
          <Link href="/projects" className="link-sweep text-muted">
            &larr; All projects
          </Link>
        </p>
      </div>
    </main>
  );
}
