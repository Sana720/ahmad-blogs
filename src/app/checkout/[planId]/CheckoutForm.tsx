"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PayPalCheckoutButton from "@/components/PayPalCheckoutButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

interface CheckoutFormProps {
  planId: string;
  planName: string;
  planPrice: number;
  currency: string;
}

export default function CheckoutForm({ planId, planName, planPrice, currency }: CheckoutFormProps) {
  const searchParams = useSearchParams();
  const initialCoupon = searchParams?.get('coupon') || "";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [discountCode, setDiscountCode] = useState(initialCoupon);
  const [isReadyForPayment, setIsReadyForPayment] = useState(false);

  useEffect(() => {
    const couponFromUrl = searchParams?.get('coupon');
    if (couponFromUrl && !discountCode) {
      setDiscountCode(couponFromUrl);
    }
  }, [searchParams]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsReadyForPayment(true);
  };

  const hasDiscount = Boolean(discountCode && discountCode.trim().length > 0);

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
          {hasDiscount && (
            <p className="text-sm text-gray-600 mt-2 font-medium">Discount applied: <span className="uppercase text-[#3CB371] font-bold">{discountCode.trim()}</span> (10% OFF)</p>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-500">Original Price:</span>
              <span className={hasDiscount ? "line-through text-gray-400" : "font-bold text-gray-900"}>
                {currency === "USD" ? "$" : ""}{planPrice}
              </span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between items-center text-base font-bold">
                <span className="text-[#232946]">Total Due:</span>
                <span className="text-[#3CB371]">{currency === "USD" ? "$" : ""}{(planPrice * 0.9).toFixed(2)}</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsReadyForPayment(false)}
            className="text-sm text-[#3CB371] hover:underline mt-2 font-medium"
          >
            Change details
          </button>
        </div>
        
        <div className="pt-2">
          <PayPalCheckoutButton 
            planId={planId} 
            customerEmail={email} 
            customerName={name}
            discountCode={discountCode}
          />
        </div>

        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800 text-center">
          <span className="font-bold">🇮🇳 Indian Users:</span> PayPal does not support domestic payments in India. 
          <br/>
          Please <a href="https://wa.me/917209362004" target="_blank" className="font-bold underline text-orange-900">WhatsApp me (+91 7209362004)</a> to buy your license directly via UPI!
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
        <input
          type="text"
          id="discountCode"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="w-full px-4 py-3 text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] outline-none transition-all uppercase"
          placeholder="e.g. SAVE20"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-4 bg-[#232946] hover:bg-[#1a1f35] text-white font-bold rounded-xl transition-colors shadow-md"
      >
        Continue to Payment
      </button>
    </form>
    </>
  );
}
