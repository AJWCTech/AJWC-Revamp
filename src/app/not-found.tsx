import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { NAV } from "@/content/site";

export default function NotFound() {
  return (
    <main id="main">
      <PageHeader
        kicker="404"
        title="That page isn't here."
        intro="It may have moved, or the link may be wrong. Everything the site has is below."
      />

      <div className="mx-auto max-w-[var(--content-width)] px-6 pb-32 sm:px-8">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <Link href="/" className="link-sweep text-muted">
              Home
            </Link>
          </li>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="link-sweep text-muted">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
