import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Prose } from "@/components/PageShell";
import { COMPANY, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "No analytics, no advertising, no tracking. What happens to anything you send through the contact form.",
};

/* Wording carried over verbatim from the original site, including the
 * real company number, ICO registration and registered office. Do not
 * edit these without checking Companies House and the ICO register. */

export default function PrivacyPage() {
  return (
    <main id="main">
      <PageHeader
        kicker="Legal"
        title="Privacy Policy"
        intro="This site has no analytics, no advertising and no tracking. The only personal information it handles is what you type into the contact form, plus the IP address that comes with it. This page explains exactly what happens to it."
        updated={COMPANY.updated}
      />

      <Prose>
        <h2>Who is responsible</h2>
        <p>
          This website is operated by {COMPANY.name}, a private limited company
          registered in England &amp; Wales, which is the data controller for
          the information described below.
        </p>
        <div className="table-scroll">
          <table>
            <tbody>
              <tr>
                <th>Company number</th>
                <td>{COMPANY.number}</td>
              </tr>
              <tr>
                <th>ICO registration</th>
                <td>{COMPANY.ico}</td>
              </tr>
              <tr>
                <th>Registered office</th>
                <td>{COMPANY.office}</td>
              </tr>
              <tr>
                <th>Data protection contact</th>
                <td>
                  {COMPANY.contact} — <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          I am the named data protection contact on the ICO register. This is a
          one-person company, so anything you send about your information comes
          straight to me rather than to a department.
        </p>

        <h2>What I collect, and why</h2>
        <p>
          Only the contact form collects personal information. Nothing is
          collected from simply reading the site.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Information</th>
                <th>When</th>
                <th>Why</th>
                <th>Lawful basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name, email address, subject, message</td>
                <td>Only when you submit the contact form</td>
                <td>So I can read your message and reply to it</td>
                <td>
                  Legitimate interests — responding to an enquiry you chose to
                  send
                </td>
              </tr>
              <tr>
                <td>Your IP address</td>
                <td>Recorded alongside a form submission</td>
                <td>To identify and block spam and abuse of the form</td>
                <td>
                  Legitimate interests — keeping the form usable and secure
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          I do not use your details for marketing, I do not add you to any
          mailing list, and I do not sell or share them with anyone for their
          own purposes.
        </p>

        <h2>Cookies</h2>
        <p>
          This site sets one cookie, and only at the moment you submit the
          contact form. It is a standard PHP session cookie used to limit how
          many times the form can be submitted in a short period, which is what
          stops it being used to send spam.
        </p>
        <p>
          It contains no personal information, it is not used to track you, and
          it is deleted when you close your browser. Because it is strictly
          necessary for a service you have asked for, it does not require
          consent — which is why you are not being shown a cookie banner. The{" "}
          <Link href="/cookies">cookie policy</Link> covers this in full.
        </p>
        <p>
          There are no analytics cookies, advertising cookies or third-party
          trackers on this site. Fonts are served from this domain rather than
          from Google, so reading the site does not reveal your visit to anyone
          else.
        </p>

        <h2>Who else can see it</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Who</th>
                <th>Role</th>
                <th>What they see</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fasthosts</td>
                <td>Web hosting</td>
                <td>
                  Hosts this site and processes the form submission on my
                  behalf. UK based.
                </td>
              </tr>
              <tr>
                <td>Google (Gmail)</td>
                <td>Email provider</td>
                <td>
                  Your message is delivered to a Gmail inbox, so it is stored on
                  Google&rsquo;s systems.
                </td>
              </tr>
              <tr>
                <td>Google (Docs viewer)</td>
                <td>Document preview</td>
                <td>
                  Only if you open the CV viewer on a phone: the CV is displayed
                  through Google&rsquo;s document viewer, so Google sees that
                  request.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Your rights</h2>
        <p>
          You can ask me for a copy of what I hold about you, ask me to correct
          it, or ask me to delete it. Write to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I will respond
          within one month. If you are not happy with how I have handled it, you
          can complain to the Information Commissioner&rsquo;s Office at
          ico.org.uk.
        </p>
      </Prose>
    </main>
  );
}
