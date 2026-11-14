"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PayPalCheckoutButton from "@/components/PayPalCheckoutButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { trackEvent } from "@/utils/analytics";

interface CheckoutFormProps {
  planId: string;
  planName: string;
  planPrice: number;
  currency: string;
}

interface AppliedCoupon {
  code: string;
  discountPercentage: number;
  description?: string;
  discountAmount: number;
  finalPrice: number;
}

export default function CheckoutForm({ planId, planName, planPrice, currency }: CheckoutFormProps) {
  const searchParams = useSearchParams();
  const initialCoupon = searchParams?.get('coupon') || "";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [couponInput, setCouponInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isReadyForPayment, setIsReadyForPayment] = useState(false);

  // Validate coupon against API
  const validateAndApplyCoupon = useCallback(async (codeToTest: string) => {
    const cleanCode = codeToTest.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError("Please enter a coupon code.");
      setAppliedCoupon(null);
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, planPrice }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponError(data.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.code,
          discountPercentage: data.discountPercentage,
          description: data.description,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
        });
        setCouponError(null);
      }
    } catch (err: any) {
      setCouponError("Unable to validate coupon. Please try again.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [planPrice]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  // Auto-validate if coupon is provided via URL query params
  useEffect(() => {
    const couponFromUrl = searchParams?.get('coupon');
    if (couponFromUrl && !appliedCoupon) {
      setCouponInput(couponFromUrl);
      validateAndApplyCoupon(couponFromUrl);
    }
  }, [searchParams, appliedCoupon, validateAndApplyCoupon]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    trackEvent("begin_checkout", {
      plan_id: planId,
      plan_name: planName,
      price: planPrice,
      currency: currency,
    });
    setIsReadyForPayment(true);
  };

  const finalDue = appliedCoupon
    ? appliedCoupon.finalPrice.toFixed(2)
    : planPrice.toFixed(2);

  if (isReadyForPayment) {
    return (
      <div className="space-y-4">
        <ExitIntentPopup />
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">License Delivery</p>
              <p className="font-bold text-gray-900 text-sm break-all">{email}</p>
            </div>
            <button 
              type="button"
              onClick={() => setIsReadyForPayment(false)}
              className="text-xs text-[#3CB371] hover:text-[#2e8b57] font-bold underline shrink-0 cursor-pointer"
            >
              Edit
            </button>
          </div>

          <p className="text-[11px] text-amber-800 mt-2 flex items-start gap-1.5 font-medium leading-snug bg-amber-50/80 p-2 rounded-lg border border-amber-200/50">
            <svg className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            License verifies on this Chrome profile email.
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Plan Price:</span>
              <span className={appliedCoupon ? "line-through text-gray-400" : "font-bold text-gray-800"}>
                {currency === "USD" ? "$" : ""}{planPrice.toFixed(2)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-xs text-[#3CB371] font-semibold">
                <span>Coupon ({appliedCoupon.code} -{appliedCoupon.discountPercentage}%):</span>
                <span>-{currency === "USD" ? "$" : ""}{appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-extrabold pt-1.5 border-t border-slate-200/80">
              <span className="text-[#232946]">Final Amount:</span>
              <span className="text-[#3CB371] text-base">
                {currency === "USD" ? "$" : ""}{finalDue}
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-1">
          <PayPalCheckoutButton 
            planId={planId} 
            customerEmail={email} 
            customerName={name}
            discountCode={appliedCoupon ? appliedCoupon.code : undefined}
          />
        </div>

        <div className="p-2.5 bg-orange-50/70 border border-orange-200/70 rounded-xl text-xs text-orange-900 text-center leading-relaxed">
          <span className="font-bold">🇮🇳 Indian Users:</span> PayPal does not support domestic INR.
          <br/>
          <a 
            href="https://wa.me/917209362004" 
            target="_blank" 
            onClick={() => trackEvent("contact_click", { channel: "whatsapp_upi_checkout", plan_id: planId })} 
            className="font-bold underline text-orange-950 hover:text-orange-800 inline-flex items-center gap-1 mt-0.5"
          >
            WhatsApp (+91 7209362004) to pay via UPI
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <ExitIntentPopup />
      <form onSubmit={handleContinue} className="space-y-3.5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="name" className="text-xs sm:text-sm font-bold text-gray-700">Full Name</label>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Optional</span>
          </div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white rounded-xl border border-gray-200 focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 outline-none transition-all placeholder:text-gray-400 shadow-2xs"
            placeholder="John Doe"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="email" className="text-xs sm:text-sm font-bold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold">License sent here</span>
          </div>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white rounded-xl border border-gray-200 focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 outline-none transition-all placeholder:text-gray-400 shadow-2xs"
            placeholder="your-email@gmail.com"
          />
          <div className="mt-2 p-2.5 px-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs sm:text-[13px] text-amber-900 flex items-start gap-2 leading-relaxed">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold text-amber-950">Important:</span> Enter the email profile where you use Chrome. The license activates on that profile only.
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="discountCode" className="text-xs sm:text-sm font-bold text-gray-700">Promo Code</label>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">Optional</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="discountCode"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                if (couponError) setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  validateAndApplyCoupon(couponInput);
                }
              }}
              disabled={isValidatingCoupon || Boolean(appliedCoupon)}
              className="flex-1 px-4 py-2.5 text-sm sm:text-base text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white rounded-xl border border-gray-200 focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 outline-none transition-all uppercase font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal disabled:bg-gray-100 placeholder:text-gray-400 shadow-2xs"
              placeholder="e.g. PRO20"
            />
            {!appliedCoupon ? (
              <button
                type="button"
                onClick={() => validateAndApplyCoupon(couponInput)}
                disabled={isValidatingCoupon || !couponInput.trim()}
                className="px-5 py-2.5 bg-[#3CB371] hover:bg-[#349e63] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 min-w-[80px] cursor-pointer"
              >
                {isValidatingCoupon ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-3.5 py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>

          {/* Error Message */}
          {couponError && (
            <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1 animate-in fade-in duration-200">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {couponError}
            </p>
          )}

          {/* Success Message */}
          {appliedCoupon && (
            <div className="mt-1.5 p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-800 animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="text-emerald-600">✓</span>
                <span className="uppercase">{appliedCoupon.code}</span> applied: {appliedCoupon.discountPercentage}% OFF
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-emerald-700 hover:text-red-600 font-semibold cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Live Price Summary if Coupon Applied */}
        {appliedCoupon && (
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs sm:text-sm space-y-1.5 shadow-2xs">
            <div className="flex justify-between text-gray-500">
              <span>Original Price:</span>
              <span className="line-through">{currency === "USD" ? "$" : ""}{planPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#3CB371] font-medium">
              <span>Coupon Discount ({appliedCoupon.discountPercentage}%):</span>
              <span>-{currency === "USD" ? "$" : ""}{appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#232946] font-bold pt-1.5 border-t border-emerald-200/60 text-sm sm:text-base">
              <span>New Total:</span>
              <span className="text-[#3CB371]">{currency === "USD" ? "$" : ""}{finalDue}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 sm:py-4 px-4 bg-[#232946] hover:bg-[#1b2038] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <svg className="w-4 h-4 text-[#3CB371]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Continue to Payment
        </button>
      </form>
    </>
  );
}
