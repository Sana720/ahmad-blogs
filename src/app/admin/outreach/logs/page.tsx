"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { EmailLog } from '../../../../utils/outreachFirestore';

export default function LogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const q = query(collection(db, 'outreach_email_logs'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailLog)));
      } catch (e) {
        console.error("Failed to load logs", e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Email Logs</h1>
            <p className="mt-2 text-sm text-gray-500">Recent email sending and delivery events (last 100).</p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden border border-[#eaf0f6]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">Loading...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No logs found.</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.recipientEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">{log.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.status === 'Delivered' || log.status === 'Sent' ? 'bg-green-100 text-green-800' :
                            log.status === 'Bounced' || log.status === 'Failed' || log.status === 'Complained' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {log.createdAt?.toDate ? new Date(log.createdAt.toDate()).toLocaleString() : 'Unknown'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
