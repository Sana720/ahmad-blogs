"use client";
import React, { useState } from "react";
import Image from 'next/image';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GuestPostPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    email: "",
    category: "",
    imageUrl: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ahmad-blogs"); 
    const res = await fetch("https://api.cloudinary.com/v1_1/dmklge3gp/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      if (!imageUrl) {
        setError("Please upload an image.");
        setLoading(false);
        return;
      }
      await addDoc(collection(db, "guest_posts"), {
        ...form,
        imageUrl,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setForm({ title: "", content: "", author: "", email: "", category: "", imageUrl: "" });
      setImageFile(null);
      setImageUrl("");
    } catch (err: any) {
      setError("Failed to submit. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#f7f8fa] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 mt-8">
          <h1 className="text-3xl font-bold text-[#232946] mb-6 text-center">Submit a Guest Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ...existing code... */}
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg text-[#232946] placeholder:text-gray-400"
              required
            />
            <textarea
              placeholder="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg min-h-[120px] text-[#232946] placeholder:text-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Author Name"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg text-[#232946] placeholder:text-gray-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg text-[#232946] placeholder:text-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg text-[#232946] placeholder:text-gray-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-lg text-[#232946] placeholder:text-gray-400"
            />
            {uploading && <div className="text-sm text-blue-500">Uploading...</div>}
            {imageUrl && <div className="mt-2 h-32 w-full max-w-[320px] relative"><Image src={imageUrl} alt="Preview" fill style={{ objectFit: 'cover', borderRadius: '0.5rem' }} className="rounded" /></div>}
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
      </main>
      <Footer />
    </div>
  );
}
