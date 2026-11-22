import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { publisher } from "@/utils/publisherSchema";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import Footer from "@/components/Footer";
import PostClientContent from "@/app/posts/[slug]/PostClientContent";
import MarkdownRenderer from "@/app/posts/[slug]/MarkdownRenderer";
import { getAuthorAvatarByName } from "@/app/posts/[slug]/getAuthorAvatar";
import styles from "@/app/posts/[slug]/postContent.module.css";

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface GuestPost {
  id: string;
  slug?: string;
  title: string;
  author: string;
  email?: string;
  category?: string | string[];
  content: string;
  imageUrl?: string;
  submittedAt?: string;
  created?: string;
  status?: string;
}

function stripHtml(html: string): string {
  return html ? html.replace(/<[^>]*>/g, "").trim() : "";
}

function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

async function getGuestPostBySlug(slug: string): Promise<GuestPost | null> {
  try {
    // 1. Try directly fetching by document ID
    const docRef = doc(db, "guest_posts", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as any) };
    }

    // 2. Fallback: Query by slug field if present
    const q = query(collection(db, "guest_posts"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const first = snap.docs[0];
      return { id: first.id, ...(first.data() as any) };
    }
  } catch (err) {
    console.error("Error fetching guest post:", err);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getGuestPostBySlug(slug);

  if (!post) {
    return {
      title: "Guest Post Not Found | Ahmad Blogs",
      description: "This guest post could not be found.",
    };
  }

  const cleanDescription = stripHtml(post.content).slice(0, 160) || post.title;
  const canonicalUrl = `https://www.ahmadblogs.com/guest-post/${slug}`;

  return {
    title: `${post.title} | Ahmad Blogs`,
    description: cleanDescription,
    authors: post.author ? [{ name: post.author }] : undefined,
    publisher: "Ahmad Blogs",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: canonicalUrl,
      type: "article",
      images: [post.imageUrl || "/default-og.png"],
      siteName: "Ahmad Blogs",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [post.imageUrl || "/default-og.png"],
      site: "@ahmadblogs",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    metadataBase: new URL("https://www.ahmadblogs.com"),
  };
}

export default async function GuestPostSlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getGuestPostBySlug(params.slug);

  if (!post || (post.status && post.status === "rejected")) {
    return notFound();
  }

  const authorAvatar = post.author ? await getAuthorAvatarByName(post.author) : undefined;
  const categories = (Array.isArray(post.category) ? post.category : [post.category]).filter(
    (cat): cat is string => typeof cat === "string" && !!cat
  );
  const formattedDate = post.submittedAt || post.created
    ? new Date(post.submittedAt || post.created!).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const canonicalUrl = `https://www.ahmadblogs.com/guest-post/${params.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: stripHtml(post.content).slice(0, 160) || post.title,
    image: post.imageUrl || "/default-og.png",
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : undefined,
    datePublished: post.submittedAt || post.created,
    url: canonicalUrl,
    publisher: publisher,
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ahmadblogs.com/" },
      { "@type": "ListItem", "position": 2, "name": "Guest Posts", "item": "https://www.ahmadblogs.com/guest-post" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl },
    ],
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header categoryMenu={<CategoryMenu />} />

      <main className="max-w-4xl mx-auto py-8 px-4 bg-white flex-1 w-full">
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(schema)}
        </script>
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* Guest Post Banner */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <span>✍️</span> Guest Post Contribution
          </span>
        </div>

        {/* Post Title */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug sm:leading-tight text-[#232946] text-center mb-4">
            {post.title}
          </h1>

          {/* Author, Date, Categories */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[#232946] text-sm sm:text-base font-medium">
            <span className="inline-flex items-center gap-2">
              {authorAvatar ? (
                <Image
                  src={authorAvatar}
                  alt={post.author || "Author"}
                  width={28}
                  height={28}
                  className="rounded-full object-contain bg-[#eaf0f6]"
                />
              ) : (
                <span className="text-xl">🧑‍💻</span>
              )}
              <span className="font-semibold">{post.author}</span>
            </span>

            {formattedDate && <span className="text-gray-400">•</span>}
            {formattedDate && <span className="text-gray-600">{formattedDate}</span>}

            {categories.length > 0 && <span className="text-gray-400">•</span>}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-[#eaf0f6] text-[#3CB371] text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-xl overflow-hidden bg-[#eaf0f6] shadow-sm">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className={`max-w-3xl mx-auto ${styles.postContent}`}>
          {isHtml(post.content) ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <MarkdownRenderer content={post.content} />
          )}
        </article>

        {/* Author Attribution & Disclaimer Box */}
        <div className="max-w-3xl mx-auto mt-12 p-5 bg-[#f7f8fa] border border-gray-200 rounded-xl text-sm text-gray-600">
          <p className="font-bold text-[#232946] mb-1">
            About this Guest Post:
          </p>
          <p className="m-0 leading-relaxed">
            This article was submitted by <strong className="text-[#232946]">{post.author}</strong> and approved by the Ahmad Blogs editorial team. The views and tips shared in this article reflect the author&apos;s expertise.
          </p>
        </div>

        {/* Social Share & Comments */}
        <div className="max-w-3xl mx-auto mt-10">
          <PostClientContent post={{ slug: params.slug, title: post.title }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
