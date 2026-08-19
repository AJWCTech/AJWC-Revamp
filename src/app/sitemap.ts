import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { PROJECT_PAGES } from "@/content/projects";

/* Built from the same data the pages are, so a new project area appears
 * in the sitemap without anyone remembering to add it here. */

const STATIC_ROUTES = [
  ["", 1.0],
  ["/work", 0.9],
  ["/services", 0.9],
  ["/about", 0.8],
  ["/projects", 0.8],
  ["/university", 0.7],
  ["/cv", 0.8],
  ["/cv/view", 0.5],
  ["/contact", 0.8],
  ["/privacy", 0.3],
  ["/terms", 0.3],
  ["/cookies", 0.3],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-19");

  return [
    ...STATIC_ROUTES.map(([path, priority]) => ({
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...Object.keys(PROJECT_PAGES).map((area) => ({
      url: `${SITE.url}/projects/${area}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
