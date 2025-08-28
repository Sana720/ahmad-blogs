"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Image from "next/image";

export default function AuthorCrud() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [editing, setEditing] = useState<any|null>(null);

  async function fetchAuthors() {
    const snap = await getDocs(collection(db, "authors"));
    setAuthors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => { fetchAuthors(); }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    if (!name.trim()) return;
    await addDoc(collection(db, "authors"), { name, avatar });
    setName("");
    setAvatar("");
    fetchAuthors();
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!editing) return;
    await updateDoc(doc(db, "authors", editing.id), { name, avatar });
    setEditing(null);
    setName("");
    setAvatar("");
    fetchAuthors();
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "authors", id));
    fetchAuthors();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#232946] mb-4">Authors</h2>
      <form onSubmit={editing ? handleUpdate : handleCreate} className="flex gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} className="border rounded px-3 py-2 text-[#232946]" placeholder="Author name" required />
        <input value={avatar} onChange={e => setAvatar(e.target.value)} className="border rounded px-3 py-2 text-[#232946]" placeholder="Avatar URL (optional)" />
        <button type="submit" className="bg-[#3CB371] text-white px-4 py-2 rounded font-bold">{editing ? "Update" : "Add"}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName(""); setAvatar(""); }} className="bg-gray-300 text-[#232946] px-4 py-2 rounded font-bold">Cancel</button>}
      </form>
      <table className="w-full border text-[#232946]">
        <thead>
          <tr className="bg-[#f7f8fa] text-[#232946]">
            <th className="p-2 border font-semibold">Name</th>
            <th className="p-2 border font-semibold">Avatar</th>
            <th className="p-2 border font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(author => (
            <tr key={author.id}>
              <td className="p-2 border">{author.name}</td>
              <td className="p-2 border">{author.avatar && <Image src={author.avatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />}</td>
              <td className="p-2 border">
                <button onClick={() => { setEditing(author); setName(author.name); setAvatar(author.avatar || ""); }} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(author.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
