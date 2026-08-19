import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/* Required by output: "export" — a metadata route without this fails the
   build with "export const dynamic ... not configured". Any new metadata
   route needs the same line. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
