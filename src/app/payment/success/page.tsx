import React from "react";
import Link from "next/link";
import admin from "@/utils/firebaseAdmin";
import { Order, License } from "@/types/license";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "./CopyButton";

export const revalidate = 0;

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  let licenseKey = "";
  let customerEmail = "";
  let planName = "Pro";

  if (orderId) {
    const db = admin.firestore();
    try {
      const ordersSnapshot = await db
        .collection("orders")
        .where("paypalOrderId", "==", orderId)
        .limit(1)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        const order = orderDoc.data() as Order;
        customerEmail = order.customerEmail;

        if (order.licenseId) {
          const licenseDoc = await db.collection("licenses").doc(order.licenseId).get();
          if (licenseDoc.exists) {
            const license = licenseDoc.data() as License;
            licenseKey = license.key;
          }
        }

        const planDoc = await db.collection("plans").doc(order.planId).get();
        if (planDoc.exists) {
          planName = planDoc.data()?.name || "Pro";
        }
      }
    } catch (e) {
      console.error("Error fetching success order data", e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center p-8 md:p-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#232946] mb-4">Payment Successful 🎉</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            Thank you for purchasing the <strong>{planName}</strong> plan!
          </p>

          {licenseKey ? (
            <div className="bg-[#232946] p-8 rounded-xl max-w-lg mx-auto mb-8 shadow-inner text-left relative">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-3">
                Your License Key
              </span>
              <div className="text-2xl md:text-3xl font-mono text-white break-all mb-6">
                {licenseKey}
              </div>
              <CopyButton textToCopy={licenseKey} />
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-800 p-6 rounded-xl max-w-lg mx-auto mb-8 border border-yellow-200">
              <p>We are still processing your license key.</p>
              <p className="text-sm mt-2">Please check your email shortly.</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-8">
            A copy of your license has also been sent to <strong className="text-gray-700">{customerEmail || "your email"}</strong>.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Browse More Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
