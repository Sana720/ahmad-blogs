import { getHindiPostBySlug } from "@/utils/getHindiPostBySlug";
import MarkdownRenderer from "@/app/posts/[slug]/MarkdownRenderer";
import { notFound } from "next/navigation";
import { publisher } from "@/utils/publisherSchema";
import Head from "next/head";

interface HindiPostDetailProps {
  params: { slug: string };
}

export default async function HindiPostDetail({ params }: HindiPostDetailProps) {
  const { slug } = params;
  const post = await getHindiPostBySlug(slug);
  if (!post) return notFound();
  // Article schema for SEO
  const canonicalUrl = `https://ahmadblogs.com/posts_hindi/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.content?.slice(0, 160) || post.title,
    "image": post.coverImage || "/default-og.png",
    "author": post.authorId ? { "@type": "Person", "name": post.authorId } : undefined,
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt,
    "url": canonicalUrl,
    "publisher": publisher,
    "mainEntityOfPage": canonicalUrl
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ahmadblogs.com/" },
      { "@type": "ListItem", "position": 2, "name": "हिंदी पोस्ट्स", "item": "https://ahmadblogs.com/posts_hindi" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
    ]
  };
  const faqSchema = post.content && post.content.includes('Q:') ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.content.split('Q:').slice(1).map((q, i) => {
      const [question, answer] = q.split('A:');
      return {
        "@type": "Question",
        "name": question.trim(),
        "acceptedAnswer": { "@type": "Answer", "text": answer ? answer.trim() : '' }
      };
    })
  } : null;
  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <link rel="alternate" href={canonicalUrl} hrefLang="hi" />
        <link rel="alternate" href={`https://ahmadblogs.com/posts/${post.slug}`} hrefLang="en" />
      </Head>
      <main>
        <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(schema)}</script>
        <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(faqSchema)}</script>}
        <h1>{post.title}</h1>
        <div style={{background:'#ffe',color:'#b00',padding:'8px',margin:'8px 0',fontSize:'14px'}}>
          <div><b>Debug:</b></div>
          <div>URL Slug: <code>{slug}</code></div>
          <div>Firestore Slug: <code>{post.slug}</code></div>
          <div>Equal: <b>{slug === post.slug ? 'YES' : 'NO'}</b></div>
        </div>
        <MarkdownRenderer content={post.content} />
        {/* Add SocialShare, Comments, etc. as needed */}
      </main>
    </>
  );
}
