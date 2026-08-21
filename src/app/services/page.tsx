import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites for small businesses, redesigns and rebuilds, interactive and 3D work, handover and support.",
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Services"
        title="What I build"
        intro="A complete site from design through to launch, or a defined piece of work on a site you already have."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-20 sm:px-8">
        <ul className="grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={0.06 * i} as="li">
              <div className="border-t border-border pt-6">
                <h2 className="text-xl text-text">{service.title}</h2>
                <p className="mt-3 max-w-[44ch] text-[0.9375rem]">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <section className="border-t border-border/60 bg-brand py-24 text-bg">
        <div className="mx-auto max-w-[720px] px-6 text-center sm:px-8">
          <Reveal>
            <h2 className="text-bg">Start a project</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-[46ch] text-bg/80">
              Send over what your business does and what the site needs to do,
              and I will come back with an approach and a price.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/contact"
              className="btn-sweep mt-9 inline-block rounded-pill bg-bg px-8 py-3 font-display text-[0.9375rem] text-brand"
            >
              Start a project
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
