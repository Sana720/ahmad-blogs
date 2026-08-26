import React from "react";
import { notFound } from "next/navigation";
import admin from "@/utils/firebaseAdmin";
import { Plan } from "@/types/license";
import CheckoutForm from "./CheckoutForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 0; // Dynamic page

interface Props {
  params: Promise<{ planId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { planId } = await params;

  // Fetch plan from Firestore
  const db = admin.firestore();
  const planDoc = await db.collection("plans").doc(planId).get();

  if (!planDoc.exists) {
    notFound();
  }

  const plan = planDoc.data() as Plan;

  if (!plan.active) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Plan Unavailable</h1>
          <p className="text-gray-600">This pricing plan is no longer active.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Convert price to string for display
  const priceStr = plan.price.toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side: Order Summary */}
            <div className="bg-[#232946] text-white p-8 md:p-12 flex flex-col justify-center">
              <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-2">
                Order Summary
              </span>
              <h1 className="text-3xl font-extrabold mb-4">{plan.name} Plan</h1>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <span className="text-gray-300">Total Price</span>
                  <span className="text-2xl font-black text-[#3CB371]">
                    ${priceStr} {plan.currency}
                  </span>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#3CB371]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Lifetime access & free updates
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#3CB371]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    License key sent instantly to email
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side: Checkout Form & PayPal */}
            <div className="p-8 md:p-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
              {/* We use a Client Component for the form to handle state */}
              <CheckoutForm planId={planId} planName={plan.name} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
