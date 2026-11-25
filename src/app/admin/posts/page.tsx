import AdminLayout from '../../../components/admin/AdminLayout';
import PostCrud from './PostCrud';
import RequireAuth from '../../../components/admin/RequireAuth';

export default function AdminPosts() {
  return (
    <RequireAuth>
      <AdminLayout>
        <PostCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
