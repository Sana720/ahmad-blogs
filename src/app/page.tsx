"use client";

import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toasts from '../components/Toast';
import { uid } from '../utils/uid';


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
};


function FeaturedPost({ post }: { post: Post }) {
  return (
    <section className="max-w-3xl mx-auto mt-12">
      <div className="rounded-xl overflow-hidden shadow bg-white">
        <img src={post.image} alt={post.title} className="w-full h-72 object-cover" />
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-[#888] mb-2">
            <span className="inline-flex items-center gap-1"><img src="/vercel.svg" alt="author" className="w-5 h-5 rounded-full" />
              <span className="font-semibold text-[#222]">{post.author}</span>
            </span>
            <span>{post.date}</span>
            <span>• {post.category}</span>
          </div>
          <a href={`/posts/${post.slug}`} className="block text-2xl font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</a>
          <p className="text-[#444] text-base font-normal">{post.excerpt}</p>
        </div>
      </div>
    </section>
  );
}

function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div key={post.slug} className="rounded-xl overflow-hidden shadow bg-white">
          <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-[#888] mb-2">
              <span className="inline-flex items-center gap-1"><img src="/vercel.svg" alt="author" className="w-5 h-5 rounded-full" />
                <span className="font-semibold text-[#222]">{post.author}</span>
              </span>
              <span>{post.date}</span>
              <span>• {post.category}</span>
            </div>
            <a href={`/posts/${post.slug}`} className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</a>
            <p className="text-[#444] text-sm font-normal">{post.excerpt}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold">&lt;</button>
      <button className="bg-[#3CB371] text-white rounded px-3 py-1 font-semibold">1</button>
      <button className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold">2</button>
      <button className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold">3</button>
      <button className="border border-[#3CB371] text-[#3CB371] rounded px-3 py-1 hover:bg-[#3CB371] hover:text-white font-semibold">&gt;</button>
    </div>
  );
}


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
      const postsData = querySnapshot.docs.map((doc) => doc.data() as Post);
  setTotalPages(Math.ceil(postsData.length / POSTS_PER_PAGE));
  // Sort by date descending if available
  postsData.sort((a, b) => new Date(b.date || b.created || 0).getTime() - new Date(a.date || a.created || 0).getTime());
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  setPosts(postsData.slice(start, end));
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
    featured = posts[0];
    gridPosts = posts.slice(1);
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          {featured && (
            <section className="mt-12">
              <div className="rounded-xl overflow-hidden shadow bg-white">
                {featured.image && (
                  <img src={featured.image} alt={featured.title} className="w-full h-80 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[#232946] text-base mb-4 font-medium mt-2">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-2xl">👨‍🎨</span>
                      <span>{featured.author}</span>
                    </span>
                    <span>{featured.date}</span>
                    <span>• {featured.category}</span>
                  </div>
                  <a href={`/posts/${featured.slug}`} className="block text-2xl font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{featured.title}</a>
                  <p className="text-[#444] text-base font-normal">{featured.excerpt}</p>
                </div>
              </div>
            </section>
          )}
          {gridPosts.length > 0 && (
            <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {gridPosts.map((post, idx) => (
                <div key={post.slug || idx} className="rounded-xl overflow-hidden shadow bg-white">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-[#232946] text-base mb-2 font-medium mt-2">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-2xl">👨‍🎨</span>
                        <span>{post.author || "Unknown"}</span>
                      </span>
                      <span>{post.created ? new Date(post.created).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                      <span>• {Array.isArray(post.categories) ? post.categories.join(", ") : post.category || ""}</span>
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


