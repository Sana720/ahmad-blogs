import ProductsAdmin from '../../../components/admin/ProductsAdmin';
import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';

export default function AdminProductsPage() {
  return (
    <RequireAuth>
      <AdminLayout>
        <ProductsAdmin />
      </AdminLayout>
    </RequireAuth>
  );
}
