"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Template } from '../../../../utils/outreachFirestore';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');

  const fetchTemplates = async () => {
    try {
      const q = query(collection(db, 'outreach_templates'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as Template)));
    } catch (e) {
      console.error("Failed to load templates", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !htmlBody.trim()) return;
    try {
      await addDoc(collection(db, 'outreach_templates'), {
        name,
        subject,
        htmlBody,
        textBody: htmlBody.replace(/<[^>]+>/g, ''), // basic text fallback
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      setName('');
      setSubject('');
      setHtmlBody('');
      setIsCreating(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template', error);
      alert('Failed to create template');
    }
  };

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Email Templates</h1>
              <p className="mt-2 text-sm text-gray-500">Design HTML templates with variables like {'{{firstName}}'}.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] transition-colors"
              >
                Create Template
              </button>
            </div>
          </div>

          {isCreating && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
              <h3 className="text-lg font-bold mb-4">New Template</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Internal Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border" placeholder="e.g. Chrome Profile Lock Introduction" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border" placeholder="Hi {{firstName}}, check this out" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HTML Body</label>
                  <textarea value={htmlBody} onChange={e => setHtmlBody(e.target.value)} required rows={8} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] px-4 py-2 border font-mono text-sm" placeholder="<p>Hi {{firstName}},</p>..." />
                  <p className="text-xs text-gray-500 mt-1">Available variables: {'{{firstName}}, {{lastName}}, {{companyName}}, {{productUrl}}, {{discountCode}}'}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="bg-[#3CB371] text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-[#329960]">Save Template</button>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500">Loading...</td></tr>
                ) : templates.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500">No templates found.</td></tr>
                ) : (
                  templates.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{t.subject}</td>
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
