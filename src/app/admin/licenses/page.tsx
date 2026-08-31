import React from "react";
import admin from "@/utils/firebaseAdmin";
import { License } from "@/types/license";
import LicenseTableClient from "./LicenseTableClient";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireAuth from "@/components/admin/RequireAuth";

export const revalidate = 0; // Don't cache admin pages

export default async function AdminLicensesPage() {
  const db = admin.firestore();
  
  // Fetch licenses, sort by createdAt descending
  const licensesSnapshot = await db.collection("licenses").orderBy("createdAt", "desc").get();
  
  const licenses: License[] = licensesSnapshot.docs.map(doc => {
    const data = doc.data() as License;
    return { ...data, id: doc.id };
  });

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#232946] mb-8">Manage Licenses</h1>
          
          {/* We pass the fetched data to a Client Component to allow real-time filtering/search */}
          <LicenseTableClient initialLicenses={licenses} />
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
