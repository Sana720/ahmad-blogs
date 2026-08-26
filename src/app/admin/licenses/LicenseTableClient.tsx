"use client";

import React, { useState } from "react";
import { License } from "@/types/license";
import LicenseActions from "@/components/admin/LicenseActions";

interface Props {
  initialLicenses: License[];
}

export default function LicenseTableClient({ initialLicenses }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLicenses = initialLicenses.filter((license) => 
    license.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by email or license key..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent"
        />
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
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No licenses found.
                </td>
              </tr>
            ) : (
              filteredLicenses.map((license) => (
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
    </div>
  );
}
