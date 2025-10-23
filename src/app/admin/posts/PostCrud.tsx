"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import PostForm from "../../../components/admin/PostForm";

export default function PostCrud() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any|null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchPosts() {
    const [snap, snapHindi] = await Promise.all([
      getDocs(collection(db, "posts")),
      getDocs(collection(db, "posts_hindi")),
    ]);
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), lang: 'en' }));
    const postsHindi = snapHindi.docs.map(d => ({ id: d.id, ...d.data(), lang: 'hi' }));
    setPosts([...posts, ...postsHindi]);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleCreate(data: any) {
    // Remove id if present (for new posts)
    const { id, ...rest } = data;
    // Determine if Hindi post by category
    const cats = Array.isArray(rest.category) ? rest.category : [rest.category];
    const isHindi = cats.some((cat: string) => cat === 'हिंदी' || cat === 'Hindi');
    const collectionName = isHindi ? 'posts_hindi' : 'posts';
    // Use client-side addDoc for both collections (user must be authenticated)
    const docRef = await addDoc(collection(db, collectionName), rest);
    setShowForm(false);
    fetchPosts();
    // notify subscribers about the new post (best-effort, only for non-Hindi)
    if (!isHindi) {
      try {
        const slug = rest.slug || '';
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = origin ? `${origin}/posts/${slug}` : `/posts/${slug}`;
        await fetch('/api/notify-post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: rest.title, excerpt: rest.excerpt || '', url }) });
        console.log('Notify sent for new post');
      } catch (err) {
        console.error('Notify failed', err);
      }
    }
  }

  async function handleUpdate(data: any) {
    if (!editing) return;
    // Don't update id field in Firestore
    const { id, ...rest } = data;
    await updateDoc(doc(db, "posts", editing.id), rest);
    setEditing(null);
    setShowForm(false);
    fetchPosts();
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "posts", id));
    fetchPosts();
  }

  async function handleFeature(postId: string) {
    // Unset 'featured' on all posts, set it on the selected one
    const snap = await getDocs(collection(db, "posts"));
    const batch = writeBatch(db);
    snap.docs.forEach(docSnap => {
      const isTarget = docSnap.id === postId;
      batch.update(doc(db, "posts", docSnap.id), { featured: isTarget });
    });
    await batch.commit();
    fetchPosts();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#232946]">Posts</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-[#3CB371] text-white px-4 py-2 rounded">Add Post</button>
      </div>
      {showForm && (
        <PostForm
          onSubmit={editing ? handleUpdate : handleCreate}
          initialData={editing}
        />
      )}
      <div className="mt-8">
        <table className="w-full border text-[#232946]">
          <thead>
            <tr className="bg-[#f7f8fa] text-[#232946]">
              <th className="p-2 border font-semibold">Title</th>
              <th className="p-2 border font-semibold">Image</th>
              <th className="p-2 border font-semibold">Actions</th>
              <th className="p-2 border font-semibold">Feature</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="text-[#232946]">
                <td className="p-2 border">{post.title}</td>
                <td className="p-2 border">{post.image && <Image src={post.image} alt={post.title || ''} width={48} height={48} className="rounded" />}</td>
                <td className="p-2 border">
                  <button onClick={() => { setEditing(post); setShowForm(true); }} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600">Delete</button>
                </td>
                <td className="p-2 border text-center">
                  {post.featured ? (
                    <span className="text-green-600 font-bold">Featured</span>
                  ) : (
                    <button onClick={() => handleFeature(post.id)} className="bg-[#3CB371] text-white px-3 py-1 rounded text-xs">Make Featured</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
