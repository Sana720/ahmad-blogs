"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import PostForm from "../../../components/admin/PostForm";

export default function PostCrud() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any|null>(null);
  const [showForm, setShowForm] = useState(false);

  async function fetchPosts() {
    const snap = await getDocs(collection(db, "posts"));
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleCreate(data: any) {
    const docRef = await addDoc(collection(db, "posts"), data);
    setShowForm(false);
    fetchPosts();
    // notify subscribers about the new post (best-effort)
    try {
      const slug = data.slug || '';
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = origin ? `${origin}/posts/${slug}` : `/posts/${slug}`;
      await fetch('/api/notify-post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: data.title, excerpt: data.excerpt || '', url }) });
      console.log('Notify sent for new post');
    } catch (err) {
      console.error('Notify failed', err);
    }
  }

  async function handleUpdate(data: any) {
    if (!editing) return;
    await updateDoc(doc(db, "posts", editing.id), data);
    setEditing(null);
    setShowForm(false);
    fetchPosts();
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "posts", id));
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
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="text-[#232946]">
                <td className="p-2 border">{post.title}</td>
                <td className="p-2 border">{post.image && <img src={post.image} alt="" className="h-12 rounded" />}</td>
                <td className="p-2 border">
                  <button onClick={() => { setEditing(post); setShowForm(true); }} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
