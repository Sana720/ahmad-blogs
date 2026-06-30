import React from "react";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Products | Ahmad Blogs",
  description: "Browse high-quality chrome extensions, Next.js website templates, and CRM tools developed by Ahmad Blogs to simplify your dev workflow and business automation.",
  keywords: ["Chrome Extensions", "Notion Templates", "CRM", "Next.js Templates", "Digital Products", "Indie Hacking", "Developer Tools"],
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
    canonical: "https://ahmadblogs.com/products"
  }
};

export default function ProductsPage() {
  return <ProductsClient />;
}
