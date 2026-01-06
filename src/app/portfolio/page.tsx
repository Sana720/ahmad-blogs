import React from "react";
import PortfolioClient from "./PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Ahmad Blogs - Professional Projects",
  description: "Browse the portfolio of Ahmad Blogs. See recent projects, case studies, and client testimonials showcasing full-stack development and digital solutions.",
  keywords: ["Portfolio", "Projects", "Case Studies", "Web Development", "Client Testimonials"],
  authors: [{ name: "Ahmad Sana" }],
  publisher: "Ahmad Blogs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://ahmadblogs.com/portfolio"
  }
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
