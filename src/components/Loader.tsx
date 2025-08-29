import React from "react";

export default function Loader() {
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
