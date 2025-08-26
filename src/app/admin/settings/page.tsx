import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';

export default function AdminSettings() {
  return (
    <RequireAuth>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6 text-[#232946]">Settings</h1>
        <div className="text-[#232946]">Site and admin settings will go here.</div>
      </AdminLayout>
    </RequireAuth>
  );
}
