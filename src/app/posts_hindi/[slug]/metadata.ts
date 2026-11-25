import { Metadata } from "next";
import { getHindiPostBySlug } from "@/utils/getHindiPostBySlug";

interface GenerateMetadataProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const post = await getHindiPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ahmad Blogs (हिंदी)`,
    description: post.summary || post.title,
    alternates: {
      canonical: `/posts_hindi/${post.slug}`,
      languages: {
        "hi": `/posts_hindi/${post.slug}`,
        "en": `/posts/${post.slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | Ahmad Blogs (हिंदी)`,
      description: post.summary || post.title,
      locale: "hi_IN",
      type: "article",
      url: `/posts_hindi/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ahmad Blogs (हिंदी)`,
      description: post.summary || post.title,
    },
  };
}
