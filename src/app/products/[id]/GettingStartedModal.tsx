"use client";

import React, { useState } from "react";

interface GettingStartedModalProps {
  productTitle: string;
}

export default function GettingStartedModal({ productTitle }: GettingStartedModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="font-bold text-[#3CB371] hover:underline flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Getting Started Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-extrabold text-[#232946]">
                Getting Started: {productTitle}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 prose max-w-none text-[#555]">
              <h3 className="text-lg font-bold text-[#232946] mb-3">1. Installation</h3>
              <p className="mb-4">
                After purchasing, you will receive a download link via email and on the confirmation page. 
                Extract the downloaded ZIP file to a folder on your computer.
              </p>
              
              <h3 className="text-lg font-bold text-[#232946] mb-3">2. Setup</h3>
              <p className="mb-4">
                If this is a Chrome Extension:
                <br/>
                1. Open Chrome and navigate to <strong>chrome://extensions/</strong>
                <br/>
                2. Enable <strong>Developer mode</strong> in the top right corner.
                <br/>
                3. Click <strong>Load unpacked</strong> and select the folder you just extracted.
              </p>
              <p className="mb-4">
                If this is a Next.js Template:
                <br/>
                1. Open the folder in your terminal.
                <br/>
                2. Run <code>npm install</code> to install dependencies.
                <br/>
                3. Run <code>npm run dev</code> to start the development server.
              </p>

              <h3 className="text-lg font-bold text-[#232946] mb-3">3. Need Help?</h3>
              <p>
                If you encounter any issues during setup or have questions, our support team is ready to help. 
                Please reach out to us via the <a href="/contact" className="text-[#3CB371] font-bold hover:underline">Contact page</a> or email us directly at support@ahmadblogs.com.
              </p>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
