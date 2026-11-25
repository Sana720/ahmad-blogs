"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { OutreachList } from '../../../../utils/outreachFirestore';

export default function ListsPage() {
  const [lists, setLists] = useState<OutreachList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const fetchLists = async () => {
    try {
      const q = query(collection(db, 'outreach_lists'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setLists(snap.docs.map(d => ({ id: d.id, ...d.data() } as OutreachList)));
    } catch (e) {
      console.error("Failed to load lists", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      await addDoc(collection(db, 'outreach_lists'), {
        name: newListName,
        description: newListDescription,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setNewListName('');
      setNewListDescription('');
      setIsCreating(false);
      fetchLists();
    } catch (error) {
      console.error('Error creating list', error);
      alert('Failed to create list');
    }
  };

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Lead Lists</h1>
              <p className="mt-2 text-sm text-gray-500">Segment your leads into specific target lists.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button 
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] transition-colors"
              >
                Create List
              </button>
            </div>
          </div>

          {isCreating && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
              <h3 className="text-lg font-bold mb-4">Create New List</h3>
              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">List Name</label>
                  <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border" placeholder="e.g. US Digital Agencies" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input type="text" value={newListDescription} onChange={e => setNewListDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-[#3CB371] text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-[#329960]">Save List</button>
                  <button type="button" onClick={() => setIsCreating(false)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden border border-[#eaf0f6]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">Loading...</td></tr>
                ) : lists.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">No lists found.</td></tr>
                ) : (
                  lists.map((list) => (
                    <tr key={list.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{list.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{list.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {list.createdAt?.toDate ? new Date(list.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
