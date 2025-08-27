"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CommentsCrud() {
  const [comments, setComments] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentsAll().then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, []);

  // Group comments by postId
  const grouped: Record<string, any[]> = {};
  (comments as any[]).forEach((c) => {
    if (!grouped[c.postId]) grouped[c.postId] = [];
    grouped[c.postId].push(c);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#232946] mb-4">Comments & Leads</h1>
      {loading ? (
        <div className="text-[#3CB371] text-lg">Loading comments...</div>
      ) : (
        Object.entries(grouped).map(([postId, comments]) => (
          <div key={postId} className="mb-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-[#232946]">Post: <span className="break-all font-mono text-sm">{postId}</span></h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg text-[#232946]">
                <thead>
                  <tr className="bg-[#e5eaf1] text-[#232946]">
                    <th className="py-2 px-4 border-b font-semibold">Name</th>
                    <th className="py-2 px-4 border-b font-semibold">Email</th>
                    <th className="py-2 px-4 border-b font-semibold">Comment</th>
                    <th className="py-2 px-4 border-b font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((c: any) => (
                    <tr key={c.id} className="border-b hover:bg-[#f8fafb]">
                      <td className="py-2 px-4 text-[#232946]">{c.author}</td>
                      <td className="py-2 px-4 text-[#232946]">{c.email}</td>
                      <td className="py-2 px-4 whitespace-pre-line text-[#232946]">{c.content}</td>
                      <td className="py-2 px-4 text-[#232946]">{c.created?.toDate ? c.created.toDate().toLocaleString() : (typeof c.created === 'string' ? new Date(c.created).toLocaleString() : "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Admin: get all comments (no filter)
export async function getCommentsAll() {
  const snap = await getDocs(collection(db, "comments"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
