import type { Metadata } from "next";
// Dynamic metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Reuse getPostBySlug logic
  const postsSnap = await getDocs(collection(db, "posts"));
  let postDoc = postsSnap.docs.find((doc) => {
    const data = doc.data() as Post;
    return data.slug === params.slug;
  });
  if (!postDoc) {
    postDoc = postsSnap.docs.find((doc) => doc.id === params.slug);
  }
  if (!postDoc) {
    return {
      title: "Post Not Found | Ahmad Blogs",
      description: "This post could not be found.",
    };
  }
  const post = postDoc.data() as Post;
  post.slug = post.slug || postDoc.id;
  const canonicalUrl = `https://ahmadblogs.com/posts/${post.slug}`;
  const description = post.excerpt || (typeof post.content === 'string' ? post.content.slice(0, 160) : post.title);
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [post.image || "/default-og.png"],
      siteName: "Ahmad Blogs",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.image || "/default-og.png"],
      site: "@ahmadblogs",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        hi: `https://ahmadblogs.com/posts_hindi/${post.slug}`,
      },
    },
    metadataBase: new URL("https://ahmadblogs.com"),
  };
}
import Image from "next/image";
import { publisher } from "../../../utils/publisherSchema";
import Head from "next/head";
import PostClientContent from "./PostClientContent";
import Header from "../../../components/Header";
import CategoryMenu from "../../../components/CategoryMenu";
import Footer from "../../../components/Footer";
import { notFound } from 'next/navigation';
import { db } from "../../../utils/firebase";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { getAuthorAvatarByName } from "./getAuthorAvatar";
import MarkdownRenderer from './MarkdownRenderer';
import styles from './postContent.module.css';

export const revalidate = 60; // ISR: revalidate every 60 seconds

type Post = {
  slug: string;
  title: string;
  author?: string;
  created?: string;
  categories?: string[];
  content?: string;
  image?: string;
  featured?: boolean;
  date?: string;
  category?: string | string[];
  excerpt?: string;
  authorAvatar?: string;
  tags?: string[];
};

async function getPostBySlug(slug: string): Promise<{ post: Post; postDoc: any } | null> {
  const postsSnap = await getDocs(collection(db, "posts"));
  // Try to find by slug field first
  let postDoc = postsSnap.docs.find((doc) => {
    const data = doc.data() as Post;
    return data.slug === slug;
  });
  // Fallback: try to find by document ID (for legacy posts)
  if (!postDoc) {
    postDoc = postsSnap.docs.find((doc) => doc.id === slug);
  }
  if (!postDoc) return null;
  const post = postDoc.data() as Post;
  post.slug = post.slug || postDoc.id;
  return { post, postDoc };
}

async function getSimilarPosts(currentSlug: string, currentCategories: string[] = []) {
  const postsSnap = await getDocs(collection(db, "posts"));
  // Exclude current post by both doc.id and slug field
  const allPosts: Post[] = postsSnap.docs
    .filter((doc) => doc.id !== currentSlug && doc.data().slug !== currentSlug)
    .map((doc) => {
      const data = doc.data() as Post;
      return { ...data, slug: data.slug || doc.id };
    });
  // Find similar by category
  const similar = allPosts.filter((p) =>
    p.category && currentCategories.some((cat: string) =>
      Array.isArray(p.category) ? (p.category as string[]).includes(cat) : p.category === cat
    )
  );
  // Fill up to 3 with unique posts only
  const seen = new Set(similar.map(p => p.slug));
  for (const p of allPosts) {
    if (similar.length >= 3) break;
    if (!seen.has(p.slug)) {
      similar.push(p);
      seen.add(p.slug);
    }
  }
  return similar.slice(0, 3);
}

export default async function PostPage(props: { params: { slug: string } }) {
  const { params } = await props;
  const data = await getPostBySlug(params.slug);
  if (!data) return notFound();
  const { post, postDoc } = data;

  post.authorAvatar = post.author ? await getAuthorAvatarByName(post.author) : undefined;
  updateDoc(doc(db, "posts", postDoc.id), { views: increment(1) }).catch(() => {});
  const categories = (Array.isArray(post.category) ? post.category : [post.category]).filter((cat): cat is string => typeof cat === 'string');
  const similarPosts = await getSimilarPosts(post.slug, categories);

  // Article schema for SEO
  const canonicalUrl = `https://ahmadblogs.com/posts/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.content?.slice(0, 160) || post.title,
    "image": post.image || "/default-og.png",
    "author": post.author ? { "@type": "Person", "name": post.author } : undefined,
    "datePublished": post.date || post.created,
    "dateModified": post.date || post.created,
    "url": canonicalUrl,
    "publisher": publisher,
    "mainEntityOfPage": canonicalUrl
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ahmadblogs.com/" },
      { "@type": "ListItem", "position": 2, "name": "Posts", "item": "https://ahmadblogs.com/posts" },
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
      <div className="bg-white min-h-screen flex flex-col">
        <Header categoryMenu={<CategoryMenu />} />
        <main className="max-w-4xl mx-auto py-8 px-2 bg-white flex-1">
          <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(schema)}</script>
          <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(breadcrumbSchema)}</script>
          {faqSchema && <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify(faqSchema)}</script>}
          <div className="flex flex-col items-center mt-2 mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-snug sm:leading-tight text-[#232946] text-center mb-2">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-[#232946] text-base font-medium mb-4">
              <span className="inline-flex items-center gap-2 mb-2 sm:mb-0">
                <Image
                  src={post.authorAvatar || "/default-avatar.png"}
                  alt={post.author || "Author"}
                  width={28}
                  height={28}
                  className="rounded-full object-contain bg-[#eaf0f6]"
                  priority
                />
                <span className="text-sm sm:text-base">{post.author}</span>
              </span>
              <span className="text-sm sm:text-base mb-2 sm:mb-0">{post.date}</span>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(post.category) ? post.category : [post.category])
                  .filter((cat: unknown): cat is string => typeof cat === 'string' && !!cat)
                  .map((cat: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-[#eaf0f6] text-[#3CB371] text-xs sm:text-sm font-medium px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-md overflow-hidden bg-[#eaf0f6]">
              <Image
                src={post.image || "/placeholder.png"}
                alt={post.title}
                fill
                className="object-cover rounded-md w-full h-auto"
                sizes="100vw"
                priority
              />
            </div>
          </div>
          <div className={`max-w-3xl mx-auto text-base sm:text-[1rem] text-[#232946] space-y-6 prose prose-headings:text-[#232946] prose-img:rounded-xl prose-img:mx-auto ${styles.postContent}`}>
            {post.content && (
              <MarkdownRenderer content={Array.isArray(post.content) ? post.content.join('\n\n') : post.content} />
            )}
          </div>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 mb-6 gap-4">
            <div className="flex gap-2 flex-wrap">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="bg-[#f7f8fa] text-[#232946] px-4 py-2 rounded-lg text-base font-medium">#{tag}</span>
              ))}
            </div>
          </div>
          {/* Comments section moved after tags, before similar posts */}
          <div className="max-w-3xl mx-auto mb-12">
            <PostClientContent post={post} />
          </div>
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-extrabold text-center mb-10 text-[#232946]">Similar Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {similarPosts.map((sp: Post, idx: number) => (
                <a
                  key={sp.slug || idx}
                  href={`/posts/${sp.slug}`}
                  className="group bg-white rounded-2xl shadow-lg p-0 flex flex-col items-stretch transition-transform hover:-translate-y-2 hover:shadow-2xl border border-[#eaf0f6] h-full min-h-[270px] max-w-[420px] mx-auto"
                  style={{ textDecoration: 'none' }}
                >
                  {sp.image && (
                    <div className="relative w-full aspect-[16/9] bg-[#eaf0f6] rounded-t-2xl overflow-hidden">
                      <Image
                        src={sp.image}
                        alt={sp.title}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 420px"
                        priority={idx === 0}
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between p-4">
                    <h3 className="text-base font-bold text-[#232946] mb-2 line-clamp-2 group-hover:text-[#3CB371] transition-colors text-center">
                      {sp.title}
                    </h3>
                    <div className="text-xs text-[#888] text-center mt-auto">{sp.date || sp.created}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
