"use client";

import React, { useState, useEffect } from "react";
import { License } from "@/types/license";
import LicenseActions from "@/components/admin/LicenseActions";
import { getFirestoreProducts, getPlansForProduct } from "@/utils/productsFirestore";
import { Product } from "@/utils/productsData";
import { Plan } from "@/types/license";

interface Props {
  initialLicenses: License[];
}

export default function LicenseTableClient({ initialLicenses }: Props) {
  const [licenses, setLicenses] = useState<License[]>(initialLicenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  
  // Modal Form State
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isModalOpen && products.length === 0) {
      getFirestoreProducts().then(setProducts);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedProductId) {
      getPlansForProduct(selectedProductId).then(setPlans);
    } else {
      setPlans([]);
    }
  }, [selectedProductId]);

  const handleGenerateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !selectedProductId || !selectedPlanId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/licenses/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail,
          customerName,
          productId: selectedProductId,
          planId: selectedPlanId,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLicenses([data.license, ...licenses]);
        setIsModalOpen(false);
        setCustomerEmail("");
        setCustomerName("");
        setSelectedProductId("");
        setSelectedPlanId("");
      } else {
        alert(data.error || "Failed to generate license");
      }
    } catch (err) {
      alert("Error generating license");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch = 
      license.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.key.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || license.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLicenses = filteredLicenses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* FILTER BAR & ACTION */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
          <input
            type="text"
            placeholder="Search by email or license key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REVOKED">Revoked</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-[#3CB371] text-white font-medium rounded-lg hover:bg-[#2E8B57] transition-colors whitespace-nowrap"
        >
          + Manual License
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold">
              <th className="p-4 whitespace-nowrap">Generated</th>
              <th className="p-4 whitespace-nowrap">Customer</th>
              <th className="p-4 whitespace-nowrap">License Key</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 whitespace-nowrap">Activations</th>
              <th className="p-4 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentLicenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No licenses found.
                </td>
              </tr>
            ) : (
              currentLicenses.map((license) => (
                <tr key={license.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-600 whitespace-nowrap">
                    {new Date(license.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-[#232946]">
                    {license.customerEmail}
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {license.key}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md font-bold text-xs uppercase tracking-wider ${
                      license.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      license.status === 'REVOKED' ? 'bg-red-100 text-red-800' :
                      license.status === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {license.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-600">
                    {license.activationCount} / {license.maxDevices}
                  </td>
                  <td className="p-4">
                    <LicenseActions 
                      licenseId={license.id!} 
                      status={license.status} 
                      customerEmail={license.customerEmail} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredLicenses.length)}</span> of <span className="font-semibold text-gray-900">{filteredLicenses.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center px-4 font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Manually Generate License</h2>
              <p className="text-sm text-gray-500 mt-1">Send a license for a custom payment (UPI, Wire, etc)</p>
            </div>
            <form onSubmit={handleGenerateLicense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-[#3CB371] focus:border-[#3CB371]"
                  placeholder="customer@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-[#3CB371] focus:border-[#3CB371]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-[#3CB371] focus:border-[#3CB371]"
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  required
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  disabled={!selectedProductId || plans.length === 0}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-[#3CB371] focus:border-[#3CB371] disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="">Select a plan...</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id!}>{p.name} - {p.price} {p.currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method Note</label>
                <input
                  type="text"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md focus:ring-[#3CB371] focus:border-[#3CB371]"
                  placeholder="e.g. UPI, Bank Transfer"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#3CB371] border border-transparent rounded-md hover:bg-[#2E8B57] disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? "Generating..." : "Generate & Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
