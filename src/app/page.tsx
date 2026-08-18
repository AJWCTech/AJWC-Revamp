import Image from "next/image";
import { SceneHost } from "@/components/SceneHost";
import { WorkCard } from "@/components/WorkCard";
import { Reveal } from "@/components/Reveal";
import { SITE, NAV, WORK, SERVICES } from "@/content/site";
import { ASSETS } from "@/content/assets";
import { Mark } from "@/components/Mark";

/* Copy note: this sells web development. The degree appears once, in
 * About, as credibility — not as a theme. Every factual claim I could
 * not verify is marked `TODO: confirm` rather than invented. */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 block font-display text-xs uppercase tracking-[0.2em] text-muted">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <SceneHost>
      <div className="page-content">
        <header className="fixed inset-x-0 top-0 z-20 border-b border-border/50 bg-bg/70 backdrop-blur-md">
          <nav
            aria-label="Main"
            className="mx-auto flex max-w-[var(--content-width)] items-center justify-between px-8 py-4"
          >
            <a href="#main" className="flex items-center gap-3 text-text">
              <Mark className="h-7 w-7 text-brand" />
              <span className="font-display text-sm">{SITE.name}</span>
            </a>
            <ul className="hidden gap-8 text-sm sm:flex">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-muted transition-colors hover:text-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="main">
          {/* --- Hero ------------------------------------------------ */}
          <section
            id="hero"
            className="mx-auto flex min-h-svh max-w-[var(--content-width)] flex-col justify-center px-8 pt-32"
          >
            <Reveal>
              <Kicker>{SITE.company}</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="max-w-[15ch]">Websites that win you the work.</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-[50ch] text-lg">
                I&rsquo;m {SITE.name.split(" ")[0]}, a web developer in{" "}
                {SITE.location}. I design and build fast, accessible sites for
                small businesses — then hand them over so you can actually run
                them.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="rounded-pill bg-brand px-7 py-3 font-display text-[0.9375rem] text-bg transition-colors hover:bg-brand-lift"
                >
                  See the work
                </a>
                <a
                  href="#contact"
                  className="rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand transition-colors hover:bg-brand hover:text-bg"
                >
                  Start a project
                </a>
              </div>
            </Reveal>
          </section>

          {/* --- Work: the centrepiece ------------------------------- */}
          <section id="work" className="border-y border-border/60 py-32">
            <div className="mx-auto max-w-[var(--content-width)] px-8">
              <Reveal>
                <Kicker>Selected work</Kicker>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="max-w-[18ch]">Three businesses, three different problems.</h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-[52ch]">
                  Every one of these had to earn something specific — a booking,
                  an enquiry, a first impression that held up.
                </p>
              </Reveal>

              <ul className="work-grid mt-20 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
                {WORK.map((item, i) => (
                  <li key={item.slug}>
                    <WorkCard item={item} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* --- About ----------------------------------------------- */}
          <section id="about" className="mx-auto max-w-[var(--content-width)] px-8 py-32">
            <div className="grid gap-16 md:grid-cols-[1fr_340px]">
              <div>
                <Reveal>
                  <Kicker>About</Kicker>
                </Reveal>
                <Reveal delay={0.08}>
                  <h2 className="max-w-[18ch]">Built properly, not just quickly.</h2>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-6 max-w-[52ch]">
                    I hold a BSc (Hons) in Cyber Security from Bath Spa
                    University, and I run {SITE.company}. The degree is why the
                    sites I build are secure, fast and accessible by default
                    rather than as an afterthought — it is not what I sell.
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <p className="mt-4 max-w-[52ch]">
                    What I sell is a website that does a job for your business,
                    delivered without jargon and handed over in a state you can
                    maintain.
                  </p>
                </Reveal>

                <Reveal delay={0.32}>
                  <ul className="mt-12 grid gap-x-10 gap-y-4 border-t border-border pt-10 sm:grid-cols-2">
                    {[
                      "Design and front-end build",
                      "Accessibility to WCAG AA",
                      "Performance and Core Web Vitals",
                      "WebGL and motion",
                      "Content structure and SEO",
                      "Hosting and handover",
                    ].map((skill) => (
                      <li key={skill} className="flex gap-3 text-[0.9375rem]">
                        <span aria-hidden="true" className="text-brand">
                          —
                        </span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <Reveal delay={0.16}>
                <Image
                  src={ASSETS["portrait"].path}
                  alt={ASSETS["portrait"].alt}
                  width={ASSETS["portrait"].width}
                  height={ASSETS["portrait"].height}
                  sizes="(min-width: 768px) 340px, 100vw"
                  className="h-auto w-full rounded-md border border-border"
                />
              </Reveal>
            </div>
          </section>

          {/* --- Services -------------------------------------------- */}
          <section id="services" className="border-y border-border/60 bg-bg-raised/40 py-32">
            <div className="mx-auto max-w-[var(--content-width)] px-8">
              <Reveal>
                <Kicker>Services</Kicker>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="max-w-[18ch]">What I can build for you.</h2>
              </Reveal>

              <ul className="mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2">
                {SERVICES.map((service, i) => (
                  <Reveal key={service.title} delay={0.08 * i} as="li">
                    <div className="border-t border-border pt-6">
                      <h3 className="text-xl text-text">{service.title}</h3>
                      <p className="mt-3 max-w-[42ch] text-[0.9375rem]">{service.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* --- Contact --------------------------------------------- */}
          <section id="contact" className="bg-brand py-28 text-bg">
            <div className="mx-auto max-w-[720px] px-8 text-center">
              <Reveal>
                <h2 className="text-bg">Got a project in mind?</h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mx-auto mt-5 max-w-[44ch] text-bg/80">
                  Tell me what your business does and who needs to find it.
                  I&rsquo;ll tell you what it takes.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-9 inline-block rounded-pill bg-bg px-8 py-3 font-display text-[0.9375rem] text-brand transition-colors hover:bg-text hover:text-bg"
                >
                  {SITE.email}
                </a>
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="py-16">
          <div className="mx-auto flex max-w-[var(--content-width)] flex-wrap items-center justify-between gap-6 px-8">
            <Mark className="h-10 w-10 text-border" />
            <p className="text-sm text-muted">
              {SITE.company} · {SITE.location}
            </p>
            <a
              href={SITE.links.linkedin}
              className="text-sm text-muted transition-colors hover:text-brand"
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </SceneHost>
  );
}
