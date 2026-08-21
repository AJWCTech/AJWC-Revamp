import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SITE, ENQUIRY_GROUPS } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Enquiries about new sites, quotes, contract work and support. Based in Wiltshire, UK.",
};

/* The form posts to contact.php, which is passed through public/ and is
 * the original hardened handler (honeypot, per-IP rate limit,
 * same-origin check). That only runs on an Apache/PHP host — if this is
 * deployed anywhere else, the form needs replacing with a route handler.
 * Flagged in the README rather than silently broken. */

export default function ContactPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Contact"
        title="Get in touch"
        intro={`Tell me what your business does and what you need the site to do. Based in ${SITE.location}, working with clients anywhere.`}
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-28 sm:px-8">
        <div className="grid gap-16 md:grid-cols-[1fr_300px]">
          <Reveal>
            <form action="/contact.php" method="post" className="max-w-[46ch]">
              {/* Honeypots: real people never fill these in. contact.php
                  checks BOTH `website` and `company_url` — the form only
                  had the first, so half the trap was missing. Hidden from
                  assistive tech as well as sight, so it is not a trap for
                  screen reader users either. */}
              <p className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                <label htmlFor="company_url">Leave this field empty too</label>
                <input
                  type="text"
                  id="company_url"
                  name="company_url"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </p>

              <div className="mb-6">
                <label htmlFor="name" className="mb-2 block text-sm text-text">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-sm border border-border bg-bg-card px-4 py-3 text-text"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="mb-2 block text-sm text-text">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-sm border border-border bg-bg-card px-4 py-3 text-text"
                />
              </div>

              {/* Posted as `subject`, which contact.php requires and puts
                  in the email subject line. It was a free-text input and
                  was NOT marked required — the handler rejects an empty
                  subject, so an enquiry sent without one silently failed. */}
              <div className="mb-6">
                <label htmlFor="subject" className="mb-2 block text-sm text-text">
                  What is this about?
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  defaultValue=""
                  className="form-select w-full rounded-sm border border-border bg-bg-card px-4 py-3 text-text"
                >
                  <option value="" disabled>
                    Choose one…
                  </option>
                  {ENQUIRY_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="mb-2 block text-sm text-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full rounded-sm border border-border bg-bg-card px-4 py-3 text-text"
                />
              </div>

              <button
                type="submit"
                className="btn-sweep rounded-pill bg-brand px-8 py-3 font-display text-[0.9375rem] text-bg"
              >
                Send enquiry
              </button>

              <p className="mt-6 text-sm text-muted">
                What happens to this is set out in the{" "}
                <Link href="/privacy" className="text-brand">
                  privacy policy
                </Link>
                .
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="over-scene rounded-md border border-border p-6">
              <h2 className="text-lg text-text">Direct contact</h2>
              <ul className="mt-5 grid gap-3 text-sm">
                <li>
                  <a href={`mailto:${SITE.email}`} className="link-sweep text-brand">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.links.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="link-sweep text-muted"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
