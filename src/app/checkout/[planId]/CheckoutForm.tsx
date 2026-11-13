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
      <div className="space-y-6">
        <ExitIntentPopup />
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Sending license to:</p>
          <p className="font-bold text-gray-900">{email}</p>
          <p className="text-xs text-amber-800 mt-1 flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            License will verify on this Chrome profile email only.
          </p>

          {appliedCoupon && (
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Discount applied:{" "}
              <span className="uppercase text-[#3CB371] font-bold">{appliedCoupon.code}</span>{" "}
              ({appliedCoupon.discountPercentage}% OFF)
            </p>
          )}

          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Original Price:</span>
              <span className={appliedCoupon ? "line-through text-gray-400" : "font-bold text-gray-900"}>
                {currency === "USD" ? "$" : ""}{planPrice.toFixed(2)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-sm text-[#3CB371] font-semibold">
                <span>Coupon Discount ({appliedCoupon.discountPercentage}%):</span>
                <span>-{currency === "USD" ? "$" : ""}{appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-bold pt-1 border-t border-gray-200">
              <span className="text-[#232946]">Total Due:</span>
              <span className={appliedCoupon ? "text-[#3CB371]" : "text-gray-900"}>
                {currency === "USD" ? "$" : ""}{finalDue}
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setIsReadyForPayment(false)}
            className="text-sm text-[#3CB371] hover:underline mt-3 font-medium cursor-pointer"
          >
            Change details or coupon
          </button>
        </div>
        
        <div className="pt-2">
          <PayPalCheckoutButton 
            planId={planId} 
            customerEmail={email} 
            customerName={name}
            discountCode={appliedCoupon ? appliedCoupon.code : undefined}
          />
        </div>

        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800 text-center">
          <span className="font-bold">🇮🇳 Indian Users:</span> PayPal does not support domestic payments in India. 
          <br/>
          Please <a href="https://wa.me/917209362004" target="_blank" onClick={() => trackEvent("contact_click", { channel: "whatsapp_upi_checkout", plan_id: planId })} className="font-bold underline text-orange-900">WhatsApp me (+91 7209362004)</a> to buy your license directly via UPI!
        </div>
      </div>
    );
  }

  return (
    <>
      <ExitIntentPopup />
      <form onSubmit={handleContinue} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] outline-none transition-all"
            placeholder="john@example.com"
          />
          <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold text-amber-950">Important:</span> Make sure to enter the email of the Chrome profile where you will use this extension. The license key will verify and activate on that email profile only.
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            We will send your {planName} license key to this email.
          </p>
        </div>

        <div>
          <label htmlFor="discountCode" className="block text-sm font-semibold text-gray-700 mb-1">
            Discount Code <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
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
              className="flex-1 px-4 py-3 text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] outline-none transition-all uppercase font-mono tracking-wide placeholder:font-sans placeholder:tracking-normal disabled:bg-gray-100"
              placeholder="e.g. PRO20"
            />
            {!appliedCoupon ? (
              <button
                type="button"
                onClick={() => validateAndApplyCoupon(couponInput)}
                disabled={isValidatingCoupon || !couponInput.trim()}
                className="px-5 py-3 bg-[#3CB371] hover:bg-[#349e63] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 min-w-[90px] cursor-pointer"
              >
                {isValidatingCoupon ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all shrink-0 text-sm cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>

          {/* Error Message */}
          {couponError && (
            <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-in fade-in duration-200">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {couponError}
            </p>
          )}

          {/* Success Message */}
          {appliedCoupon && (
            <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="text-emerald-600">✓</span>
                <span className="uppercase">{appliedCoupon.code}</span> applied: {appliedCoupon.discountPercentage}% OFF
              </span>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Live Price Summary if Coupon Applied */}
        {appliedCoupon && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Original Price:</span>
              <span className="line-through">{currency === "USD" ? "$" : ""}{planPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#3CB371] font-medium">
              <span>Discount ({appliedCoupon.discountPercentage}%):</span>
              <span>-{currency === "USD" ? "$" : ""}{appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#232946] font-bold pt-1 border-t border-gray-200">
              <span>New Total:</span>
              <span className="text-[#3CB371]">{currency === "USD" ? "$" : ""}{finalDue}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#232946] hover:bg-[#1a1f35] text-white font-bold rounded-xl transition-colors shadow-md cursor-pointer"
        >
          Continue to Payment
        </button>
      </form>
    </>
  );
}
