import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { SceneHost } from "@/components/SceneHost";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

/* next/font self-hosts these at build time, so there is no request to
   Google and no flash of unstyled text. `display: swap` plus a fallback
   with matching metrics keeps CLS at zero. */
const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* JetBrains Mono was removed deliberately. It carried the old
   "mono means evidence" rule, which reads as terminal — exactly the
   aesthetic this site must not have. Small labels now use the display
   face in uppercase with wide tracking instead. */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/logo/ajwc-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full">
        {/* Applies the saved theme before first paint. Without this the
            page renders dark for a frame and then flips, which is worse
            than not offering a light theme at all.

            NOTE: this is an inline script. The original site's .htaccess
            sets script-src 'self' with no 'unsafe-inline' — if that CSP
            is reused for this build, this needs a nonce or a hash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ajwc-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {/* SceneHost owns the one persistent canvas and the scroll
            provider, so the 3D survives navigation between pages rather
            than being torn down and rebuilt per route. */}
        <SceneHost>
          <SiteNav />
          <div className="page-content pt-24">{children}</div>
          <SiteFooter />
        </SceneHost>
        <JsonLd />
      </body>
    </html>
  );
}
