"use client";
import React, { useEffect, useState, useContext } from "react";
import LoaderContext from "../utils/LoaderContext";
import Link from 'next/link';


type HeaderProps = {
  categoryMenu?: React.ReactNode;
};

function Header({ categoryMenu }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const { setLoading } = useContext(LoaderContext);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full border-b border-gray-100 bg-white z-30 sticky top-0 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"}`}
      style={{
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)"
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center" onClick={() => setLoading(true)}>
          {/* Original Eye/Face SVG Logo */}
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mr-2">
            <ellipse cx="24" cy="24" rx="24" ry="24" fill="#3CB371"/>
            <ellipse cx="18" cy="24" rx="8" ry="8" fill="#fff"/>
            <ellipse cx="30" cy="24" rx="8" ry="8" fill="#fff"/>
            <ellipse cx="18" cy="24" rx="5" ry="5" fill="#3CB371"/>
            <ellipse cx="30" cy="24" rx="5" ry="5" fill="#3CB371"/>
            <circle cx="17" cy="23" r="1.2" fill="#222"/>
            <circle cx="29" cy="23" r="1.2" fill="#222"/>
            <path d="M20 28c1.5 1.5 6.5 1.5 8 0" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-extrabold text-[#222] tracking-tight" style={{letterSpacing: '-1px'}}>Ahmad Blogs</span>
          </Link>
        </div>
        {/* Desktop Nav with Category Dropdown */}
        <nav className="hidden md:flex gap-8 text-base font-semibold text-[#222] items-center">
          <Link href="/" className="hover:text-[#3CB371]" onClick={() => setLoading(true)}>Home</Link>
          <div className="relative group">
            <button className="hover:text-[#3CB371] flex items-center gap-1 focus:outline-none">
              Categories
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#3CB371" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="absolute left-0 mt-2 w-44 bg-white border border-[#eaf0f6] rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity">
              {categoryMenu}
            </div>
          </div>
         
          <Link href="/about" className="hover:text-[#3CB371]">About Me</Link>
          <Link href="/contact" className="hover:text-[#3CB371]">Contact Me</Link>
           <Link href="/portfolio" className="hover:text-[#3CB371]">Portfolio</Link>
        </nav>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded focus:outline-none" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="#232946" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
        {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 flex flex-col gap-2 text-base font-semibold text-[#232946] shadow">
          <Link href="/" className="hover:text-[#3CB371]" onClick={() => { setMobileOpen(false); setLoading(true); }}>Home</Link>
          <div className="relative">
            <button
              className="hover:text-[#3CB371] flex items-center gap-1 focus:outline-none"
              onClick={() => setShowMobileCategories((v) => !v)}
              aria-expanded={showMobileCategories}
              aria-controls="mobile-category-menu"
            >
              Categories
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#3CB371" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {showMobileCategories && (
              <div className="mt-2" id="mobile-category-menu">{categoryMenu}</div>
            )}
          </div>
          <Link href="/portfolio" className="hover:text-[#3CB371]" onClick={() => setMobileOpen(false)}>Portfolio</Link>
          <Link href="/about" className="hover:text-[#3CB371]" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-[#3CB371]" onClick={() => setMobileOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
