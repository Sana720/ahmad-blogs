"use client";

import React, { useEffect, useState } from "react";

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if we've already shown it this session
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown === "true") {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // If mouse moves up towards the browser tab bar
      if (e.clientY <= 0 && !hasTriggered) {
        setShowPopup(true);
        setHasTriggered(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <button 
            onClick={() => setShowPopup(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Wait! Do you have any questions before you go?</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          I'm here to help. If you're facing any payment issues or want to know more about the product, you can message me directly on WhatsApp right now.
        </p>

        <div className="flex flex-col space-y-3">
          <a 
            href="https://wa.me/917209362004" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setShowPopup(false)}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.893-4.443 9.893-9.892 0-5.446-4.446-9.892-9.893-9.892-5.452 0-9.894 4.446-9.894 9.892 0 1.988.546 3.824 1.504 5.396l-1.18 4.302 4.445-1.187zm-1.884-9.35c.01-.223.018-.45.074-.66.11-.424.31-.818.577-1.157.195-.247.458-.456.77-.552.32-.1.666-.089.976.01.294.093.553.284.773.518.232.247.417.545.541.874.129.34.184.71.188 1.077.004.382-.047.76-.145 1.127-.101.381-.252.748-.466 1.082-.206.323-.46.61-.75.862-.276.241-.58.442-.916.596-.341.156-.714.254-1.089.314-.368.058-.752.063-1.127.01-.365-.051-.716-.164-1.042-.321-.318-.153-.61-.362-.857-.611-.237-.24-.442-.516-.604-.813-.153-.284-.265-.59-.344-.912-.073-.298-.109-.606-.117-.914z"/>
            </svg>
            <span>Message on WhatsApp</span>
          </a>
          <button
            onClick={() => setShowPopup(false)}
            className="w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            No thanks, I'll browse later
          </button>
        </div>
      </div>
    </div>
  );
}
