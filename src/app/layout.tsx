
import type { Metadata } from "next";
import { Geist, Geist_Mono, Mulish } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "../utils/analytics";
import { Analytics } from "@vercel/analytics/next"

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
  title: "Ahmed Blogs",
  description: "Ahmed Blogs - Latest posts, news, and updates.",
  openGraph: {
    title: "Ahmed Blogs",
    description: "Ahmed Blogs - Latest posts, news, and updates.",
    url: "https://ahmadblogs.com/",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 512,
        height: 512,
        alt: "Ahmed Blogs Logo",
      },
    ],
    siteName: "Ahmed Blogs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Blogs",
    description: "Ahmed Blogs - Latest posts, news, and updates.",
    images: ["/favicon.svg"],
    creator: "@ahmadblogs"
  },
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
      </head>
      <body
        className={`${mulish.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-mulish), Mulish, sans-serif' }}
      >
        {children}
         <Analytics />
      </body>
    </html>
  );
}
