
import Image from "next/image";
import SocialShare from "./SocialShare";
import Comments from "./Comments";
import Header from "../../../components/Header";
import CategoryMenu from "../../../components/CategoryMenu";
import Footer from "../../../components/Footer";
import { notFound } from 'next/navigation';
import { db } from "../../../utils/firebase";
import { collection, query, where, getDocs, limit, doc, updateDoc, increment } from "firebase/firestore";
import React from "react";
import { getAuthorAvatarByName } from "./getAuthorAvatar";
import { Metadata } from "next";
import MarkdownRenderer from './MarkdownRenderer';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Fetch post title for metadata
  const { db } = await import("../../../utils/firebase");
  const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
  const q = query(collection(db, "posts"), where("slug", "==", params.slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return { title: "Post Not Found | Ahmed Blogs" };
  const post = querySnapshot.docs[0].data();
  const url = `https://ahmadblogs.com/posts/${params.slug}`;
  const image = post.image && post.image.trim() !== "" ? post.image : "/favicon.svg";
  const description = post.excerpt || (typeof post.content === 'string' ? post.content.slice(0, 120) : Array.isArray(post.content) ? post.content[0] : "Read this post on Ahmed Blogs.");
  return {
    title: `${post.title} | Ahmed Blogs`,
    description,
    openGraph: {
      title: `${post.title} | Ahmed Blogs`,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: "Ahmed Blogs",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ahmed Blogs`,
      description,
      images: [image],
      creator: post.author || "@ahmadblogs"
    },
    alternates: {
      canonical: url
    },
    other: {
      // JSON-LD structured data for Article
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": description,
        "image": [image],
        "author": {
          "@type": "Person",
          "name": post.author || "Ahmed Blogs"
        },
        "datePublished": post.date,
        "publisher": {
          "@type": "Organization",
          "name": "Ahmed Blogs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ahmadblogs.com/vercel.svg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      })
    }
  };
}

export default async function PostPage({ params }: any) {
  const q = query(collection(db, "posts"), where("slug", "==", params.slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return notFound();
  const postDoc = querySnapshot.docs[0];
  const post = postDoc.data();

  // Fetch author avatar
  const authorAvatar = await getAuthorAvatarByName(post.author);
  console.log('Author avatar for', post.author, ':', authorAvatar);
  post.authorAvatar = authorAvatar;

  // Increment the views field for analytics
  try {
    const postRef = doc(db, "posts", postDoc.id);
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (e) {
    // Ignore errors for analytics
  }

  const allPostsSnap = await getDocs(collection(db, "posts"));
  const similarPosts = allPostsSnap.docs
    .filter((doc) => doc.id !== postDoc.id)
    .slice(0, 3)
    .map((doc) => doc.data());

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header categoryMenu={<CategoryMenu />} />
      <main className="max-w-4xl mx-auto py-8 px-4 bg-white flex-1">
        {/* Title */}
        <div className="flex flex-col items-center mt-2 mb-4">
          <h1 className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
  font-extrabold 
  leading-snug sm:leading-tight
  text-[#232946] 
  text-center 
  mb-2
">
            {post.title}
          </h1>

          {/* Meta row under title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-[#232946] text-base font-medium mb-4">
  {/* Author */}
  <span className="inline-flex items-center gap-2 mb-2 sm:mb-0">
    <Image
      src={post.authorAvatar || "/default-avatar.png"}
      alt={post.author || "Author"}
      width={28}
      height={28}
      className="rounded-full object-contain bg-[#eaf0f6]"
    />
    <span className="text-sm sm:text-base">{post.author}</span>
  </span>

  {/* Date */}
  <span className="text-sm sm:text-base mb-2 sm:mb-0">{post.date}</span>

  {/* Categories */}
  <div className="flex flex-wrap gap-2">
    {(Array.isArray(post.category) ? post.category : [post.category]).map((cat, idx) => (
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
        {/* Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7]">
            <Image
              src={post.image || "/placeholder.png"}
              alt={post.title}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
              priority
            />
          </div>
        </div>
        {/* Content */}
        <div className="max-w-3xl mx-auto text-lg text-[#232946] space-y-6 prose prose-headings:text-[#232946] prose-a:text-[#3CB371] prose-img:rounded-xl prose-img:mx-auto">
          {post.content && (
            <MarkdownRenderer content={Array.isArray(post.content) ? post.content.join('\n\n') : post.content} />
          )}
        </div>
        {/* Tags and Social Share Icons */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 mb-6 gap-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="bg-[#f7f8fa] text-[#232946] px-4 py-2 rounded-lg text-base font-medium">#{tag}</span>
            ))}
          </div>
          <div className="flex-shrink-0">
            <SocialShare post={post} />
          </div>
        </div>
        {/* Comments Section */}
        <Comments postId={post.slug} />
        {/* Similar Posts */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-extrabold text-center mb-10 text-[#232946]">Similar Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarPosts.map((sp: any, idx: number) => (
              <div key={sp.slug || idx} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                {sp.image && (
                  <div className="relative w-full h-40 mb-4 bg-[#eaf0f6] rounded-lg overflow-hidden">
                    <Image
                      src={sp.image}
                      alt={sp.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#232946] text-sm mb-1">
                  <span>{sp.date}</span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(post.category) ? post.category : [post.category]).map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-[#eaf0f6] text-[#3CB371] text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <a href={`/posts/${sp.slug}`} className="block text-lg font-bold text-center hover:text-[#3CB371] text-[#232946]">{sp.title}</a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

