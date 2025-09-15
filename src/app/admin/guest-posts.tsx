"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function AdminGuestPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const snap = await getDocs(collection(db, "guest_posts"));
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError("Failed to load guest posts.");
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  async function handleApprove(id: string) {
    await updateDoc(doc(db, "guest_posts", id), { status: "approved" });
    setPosts(posts => posts.map(p => p.id === id ? { ...p, status: "approved" } : p));
  }

  async function handleReject(id: string) {
    await updateDoc(doc(db, "guest_posts", id), { status: "rejected" });
    setPosts(posts => posts.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "guest_posts", id));
    setPosts(posts => posts.filter(p => p.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f7f8fa] px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-[#232946] mb-6 text-center">Guest Post Submissions</h1>
        {loading && <div className="text-[#3CB371] text-center">Loading...</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <ul className="space-y-6">
          {posts.length === 0 && !loading && (
            <li className="text-[#888] text-center">No guest posts found.</li>
          )}
          {posts.map(post => (
            <li key={post.id} className="bg-[#f7f8fa] rounded-lg shadow p-4">
              <div className="flex flex-col gap-2">
                <div className="font-bold text-lg text-[#232946]">{post.title}</div>
                <div className="text-sm text-[#444]">{post.content}</div>
                <div className="text-xs text-[#888]">By {post.author} ({post.email})</div>
                <div className="text-xs text-[#888]">Category: {post.category || "Uncategorized"}</div>
                <div className="text-xs text-[#888]">Status: <span className={post.status === "approved" ? "text-green-600" : post.status === "rejected" ? "text-red-600" : "text-yellow-600"}>{post.status}</span></div>
                <div className="flex gap-2 mt-2">
                  {post.status === "pending" && (
                    <>
                      <button className="px-3 py-1 rounded bg-[#3CB371] text-white font-bold" onClick={() => handleApprove(post.id)}>Approve</button>
                      <button className="px-3 py-1 rounded bg-red-100 text-red-600 font-bold" onClick={() => handleReject(post.id)}>Reject</button>
                    </>
                  )}
                  <button className="px-3 py-1 rounded bg-gray-200 text-[#232946] font-bold" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
