import Image from "next/image";
import { SceneHost } from "@/components/SceneHost";
import { SITE, NAV } from "@/content/site";
import { ASSETS } from "@/content/assets";

/* Copy note: every factual claim I could not verify is marked
 * `TODO: confirm` rather than invented. Grep for it before launch. */

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="mb-4 block font-mono text-xs uppercase tracking-[0.18em] text-muted">
      <span className="text-brand">{n}</span> · {children}
    </span>
  );
}

export default function Home() {
  const work = [
    ASSETS["work-kritikal"],
    ASSETS["work-umbra"],
    ASSETS["work-white-phoenix"],
  ];

  return (
    <SceneHost>
      <div className="page-content">
        <header className="fixed inset-x-0 top-0 z-20 border-b border-border/60 bg-bg/70 backdrop-blur-md">
          <nav
            aria-label="Main"
            className="mx-auto flex max-w-[var(--content-width)] items-center justify-between px-8 py-4"
          >
            <a href="#main" className="flex items-center gap-3 text-text">
              {/* Inlined, not <img>: currentColor does not resolve inside
                  an SVG loaded as an image. */}
              <svg width="26" height="26" viewBox="0 0 64 64" fill="currentColor" className="text-brand" aria-hidden="true">
                <path fillRule="evenodd" d="M32.00 2.00 6.02 17.00 6.02 47.00 32.00 62.00 57.98 47.00 57.98 17.00Z M32.00 8.00 11.22 20.00 11.22 44.00 32.00 56.00 52.78 44.00 52.78 20.00Z" />
                <path d="M30.17 11.08 14.80 19.95 21.26 27.88 28.26 21.13Z" />
                <path d="M12.97 23.13 12.97 40.87 23.06 39.24 20.71 29.81Z" />
                <path d="M14.80 44.05 30.17 52.92 33.80 43.36 24.46 40.68Z" />
                <path d="M33.83 52.92 49.20 44.05 42.74 36.12 35.74 42.87Z" />
                <path d="M51.03 40.87 51.03 23.13 40.94 24.76 43.29 34.19Z" />
                <path d="M49.20 19.95 33.83 11.08 30.20 20.64 39.54 23.32Z" />
              </svg>
              <span className="font-display text-sm">{SITE.name}</span>
            </a>
            <ul className="flex gap-7 text-sm">
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
          {/* 1 — Hero */}
          <section
            id="hero"
            className="mx-auto flex min-h-svh max-w-[var(--content-width)] flex-col justify-center px-8 pt-32"
          >
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {SITE.company}
            </span>
            <h1 className="max-w-[16ch]">I break things, then I build them properly.</h1>
            <p className="mt-8 max-w-[52ch] text-lg">
              Cyber security graduate working towards OSCP, and director of a
              consultancy that ships production websites. Offensive security on
              one side, real delivery on the other.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#security"
                className="rounded-pill bg-brand px-7 py-3 font-display text-[0.9375rem] text-bg transition-colors hover:bg-brand-lift"
              >
                See the security work
              </a>
              <a
                href="#contact"
                className="rounded-pill border border-brand px-7 py-3 font-display text-[0.9375rem] text-brand transition-colors hover:bg-brand hover:text-bg"
              >
                Get in touch
              </a>
            </div>
          </section>

          {/* 2 — Security */}
          <section id="security" className="mx-auto max-w-[var(--content-width)] px-8 py-32">
            <Kicker n="01">Security</Kicker>
            <h2 className="max-w-[20ch]">Offensive work, done in the open.</h2>
            <p className="mt-6 max-w-[54ch]">
              I work boxes on HackTheBox and TryHackMe, and I am studying for
              OSCP. The point is not the badge count — it is that the same
              habits show up in the sites I build.
            </p>
            <dl className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
              {[
                ["OSCP", "In progress", "TODO: confirm target exam date"],
                ["HackTheBox", "TODO: confirm rank", "Active"],
                ["TryHackMe", "TODO: confirm rank", "Active"],
              ].map(([term, value, note]) => (
                <div key={term} className="border-l border-border pl-5">
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {term}
                  </dt>
                  <dd className="mt-2 font-display text-2xl text-text">{value}</dd>
                  <dd className="mt-1 font-mono text-xs text-muted">{note}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 3 — Work */}
          <section id="work" className="border-y border-border bg-bg-raised/60 py-32">
            <div className="mx-auto max-w-[var(--content-width)] px-8">
              <Kicker n="02">Work</Kicker>
              <h2 className="max-w-[20ch]">Three sites, three different problems.</h2>
              <p className="mt-6 max-w-[54ch]">
                Built through AJWC Tech Consulting. Fast, accessible and secure
                by default, then handed over so the owner can actually run them.
              </p>
              <ul className="mt-14 grid gap-10 md:grid-cols-3">
                {work.map((item) => (
                  <li key={item.path}>
                    <figure className="overflow-hidden rounded-md border border-border">
                      <Image
                        src={item.path}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className="h-auto w-full"
                      />
                    </figure>
                    <p className="mt-4 font-mono text-xs text-muted">{item.brief}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4 — About */}
          <section id="about" className="mx-auto max-w-[var(--content-width)] px-8 py-32">
            <Kicker n="03">About</Kicker>
            <div className="grid gap-14 md:grid-cols-[1fr_320px]">
              <div>
                <h2 className="max-w-[18ch]">Two halves of the same job.</h2>
                <p className="mt-6 max-w-[54ch]">
                  I finished a BSc in Cyber Security and started a company in
                  the same year. The consultancy pays for the lab time; the lab
                  time is why the consultancy&rsquo;s sites hold up.
                </p>
                <p className="mt-4 max-w-[54ch]">
                  Based in {SITE.location}. Available for security roles and for
                  build work.
                </p>
              </div>
              <Image
                src={ASSETS["portrait"].path}
                alt={ASSETS["portrait"].alt}
                width={ASSETS["portrait"].width}
                height={ASSETS["portrait"].height}
                className="h-auto w-full rounded-md border border-border"
              />
            </div>
          </section>

          {/* 5 — Education */}
          <section id="education" className="mx-auto max-w-[var(--content-width)] px-8 py-32">
            <Kicker n="04">Education</Kicker>
            <h2 className="max-w-[20ch]">Three years of coursework, kept online.</h2>
            <p className="mt-6 max-w-[54ch]">
              BSc (Hons) Cyber Security, Bath Spa University. Module work from
              all three years is archived and readable rather than summarised.
              {/* TODO: confirm — link target once the archive is migrated. */}
            </p>
          </section>

          {/* 6 — Contact */}
          <section id="contact" className="bg-brand py-28 text-bg">
            <div className="mx-auto max-w-[720px] px-8 text-center">
              <h2 className="text-bg">Let&rsquo;s talk.</h2>
              <p className="mx-auto mt-5 max-w-[46ch] text-bg/80">
                Hiring for a security role, or need a site that holds up? Either
                one, same inbox.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-9 inline-block rounded-pill bg-bg px-8 py-3 font-display text-[0.9375rem] text-brand transition-colors hover:bg-text hover:text-bg"
              >
                {SITE.email}
              </a>
            </div>
          </section>
        </main>

        <footer className="border-t border-border py-14">
          <div className="mx-auto flex max-w-[var(--content-width)] items-center justify-between px-8">
            <p className="font-mono text-xs text-muted">
              {SITE.company} · {SITE.location}
            </p>
            <a
              href={SITE.links.linkedin}
              className="font-mono text-xs text-muted transition-colors hover:text-brand"
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
