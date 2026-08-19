import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "freight forwarding UAE",
    "Dubai logistics company",
    "sea freight Jebel Ali",
    "air freight Dubai",
    "GCC land transport",
    "customs clearance UAE",
    "bonded warehousing JAFZA",
    "project cargo Middle East",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/images/hero/hero-poster.jpg",
        width: 2400,
        height: 1350,
        alt: `${site.name} container operations`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/hero/hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Organisation schema so search engines resolve the business entity cleanly. */
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  description: site.description,
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}`,
    addressLocality: site.contact.address.city,
    addressCountry: "AE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.contact.phone,
    email: site.contact.email,
    contactType: "sales",
    areaServed: "Worldwide",
    availableLanguage: ["English", "Arabic"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, developer-authored schema — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <SmoothScroll>
          <Cursor />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
