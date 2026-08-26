"use client";

import React, { useState, useEffect } from "react";
import { Review } from "../types/review";
import { FcGoogle } from "react-icons/fc";
import { FaStar, FaRegStar, FaStarHalfAlt, FaCheckCircle } from "react-icons/fa";

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewsCount: number;
}

export default function ProductReviews({ productId, rating, reviewsCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [formData, setFormData] = useState({ authorName: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setFormData({ authorName: "", rating: 5, text: "" });
      }, 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = rating.toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 my-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-black text-[#232946] mb-2 flex items-center gap-2">
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">{displayRating}</span>
              <div className="flex flex-col">
                <div className="flex text-yellow-400 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {rating >= star ? (
                        <FaStar />
                      ) : rating >= star - 0.5 ? (
                        <FaStarHalfAlt />
                      ) : (
                        <FaRegStar />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">{reviewsCount} reviews</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-white text-[#232946] border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
        >
          Write a Review
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 py-4">Loading reviews...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0, visibleCount).map((review) => (
              <div key={review.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#232946] truncate">{review.authorName}</h4>
                      {review.source === 'google_seeded' ? (
                        <FcGoogle className="w-4 h-4 shrink-0" title="Imported from Google" />
                      ) : (
                        <FaCheckCircle className="w-3.5 h-3.5 text-[#3CB371] shrink-0" title="Verified Purchase" />
                      )}
                    </div>
                    <div className="flex text-yellow-400 text-xs mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {review.rating >= star ? (
                            <FaStar />
                          ) : review.rating >= star - 0.5 ? (
                            <FaStarHalfAlt />
                          ) : (
                            <FaRegStar />
                          )}
                        </span>
                      ))}
                      <span className="text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
              </div>
            ))}
          </div>
          
          {visibleCount < reviews.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="px-6 py-2.5 bg-white text-[#232946] border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                View More
              </button>
            </div>
          )}
        </>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-[#232946] mb-6">Write a Review</h3>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Review Submitted!</h4>
                <p className="text-gray-500 text-sm">Your review is pending moderation and will appear soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                  <div className="flex text-yellow-400 text-3xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => setFormData({...formData, rating: star})}>
                        {star <= formData.rating ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3CB371] focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#3CB371] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell others what you think about this product..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-[#3CB371] hover:bg-[#2e945b] text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
