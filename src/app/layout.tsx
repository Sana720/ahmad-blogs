
import type { Metadata } from "next";
import { Geist, Geist_Mono, Mulish } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "../utils/analytics";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import WhatsAppButton from "../components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadblogs.com"),
  title: "Ahmad Blogs",
  description: "Ahmad Blogs is your go-to resource for AI, coding, freelancing, and tech insights. Discover tutorials, industry news, and expert tips to help you grow as a developer or digital entrepreneur.",
  openGraph: {
    title: "Ahmad Blogs",
    description: "Explore Ahmad Blogs for the latest in AI, programming, freelancing, and digital trends. Get actionable guides, news, and resources for tech professionals and enthusiasts.",
    url: "https://ahmadblogs.com/",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 512,
        height: 512,
        alt: "Ahmad Blogs Logo",
      },
    ],
    siteName: "Ahmad Blogs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Blogs",
    description: "Follow Ahmad Blogs for expert tips, tutorials, and news on AI, coding, freelancing, and tech. Stay ahead in the digital world!",
    images: ["/favicon.svg"],
    creator: "@ahmadblogs"
  },
};

// Structured data for SEO (WebSite schema)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ahmed Blogs",
  "url": "https://ahmadblogs.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ahmadblogs.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        {/* Preconnects for Cloudinary and analytics to reduce connection time */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link
          rel="preload"
          as="image"
          href="/placeholder.png"
        />
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${mulish.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-mulish), Mulish, sans-serif' }}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <WhatsAppButton />
      </body>
    </html>
  );
}
