"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import AdminLayout from "../../../components/admin/AdminLayout";

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string; message: string }>({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "contacts"));
    setContacts(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Contact, 'id'>) })));
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "contacts", id));
    fetchContacts();
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditData({ name: contact.name, email: contact.email, message: contact.message });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateDoc(doc(db, "contacts", editingId), editData);
    setEditingId(null);
    fetchContacts();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-[#232946]">Contact Submissions</h1>
        {loading ? <div>Loading...</div> : (
          <table className="w-full border">
            <thead>
              <tr className="bg-[#eaf0f6]">
                <th className="p-2 border text-[#232946]">Name</th>
                <th className="p-2 border text-[#232946]">Email</th>
                <th className="p-2 border text-[#232946]">Message</th>
                <th className="p-2 border text-[#232946]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-b">
                  <td className="p-2 border text-[#232946]">
                    {editingId === contact.id ? (
                      <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="border p-1" />
                    ) : contact.name}
                  </td>
                  <td className="p-2 border text-[#232946]">
                    {editingId === contact.id ? (
                      <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} className="border p-1" />
                    ) : contact.email}
                  </td>
                  <td className="p-2 border text-[#232946]">
                    {editingId === contact.id ? (
                      <textarea value={editData.message} onChange={e => setEditData({ ...editData, message: e.target.value })} className="border p-1" />
                    ) : contact.message}
                  </td>
                  <td className="p-2 border text-[#232946]">
                    {editingId === contact.id ? (
                      <button onClick={handleUpdate} className="text-green-600 mr-2">Save</button>
                    ) : (
                      <button onClick={() => handleEdit(contact)} className="text-blue-600 mr-2">Edit</button>
                    )}
                    <button onClick={() => handleDelete(contact.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
