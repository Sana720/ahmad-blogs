"use client";
import Header from "../components/Header";
import CategoryMenu from "../components/CategoryMenu";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
};

export default function HomeClient({ posts, totalPages }: { posts: Post[]; totalPages: number }) {
  // Filter posts by category if needed (for now, show all)
  const featured = posts.length > 0 ? (posts.find((p: any) => p.featured) || posts[0]) : undefined;
  const gridPosts = posts.length > 0 ? posts.filter((p: any) => p !== featured) : [];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header categoryMenu={<CategoryMenu />} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          {featured && (
            <section className="mt-12">
              <div className="rounded-xl overflow-hidden shadow bg-white">
                {featured.image && (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7] max-w-full">
                    <Image
                      src={featured.image || "/placeholder.png"}
                      alt={featured.title}
                      fill
                      className="object-cover rounded-md w-full h-auto max-w-full"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[#232946] text-base mb-4 font-medium mt-2">
                    <span className="inline-flex items-center gap-1">
                      {featured.authorAvatar ? (
                        <Image
                          src={featured.authorAvatar}
                          alt={featured.author || "Author"}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👨‍🎨</span>
                      )}
                      <span>{featured.author}</span>
                    </span>
                    <span>{featured.date}</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(Array.isArray(featured.category) ? featured.category : [featured.category])
                        .filter((cat: unknown): cat is string => typeof cat === 'string' && !!cat)
                        .map((cat: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-[#eaf0f6] text-[#3CB371] text-[10px] sm:text-xs md:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap"
                          >
                            {cat}
                          </span>
                        ))}
                    </div>
                  </div>
                  <Link
                    href={`/posts/${featured.slug}`}
                    className="block mt-3 text-lg sm:text-xl md:text-2xl font-extrabold leading-snug hover:text-[#3CB371] text-[#222] break-words"
                  >
                    {featured.title}
                  </Link>
                  <p className="text-[#444] text-base font-normal">
                    {featured.excerpt
                      ? featured.excerpt
                      : typeof featured.content === "string"
                        ? featured.content.slice(0, 120) + (featured.content.length > 120 ? "..." : "")
                        : ""}
                  </p>
                </div>
              </div>
            </section>
          )}
          {gridPosts.length > 0 && (
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridPosts.map((post: any, idx: number) => (
                  <div key={post.slug || idx} className="rounded-xl overflow-hidden shadow bg-white">
                    {post.image && (
                      <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7] max-w-full">
                        <Image
                          src={post.image || "/placeholder.png"}
                          alt={post.title}
                          fill
                          className="object-cover rounded-md w-full h-auto max-w-full"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={false}
                        />
                      </div>
                    )}
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-[#232946] text-base mb-2 font-medium mt-2">
                      <span className="inline-flex items-center gap-1">
                        {post.authorAvatar ? (
                          <Image
                            src={post.authorAvatar}
                            alt={post.author || "Author"}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👨‍🎨</span>
                        )}
                        <span>{post.author || "Unknown"}</span>
                      </span>
                      <span>{post.created ? new Date(post.created).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(post.category) ? post.category : [post.category])
                          .filter((cat: unknown): cat is string => typeof cat === 'string' && !!cat)
                          .map((cat: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-[#eaf0f6] text-[#3CB371] text-xs font-medium px-2 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>
                    </div>
                    <Link 
                      href={`/posts/${post.slug}`} 
                      className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]"
                    >
                      {post.title}
                    </Link>
                    <p className="text-[#444] text-sm font-normal line-clamp-2">{typeof post.content === "string" ? post.content.slice(0, 120) + (post.content.length > 120 ? "..." : "") : post.excerpt || ""}</p>
                  </div>
                </div>
              ))}
            </section>
          )}
          <div className="flex justify-center items-center gap-2 mt-12">
            {/* Pagination UI can be added here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}