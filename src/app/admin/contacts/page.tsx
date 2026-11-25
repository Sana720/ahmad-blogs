import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import ContactsCrud from '../../../components/admin/ContactsCrud';

export default function AdminContacts() {
  return (
    <RequireAuth>
      <AdminLayout>
        <ContactsCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
