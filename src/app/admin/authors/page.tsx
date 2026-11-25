import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import AuthorCrud from '../../../components/admin/AuthorCrud';

export default function AdminAuthors() {
  return (
    <RequireAuth>
      <AdminLayout>
        <AuthorCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
