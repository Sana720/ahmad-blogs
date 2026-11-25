"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { getLeads, Lead } from '../../../../utils/outreachFirestore';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, []);

  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(search.toLowerCase()) || 
    (l.fullName && l.fullName.toLowerCase().includes(search.toLowerCase())) ||
    (l.companyName && l.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Leads</h1>
              <p className="mt-2 text-sm text-gray-500">Manage your outreach prospects, import lists, and view engagement.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
                Import CSV
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] focus:outline-none transition-colors">
                Add Lead
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden border border-[#eaf0f6]">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search leads by email, name, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email / Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">Loading leads...</td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No leads found.</td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.email}</div>
                          {lead.fullName && <div className="text-sm text-gray-500">{lead.fullName}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.companyName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Unsubscribed' || lead.status === 'Invalid' ? 'bg-red-100 text-red-800' :
                            lead.status === 'Replied' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#3CB371] hover:text-[#2da05f]">Edit</button>
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
