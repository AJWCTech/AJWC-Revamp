import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { WorkCard } from "@/components/WorkCard";
import { Section } from "@/components/PageShell";
import { SITE, WORK, SERVICES, COMPANY } from "@/content/site";

/* The homepage is a shop window, not the whole site: each block ends in
 * a link to the page that carries the detail. Nav and footer live in the
 * root layout, so they are not repeated here. */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 block font-display text-xs uppercase tracking-[0.2em] text-muted">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main id="main">
      {/* --- Hero --------------------------------------------------- */}
      <section
        id="hero"
        className="mx-auto flex min-h-[86svh] max-w-[var(--content-width)] flex-col justify-center px-6 sm:px-8"
      >
        <Reveal>
          <Kicker>{COMPANY.name}</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="max-w-[15ch]">Web development for small businesses</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-8 max-w-[50ch] text-lg">
            I&rsquo;m Archie, a web developer in {SITE.location}. I design and
            build websites for small businesses, then hand them over documented
            and ready for you to maintain.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="btn-sweep rounded-pill bg-brand px-7 py-3 font-display text-[0.9375rem] text-bg"
            >
              See the work
            </Link>
            <Link
              href="/contact"
              className="btn-sweep rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand"
            >
              Start a project
            </Link>
          </div>
        </Reveal>
      </section>

      {/* --- Work --------------------------------------------------- */}
      <Section id="work">
        <Reveal>
          <Kicker>Work</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-[18ch]">Recent client work</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[52ch]">
            Three sites built through AJWC Tech Consulting, for an equipment hire
            company, a musician and an Oracle consultancy.
          </p>
        </Reveal>

        <ul className="work-grid mt-16 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
          {WORK.map((item, i) => (
            <li key={item.slug}>
              <WorkCard item={item} index={i} />
            </li>
          ))}
        </ul>

        <p className="mt-14">
          <Link href="/work" className="link-sweep text-brand">
            All client work &rarr;
          </Link>
        </p>
      </Section>

      {/* --- Services ----------------------------------------------- */}
      <Section raised>
        <Reveal>
          <Kicker>Services</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-[18ch]">What I build</h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={0.06 * i} as="li">
              <div className="border-t border-border pt-6">
                <h3 className="text-lg text-text">{service.title}</h3>
                <p className="mt-3 max-w-[42ch] text-[0.9375rem]">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-14">
          <Link href="/services" className="link-sweep text-brand">
            All services &rarr;
          </Link>
        </p>
      </Section>

      {/* --- About -------------------------------------------------- */}
      <Section>
        <Reveal>
          <Kicker>About</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-[18ch]">Background</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-[54ch]">
            I hold a BSc (Hons) in Cyber Security from Bath Spa University. The
            degree is the reason security, performance and accessibility are
            part of how I build rather than something added at the end.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-8 flex flex-wrap gap-6">
            <Link href="/about" className="link-sweep text-brand">
              About me &rarr;
            </Link>
            <Link href="/projects" className="link-sweep text-muted">
              Projects and university work
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* --- Contact ------------------------------------------------ */}
      <section id="contact" className="border-t border-border/60 bg-brand py-24 text-bg">
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
