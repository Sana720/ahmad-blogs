"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../../../utils/productsData";
import { Plan } from "../../../types/license";
import CheckoutForm from "../../checkout/[planId]/CheckoutForm";

interface PurchaseCTAProps {
  product: Product;
  priceStr: string;
  plans: Plan[];
}

export default function PurchaseCTA({ product, priceStr, plans }: PurchaseCTAProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Filter only active plans and sort by price descending (highest value at the top)
  const activePlans = plans
    .filter((p) => p.active !== false)
    .sort((a, b) => b.price - a.price);

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (activePlans.length === 1) {
      // Show modal directly on the single plan's checkout form
      setSelectedPlan(activePlans[0]);
      setShowModal(true);
    } else if (activePlans.length > 1) {
      // Show modal to choose plan
      setSelectedPlan(null);
      setShowModal(true);
    } else {
      // No plans available
      alert("No purchase plans are currently available for this product.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
          {product.downloadUrl && (
            <a
              href={product.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center text-center px-2 py-2.5 sm:py-3 bg-white hover:bg-gray-50 text-[#3CB371] border-[1.5px] border-[#3CB371] text-[13px] sm:text-sm font-extrabold rounded-full transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              {product.pricingType === "Freemium" ? "Install Free Extension" : "Download Now"}
            </a>
          )}
          
          {product.purchaseUrl && (
            <button
              onClick={handlePurchaseClick}
              className="flex-1 flex items-center justify-center gap-1.5 text-center px-2 py-2.5 sm:py-3 text-[13px] sm:text-sm font-bold rounded-full transition-all cursor-pointer bg-[#FFC439] hover:bg-[#F4BB33] text-gray-900 shadow-sm whitespace-nowrap"
            >
              <svg viewBox="0 0 124 33" className="h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M46.21 31.84L51.35 0H74.32C81.33 0 85.91 1.48 88.08 4.45C89.73 6.64 90.15 9.77 89.34 13.82C87.89 20.9 83.27 25.12 75.46 25.12H61.64L58.62 31.84H46.21Z" fill="#003087"/>
                <path d="M12.98 31.84L18.12 0H41.09C48.1 0 52.68 1.48 54.85 4.45C56.5 6.64 56.92 9.77 56.11 13.82C54.66 20.9 50.04 25.12 42.23 25.12H28.41L25.39 31.84H12.98Z" fill="#009CDE"/>
              </svg>
              <span>{product.pricingType === "Freemium" ? `Get Pro ${priceStr}` : `Get Pro ${priceStr}`}</span>
            </button>
          )}

          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center text-center px-2 py-2.5 sm:py-3 bg-gray-50 hover:bg-gray-100 text-[#232946] text-[13px] sm:text-sm font-extrabold rounded-full border border-gray-200 transition-all cursor-pointer whitespace-nowrap"
            >
              Live Demo
            </a>
          )}
        </div>
        
        {product.purchaseUrl && (
          <div className="flex flex-col items-center justify-center mt-1">
            <div className="flex justify-center items-center gap-1.5 mb-2">
              <div className="bg-[#1434CB] text-white text-[10px] font-bold italic px-2 py-0.5 rounded-sm w-12 text-center shadow-sm">VISA</div>
              <div className="bg-[#222222] text-white text-[8px] font-bold px-1 py-0.5 rounded-sm w-12 text-center flex items-center justify-center relative overflow-hidden h-[20px] shadow-sm">
                <span className="relative z-10 leading-none mt-0.5">mastercard</span>
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full opacity-80"></div>
              </div>
              <div className="bg-[#2671B9] text-white text-[10px] font-bold px-1 py-0.5 rounded-sm w-12 text-center leading-none h-[20px] flex items-center justify-center shadow-sm">AMEX</div>
              <div className="bg-[#232946] text-white text-[8px] font-bold px-1 py-0.5 rounded-sm w-12 text-center leading-none h-[20px] flex items-center justify-center border-b-[2px] border-[#F9A021] shadow-sm">DISCOVER</div>
            </div>
            <p className="text-gray-400 text-[13px] font-medium text-center">Skip the forms and pay faster with PayPal!</p>
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-[12px] text-orange-800 text-center w-full max-w-sm mx-auto">
              <span className="font-bold">🇮🇳 Indian Users:</span> PayPal does not support domestic payments. Please <a href="https://wa.me/917209362004" target="_blank" className="font-bold underline text-orange-900">WhatsApp me</a> to buy via UPI.
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Buy Button */}
      {product.purchaseUrl && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:hidden z-40 animate-in slide-in-from-bottom-full duration-300">
          <button
            onClick={handlePurchaseClick}
            className="w-full text-center py-3.5 bg-[#3CB371] active:bg-[#2e945b] text-white text-base font-extrabold rounded-xl shadow-md"
          >
            {product.pricingType === "Freemium" ? `Get PRO (${priceStr})` : "Buy Now"}
          </button>
        </div>
      )}

      {/* Plan Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowModal(false);
                setTimeout(() => setSelectedPlan(null), 200); // Reset after closing animation
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {!selectedPlan ? (
                <>
                  <h2 className="text-2xl font-extrabold text-[#232946] mb-2 pr-8">Select a Plan</h2>
                  <p className="text-gray-500 mb-6 text-sm">
                    Choose the best subscription or lifetime plan for {product.title}.
                  </p>

                  <div className="space-y-4">
                    {activePlans.map((plan) => {
                      const isLifetime = plan.slug.toLowerCase() === 'lifetime' || plan.lifetime;
                      const isYearly = plan.slug.toLowerCase() === 'yearly' || plan.durationDays === 365 || plan.durationDays === 360;

                      return (
                        <div 
                          key={plan.id || plan.slug} 
                          className="relative flex flex-col sm:flex-row items-center justify-between p-5 sm:p-6 border-2 rounded-xl transition-all gap-4 overflow-hidden border-gray-200 hover:border-[#3CB371] hover:bg-green-50/30"
                        >
                          <div className="flex-1 text-left w-full sm:w-auto z-10">
                            <h3 className="font-bold text-[#232946] text-lg sm:text-xl pr-10 sm:pr-0 flex items-center gap-2">
                              {plan.name}
                              {isLifetime && (
                                <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest py-0.5 px-2 rounded-md whitespace-nowrap">
                                  🔥 Top Selling
                                </span>
                              )}
                              {isYearly && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest py-0.5 px-2 rounded-md whitespace-nowrap">
                                  💎 Best Value
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {plan.lifetime 
                                ? "One-time payment, lifetime access" 
                                : `Billed every ${plan.durationDays} days`}
                            </p>
                          </div>
                          
                          <div className="flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 z-10 shrink-0">
                            <div className="flex flex-col items-start sm:items-end gap-1">
                              {plan.regularPrice && plan.regularPrice > plan.price && (
                                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 leading-none">
                                  <span className="line-through">{plan.currency === "USD" ? "$" : ""}{plan.regularPrice}</span>
                                  <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-bold">
                                    -{Math.round(((plan.regularPrice - plan.price) / plan.regularPrice) * 100)}%
                                  </span>
                                </div>
                              )}
                              <div className="text-xl sm:text-2xl font-black text-[#232946] leading-none">
                                {plan.currency === "USD" ? "$" : ""}{plan.price}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedPlan(plan)}
                              className={`px-5 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm shrink-0 ${
                                isLifetime ? 'bg-[#3CB371] hover:bg-[#2e945b] text-white' : 'bg-gray-800 hover:bg-gray-900 text-white'
                              }`}
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  {activePlans.length > 1 && (
                    <button 
                      onClick={() => setSelectedPlan(null)}
                      className="text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      Back to plans
                    </button>
                  )}
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-[#232946] mb-1 pr-8">Complete Purchase</h2>
                    <p className="text-gray-500 text-sm">
                      You are purchasing the <span className="font-bold text-[#3CB371]">{selectedPlan.name}</span> plan for <span className="font-bold text-gray-800">{selectedPlan.currency === "USD" ? "$" : ""}{selectedPlan.price}</span>.
                    </p>
                  </div>
                  
                  <CheckoutForm 
                    planId={selectedPlan.id || selectedPlan.slug} 
                    planName={selectedPlan.name} 
                  />
                </div>
              )}
            </div>

            {/* Trust Badges Footer */}
            <div className="bg-gray-50 border-t border-gray-100 p-4 rounded-b-2xl flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>🔒</span> Secure PayPal Checkout
              </div>
              <div className="flex items-center gap-1.5">
                <span>⚡</span> Instant Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <span>🛡️</span> Guarantee
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
