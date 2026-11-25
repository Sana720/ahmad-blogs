"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../../../utils/productsData";
import { Plan } from "../../../types/license";
import CheckoutForm from "../../checkout/[planId]/CheckoutForm";
import { trackEvent } from "../../../utils/analytics";

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

    trackEvent("pricing_click", {
      product_id: product.id,
      product_title: product.title,
      price: priceStr,
    });

    if (activePlans.length === 1) {
      const plan = activePlans[0];
      const isLifetime = plan.slug.toLowerCase() === 'lifetime' || plan.lifetime;
      const isYearly = plan.slug.toLowerCase() === 'yearly' || plan.durationDays === 365 || plan.durationDays === 360;
      const planType = isLifetime ? 'Buy Lifetime' : isYearly ? 'Buy Yearly' : 'Buy Monthly';
      trackEvent("purchase_plan_click", {
        plan_type: planType,
        plan_name: plan.name,
        plan_id: plan.id || plan.slug,
        price: plan.price,
        currency: plan.currency,
        product_id: product.id,
        product_title: product.title,
      });

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
              title={`Download ${product.title}`}
              onClick={() => {
                if (product.pricingType === "Freemium") {
                  trackEvent("extension_install_click", {
                    product_id: product.id,
                    product_title: product.title,
                    url: product.downloadUrl,
                  });
                } else {
                  trackEvent("extension_download", {
                    product_id: product.id,
                    product_title: product.title,
                    url: product.downloadUrl,
                  });
                }
              }}
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
              onClick={() => {
                trackEvent("demo_click", {
                  product_id: product.id,
                  product_title: product.title,
                  url: product.demoUrl,
                  type: "live_demo",
                });
              }}
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
              <span className="font-bold">🇮🇳 Indian Users:</span> PayPal does not support domestic payments. Please <a href="https://wa.me/917209362004" target="_blank" title="Contact via WhatsApp" onClick={() => trackEvent("contact_click", { channel: "whatsapp_upi", product_id: product.id, product_title: product.title })} className="font-bold underline text-orange-900">WhatsApp me</a> to buy via UPI.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className={`bg-white rounded-3xl w-full ${selectedPlan ? 'max-w-[560px]' : 'max-w-[620px]'} max-h-[92vh] flex flex-col shadow-2xl relative transition-all duration-300 overflow-hidden border border-gray-100`}>
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowModal(false);
                setTimeout(() => setSelectedPlan(null), 200); // Reset after closing animation
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100/90 hover:bg-gray-200 rounded-full p-2.5 transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={`${selectedPlan ? 'p-5 sm:p-6 sm:pt-4 sm:pb-5' : 'p-6 sm:p-8'} overflow-y-auto flex-1`}>
              {!selectedPlan ? (
                <>
                  <div className="mb-6 pr-8">
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#232946] tracking-tight">Select a Plan</h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-1">
                      Choose the best license for {product.title}.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activePlans.map((plan) => {
                      const isLifetime = plan.slug.toLowerCase() === 'lifetime' || plan.lifetime;
                      const isYearly = plan.slug.toLowerCase() === 'yearly' || plan.durationDays === 365 || plan.durationDays === 360;

                      return (
                        <div 
                          key={plan.id || plan.slug} 
                          className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 border-2 rounded-2xl transition-all gap-4 overflow-hidden ${
                            isLifetime 
                              ? 'border-[#3CB371] bg-emerald-50/20 shadow-xs' 
                              : 'border-gray-200/90 hover:border-[#3CB371] hover:bg-green-50/20 shadow-xs'
                          }`}
                        >
                          <div className="flex-1 text-left min-w-0 z-10">
                            <h3 className="font-bold text-[#232946] text-lg sm:text-xl flex items-center gap-2">
                              {plan.name}
                              {isLifetime && (
                                <span className="bg-orange-100 text-orange-700 text-[11px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-md whitespace-nowrap">
                                  🔥 Most Popular
                                </span>
                              )}
                              {isYearly && (
                                <span className="bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-md whitespace-nowrap">
                                  💎 Best Value
                                </span>
                              )}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              {plan.lifetime 
                                ? "One-time payment, lifetime access & all updates" 
                                : `Billed every ${plan.durationDays} days`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0 z-10 justify-between sm:justify-end">
                            <div className="text-left sm:text-right">
                              {plan.regularPrice && plan.regularPrice > plan.price && (
                                <div className="text-xs sm:text-sm text-gray-400 font-medium flex items-center gap-1 sm:justify-end leading-none">
                                  <span className="line-through">{plan.currency === "USD" ? "$" : ""}{plan.regularPrice}</span>
                                </div>
                              )}
                              <div className="text-xl sm:text-2xl font-black text-[#232946] leading-none mt-1">
                                {plan.currency === "USD" ? "$" : ""}{plan.price}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const planType = isLifetime ? 'Buy Lifetime' : isYearly ? 'Buy Yearly' : 'Buy Monthly';
                                trackEvent("purchase_plan_click", {
                                  plan_type: planType,
                                  plan_name: plan.name,
                                  plan_id: plan.id || plan.slug,
                                  price: plan.price,
                                  currency: plan.currency,
                                  product_id: product.id,
                                  product_title: product.title,
                                });
                                setSelectedPlan(plan);
                              }}
                              className={`px-5 py-2.5 sm:px-6 sm:py-3 font-bold text-sm sm:text-base rounded-xl transition-all whitespace-nowrap shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                                isLifetime ? 'bg-[#3CB371] hover:bg-[#2e945b] text-white shadow-emerald-600/20 shadow-md' : 'bg-gray-800 hover:bg-gray-900 text-white'
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
                <div className="animate-in slide-in-from-right-3 duration-250">
                  {/* Top Bar Navigation */}
                  <div className="flex items-center justify-between mb-2.5">
                    {activePlans.length > 1 ? (
                      <button 
                        onClick={() => setSelectedPlan(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100 -ml-2 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to plans
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">Checkout</span>
                    )}
                  </div>

                  {/* Selected Plan Summary Banner */}
                  <div className="flex items-center justify-between py-2.5 px-3.5 sm:px-4 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white border border-emerald-100 rounded-xl mb-3 shadow-2xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Selected License</div>
                      <div className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-1.5 mt-0.5">
                        {selectedPlan.name}
                        {selectedPlan.lifetime && (
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
                            Lifetime
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price</div>
                      <div className="text-lg sm:text-xl font-black text-[#3CB371] leading-none mt-0.5">
                        {selectedPlan.currency === "USD" ? "$" : ""}{selectedPlan.price}
                      </div>
                    </div>
                  </div>
                  
                  <CheckoutForm 
                    planId={selectedPlan.id || selectedPlan.slug} 
                    planName={selectedPlan.name} 
                    planPrice={selectedPlan.price}
                    currency={selectedPlan.currency}
                  />
                </div>
              )}
            </div>

            {/* Trust Badges Footer */}
            <div className="bg-gray-50/90 border-t border-gray-100 py-3 px-6 rounded-b-3xl flex items-center justify-around text-xs sm:text-[13px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <span>🔒</span> PayPal Secure
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>⚡</span> Instant Delivery
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>🛡️</span> 7-Day Refund
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
