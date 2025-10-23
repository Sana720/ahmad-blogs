"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminGuestPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const snap = await getDocs(collection(db, "guest_posts"));
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (_e) {
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
    <AdminLayout>
      <div className="w-full">
        <h1 className="text-3xl font-bold text-[#232946] mb-6">Guest Post Submissions</h1>
        {loading && <div className="text-[#3CB371] text-center">Loading...</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-[#f7f8fa]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Title</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Content</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Author</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Email</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Category</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Status</th>
                <th className="px-4 py-2 text-left text-sm font-bold text-[#232946] border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-[#888] text-center py-6">No guest posts found.</td>
                </tr>
              )}
              {posts.map(post => (
                <tr key={post.id} className="border-b">
                  <td className="px-4 py-2 text-sm font-semibold text-[#232946] max-w-[180px] truncate">{post.title}</td>
                  <td className="px-4 py-2 text-sm text-[#444] max-w-[320px] truncate">{post.content}</td>
                  <td className="px-4 py-2 text-xs text-[#888]">{post.author}</td>
                  <td className="px-4 py-2 text-xs text-[#888]">{post.email}</td>
                  <td className="px-4 py-2 text-xs text-[#888]">{post.category || "Uncategorized"}</td>
                  <td className="px-4 py-2 text-xs">
                    <span className={post.status === "approved" ? "text-green-600 font-bold" : post.status === "rejected" ? "text-red-600 font-bold" : "text-yellow-600 font-bold"}>{post.status}</span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex gap-2">
                      {post.status === "pending" && (
                        <>
                          <button className="px-3 py-1 rounded bg-[#3CB371] text-white font-bold text-xs" onClick={() => handleApprove(post.id)}>Approve</button>
                          <button className="px-3 py-1 rounded bg-red-100 text-red-600 font-bold text-xs" onClick={() => handleReject(post.id)}>Reject</button>
                        </>
                      )}
                      <button className="px-3 py-1 rounded bg-gray-200 text-[#232946] font-bold text-xs" onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
