"use client";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import Link from "next/link";

export default function GuestPostPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    email: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await addDoc(collection(db, "guest_posts"), {
        ...form,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setForm({ title: "", content: "", author: "", email: "", category: "" });
    } catch (err: any) {
      setError("Failed to submit. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fa] px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 mt-8">
        <h1 className="text-3xl font-bold text-[#232946] mb-6 text-center">Submit a Guest Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg min-h-[120px]"
            required
          />
          <input
            type="text"
            placeholder="Author Name"
            value={form.author}
            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold w-full"
            disabled={loading}
          >{loading ? "Submitting..." : "Submit Post"}</button>
        </form>
        {success && <div className="text-green-600 mt-4 text-center">Your post has been submitted for review!</div>}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#3CB371] font-semibold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
