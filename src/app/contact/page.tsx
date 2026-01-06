import React from "react";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Ahmad Blogs",
  description: "Get in touch with Ahmad Blogs. We'd love to hear from you! Send us your questions, suggestions, or just say hello.",
  keywords: ["Contact", "Ahmad Blogs", "Support", "Inquiry"],
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
    canonical: "https://ahmadblogs.com/contact"
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
