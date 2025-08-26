import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import CategoryCrud from '../../../components/admin/CategoryCrud';

export default function AdminCategories() {
  return (
    <RequireAuth>
      <AdminLayout>
        <CategoryCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
