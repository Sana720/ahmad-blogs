import React from "react";
import admin from "@/utils/firebaseAdmin";
import { License } from "@/types/license";
import LicenseTableClient from "./LicenseTableClient";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireAuth from "@/components/admin/RequireAuth";

export const revalidate = 0; // Don't cache admin pages

export default async function AdminLicensesPage() {
  const db = admin.firestore();
  
  // Fetch licenses and plans in parallel
  const [licensesSnapshot, plansSnapshot] = await Promise.all([
    db.collection("licenses").orderBy("createdAt", "desc").get(),
    db.collection("plans").get().catch(() => ({ docs: [] } as any)),
  ]);
  
  const licenses: License[] = licensesSnapshot.docs.map(doc => {
    const data = doc.data() as License;
    return { ...data, id: doc.id };
  });

  const plansMap: Record<string, { name: string; slug: string; lifetime?: boolean }> = {};
  plansSnapshot.docs.forEach((doc: any) => {
    const p = doc.data();
    plansMap[doc.id] = { name: p.name, slug: p.slug, lifetime: p.lifetime };
    if (p.slug) {
      plansMap[p.slug] = { name: p.name, slug: p.slug, lifetime: p.lifetime };
    }
  });

  return (
    <RequireAuth>
      <AdminLayout>
        <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#232946] mb-8">Manage Licenses</h1>
          
          {/* We pass the fetched data to a Client Component to allow real-time filtering/search */}
          <LicenseTableClient initialLicenses={licenses} plansMap={plansMap} />
        </div>
      </AdminLayout>
    </RequireAuth>
  );
}
