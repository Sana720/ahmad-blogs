import PortfolioAdmin from '../../../components/admin/PortfolioAdmin';
import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';

export default function AdminPortfolioPage() {
  return (
    <RequireAuth>
      <AdminLayout>
        <PortfolioAdmin />
      </AdminLayout>
    </RequireAuth>
  );
}
