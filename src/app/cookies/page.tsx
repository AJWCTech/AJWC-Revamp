import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/PageShell";
import { COMPANY } from "@/content/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "This site sets one cookie, and only if you submit the contact form. No analytics, no advertising, no tracking.",
};

/* Wording carried over verbatim from the original site. This is a
 * published policy describing real behaviour — do not reword it to suit
 * the new design. If the site's cookie behaviour changes, this page
 * changes first. */

export default function CookiesPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Legal"
        title="Cookie Policy"
        intro="This site sets one cookie, and only if you submit the contact form. There is no analytics, no advertising and no tracking of any kind — which is why you are not being made to click through a consent banner."
        updated={COMPANY.updated}
      />

      <Prose>
        <h2>What a cookie is</h2>
        <p>
          A cookie is a small text file a website asks your browser to store, so
          it can recognise the same browser on a later request. They are not
          inherently a privacy problem — the problem is what most sites use them
          for, which is following you between sites to build an advertising
          profile. This one does not do that.
        </p>

        <h2>The only cookie this site uses</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Set when</th>
                <th>Purpose</th>
                <th>Expires</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PHPSESSID</td>
                <td>Only at the moment you submit the contact form</td>
                <td>
                  Counts recent submissions from your browser so the form cannot
                  be used to send floods of spam
                </td>
                <td>When you close your browser</td>
                <td>Strictly necessary</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          It holds a random session identifier and nothing else — no name, no
          email address, no browsing history. It is set with the HttpOnly flag,
          so scripts running in the page cannot read it, and SameSite=Lax, so
          your browser will not send it to other websites. On an HTTPS
          connection it is also marked Secure.
        </p>

        <h2>Why there is no cookie banner</h2>
        <p>
          Under the Privacy and Electronic Communications Regulations (PECR),
          consent is required for cookies except those strictly necessary to
          deliver a service you have asked for. The session cookie above exists
          only to stop the contact form being abused, and it is set only when
          you choose to use that form — so it falls inside that exemption.
        </p>
        <p>
          If this site ever adds analytics or anything that tracks you, that
          will require a proper consent banner, and this page will change first.
        </p>

        <h2>What this site does not use</h2>
        <ul>
          <li>
            No analytics of any kind — no Google Analytics, no visitor counters,
            no heatmaps.
          </li>
          <li>No advertising or retargeting pixels.</li>
          <li>
            No embedded social media widgets. The GitHub and LinkedIn links in
            the footer are ordinary links — nothing loads from those companies,
            and nothing is sent to them, unless you click through.
          </li>
          <li>
            No third-party fonts or scripts. Typefaces and the animation
            libraries this site uses are served from this domain, so loading a
            page does not tell Google or anyone else that you visited.
          </li>
          <li>No localStorage, sessionStorage or other browser storage.</li>
          <li>No fingerprinting, and no attempt to identify you across sites.</li>
        </ul>

        <h2>One thing worth flagging</h2>
        <p>
          If you open my CV in the viewer on a phone, the PDF is displayed
          through Google&rsquo;s document viewer, because mobile browsers handle
          embedded PDFs poorly. That request goes to Google and Google may set
          its own cookies, under its own policies, not mine.
        </p>
        <p>
          If you would rather that did not happen, download the PDF from the CV
          page instead — that is served directly from this site with no third
          party involved.
        </p>
      </Prose>
    </main>
  );
}
