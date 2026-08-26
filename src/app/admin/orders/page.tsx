import React from "react";
import admin from "@/utils/firebaseAdmin";
import { Order } from "@/types/license";
import AdminLayout from "@/components/admin/AdminLayout";

export const revalidate = 0; // Don't cache admin pages

export default async function AdminOrdersPage() {
  const db = admin.firestore();
  
  // Fetch orders, sort by createdAt descending (newest first)
  const ordersSnapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
  
  const orders: Order[] = ordersSnapshot.docs.map(doc => {
    const data = doc.data() as Order;
    return { ...data, id: doc.id };
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#232946] mb-8">Manage Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold">
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Plan</th>
                <th className="p-4 whitespace-nowrap">Amount</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">PayPal ID</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#232946]">{order.customerEmail}</div>
                      {order.customerName && <div className="text-gray-500 text-xs">{order.customerName}</div>}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-semibold text-xs uppercase tracking-wider">
                        {order.planId}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-700 whitespace-nowrap">
                      ${order.amount.toFixed(2)} {order.currency}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-xs uppercase tracking-wider ${
                        order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {order.paypalOrderId || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
