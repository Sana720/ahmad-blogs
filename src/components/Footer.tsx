export default function Footer() {
  return (
    <footer className="bg-[#181f2a] text-gray-100 mt-24 pt-12 pb-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center px-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-12 text-lg font-medium mb-8 w-full justify-center items:center">
          <a href="/about" className="hover:text-[#3CB371]">About</a>
          <a href="/contact" className="hover:text-[#3CB371]">Contact</a>
          <a href="/privacy-policy" className="hover:text-[#3CB371]">Privacy Policy</a>
          <a href="/terms" className="hover:text-[#3CB371]">Terms & Conditions</a>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 justify-center">
          <a href="#" className="rounded-lg border border-gray-400 w-12 h-12 flex items-center justify-center text-xl text-gray-100 hover:text-[#3CB371] hover:border-[#3CB371] transition-colors">
            {/* Facebook */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M15.5 8.5h-2a1 1 0 0 0-1 1v2h3l-.5 2h-2.5v6h-2v-6H8.5v-2h2v-2a3 3 0 0 1 3-3h2v2z" fill="currentColor"/></svg>
          </a>
          <a href="#" className="rounded-lg border border-gray-400 w-12 h-12 flex items-center justify-center text-xl text-gray-100 hover:text-[#3CB371] hover:border-[#3CB371] transition-colors">
            {/* Twitter */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M19 7.5a6.5 6.5 0 0 1-1.89.52A3.28 3.28 0 0 0 18.5 6a6.56 6.56 0 0 1-2.08.8A3.28 3.28 0 0 0 12 9.5c0 .26.03.52.08.76A9.32 9.32 0 0 1 5 6.5s-4 9 5 13c-1.38.9-3.1 1.4-5 1.5 9 5 20-5 20-13.5 0-.21 0-.42-.02-.63A6.72 6.72 0 0 0 21 5.5z" fill="currentColor"/></svg>
          </a>
          <a href="#" className="rounded-lg border border-gray-400 w-12 h-12 flex items-center justify-center text-xl text-gray-100 hover:text-[#3CB371] hover:border-[#3CB371] transition-colors">
            {/* Instagram */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="7" r="1.5" fill="currentColor"/></svg>
          </a>
          <a href="#" className="rounded-lg border border-gray-400 w-12 h-12 flex items-center justify-center text-xl text-gray-100 hover:text-[#3CB371] hover:border-[#3CB371] transition-colors">
            {/* YouTube */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/><polygon points="13,12 11,13 11,11" fill="#fff"/></svg>
          </a>
          <a href="#" className="rounded-lg border border-gray-400 w-12 h-12 flex items-center justify-center text-xl text-gray-100 hover:text-[#3CB371] hover:border-[#3CB371] transition-colors">
            {/* LinkedIn */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><rect x="7" y="10" width="2" height="7" fill="currentColor"/><rect x="11" y="13" width="2" height="4" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/></svg>
          </a>
        </div>
        <div className="text-center text-base text-gray-400">Copyright © 2022 || Ahmad Blogs</div>
      </div>
    </footer>
  );
}
