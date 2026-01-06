import React from "react";
import GuestPostClient from "./GuestPostClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Guest Post | Ahmad Blogs",
  description: "Share your insights with our audience. Submit a guest post to Ahmad Blogs and contribute to the community of developers, designers, and tech enthusiasts.",
  keywords: ["Guest Post", "Submit Article", "Write for Us", "Tech Blog"],
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
    canonical: "https://ahmadblogs.com/guest-post"
  }
};

export default function GuestPostPage() {
  return <GuestPostClient />;
}
