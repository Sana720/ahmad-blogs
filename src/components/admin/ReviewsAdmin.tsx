"use client";

import React, { useState, useEffect } from "react";
import { Review } from "../../types/review";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Failed to mark as ${status}`);
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-gray-600">Loading reviews...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-800">
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Review Moderation</h2>
        <button
          onClick={fetchReviews}
          className="text-sm bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {reviews.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No reviews found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {review.productId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {review.authorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-yellow-500">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={review.text}>
                    {review.text}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      review.status === 'approved' ? 'bg-green-100 text-green-800' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(review.id, "approved")}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(review.id, "rejected")}
                          className="text-orange-600 hover:text-orange-900 bg-orange-50 p-1.5 rounded"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded ml-2"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
