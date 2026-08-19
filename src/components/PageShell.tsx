import { Reveal } from "./Reveal";

/* Shared page furniture. Every route below the homepage uses this, so
 * heading levels, measure and spacing stay consistent without each page
 * re-deciding them. */

export function PageHeader({
  kicker,
  title,
  intro,
  updated,
}: {
  kicker: string;
  title: string;
  intro?: string;
  updated?: string;
}) {
  return (
    <header className="mx-auto max-w-[var(--content-width)] px-6 pb-16 pt-16 sm:px-8">
      <Reveal>
        <span className="mb-4 block font-display text-xs uppercase tracking-[0.2em] text-muted">
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="max-w-[16ch] text-[clamp(2.25rem,5vw,4rem)]">{title}</h1>
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[58ch] text-lg">{intro}</p>
        </Reveal>
      ) : null}
      {updated ? (
        <Reveal delay={0.2}>
          <p className="mt-6 text-sm text-muted">Last updated {updated}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

/* Long-form text. The legal pages carry real, checked wording, so the
 * styling here stays out of the way and only sets measure and rhythm. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-block mx-auto max-w-[68ch] px-6 pb-28 sm:px-8">{children}</div>
  );
}

export function Section({
  children,
  raised = false,
  id,
}: {
  children: React.ReactNode;
  raised?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`border-t border-border/60 py-24 ${raised ? "bg-bg-raised/40" : ""}`}
    >
      <div className="mx-auto max-w-[var(--content-width)] px-6 sm:px-8">{children}</div>
    </section>
  );
}
