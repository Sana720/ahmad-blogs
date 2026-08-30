"use client";

import React, { useState } from "react";
import PayPalCheckoutButton from "@/components/PayPalCheckoutButton";
import ExitIntentPopup from "@/components/ExitIntentPopup";

interface CheckoutFormProps {
  planId: string;
  planName: string;
  planPrice: number;
  currency: string;
}

export default function CheckoutForm({ planId, planName, planPrice, currency }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [isReadyForPayment, setIsReadyForPayment] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (discountCode) {
      const code = discountCode.trim().toUpperCase();
      if (code !== 'COMEBACK10' && code !== 'EXISTINGUSER' && code !== 'EXISTING10') {
        alert("Invalid discount code.");
        return;
      }
    }
    setIsReadyForPayment(true);
  };

  if (isReadyForPayment) {
    return (
      <div className="space-y-6">
        <ExitIntentPopup />
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Sending license to:</p>
          <p className="font-bold text-gray-900">{email}</p>
          {discountCode && (
            <p className="text-sm text-gray-600 mt-2 font-medium">Discount applied: <span className="uppercase text-[#3CB371] font-bold">{discountCode}</span></p>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-500">Original Price:</span>
              <span className={discountCode && (discountCode.trim().toUpperCase() === 'COMEBACK10' || discountCode.trim().toUpperCase() === 'EXISTINGUSER' || discountCode.trim().toUpperCase() === 'EXISTING10') ? "line-through text-gray-400" : "font-bold text-gray-900"}>
                {currency === "USD" ? "$" : ""}{planPrice}
              </span>
            </div>
            {discountCode && (discountCode.trim().toUpperCase() === 'COMEBACK10' || discountCode.trim().toUpperCase() === 'EXISTINGUSER' || discountCode.trim().toUpperCase() === 'EXISTING10') && (
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
