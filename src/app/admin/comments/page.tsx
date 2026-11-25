import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import CommentsCrud from '../../../components/admin/CommentsCrud';

export default function AdminComments() {
  return (
    <RequireAuth>
      <AdminLayout>
        <CommentsCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
