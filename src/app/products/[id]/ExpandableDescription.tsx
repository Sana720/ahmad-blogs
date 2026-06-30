"use client";
import React, { useState } from "react";

interface ExpandableDescriptionProps {
  children: React.ReactNode;
}

export default function ExpandableDescription({ children }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex flex-col w-full">
      {/* Description Content wrapper */}
      <div
        className={`transition-all duration-300 relative ${
          isExpanded ? "max-h-none pb-4" : "max-h-[260px] overflow-hidden"
        }`}
      >
        {children}

        {/* Fading bottom mask overlay (only visible when collapsed) */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle button */}
      <div className="flex justify-start mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[#3CB371] hover:text-[#2e945b] font-bold text-sm transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              Read Less
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Read More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
