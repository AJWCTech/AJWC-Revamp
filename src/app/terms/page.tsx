import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/PageShell";
import { COMPANY } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "A personal portfolio and an archive of university work. Read it, download it, learn from it — don't submit it as your own.",
};

/* Wording carried over verbatim from the original site. */

export default function TermsPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Legal"
        title="Terms of Use"
        intro="The short version: this is a personal portfolio and an archive of my university work. Read it, download it, learn from it. Don't submit it as your own, and don't attack the server. The rest of this page is the same thing said properly."
        updated={COMPANY.updated}
      />

      <Prose>
        <h2>Who these terms are with</h2>
        <p>
          This site is operated by {COMPANY.name}, a private limited company
          registered in England &amp; Wales (company number {COMPANY.number}),
          registered office {COMPANY.office}. In these terms &ldquo;I&rdquo;,
          &ldquo;me&rdquo; and &ldquo;my&rdquo; mean that company.
        </p>
        <p>
          By using this site you accept these terms. If you do not accept them,
          please stop using the site.
        </p>

        <h2>What this site is</h2>
        <p>
          It is a portfolio: a record of my degree, my projects and my CV. It is
          not a product, a paid service, or a support channel, and nothing on it
          is an offer to enter into a contract.
        </p>
        <p>
          Much of the coursework here was written between 2021 and 2025 while I
          was a student. It reflects what I understood at the time and the tools
          that existed then. Security in particular moves quickly — treat older
          material as a record of my learning, not as current best practice.
        </p>

        <h2>Who owns what</h2>
        <p>
          The words, code, layout and design of this site, and the coursework
          and projects published on it, are mine unless stated otherwise, and
          are protected by copyright.
        </p>
        <p>
          Some documents reproduce or refer to material set by Bath Spa
          University — assignment briefs, provided datasets, module
          descriptions. That material belongs to the university, not to me, and
          it appears here only as context for my own answers.
        </p>
        <p>
          Third-party names, logos and trade marks that appear on the site
          belong to their owners.
        </p>

        <h2>Using my work</h2>
        <p>
          You are welcome to read, download and quote from this material for
          your own study, research or to assess me as a candidate. If you quote
          it, please credit me and link back to the page.
        </p>
        <p>
          Do not submit any of it as your own academic work. Every document here
          is attached to my name and student record and is publicly timestamped,
          which makes it exactly the kind of thing plagiarism-detection software
          finds. Copying it would be academic misconduct, and it would put your
          degree at risk rather than mine.
        </p>
        <p>
          You also may not republish this material as your own, sell it, or
          present it as the output of another person or business. For anything
          beyond personal or educational use, ask me first.
        </p>

        <h2>Acceptable use</h2>
        <p>Please do not:</p>
        <ul>
          <li>use the site for anything unlawful, or in a way that breaks these terms;</li>
          <li>
            attempt to gain access to any part of the site, server or account
            you are not authorised to reach;
          </li>
          <li>
            upload or transmit anything malicious, or anything designed to
            interfere with the site&rsquo;s operation;
          </li>
          <li>
            use the contact form to send spam, bulk marketing or abusive
            messages;
          </li>
          <li>
            scrape, mirror or bulk-download the site in a way that places
            unreasonable load on it, or republish it wholesale elsewhere.
          </li>
        </ul>

        <h2>Security testing</h2>
        <p>
          Good-faith security research is welcome, and I would genuinely rather
          hear about a problem than not. If you find something, the reporting
          details are in security.txt.
        </p>
        <p>
          Please keep testing proportionate: no denial-of-service or load
          testing, no automated scanning heavy enough to affect availability, no
          attempt to access data belonging to anyone else, and no social
          engineering of me or my hosting provider. Testing that stays inside
          those limits is fine by me. Testing outside them is not authorised,
          and nothing on this page should be read as permission for it.
        </p>
        <p>
          There is no bug bounty and no payment offered. I am happy to credit
          you if you would like that.
        </p>

        <h2>No professional advice</h2>
        <p>
          The security, networking and development material on this site is
          published to show my work. It is general information, not professional
          advice, and it is not tailored to anyone&rsquo;s circumstances. Do not
          rely on it to secure a real system without taking proper advice for
          your own situation.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Where this site links elsewhere, those sites are not under my control
          and I am not responsible for their content or their handling of your
          information.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the law of England and Wales, and the
          courts of England and Wales have exclusive jurisdiction.
        </p>
      </Prose>
    </main>
  );
}
