import { Metadata } from "next";

export const metadata: Metadata = {
  title: "हिंदी पोस्ट्स | Ahmad Blogs",
  description: "सभी हिंदी ब्लॉग पोस्ट्स यहाँ पढ़ें।",
  alternates: {
    canonical: "/posts_hindi",
    languages: {
      "hi": "/posts_hindi",
      "en": "/posts",
    },
  },
  openGraph: {
    title: "हिंदी पोस्ट्स | Ahmad Blogs",
    description: "सभी हिंदी ब्लॉग पोस्ट्स यहाँ पढ़ें।",
    locale: "hi_IN",
    type: "website",
    url: "/posts_hindi",
  },
  twitter: {
    card: "summary_large_image",
    title: "हिंदी पोस्ट्स | Ahmad Blogs",
    description: "सभी हिंदी ब्लॉग पोस्ट्स यहाँ पढ़ें।",
  },
};
