"use client";
import React, { useEffect, useState } from "react";
import { getAuthorAvatarByName } from "../utils/getAuthorAvatar";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toasts from '../components/Toast';
import { uid } from '../utils/uid';
import Image from "next/image";
import Link from "next/link";

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
  category?: string;
  excerpt?: string;
  authorAvatar?: string;
};



export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 5;
  const [toasts, setToasts] = useState<{ id: string; type?: 'success' | 'error' | 'info'; message: string }[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const pushToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = uid();
    setToasts((s) => [...s, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts((s) => s.filter(t => t.id !== id));

  useEffect(() => {
    async function fetchPosts() {
      const querySnapshot = await getDocs(collection(db, "posts"));
      let postsData = querySnapshot.docs.map((doc) => doc.data() as Post);
      // Sort by date descending (newest first)
      postsData = postsData.sort((a, b) => new Date(b.date || b.created || 0).getTime() - new Date(a.date || a.created || 0).getTime());
      setTotalPages(Math.ceil(postsData.length / POSTS_PER_PAGE));
      // Always show the newest post as featured (first in sorted array)
      const start = (page - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      // Fetch author avatars for all posts in this page
      const pagePosts = postsData.slice(start, end);
      const postsWithAvatars = await Promise.all(
        pagePosts.map(async (post) => {
          const avatar = post.author ? await getAuthorAvatarByName(post.author) : undefined;
          return { ...post, authorAvatar: avatar };
        })
      );
      setPosts(postsWithAvatars);
      setLoading(false);
    }
    fetchPosts();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl text-[#3CB371]">Loading posts...</span>
      </div>
    );
  }

  let featured: Post | undefined = undefined;
  let gridPosts: Post[] = [];
  if (posts.length > 0) {
    featured = posts[0]; // Always the newest post
    gridPosts = posts.slice(1);
  }
  console.log('Featured excerpt:', featured?.excerpt);
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          {featured && (
            <section className="mt-12">
              <div className="rounded-xl overflow-hidden shadow bg-white">
                {featured.image && (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7]">
                    <Image
                      src={featured.image || "/placeholder.png"}
                      alt={featured.title}
                      fill
                      className="object-cover rounded-md"
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
                      {(Array.isArray(featured.category) ? featured.category : [featured.category]).map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-[#eaf0f6] text-[#3CB371] 
                 text-[10px] sm:text-xs md:text-sm 
                 font-medium px-2 py-1 
                 rounded-full whitespace-nowrap"
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
              {gridPosts.map((post, idx) => (
                <div key={post.slug || idx} className="rounded-xl overflow-hidden shadow bg-white">
                  {post.image && (
                    <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7]">
                      <Image
                        src={post.image || "/placeholder.png"}
                        alt={post.title}
                        fill
                        className="object-cover rounded-md"
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
                    <a href={`/posts/${post.slug}`} className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</a>
                    <p className="text-[#444] text-sm font-normal line-clamp-2">{typeof post.content === "string" ? post.content.slice(0, 120) + (post.content.length > 120 ? "..." : "") : post.excerpt || ""}</p>
                  </div>
                </div>
              ))}
            </section>
          )}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`rounded px-3 py-1 font-semibold ${page === i + 1 ? 'bg-[#3CB371] text-white' : 'border border-[#3CB371] text-[#3CB371] hover:bg-[#3CB371] hover:text-white'}`}
                onClick={() => setPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button
              className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >&gt;</button>
          </div>
        </div>
      </main>
      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto mt-24 mb-12 bg-[#eaf0f6] rounded-xl p-8 flex flex-col items-center shadow">
        <h2 className="text-2xl font-extrabold text-[#232946] mb-2">Subscribe to our Newsletter</h2>
        <p className="text-[#444] mb-4 text-center">Get the latest posts and updates delivered straight to your inbox.</p>
        {!subscribed ? (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement);
            const email = (data.get('email') || '').toString().trim();
            if (!email) return pushToast('Please enter a valid email', 'error');
            try {
              const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
              if (!res.ok) throw new Error('Server error');
              setSubscribed(true);
              pushToast('Thanks for subscribing!', 'success');
            } catch (err: any) {
              console.error(err);
              pushToast(err?.message || 'Could not subscribe. Try again later.', 'error');
            }
          }} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl" name="newsletter-form">
            <input name="email" type="email" required placeholder="Your email address" className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none text-[#232946]" />
            <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold hover:bg-[#232946] transition-colors">Subscribe</button>
          </form>
        ) : (
          <div className="mt-3 text-sm text-[#232946]">Thanks for subscribing! Check your inbox.</div>
        )}
      </section>
      <Toasts toasts={toasts} removeToast={removeToast} />
      <Footer />
    </div>
  );
}


