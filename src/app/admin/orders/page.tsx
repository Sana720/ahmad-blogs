import React from "react";
import admin from "@/utils/firebaseAdmin";
import { Order } from "@/types/license";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderTableClient from "./OrderTableClient";

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
        
        <OrderTableClient initialOrders={orders} />
      </div>
    </AdminLayout>
  );
}
