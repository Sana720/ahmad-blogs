import AdminLayout from "../../../components/admin/AdminLayout";
import ReviewsAdmin from "../../../components/admin/ReviewsAdmin";

export default function AdminReviewsPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Reviews Management</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Approve or reject customer reviews here. Approved reviews will appear publicly on the product pages.
        </p>
        <ReviewsAdmin />
      </div>
    </AdminLayout>
  );
}
