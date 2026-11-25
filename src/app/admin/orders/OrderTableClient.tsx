"use client";

import React, { useState } from "react";
import { Order } from "@/types/license";

interface Props {
  initialOrders: Order[];
}

export default function OrderTableClient({ initialOrders }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredOrders = initialOrders.filter((order) => {
    const matchesSearch = 
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paypalOrderId?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || order.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* FILTER BAR */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by email, name, or PayPal ID..."
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
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

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
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
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
                      order.paymentStatus === 'REFUNDED' ? 'bg-purple-100 text-purple-800' :
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

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of <span className="font-semibold text-gray-900">{filteredOrders.length}</span> results
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
    </div>
  );
}
