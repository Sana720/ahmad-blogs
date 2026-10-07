"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Campaign } from '../../../../utils/outreachFirestore';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const q = query(collection(db, 'outreach_campaigns'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign)));
      } catch (e) {
        console.error("Failed to load campaigns", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Campaigns</h1>
              <p className="mt-2 text-sm text-gray-500">Create, schedule, and monitor your email outreach campaigns.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button onClick={() => alert("Campaign Wizard would open here.")} className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] focus:outline-none transition-colors">
                Create Campaign
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden border border-[#eaf0f6]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">Loading campaigns...</td>
                    </tr>
                  ) : campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No campaigns found. Click "Create Campaign" to start.</td>
                    </tr>
                  ) : (
                    campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{camp.name}</div>
                          {camp.description && <div className="text-sm text-gray-500">{camp.description}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            camp.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            camp.status === 'Sending' ? 'bg-blue-100 text-blue-800' :
                            camp.status === 'Failed' || camp.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {camp.createdAt?.toDate ? new Date(camp.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#3CB371] hover:text-[#2da05f] mr-3">View</button>
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
