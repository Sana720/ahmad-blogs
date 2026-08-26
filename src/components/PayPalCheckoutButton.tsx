"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface PayPalCheckoutButtonProps {
  planId: string;
  customerEmail: string;
  customerName?: string;
}

export default function PayPalCheckoutButton({
  planId,
  customerEmail,
  customerName,
}: PayPalCheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (!clientId) {
    return <div className="text-red-500 font-bold">PayPal Client ID is missing!</div>;
  }

  const initialOptions = {
    clientId,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect" }}
          createOrder={async () => {
            setError(null);
            try {
              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  planId,
                  customerEmail,
                  customerName,
                }),
              });

              const orderData = await response.json();

              if (!response.ok) {
                const errorDetail = orderData?.error;
                throw new Error(errorDetail || "Could not create order");
              }

              if (orderData.orderId) {
                return orderData.orderId;
              } else {
                throw new Error("Invalid response from server");
              }
            } catch (err: any) {
              setError(err.message || "Failed to initiate PayPal checkout.");
              throw err; // Stop checkout flow
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              });

              const captureData = await response.json();

              if (!response.ok) {
                throw new Error(captureData.error || "Failed to capture payment.");
              }

              // Payment successful! Navigate to success page
              router.push(`/payment/success?orderId=${data.orderID}`);
            } catch (err: any) {
              setError(err.message || "Failed to finalize the payment.");
            }
          }}
          onCancel={() => {
            // Optional: Handle cancellation
            router.push("/payment/failed");
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            setError("An unexpected error occurred with PayPal.");
            router.push("/payment/failed");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
