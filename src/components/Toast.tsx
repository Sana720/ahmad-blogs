"use client";

import React, { useEffect } from 'react';

type ToastItem = {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
};

export default function Toasts({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: string) => void }) {
  useEffect(() => {
    // Auto-remove toasts after 4 seconds
    const timers = toasts.map((t) => {
      const id = setTimeout(() => removeToast(t.id), 4000);
      return () => clearTimeout(id);
    });
    return () => timers.forEach((c) => c());
  }, [toasts, removeToast]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
            t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
          }`}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
