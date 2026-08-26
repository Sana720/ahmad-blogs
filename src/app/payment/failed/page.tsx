import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-8">
            We couldn't process your payment. Your card has not been charged, and no license was generated.
          </p>
          
          <Link
            href="/products"
            className="inline-block w-full py-3.5 px-4 bg-[#232946] hover:bg-[#1a1f35] text-white font-bold rounded-xl transition-colors shadow-md"
          >
            Return to Products
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
