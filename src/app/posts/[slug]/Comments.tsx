"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { addComment, getComments } from "./commentsApi";

export type Comment = {
  id: string;
  author: string;
  content: string;
  created: string;
  avatar?: string;
  parentId?: string;
  replies?: Comment[];
};

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch comments from Firestore
    getComments(postId).then((data) => {
      console.log("Fetched comments for postId:", postId, data);
      setComments(data as Comment[]);
    });
  }, [postId]);

  // Store pending parentId for comment if user modal is open
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    const newUser = { name: userForm.name.trim(), email: userForm.email.trim() };
    setUser(newUser);
    setShowUserModal(false);
    // After setting user, immediately submit the pending comment
    setLoading(true);
    await addComment({
      postId,
      author: newUser.name,
      email: newUser.email,
      content: newComment,
      parentId: pendingParentId || null,
    });
    const data = await getComments(postId);
    setComments(data as Comment[]);
    setNewComment("");
    setReplyTo(null);
    setPendingParentId(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      setPendingParentId(parentId || null);
      setShowUserModal(true);
      return;
    }
    setLoading(true);
    await addComment({
      postId,
      author: user.name,
      email: user.email,
      content: newComment,
      parentId: parentId || null,
    });
    // Refresh comments
    const data = await getComments(postId);
    setComments(data as Comment[]);
    setNewComment("");
    setReplyTo(null);
    setLoading(false);
  };

  // Render comments recursively
  const renderComments = (comments: Comment[], parentId?: string | null) =>
    comments
      .filter((c) => (c.parentId ?? null) === (parentId ?? null))
      .map((comment) => (
        <div
          key={comment.id}
          className="mb-6 ml-0 md:ml-8 border-l-4 border-[#3CB371]/20 pl-6 bg-[#f8fafb] rounded-lg py-3"
        >
          <div className="flex items-center gap-3 mb-1">
            {comment.avatar ? (
              <Image
                src={comment.avatar}
                alt={comment.author}
                className="w-9 h-9 rounded-full object-cover border border-[#3CB371]/30 bg-white"
              />
            ) : (
              <span className="inline-block w-9 h-9 rounded-full bg-[#3CB371]/20 flex items-center justify-center text-[#3CB371] font-bold text-lg">
                <span className="flex items-center justify-center w-full h-full">{comment.author[0]}</span>
              </span>
            )}
            <span className="text-lg font-bold text-[#232946]">{comment.author}</span>
            <span className="text-xs text-[#888] ml-2">
              {comment.created && (typeof comment.created === 'object' && 'toDate' in comment.created
                ? (comment.created as { toDate: () => Date }).toDate().toLocaleString()
                : new Date(comment.created).toLocaleString())}
            </span>
          </div>
          <div className="text-base text-[#232946] mb-2 whitespace-pre-line">{comment.content}</div>
          <button
            className="text-xs text-[#3CB371] hover:underline mb-2 font-semibold"
            onClick={() => setReplyTo(comment.id)}
          >
            Reply
          </button>
          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mb-2 mt-2">
              <textarea
                className="w-full border border-[#3CB371]/40 rounded p-2 text-sm focus:outline-none focus:border-[#3CB371] bg-white text-[#232946] placeholder-[#888]"
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
              />
              <button type="submit" className="bg-[#3CB371] text-white px-3 py-1 rounded text-xs mt-1">Reply</button>
            </form>
          )}
          {renderComments(comments, comment.id)}
        </div>
      ));

  return (
    <section className="max-w-3xl mx-auto mt-12 mb-12">
      <h3 className="text-2xl font-extrabold mb-6 text-[#232946]">Comments</h3>
      <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
        <textarea
          className="w-full border border-[#3CB371]/40 rounded p-3 text-base focus:outline-none focus:border-[#3CB371] bg-white text-[#232946] placeholder-[#888]"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={loading}
        />
        <button type="submit" className="bg-[#3CB371] text-white px-5 py-2 rounded mt-3 font-semibold shadow hover:bg-[#2e9e6f] transition" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
      {/* User Info Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h4 className="text-lg font-bold mb-4 text-[#232946]">Enter your details to comment</h4>
            <form onSubmit={handleUserSubmit}>
              <input
                type="text"
                className="w-full border border-[#3CB371]/40 rounded p-2 mb-3 text-base focus:outline-none focus:border-[#3CB371] bg-white text-[#232946] placeholder-[#888]"
                placeholder="Your Name"
                value={userForm.name}
                onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                className="w-full border border-[#3CB371]/40 rounded p-2 mb-3 text-base focus:outline-none focus:border-[#3CB371] bg-white text-[#232946] placeholder-[#888]"
                placeholder="Your Email"
                value={userForm.email}
                onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <button type="submit" className="bg-[#3CB371] text-white px-4 py-2 rounded font-semibold w-full">Continue</button>
            </form>
          </div>
        </div>
      )}
      <div>{renderComments(comments)}</div>
    </section>
  );
}
