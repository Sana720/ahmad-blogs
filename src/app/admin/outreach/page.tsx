"use client";

import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { getLeads, getSuppressions } from '../../../utils/outreachFirestore';

export default function OutreachDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    suppressed: 0,
    contacted: 0,
    interested: 0,
    converted: 0,
    unsubscribed: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const leads = await getLeads();
        const suppressions = await getSuppressions();
        
        const contacted = leads.filter(l => l.status === 'Contacted' || l.status === 'Replied' || l.status === 'Interested' || l.status === 'Converted').length;
        const interested = leads.filter(l => l.status === 'Interested').length;
        const converted = leads.filter(l => l.status === 'Converted').length;
        const unsubscribed = leads.filter(l => l.unsubscribeStatus).length;
        
        setStats({
          totalLeads: leads.length,
          suppressed: suppressions.length,
          contacted,
          interested,
          converted,
          unsubscribed
        });
      } catch (error) {
        console.error('Failed to load outreach stats', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Outreach Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] flex flex-col justify-center items-center">
              <div className="text-4xl font-black text-[#232946]">{loading ? '...' : stats.totalLeads}</div>
              <div className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wide">Total Leads</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] flex flex-col justify-center items-center">
              <div className="text-4xl font-black text-[#3CB371]">{loading ? '...' : stats.contacted}</div>
              <div className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wide">Contacted</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow p-6 border border-[#eaf0f6] flex flex-col justify-center items-center">
              <div className="text-4xl font-black text-red-500">{loading ? '...' : stats.unsubscribed}</div>
              <div className="text-sm font-semibold text-gray-500 mt-2 uppercase tracking-wide">Unsubscribed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border border-[#eaf0f6] overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-bold text-[#232946]">Quick Actions</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <a href="/admin/outreach/leads" className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Manage Leads
               </a>
               <a href="/admin/outreach/campaigns" className="flex items-center justify-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] transition-colors">
                  Create Campaign
               </a>
               <a href="/admin/outreach/templates" className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Edit Templates
               </a>
               <a href="/admin/outreach/settings" className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Outreach Settings
               </a>
            </div>
          </div>
          
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
