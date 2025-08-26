"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function CategoryCrud() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<any|null>(null);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => { fetchCategories(); }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    if (!name.trim()) return;
    await addDoc(collection(db, "categories"), { name });
    setName("");
    fetchCategories();
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!editing) return;
    await updateDoc(doc(db, "categories", editing.id), { name });
    setEditing(null);
    setName("");
    fetchCategories();
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "categories", id));
    fetchCategories();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#232946] mb-4">Categories</h2>
      <form onSubmit={editing ? handleUpdate : handleCreate} className="flex gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} className="border rounded px-3 py-2 text-[#232946]" placeholder="Category name" required />
        <button type="submit" className="bg-[#3CB371] text-white px-4 py-2 rounded font-bold">{editing ? "Update" : "Add"}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName(""); }} className="bg-gray-300 text-[#232946] px-4 py-2 rounded font-bold">Cancel</button>}
      </form>
      <table className="w-full border text-[#232946]">
        <thead>
          <tr className="bg-[#f7f8fa] text-[#232946]">
            <th className="p-2 border font-semibold">Name</th>
            <th className="p-2 border font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">
                <button onClick={() => { setEditing(cat); setName(cat.name); }} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
