# Deployment and hosting options

**Status:** decision needed
**Written:** 19 August 2026

Everything below was tested against this repo, not assumed. Where a claim
comes from a build I ran, it says so.

---

## The short version

**You can stay on Fasthosts.** A static export builds cleanly, keeps your
existing `.html` URLs, and keeps `contact.php` working.

**But there is one real cost**, and it is the thing you deliberately built:
your hardened Content-Security-Policy has to be relaxed. Details in
[The CSP problem](#the-csp-problem). If that matters more to you than
staying put, move to Vercel instead.

---

## What was tested

I set `output: "export"` and ran a production build. Results:

| Check | Result |
|---|---|
| Build completes | ✅ 22 routes, all prerendered |
| Output size | ✅ 4.8 MB total |
| **Original URLs preserved** | ✅ `out/privacy.html`, `out/cv.html`, `out/work.html` — **not** `/privacy/` |
| `contact.php` passes through | ✅ present in `out/` |
| 16 university module pages | ✅ all present, original paths intact |
| Sitemap and robots | ✅ served correctly |
| OG image | ⚠️ exports **without a file extension** — see below |
| Inline scripts vs strict CSP | ❌ blocked — see below |

**Correction to something I told you earlier.** At the start of this
project I warned that moving to Next would change your URLs from
`/privacy.html` to `/privacy/`. That turns out to be wrong for Next 16 —
the export emits real `.html` files at the original paths. Every existing
inbound link and bookmark survives. This removes what I had thought was
the biggest objection to a framework.

---

## The CSP problem

Your current `.htaccess` sets:

```
script-src 'self'
```

with no `'unsafe-inline'`. That is a genuinely strong policy and it is
better than most commercial sites manage.

Next.js cannot satisfy it on a static host. I extracted the inline
scripts from the built `index.html`:

| Inline script | Size | Hash stable across builds? |
|---|---|---|
| Theme init (mine, prevents a flash of dark) | 136 B | ✅ yes |
| JSON-LD structured data | 856 B | ✅ yes |
| `__next_f` bootstrap | 43 B | ✅ yes |
| **React hydration payload** | **23.8 KB** | ❌ **no — changes every build** |

That last one is the blocker. It carries your page content, so its hash
changes whenever the content does.

**Why the usual fixes do not work here:**

- **Hashes** — you would have to recompute and paste a new hash into
  `.htaccess` on every single deploy. One forgotten update and the site
  silently stops working.
- **Nonces** — the correct solution, but a nonce must be generated per
  request by a server. A static export has no server.

**What happens if you deploy with the strict CSP unchanged:** the HTML
and CSS load, so the site *looks* fine for a moment, and then nothing
works. No 3D, no theme toggle, no motion toggle, no mobile menu. React
never boots.

**So the choice is:**

| Option | CSP outcome |
|---|---|
| Fasthosts static export | `script-src 'self' 'unsafe-inline'` — meaningfully weaker |
| Vercel / any Node host | `script-src 'self' 'nonce-…'` via middleware — as strong as now, arguably stronger |

For a site with no login, no user accounts and no user-generated content,
`'unsafe-inline'` is a much smaller real-world risk than it would be on
an application. It is a genuine downgrade, not a catastrophe.

---

## Option A — Fasthosts, static export

**Best if:** you want to change nothing about hosting, keep the contact
form exactly as it is, and pay nothing extra.

**Pros**

- No migration. Same host, same domain, same FTP upload you already do.
- `contact.php` keeps working, with its honeypot, rate limit and
  same-origin check intact.
- Original `.html` URLs preserved — nothing breaks.
- No new accounts, no vendor lock-in, no monthly cost.

**Cons**

- CSP must be relaxed to `'unsafe-inline'` (above).
- `next/image` runs with `unoptimized: true`, so images ship at their
  source size and format. Your images are already sized sensibly, so the
  practical cost is small — but there is no automatic AVIF/WebP.
- Manual deploys. No preview builds, no rollback, no CI.
- The OG image needs a MIME fix (below).

**Steps**

1. Build:
   ```bash
   npm run build
   ```
2. Upload the entire contents of `out/` to your web root.
3. Add these to `.htaccess`:

   ```apache
   # The OG card exports without a file extension, so Apache would serve
   # it as application/octet-stream and some scrapers reject that.
   <Files "opengraph-image">
     ForceType image/png
   </Files>

   # Required for Next to hydrate. See DEPLOYMENT.md - the hydration
   # payload's hash changes every build, so a hash allow-list is not
   # maintainable and nonces need a server.
   Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"
   ```
4. Check `/privacy.html`, `/cv.html`, a university module page, and submit
   the contact form once.

---

## Option B — Vercel

**Best if:** you want the strongest technical result and are willing to
rebuild the contact form.

**Pros**

- Built by the Next.js team; zero configuration.
- **Proper CSP with per-request nonces** via middleware — strictly better
  than what you have now.
- Automatic image optimisation (AVIF/WebP, correct sizes per device).
- Deploy on `git push`. Preview URL for every branch. One-click rollback.
- Free tier comfortably covers a portfolio.

**Cons**

- **`contact.php` dies.** PHP does not run on Vercel. The form needs
  rewriting as a route handler plus an email service (Resend and Postmark
  both have free tiers). That is perhaps an hour of work, and the
  honeypot and rate limiting have to be reimplemented.
- DNS moves to Vercel. Your Fasthosts email, if any, is unaffected — but
  check before switching nameservers.
- Vendor dependency for a site that currently has none.

**Steps**

1. Remove `output: "export"` and `images: { unoptimized: true }` from
   `next.config.ts`.
2. Import the GitHub repo at vercel.com. It detects Next automatically.
3. Rewrite the contact form as `src/app/api/contact/route.ts`.
4. Add `middleware.ts` for the nonce-based CSP.
5. Point DNS at Vercel.

---

## Option C — Cloudflare Pages

**Best if:** you want Vercel's workflow without Vercel.

Effectively the same trade as Option B — same PHP problem, same CI
benefits, generous free tier, and excellent global performance. Slightly
more fiddly for Next specifically. Worth considering mainly if you already
use Cloudflare for DNS.

---

## Option D — split hosting

Static site on Vercel or Cloudflare, `contact.php` left on Fasthosts and
posted to cross-origin.

**I would not.** It means CORS configuration, two hosts to maintain, two
places to renew, and the same-origin check in `contact.php` has to be
loosened — which is one of the protections that makes it worth keeping.
The complexity buys nothing that Option B does not do better.

---

## Recommendation

**Start with Option A.** Deploy to Fasthosts, accept the CSP relaxation,
and get the site live. Nothing about that decision is hard to reverse —
the same repo deploys to Vercel by deleting two lines from
`next.config.ts`.

**Move to Option B when the contact form is next due attention.** At that
point you are rewriting the handler anyway, so the main cost of the move
has already been paid, and you get the stronger CSP and image
optimisation as a bonus.

The one thing I would not do is stay on Option A *and* tell yourself the
CSP is still hardened. It will not be, and the security.txt on your site
invites people to look.

---

## Open questions for you

1. **Domain** — `src/content/site.ts` still has `ajwctechconsulting.com`
   as a placeholder. Confirm before deploying: it is baked into the
   sitemap, the OG tags and the JSON-LD.
2. **Contact email** — currently a personal Gmail address. A business
   address on the domain would read better to clients.
3. **The old site** — does `portfolio-site/` stay live anywhere, or does
   this replace it entirely? If it is replaced, the university module URLs
   are preserved by this build, so nothing breaks either way.
