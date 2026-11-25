"use client";

import AdminLayout from '../../../../components/admin/AdminLayout';
import RequireAuth from '../../../../components/admin/RequireAuth';
import { useEffect, useState } from 'react';
import { db } from '../../../../utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Settings } from '../../../../utils/outreachFirestore';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    senderName: 'Ahmad Blogs',
    senderEmail: 'support@ahmadblogs.com',
    businessName: 'Ahmad Blogs',
    businessAddress: '',
    defaultEmailsPerMinute: 5,
    dailySendLimit: 500,
    defaultProductUrl: 'https://www.ahmadblogs.com/products/google-chrome-profile-lock'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, 'outreach_settings', 'global');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'outreach_settings', 'global');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, settings as any);
      } else {
        await setDoc(docRef, settings);
      }
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight">Outreach Settings</h1>
            <p className="mt-2 text-sm text-gray-500">Configure global sender information and rate limits.</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-[#eaf0f6]">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sender Name</label>
                  <input type="text" name="senderName" value={settings.senderName || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sender Email</label>
                  <input type="email" name="senderEmail" value={settings.senderEmail || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name (for Footer)</label>
                  <input type="text" name="businessName" value={settings.businessName || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Address (for Footer)</label>
                  <input type="text" name="businessAddress" value={settings.businessAddress || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emails Per Minute (Batch Size)</label>
                  <input type="number" name="defaultEmailsPerMinute" value={settings.defaultEmailsPerMinute || 5} onChange={handleChange} min={1} max={100} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Product URL</label>
                  <input type="url" name="defaultProductUrl" value={settings.defaultProductUrl || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3CB371] focus:ring-[#3CB371] sm:text-sm px-4 py-2 border" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3CB371] hover:bg-[#329960] focus:outline-none disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
