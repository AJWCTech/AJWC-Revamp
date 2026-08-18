import { SITE } from "@/content/site";

/* Person and Organization, per the brief. Rendered as a script tag with
   JSON content — this is data, not executable code, and the type
   attribute stops it being parsed as script. */

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.name,
        jobTitle: "Cyber Security Graduate",
        email: `mailto:${SITE.email}`,
        url: SITE.url,
        address: { "@type": "PostalAddress", addressRegion: "Wiltshire", addressCountry: "GB" },
        sameAs: [SITE.links.linkedin].filter(Boolean),
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Bath Spa University",
        },
        worksFor: { "@id": `${SITE.url}/#org` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#org`,
        name: SITE.company,
        url: SITE.url,
        logo: `${SITE.url}/icon-512.png`,
        founder: { "@id": `${SITE.url}/#person` },
        address: { "@type": "PostalAddress", addressRegion: "Wiltshire", addressCountry: "GB" },
      },
    ],
  };

  /* All values are author-controlled constants, and application/ld+json
     is data rather than executable script. The escape is still applied
     so that a future edit to site.ts containing "</script>" cannot break
     out of the tag. */
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
