"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Suppression } from '../../../../utils/outreachFirestore';

export default function SuppressionPage() {
  const [suppressions, setSuppressions] = useState<Suppression[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Manual Do Not Contact');

  const fetchSuppressions = async () => {
    try {
      const q = query(collection(db, 'outreach_suppressions'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setSuppressions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Suppression)));
    } catch (e) {
      console.error("Failed to load suppressions", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppressions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addDoc(collection(db, 'outreach_suppressions'), {
        email: email.toLowerCase().trim(),
        reason,
        source: 'Admin UI',
        createdAt: Timestamp.now(),
      });
      setEmail('');
      setIsAdding(false);
      fetchSuppressions();
    } catch (error) {
      console.error('Error adding to suppression list', error);
      alert('Failed to add');
    }
  };

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Suppression List</h1>
              <p className="mt-2 text-sm text-gray-500">Emails on this list will automatically be skipped during campaigns.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Add Suppression
              </button>
            </div>
          </div>

          {isAdding && (
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-8">
              <h3 className="text-lg font-bold text-red-800 mb-4">Add to Global Suppression List</h3>
              <form onSubmit={handleAdd} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-red-800">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-800">Reason</label>
                  <select value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 px-4 py-2 border">
                    <option value="Manual Do Not Contact">Manual Do Not Contact</option>
                    <option value="Complaint">Complaint</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-red-700">Add to List</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden border border-[#eaf0f6]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">Loading...</td></tr>
                ) : suppressions.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No suppressions found.</td></tr>
                ) : (
                  suppressions.map((sup) => (
                    <tr key={sup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sup.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {sup.reason}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sup.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {sup.createdAt?.toDate ? new Date(sup.createdAt.toDate()).toLocaleString() : 'Unknown'}
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
