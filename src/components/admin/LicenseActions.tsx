"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LicenseActionsProps {
  licenseId: string;
  status: string;
  customerEmail: string;
}

export default function LicenseActions({ licenseId, status, customerEmail }: LicenseActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (endpoint: string, actionName: string) => {
    if (!confirm(`Are you sure you want to ${actionName} this license?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/licenses/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      
      alert(`Success: ${actionName} completed.`);
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "REVOKED" && (
        <button
          onClick={() => handleAction("revoke", "revoke")}
          disabled={isLoading}
          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors disabled:opacity-50"
        >
          Revoke
        </button>
      )}
      
      <button
        onClick={() => handleAction("reset-device", "reset device limit for")}
        disabled={isLoading}
        className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors disabled:opacity-50"
      >
        Reset Devices
      </button>

      <button
        onClick={() => handleAction("resend", "resend email for")}
        disabled={isLoading}
        className="bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors disabled:opacity-50"
      >
        Resend Email
      </button>
    </div>
  );
}
