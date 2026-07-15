import { getHindiPostBySlug } from "@/utils/getHindiPostBySlug";
import MarkdownRenderer from "@/app/posts/[slug]/MarkdownRenderer";
import { notFound } from "next/navigation";
import { publisher } from "@/utils/publisherSchema";
import Head from "next/head";

export const revalidate = 1; // Revalidate dynamic pages every second (near real-time)

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
    "author": post.authorId ? {
      "@type": "Person",
      "name": post.authorId,
      "url": "https://ahmadblogs.com/about",
      "sameAs": [
        "https://github.com/Sana720",
        "https://twitter.com/ahmadblogs"
      ]
    } : undefined,
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

        {/* Quick Summary Block (AEO) */}
        {post.content && (
          <div style={{ background: '#f9f9f9', borderLeft: '4px solid #3CB371', padding: '16px', borderRadius: '0 8px 8px 0', margin: '20px 0' }}>
            <strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3CB371', display: 'block', marginBottom: '4px' }}>
              त्वरित सारांश (Quick Summary / Direct Answer)
            </strong>
            <p style={{ margin: 0, fontSize: '15px', color: '#232946', fontWeight: 600, lineHeight: 1.6 }}>
              {post.content.replace(/[#*`_]/g, '').slice(0, 180)}...
            </p>
          </div>
        )}

        <MarkdownRenderer content={post.content} />

        {/* Citations & References (GEO) */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #eee', fontSize: '12px', color: '#888' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Citations & References:</p>
          <p style={{ margin: 0 }}>
            Originally published on <a href={canonicalUrl} style={{ textDecoration: 'underline', color: '#3CB371' }}>{canonicalUrl}</a>. 
            Content verified and published by <span style={{ fontWeight: 500, color: '#555' }}>Ahmad Blogs</span>. 
            For professional inquiries or permissions, contact our editorial team.
          </p>
        </div>
      </main>
    </>
  );
}
