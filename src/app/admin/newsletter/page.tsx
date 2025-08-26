"use client";
import RequireAuth from '../../../components/admin/RequireAuth';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, app } from '../../../utils/firebase';
import { getAuth } from 'firebase/auth';
import Toasts from '../../../components/Toast';
import { uid } from '../../../utils/uid';

export default function AdminNewsletter() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState('');
  const [toasts, setToasts] = useState<{ id: string; type?: 'success' | 'error' | 'info'; message: string }[]>([]);
  const pushToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = uid();
    setToasts((s) => [...s, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts((s) => s.filter(t => t.id !== id));
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const refetchList = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'newsletter'));
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err: any) {
      console.error(err);
      pushToast(err?.message || 'Could not load subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const auth = getAuth(app);
  setCurrentUid(auth.currentUser?.uid ?? null);
  refetchList();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'newsletter', id));
      setList(list.filter(i => i.id !== id));
      pushToast('Subscriber deleted', 'success');
    } catch (err: any) {
      console.error(err);
      const msg = err?.code === 'permission-denied' || /insufficient permissions/i.test(err?.message || '')
        ? 'Permission denied. Make sure your user UID exists in the admins collection.'
        : (err?.message || 'Could not delete subscriber');
      pushToast(msg, 'error');
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditingEmail(item.email);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'newsletter', editingId), { email: editingEmail });
      setList(list.map(i => i.id === editingId ? { ...i, email: editingEmail } : i));
      setEditingId(null);
      setEditingEmail('');
      pushToast('Subscriber updated', 'success');
    } catch (err: any) {
      console.error(err);
      const msg = err?.code === 'permission-denied' || /insufficient permissions/i.test(err?.message || '')
        ? 'Permission denied. Make sure your user UID exists in the admins collection.'
        : (err?.message || 'Could not update subscriber');
      pushToast(msg, 'error');
    }
  };

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#232946]">Newsletter Subscribers</h1>
          <div className="text-sm text-[#666]">
            Signed in as: <span className="font-mono text-[#232946]">{currentUid ?? '—'}</span>
            <button
              onClick={async () => {
                try {
                  const auth = getAuth(app);
                  if (!auth.currentUser) return pushToast('Not signed in', 'error');
                  await auth.currentUser.getIdToken(true);
                  pushToast('Session refreshed', 'success');
                  await refetchList();
                } catch (err: any) {
                  console.error(err);
                  pushToast(err?.message || 'Could not refresh session', 'error');
                }
              }}
              className="ml-4 px-3 py-1 border rounded text-sm"
            >Refresh session</button>
          </div>
        </div>
        {loading ? <div>Loading...</div> : (
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#666]"><th>Email</th><th>Created</th><th className="w-40">Actions</th></tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.id} className="border-t py-2">
                    <td className="py-3 text-[#232946]">{editingId === item.id ? (
                      <input value={editingEmail} onChange={e => setEditingEmail(e.target.value)} className="border px-2 py-1" />
                    ) : (
                      // show common field names as fallback and finally the raw object for debugging
                      item.email || item.Email || item.emailAddress || JSON.stringify(item)
                    )}</td>
                    <td className="text-[#232946]">{
                      // createdAt may be a Firestore Timestamp, a string, or missing
                      item.createdAt && typeof item.createdAt === 'object' && typeof item.createdAt.toDate === 'function'
                        ? item.createdAt.toDate().toLocaleString()
                        : (item.createdAt ? String(item.createdAt) : '')
                    }</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {editingId === item.id ? (
                          <>
                            <button onClick={saveEdit} className="bg-[#3CB371] text-white px-3 py-1 rounded text-sm">Save</button>
                            <button onClick={() => setEditingId(null)} className="border px-3 py-1 rounded text-sm bg-white">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(item)} className="border px-3 py-1 rounded text-sm">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Toasts toasts={toasts} removeToast={removeToast} />
          </div>
        )}
      </AdminLayout>
    </RequireAuth>
  );
}
