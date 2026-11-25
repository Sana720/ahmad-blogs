import AdminLayout from '../../../components/admin/AdminLayout';
import RequireAuth from '../../../components/admin/RequireAuth';
import CouponCrud from '../../../components/admin/CouponCrud';

export default function AdminCoupons() {
  return (
    <RequireAuth>
      <AdminLayout>
        <CouponCrud />
      </AdminLayout>
    </RequireAuth>
  );
}
