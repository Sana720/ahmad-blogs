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


function FeaturedPost({ post }: { post: Post }) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => { setIsClient(true); }, []);
  const shareUrl = isClient ? window.location.origin + `/posts/${post.slug}` : '';
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        url: shareUrl
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };
  return (
    <section className="max-w-3xl mx-auto mt-12">
      <div className="rounded-xl overflow-hidden shadow bg-white">
        <Image src={post.image || "/placeholder.png"} alt={post.title} className="w-full h-72 object-cover" />
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-[#888] mb-2">
            <span className="inline-flex items-center gap-1"><Image src="/vercel.svg" alt="author" className="w-5 h-5 rounded-full" />
              <span className="font-semibold text-[#222]">{post.author}</span>
            </span>
            <span>{post.date}</span>
            <span>• {Array.isArray(post.categories) ? post.categories.join(', ') : post.category || ''}</span>
          </div>
          <a href={`/posts/${post.slug}`} className="block text-2xl font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</a>
          <p className="text-[#444] text-base font-normal">{post.excerpt}</p>
          {isClient && (
            <div className="mt-4 flex gap-4">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="hover:text-[#3CB371]"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="#3CB371"/></svg>
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="hover:text-[#3CB371]"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#3CB371"/></svg>
              </a>
              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="hover:text-[#3CB371]"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="#3CB371"/></svg>
              </a>
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="hover:text-[#3CB371]"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="7" fill="#3CB371"/><rect x="11" y="13" width="2" height="4" fill="#3CB371"/><circle cx="8" cy="8" r="1" fill="#3CB371"/></svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PostGrid({ posts }: { posts: Post[] }) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => { setIsClient(true); }, []);
  return (
    <section className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => {
        const shareUrl = isClient ? window.location.origin + `/posts/${post.slug}` : '';
        const handleShare = async () => {
          if (navigator.share) {
            await navigator.share({
              title: post.title,
              url: shareUrl
            });
          } else {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
          }
        };
        return (
          <div key={post.slug} className="rounded-xl overflow-hidden shadow bg-white">
            {post.image ? (
              <Image src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-[#888] mb-2">
                <span className="inline-flex items-center gap-1"><Image src="/vercel.svg" alt="author" className="w-5 h-5 rounded-full" />
                  <span className="font-semibold text-[#222]">{post.author}</span>
                </span>
                <span>{post.date}</span>
                <span>• {Array.isArray(post.categories) ? post.categories.join(', ') : post.category || ''}</span>
              </div>
              <a href={`/posts/${post.slug}`} className="block text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{post.title}</a>
              <p className="text-[#444] text-sm font-normal">{post.excerpt}</p>
              {isClient && (
                <div className="mt-4 flex gap-4">
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="hover:text-[#3CB371]"
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="#3CB371"/></svg>
                  </a>
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="hover:text-[#3CB371]"
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#3CB371"/></svg>
                  </a>
                  {/* Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="hover:text-[#3CB371]"
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="#3CB371"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="hover:text-[#3CB371]"
                  >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3CB371" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="7" fill="#3CB371"/><rect x="11" y="13" width="2" height="4" fill="#3CB371"/><circle cx="8" cy="8" r="1" fill="#3CB371"/></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
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

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          {featured && (
            <section className="mt-12">
              <div className="rounded-xl overflow-hidden shadow bg-white">
                {featured.image && (
                  <Image src={featured.image} alt={featured.title} className="w-full h-80 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[#232946] text-base mb-4 font-medium mt-2">
                    <span className="inline-flex items-center gap-1">
                      {featured.authorAvatar ? (
                        <Image src={featured.authorAvatar} alt={featured.author || "Author"} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl">👨‍🎨</span>
                      )}
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
                    <Image src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-[#232946] text-base mb-2 font-medium mt-2">
                      <span className="inline-flex items-center gap-1">
                        {post.authorAvatar ? (
                          <Image src={post.authorAvatar} alt={post.author || "Author"} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <span className="text-2xl">👨‍🎨</span>
                        )}
                        <span>{post.author || "Unknown"}</span>
                      </span>
                      <span>{post.created ? new Date(post.created).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
                      <span>• {Array.isArray(post.categories) ? post.categories.join(', ') : post.category || ''}</span>
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


