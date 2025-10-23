"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Image from 'next/image';

function slugify(str: string) {
  return str
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '') // Remove accents
    .replace(/[^\p{L}\p{N}\s]+/gu, '') // Remove non-word, non-space chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces (including Hindi/Unicode) with dash
    .replace(/-+/g, '-') // Remove multiple dashes
    .replace(/(^-|-$)+/g, '')
    .toLowerCase();
}

export default function PostForm({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || "");
  const [category, setCategory] = useState(initialData?.category ? (Array.isArray(initialData.category) ? initialData.category : [initialData.category]) : []);
  const [author, setAuthor] = useState(initialData?.author || "");
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const authSnap = await getDocs(collection(db, "authors"));
      setAuthors(authSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchData();
  }, []);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image.");
  const slug = initialData?.slug && initialData.slug.trim() ? initialData.slug : slugify(title);
    onSubmit({
      ...initialData,
      title,
      content,
      image: imageUrl,
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      category,
      author,
      slug,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-[#232946]">
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 text-[#232946]" required />
      </div>
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Content</label>
        <div className="w-full border rounded px-3 py-2 text-[#232946] bg-white">
          <MDEditor value={content} onChange={setContent} height={300} data-color-mode="light" style={{ background: '#fff', color: '#232946' }} />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Tags (comma separated)</label>
        <input value={tags} onChange={e => setTags(e.target.value)} className="w-full border rounded px-3 py-2 text-[#232946]" placeholder="e.g. diy, toy" />
      </div>
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Categories (hold Ctrl/Cmd to select multiple)</label>
        <select
          multiple
          value={category}
          onChange={e => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setCategory(selected);
          }}
          className="w-full border rounded px-3 py-2 text-[#232946]"
          required
        >
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Author</label>
        <select value={author} onChange={e => setAuthor(e.target.value)} className="w-full border rounded px-3 py-2 text-[#232946]" required>
          <option value="">Select author</option>
          {authors.map((auth: any) => (
            <option key={auth.id} value={auth.name}>{auth.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1 text-[#232946]">Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-[#232946]" />
        {uploading && <div className="text-sm text-blue-500">Uploading...</div>}
  {imageUrl && <div className="mt-2 h-32 w-full max-w-[320px] relative"><Image src={imageUrl} alt="Preview" fill style={{ objectFit: 'cover', borderRadius: '0.5rem' }} className="rounded" /></div>}
      </div>
      <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold">Save Post</button>
    </form>
  );
}
