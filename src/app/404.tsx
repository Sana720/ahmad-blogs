"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function NotFound() {
  const [recentPosts, setRecentPosts] = useState<{ title: string; slug: string; type: "post" | "guest" }[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    async function fetchRecent() {
      // Fetch recent posts from both 'posts' and 'guest_posts' collections
      const q1 = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(3));
      const q2 = query(collection(db, "guest_posts"), orderBy("submittedAt", "desc"), limit(3));
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
      const posts = snap1.docs.map(doc => {
        const data = doc.data();
        return { title: data.title || "Untitled", slug: data.slug || doc.id, type: "post" as const };
      });
      const guestPosts = snap2.docs
        .filter(doc => (doc.data().status === "approved"))
        .map(doc => {
          const data = doc.data();
          return { title: data.title || "Untitled (Guest)", slug: doc.id, type: "guest" as const };
        });
      setRecentPosts([...posts, ...guestPosts]);
    }
    fetchRecent();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fa] px-4">
      <div className="flex flex-col items-center w-full max-w-xl">
        <Image
          src="/404-animated.svg"
          alt="404 Not Found"
          width={220}
          height={220}
          priority
        />
        <h1 className="text-4xl font-extrabold text-[#232946] mt-8 mb-2">404</h1>
        <p className="text-lg text-[#232946] mb-4 font-semibold text-center">Sorry, the page you’re looking for doesn’t exist.</p>
        <Link href="/" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold shadow hover:bg-[#2e8b57] transition mb-6">Go to Homepage</Link>
        <div className="w-full mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371]"
          />
        </div>
        <div className="w-full">
          <h2 className="text-lg font-bold text-[#232946] mb-3">Popular & Recent Blog Posts</h2>
          <ul className="space-y-3">
            {recentPosts.filter(post => post.title.toLowerCase().includes(search.toLowerCase())).map(post => (
              <li key={post.slug} className="bg-white rounded-lg shadow p-3 flex items-center justify-between">
                <Link href={post.type === "guest" ? `/admin/guest-posts` : `/posts/${post.slug}`} className="text-[#3CB371] font-semibold hover:underline truncate">
                  {post.title}
                  {post.type === "guest" && <span className="ml-2 text-xs text-[#888]">(Guest)</span>}
                </Link>
                <Link href={post.type === "guest" ? `/admin/guest-posts` : `/posts/${post.slug}`} className="text-xs text-[#888] ml-2">Read</Link>
              </li>
            ))}
            {recentPosts.filter(post => post.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <li className="text-[#888] text-sm">No matching posts found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
